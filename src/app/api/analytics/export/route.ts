import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Parser } from 'json2csv'
import * as XLSX from 'xlsx'

// Redis 缓存客户端
let redisClient: any = null
const REDIS_ENABLED = process.env.REDIS_URL ? true : false

async function getRedisClient() {
  if (!REDIS_ENABLED) return null
  if (redisClient) return redisClient
  
  try {
    const Redis = require('ioredis')
    redisClient = new Redis(process.env.REDIS_URL)
    return redisClient
  } catch (error) {
    console.error('Failed to connect to Redis:', error)
    return null
  }
}

// 缓存配置 - 导出数据缓存时间更长
const CACHE_TTL = {
  CSV: 3600,    // 1 小时
  EXCEL: 3600,  // 1 小时
  JSON: 1800,   // 30 分钟
}

interface ExportRequest {
  userId: string
  format?: 'csv' | 'excel' | 'json'
  startDate?: string
  endDate?: string
  includeFields?: string[]
}

// 内存缓存（用于小数据量）
const memoryCache = new Map<string, { data: Buffer | string; timestamp: number }>()

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body: ExportRequest = await request.json()
    const {
      userId,
      format = 'csv',
      startDate,
      endDate,
      includeFields,
    } = body

    // 参数验证
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    if (!['csv', 'excel', 'json'].includes(format)) {
      return NextResponse.json(
        { error: 'format must be csv, excel, or json' },
        { status: 400 }
      )
    }

    // 日期验证
    const start = startDate ? new Date(startDate) : new Date(0)
    const end = endDate ? new Date(endDate) : new Date()
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    if (start > end) {
      return NextResponse.json(
        { error: 'startDate must be before endDate' },
        { status: 400 }
      )
    }

    // 缓存键
    const cacheKey = `analytics:export:${userId}:${format}:${start.toISOString()}:${end.toISOString()}`
    const cacheTTL = format === 'excel' ? CACHE_TTL.EXCEL : CACHE_TTL.CSV

    // 尝试从 Redis 读取（仅 JSON 格式）
    if (format === 'json' && REDIS_ENABLED) {
      const redis = await getRedisClient()
      if (redis) {
        const cached = await redis.get(cacheKey)
        if (cached) {
          console.log(`[Export API] Cache hit (Redis): ${cacheKey}`)
          return NextResponse.json(JSON.parse(cached))
        }
      }
    }

    // 查询数据
    const checkIns = await prisma.checkIn.findMany({
      where: {
        userId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        id: true,
        mood: true,
        note: true,
        createdAt: true,
        likes: {
          select: {
            id: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (checkIns.length === 0) {
      return NextResponse.json(
        { error: 'No data found for the specified period' },
        { status: 404 }
      )
    }

    // 格式化数据
    const formattedData = checkIns.map((checkIn) => ({
      id: checkIn.id,
      date: checkIn.createdAt.toISOString().split('T')[0],
      time: checkIn.createdAt.toTimeString().split(' ')[0],
      mood: checkIn.mood,
      moodLabel: getMoodLabel(checkIn.mood),
      note: checkIn.note || '',
      likes: checkIn.likes.length,
      createdAt: checkIn.createdAt.toISOString(),
    }))

    // 根据 includeFields 过滤字段
    const filteredData = includeFields && includeFields.length > 0
      ? formattedData.map((item: any) => {
          const filtered: any = {}
          includeFields.forEach((field) => {
            if (field in item) filtered[field] = item[field]
          })
          return filtered
        })
      : formattedData

    // 生成导出文件
    let content: Buffer | string
    let contentType: string
    let filename: string

    if (format === 'csv') {
      content = generateCSV(filteredData)
      contentType = 'text/csv'
      filename = `mood-data-${userId}-${start.toISOString().split('T')[0]}-${end.toISOString().split('T')[0]}.csv`
    } else if (format === 'excel') {
      content = generateExcel(filteredData)
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      filename = `mood-data-${userId}-${start.toISOString().split('T')[0]}-${end.toISOString().split('T')[0]}.xlsx`
    } else {
      content = JSON.stringify(filteredData, null, 2)
      contentType = 'application/json'
      filename = `mood-data-${userId}-${start.toISOString().split('T')[0]}-${end.toISOString().split('T')[0]}.json`
    }

    // 缓存结果（JSON 格式）
    if (format === 'json' && REDIS_ENABLED) {
      const redis = await getRedisClient()
      if (redis) {
        try {
          await redis.setex(cacheKey, cacheTTL, content as string)
          console.log(`[Export API] Cached to Redis: ${cacheKey}`)
        } catch (error) {
          console.error('Failed to cache to Redis:', error)
        }
      }
    }

    // 性能日志
    const responseTime = Date.now() - startTime
    console.log(`[Export API] Response time: ${responseTime}ms, records: ${checkIns.length}`)

    // 返回文件
    const headers = new Headers()
    headers.set('Content-Type', contentType)
    headers.set('Content-Disposition', `attachment; filename="${filename}"`)
    headers.set('X-Response-Time', `${responseTime}ms`)
    headers.set('X-Record-Count', `${checkIns.length}`)

    if (format === 'json') {
      return new NextResponse(content as string, { headers })
    } else {
      return new NextResponse(content as unknown as ArrayBuffer, { headers })
    }
  } catch (error) {
    console.error('[Export API] Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to export data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // GET 请求返回导出说明
  return NextResponse.json({
    description: 'Data Export API',
    method: 'POST',
    requiredFields: ['userId'],
    optionalFields: ['format', 'startDate', 'endDate', 'includeFields'],
    formats: ['csv', 'excel', 'json'],
    example: {
      userId: 'ou_xxx',
      format: 'csv',
      startDate: '2026-01-01',
      endDate: '2026-03-30',
      includeFields: ['date', 'mood', 'moodLabel', 'note', 'likes'],
    },
  })
}

/**
 * 生成 CSV 格式
 */
function generateCSV(data: any[]): Buffer {
  try {
    const parser = new Parser({
      fields: Object.keys(data[0]),
      defaultValue: '',
    })
    const csv = parser.parse(data)
    return Buffer.from(csv, 'utf-8')
  } catch (error) {
    console.error('CSV generation error:', error)
    // Fallback: manual CSV generation
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map((row) =>
      Object.values(row)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(',')
    )
    return Buffer.from(`${headers}\n${rows.join('\n')}`, 'utf-8')
  }
}

/**
 * 生成 Excel 格式
 */
function generateExcel(data: any[]): Buffer {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Mood Data')
  
  // 添加统计工作表
  const stats = calculateStats(data)
  const statsSheet = XLSX.utils.json_to_sheet(stats)
  XLSX.utils.book_append_sheet(workbook, statsSheet, 'Statistics')
  
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

/**
 * 计算统计数据
 */
function calculateStats(data: any[]): any[] {
  const moods = data.map((d) => d.mood)
  const moodCounts: Record<number, number> = {}
  
  moods.forEach((mood) => {
    moodCounts[mood] = (moodCounts[mood] || 0) + 1
  })

  return [
    { metric: 'Total Records', value: data.length },
    { metric: 'Average Mood', value: (moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(2) },
    { metric: 'Min Mood', value: Math.min(...moods) },
    { metric: 'Max Mood', value: Math.max(...moods) },
    { metric: 'Total Likes', value: data.reduce((sum, d) => sum + d.likes, 0) },
    ...Object.entries(moodCounts).map(([mood, count]) => ({
      metric: `Mood ${mood} Count`,
      value: count,
    })),
  ]
}

/**
 * 心情标签映射
 */
function getMoodLabel(mood: number): string {
  const labels: Record<number, string> = {
    1: '😞 非常差',
    2: '😕 差',
    3: '😐 一般',
    4: '🙂 好',
    5: '😄 非常好',
  }
  return labels[mood] || '未知'
}

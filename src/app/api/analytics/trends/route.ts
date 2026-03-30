import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

// 缓存配置
const CACHE_TTL = {
  HOT: 300,      // 5 分钟
  AGG: 1800,     // 30 分钟
  REPORT: 21600, // 6 小时
}

interface TrendDataPoint {
  date: string
  mood: number
  count: number
  moodChange?: number // 与前一日相比的变化
}

interface TrendResponse {
  data: TrendDataPoint[]
  period: {
    start: string
    end: string
    days: number
  }
  statistics: {
    average: number
    min: number
    max: number
    trend: 'up' | 'down' | 'stable'
  }
}

// 内存缓存
const memoryCache = new Map<string, { data: TrendResponse; timestamp: number }>()

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const days = parseInt(searchParams.get('days') || '30', 10)
    const granularity = searchParams.get('granularity') || 'day' // day, week, month
    const forceRefresh = searchParams.get('forceRefresh') === 'true'

    // 参数验证
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    if (days < 1 || days > 365) {
      return NextResponse.json(
        { error: 'days must be between 1 and 365' },
        { status: 400 }
      )
    }

    if (!['day', 'week', 'month'].includes(granularity)) {
      return NextResponse.json(
        { error: 'granularity must be day, week, or month' },
        { status: 400 }
      )
    }

    // 缓存键
    const cacheKey = `analytics:trends:${userId}:${granularity}:${days}`
    const cacheTTL = granularity === 'day' ? CACHE_TTL.HOT : CACHE_TTL.AGG

    // 尝试从 Redis 读取
    if (!forceRefresh && REDIS_ENABLED) {
      const redis = await getRedisClient()
      if (redis) {
        const cached = await redis.get(cacheKey)
        if (cached) {
          const data = JSON.parse(cached)
          console.log(`[Trends API] Cache hit (Redis): ${cacheKey}`)
          return NextResponse.json(data)
        }
      }
    }

    // 尝试从内存缓存读取
    if (!forceRefresh) {
      const cached = memoryCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < cacheTTL * 1000) {
        console.log(`[Trends API] Cache hit (Memory): ${cacheKey}`)
        return NextResponse.json(cached.data)
      }
    }

    // 计算日期范围
    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days + 1)
    startDate.setHours(0, 0, 0, 0)

    // 根据粒度选择查询策略
    let trendData: TrendDataPoint[] = []
    
    if (granularity === 'day') {
      trendData = await getDailyTrends(userId, startDate, endDate)
    } else if (granularity === 'week') {
      trendData = await getWeeklyTrends(userId, startDate, endDate)
    } else {
      trendData = await getMonthlyTrends(userId, startDate, endDate)
    }

    // 计算统计数据
    const validDataPoints = trendData.filter(d => d.count > 0)
    const moods = validDataPoints.map(d => d.mood)
    
    const statistics = {
      average: moods.length > 0 
        ? Math.round((moods.reduce((a, b) => a + b, 0) / moods.length) * 100) / 100
        : 0,
      min: moods.length > 0 ? Math.min(...moods) : 0,
      max: moods.length > 0 ? Math.max(...moods) : 0,
      trend: calculateTrend(trendData) as 'up' | 'down' | 'stable',
    }

    const response: TrendResponse = {
      data: trendData,
      period: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        days,
      },
      statistics,
    }

    // 写入 Redis 缓存
    if (REDIS_ENABLED) {
      const redis = await getRedisClient()
      if (redis) {
        try {
          await redis.setex(cacheKey, cacheTTL, JSON.stringify(response))
          console.log(`[Trends API] Cached to Redis: ${cacheKey}`)
        } catch (error) {
          console.error('Failed to cache to Redis:', error)
        }
      }
    }

    // 写入内存缓存
    memoryCache.set(cacheKey, { data: response, timestamp: Date.now() })

    // 性能日志
    const responseTime = Date.now() - startTime
    console.log(`[Trends API] Response time: ${responseTime}ms`)

    // 添加性能头
    const res = NextResponse.json(response)
    res.headers.set('X-Response-Time', `${responseTime}ms`)
    res.headers.set('X-Cache-Source', 'miss')
    
    return res
  } catch (error) {
    console.error('[Trends API] Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch trend data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * 获取每日趋势数据
 */
async function getDailyTrends(userId: string, startDate: Date, endDate: Date): Promise<TrendDataPoint[]> {
  // 使用原始 SQL 优化性能
  const rawResults = await prisma.$queryRaw`
    SELECT 
      DATE("createdAt") as date,
      AVG("mood") as mood,
      COUNT(*) as count
    FROM "CheckIn"
    WHERE "userId" = ${userId}
      AND "createdAt" >= ${startDate}
      AND "createdAt" <= ${endDate}
    GROUP BY DATE("createdAt")
    ORDER BY DATE("createdAt") ASC
  `

  // 填充缺失的日期
  return fillMissingDays(rawResults, startDate, endDate, 'day')
}

/**
 * 获取每周趋势数据
 */
async function getWeeklyTrends(userId: string, startDate: Date, endDate: Date): Promise<TrendDataPoint[]> {
  const rawResults = await prisma.$queryRaw`
    SELECT 
      DATE("createdAt", 'weekday 0') as date,
      AVG("mood") as mood,
      COUNT(*) as count
    FROM "CheckIn"
    WHERE "userId" = ${userId}
      AND "createdAt" >= ${startDate}
      AND "createdAt" <= ${endDate}
    GROUP BY DATE("createdAt", 'weekday 0')
    ORDER BY DATE("createdAt", 'weekday 0') ASC
  `

  return fillMissingDays(rawResults, startDate, endDate, 'week')
}

/**
 * 获取每月趋势数据
 */
async function getMonthlyTrends(userId: string, startDate: Date, endDate: Date): Promise<TrendDataPoint[]> {
  const rawResults = await prisma.$queryRaw`
    SELECT 
      STRFTIME('%Y-%m-01', "createdAt") as date,
      AVG("mood") as mood,
      COUNT(*) as count
    FROM "CheckIn"
    WHERE "userId" = ${userId}
      AND "createdAt" >= ${startDate}
      AND "createdAt" <= ${endDate}
    GROUP BY STRFTIME('%Y-%m-01', "createdAt")
    ORDER BY STRFTIME('%Y-%m-01', "createdAt") ASC
  `

  return fillMissingDays(rawResults, startDate, endDate, 'month')
}

/**
 * 填充缺失的日期/周期
 */
function fillMissingDays(
  rawResults: unknown,
  startDate: Date,
  endDate: Date,
  granularity: 'day' | 'week' | 'month'
): TrendDataPoint[] {
  const results = rawResults as any[]
  const resultDates = new Map<string, { mood: number; count: number }>()

  results.forEach((row: any) => {
    const dateStr = row.date instanceof Date 
      ? row.date.toISOString().split('T')[0] 
      : row.date
    resultDates.set(dateStr, {
      mood: Math.round(Number(row.mood) * 100) / 100,
      count: Number(row.count),
    })
  })

  const trendData: TrendDataPoint[] = []
  
  if (granularity === 'day') {
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]
      const data = resultDates.get(dateStr)
      trendData.push({
        date: dateStr,
        mood: data?.mood ?? 0,
        count: data?.count ?? 0,
      })
    }
  } else if (granularity === 'week') {
    // 简化：只返回有数据的周
    results.forEach((row: any) => {
      const dateStr = row.date instanceof Date 
        ? row.date.toISOString().split('T')[0] 
        : row.date
      trendData.push({
        date: dateStr,
        mood: Math.round(Number(row.mood) * 100) / 100,
        count: Number(row.count),
      })
    })
  } else {
    // 月度
    results.forEach((row: any) => {
      const dateStr = row.date instanceof Date 
        ? row.date.toISOString().split('T')[0] 
        : row.date
      trendData.push({
        date: dateStr,
        mood: Math.round(Number(row.mood) * 100) / 100,
        count: Number(row.count),
      })
    })
  }

  // 计算变化量
  for (let i = 1; i < trendData.length; i++) {
    if (trendData[i].count > 0 && trendData[i - 1].count > 0) {
      trendData[i].moodChange = Math.round(
        (trendData[i].mood - trendData[i - 1].mood) * 100
      ) / 100
    }
  }

  return trendData
}

/**
 * 计算趋势方向
 */
function calculateTrend(data: TrendDataPoint[]): string {
  const validPoints = data.filter(d => d.count > 0)
  if (validPoints.length < 2) return 'stable'

  // 比较最近 7 天和前 7 天的平均值
  const recent = validPoints.slice(-7)
  const previous = validPoints.slice(-14, -7)

  if (previous.length === 0) return 'stable'

  const recentAvg = recent.reduce((sum, d) => sum + d.mood, 0) / recent.length
  const previousAvg = previous.reduce((sum, d) => sum + d.mood, 0) / previous.length

  const diff = recentAvg - previousAvg
  if (diff > 0.2) return 'up'
  if (diff < -0.2) return 'down'
  return 'stable'
}

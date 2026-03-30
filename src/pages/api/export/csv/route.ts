import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Parser } from 'json2csv'
import { z } from 'zod'

// 请求参数验证 Schema
const exportQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  dataType: z.enum(['checkins', 'stats', 'all']).optional().default('all'),
  userId: z.string().optional(),
})

// 数据类型定义
interface CheckInData {
  id: string
  userId: string
  mood: number
  note: string | null
  createdAt: string
  likes: number
}

interface StatsData {
  userId: string
  totalCheckIns: number
  averageMood: number
  consecutiveDays: number
  mood1: number
  mood2: number
  mood3: number
  mood4: number
  mood5: number
}

/**
 * POST /api/export/csv
 * 导出 CSV 格式数据
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求参数
    const searchParams = request.nextUrl.searchParams
    const params = exportQuerySchema.parse({
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      dataType: searchParams.get('dataType') || 'all',
      userId: searchParams.get('userId') || undefined,
    })

    const { startDate, endDate, dataType, userId } = params

    // 构建时间范围查询条件
    const dateFilter: any = {}
    if (startDate) {
      dateFilter.gte = new Date(startDate)
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate)
    }

    // 构建用户查询条件
    const userFilter: any = {}
    if (userId) {
      userFilter.userId = userId
    }

    let csvContent = ''

    // 导出打卡数据
    if (dataType === 'checkins' || dataType === 'all') {
      const checkIns = await prisma.checkIn.findMany({
        where: {
          ...userFilter,
          createdAt: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
        },
        include: {
          likes: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      // 转换为 CSV 格式数据
      const checkInData: CheckInData[] = checkIns.map((checkIn) => ({
        id: checkIn.id,
        userId: checkIn.userId,
        mood: checkIn.mood,
        note: checkIn.note || '',
        createdAt: checkIn.createdAt.toISOString(),
        likes: checkIn.likes.length,
      }))

      if (checkInData.length > 0) {
        const parser = new Parser<CheckInData>({
          fields: ['id', 'userId', 'mood', 'note', 'createdAt', 'likes'],
        })
        csvContent += '=== 打卡数据 ===\n'
        csvContent += parser.parse(checkInData)
        csvContent += '\n\n'
      }
    }

    // 导出统计数据
    if (dataType === 'stats' || dataType === 'all') {
      // 获取所有用户
      const users = await prisma.user.findMany({
        where: userId ? { id: userId } : undefined,
      })

      const statsData: StatsData[] = []

      for (const user of users) {
        // 计算每个用户的统计数据
        const totalCheckIns = await prisma.checkIn.count({
          where: {
            userId: user.id,
            createdAt: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
          },
        })

        const avgMoodResult = await prisma.checkIn.aggregate({
          where: {
            userId: user.id,
            createdAt: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
          },
          _avg: { mood: true },
        })

        const moodDistribution = await prisma.checkIn.groupBy({
          by: ['mood'],
          where: {
            userId: user.id,
            createdAt: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
          },
          _count: { mood: true },
        })

        // 计算连续打卡天数
        const checkIns = await prisma.checkIn.findMany({
          where: {
            userId: user.id,
            createdAt: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
          },
          select: { createdAt: true },
          orderBy: { createdAt: 'desc' },
        })

        const consecutiveDays = calculateConsecutiveDays(
          checkIns.map((c) => c.createdAt)
        )

        // 构建心情分布
        const moodCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        moodDistribution.forEach((item) => {
          moodCounts[item.mood] = item._count.mood
        })

        statsData.push({
          userId: user.id,
          totalCheckIns,
          averageMood: Math.round((avgMoodResult._avg.mood ?? 0) * 100) / 100,
          consecutiveDays,
          mood1: moodCounts[1],
          mood2: moodCounts[2],
          mood3: moodCounts[3],
          mood4: moodCounts[4],
          mood5: moodCounts[5],
        })
      }

      if (statsData.length > 0) {
        const parser = new Parser<StatsData>({
          fields: ['userId', 'totalCheckIns', 'averageMood', 'consecutiveDays', 'mood1', 'mood2', 'mood3', 'mood4', 'mood5'],
        })
        csvContent += '=== 统计数据 ===\n'
        csvContent += parser.parse(statsData)
      }
    }

    // 如果没有数据
    if (!csvContent.trim()) {
      return NextResponse.json(
        { error: 'No data found for the specified filters' },
        { status: 404 }
      )
    }

    // 创建 CSV 响应
    const filename = `export_${dataType}_${new Date().toISOString().split('T')[0]}.csv`
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('CSV Export API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to export CSV' },
      { status: 500 }
    )
  }
}

/**
 * 计算连续打卡天数
 */
function calculateConsecutiveDays(dates: Date[]): number {
  if (dates.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const uniqueDays = new Set<number>()
  dates.forEach((date) => {
    const day = new Date(date)
    day.setHours(0, 0, 0, 0)
    uniqueDays.add(day.getTime())
  })

  const sortedDays = Array.from(uniqueDays).sort((a, b) => b - a)

  const mostRecentDay = sortedDays[0]
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)

  if (mostRecentDay !== today.getTime() && mostRecentDay !== yesterday.getTime()) {
    return 0
  }

  let streak = 1
  for (let i = 1; i < sortedDays.length; i++) {
    const expectedPrevDay = sortedDays[i - 1] - 24 * 60 * 60 * 1000
    if (sortedDays[i] === expectedPrevDay) {
      streak++
    } else {
      break
    }
  }

  return streak
}

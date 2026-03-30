import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Redis 缓存客户端（如果配置了 Redis）
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
  HOT: 300,      // 5 分钟 - 热点数据
  AGG: 1800,     // 30 分钟 - 聚合数据
  REPORT: 21600, // 6 小时 - 报表数据
}

interface SummaryResponse {
  totalCheckIns: number
  totalUsers: number
  averageMood: number
  moodDistribution: { mood: number; count: number; percentage: number }[]
  activeUsers: {
    today: number
    thisWeek: number
    thisMonth: number
  }
  streaks: {
    maxStreak: number
    averageStreak: number
  }
  updatedAt: string
}

// 内存缓存作为 Redis 的降级方案
const memoryCache = new Map<string, { data: SummaryResponse; timestamp: number }>()

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId') // 可选，提供则返回用户个人统计
    const forceRefresh = searchParams.get('forceRefresh') === 'true'

    // 缓存键
    const cacheKey = userId ? `analytics:summary:user:${userId}` : 'analytics:summary:global'
    const cacheTTL = userId ? CACHE_TTL.HOT : CACHE_TTL.AGG

    // 尝试从 Redis 读取
    if (!forceRefresh && REDIS_ENABLED) {
      const redis = await getRedisClient()
      if (redis) {
        const cached = await redis.get(cacheKey)
        if (cached) {
          const data = JSON.parse(cached)
          console.log(`[Summary API] Cache hit (Redis): ${cacheKey}`)
          return NextResponse.json(data)
        }
      }
    }

    // 尝试从内存缓存读取
    if (!forceRefresh) {
      const cached = memoryCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < cacheTTL * 1000) {
        console.log(`[Summary API] Cache hit (Memory): ${cacheKey}`)
        return NextResponse.json(cached.data)
      }
    }

    // 构建查询条件
    const whereClause = userId ? { userId } : {}

    // 1. 总打卡数
    const totalCheckIns = await prisma.checkIn.count({
      where: whereClause,
    })

    // 2. 总用户数（仅全局统计）
    const totalUsers = userId 
      ? 1 
      : await prisma.user.count()

    // 3. 平均心情
    const avgMoodResult = await prisma.checkIn.aggregate({
      where: whereClause,
      _avg: { mood: true },
    })
    const averageMood = avgMoodResult._avg.mood ?? 0

    // 4. 心情分布（使用原始 SQL 优化性能）
    const moodDistributionRaw: any[] = userId
      ? await prisma.$queryRaw`
          SELECT 
            "mood",
            COUNT(*) as count
          FROM "CheckIn"
          WHERE "userId" = ${userId}
          GROUP BY "mood"
          ORDER BY "mood" ASC
        `
      : await prisma.$queryRaw`
          SELECT 
            "mood",
            COUNT(*) as count
          FROM "CheckIn"
          GROUP BY "mood"
          ORDER BY "mood" ASC
        `

    const moodDistribution = moodDistributionRaw.map((row: any) => ({
      mood: Number(row.mood),
      count: Number(row.count),
      percentage: totalCheckIns > 0 
        ? Math.round((Number(row.count) / totalCheckIns) * 10000) / 100 
        : 0,
    }))

    // 5. 活跃用户统计
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(todayStart)
    weekStart.setDate(weekStart.getDate() - 7)
    const monthStart = new Date(todayStart)
    monthStart.setDate(monthStart.getDate() - 30)

    const activeUsers = userId
      ? { today: 0, thisWeek: 0, thisMonth: 0 }
      : {
          today: await prisma.user.count({
            where: {
              checkins: {
                some: {
                  createdAt: { gte: todayStart },
                },
              },
            },
          }),
          thisWeek: await prisma.user.count({
            where: {
              checkins: {
                some: {
                  createdAt: { gte: weekStart },
                },
              },
            },
          }),
          thisMonth: await prisma.user.count({
            where: {
              checkins: {
                some: {
                  createdAt: { gte: monthStart },
                },
              },
            },
          }),
        }

    // 6. 连续打卡统计（优化：仅计算有数据的用户）
    const streaks = userId
      ? await calculateUserStreaks(userId)
      : { maxStreak: 0, averageStreak: 0 }

    const summary: SummaryResponse = {
      totalCheckIns,
      totalUsers,
      averageMood: Math.round(averageMood * 100) / 100,
      moodDistribution,
      activeUsers,
      streaks,
      updatedAt: new Date().toISOString(),
    }

    // 写入 Redis 缓存
    if (REDIS_ENABLED) {
      const redis = await getRedisClient()
      if (redis) {
        try {
          await redis.setex(cacheKey, cacheTTL, JSON.stringify(summary))
          console.log(`[Summary API] Cached to Redis: ${cacheKey}`)
        } catch (error) {
          console.error('Failed to cache to Redis:', error)
        }
      }
    }

    // 写入内存缓存
    memoryCache.set(cacheKey, { data: summary, timestamp: Date.now() })

    // 性能日志
    const responseTime = Date.now() - startTime
    console.log(`[Summary API] Response time: ${responseTime}ms`)

    // 添加性能头
    const response = NextResponse.json(summary)
    response.headers.set('X-Response-Time', `${responseTime}ms`)
    response.headers.set('X-Cache-Source', 'miss')
    
    return response
  } catch (error) {
    console.error('[Summary API] Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics summary',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * 计算用户连续打卡天数
 */
async function calculateUserStreaks(userId: string): Promise<{ maxStreak: number; averageStreak: number }> {
  try {
    const checkIns = await prisma.checkIn.findMany({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' },
      // 优化：只取最近 365 天的数据
    })

    if (checkIns.length === 0) {
      return { maxStreak: 0, averageStreak: 0 }
    }

    // 转换为唯一日期
    const uniqueDays = new Set<number>()
    checkIns.forEach((c) => {
      const day = new Date(c.createdAt)
      day.setHours(0, 0, 0, 0)
      uniqueDays.add(day.getTime())
    })

    const sortedDays = Array.from(uniqueDays).sort((a, b) => b - a)
    
    // 计算当前连续天数
    let currentStreak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const mostRecentDay = sortedDays[0]
    if (mostRecentDay === today.getTime() || mostRecentDay === yesterday.getTime()) {
      currentStreak = 1
      for (let i = 1; i < sortedDays.length; i++) {
        const expectedPrevDay = sortedDays[i - 1] - 24 * 60 * 60 * 1000
        if (sortedDays[i] === expectedPrevDay) {
          currentStreak++
        } else {
          break
        }
      }
    }

    // 计算历史最大连续天数（滑动窗口）
    let maxStreak = currentStreak
    let tempStreak = 1
    
    for (let i = 1; i < sortedDays.length; i++) {
      const expectedPrevDay = sortedDays[i - 1] - 24 * 60 * 60 * 1000
      if (sortedDays[i] === expectedPrevDay) {
        tempStreak++
        maxStreak = Math.max(maxStreak, tempStreak)
      } else {
        tempStreak = 1
      }
    }

    return {
      maxStreak,
      averageStreak: Math.round(currentStreak * 100) / 100,
    }
  } catch (error) {
    console.error('Failed to calculate streaks:', error)
    return { maxStreak: 0, averageStreak: 0 }
  }
}

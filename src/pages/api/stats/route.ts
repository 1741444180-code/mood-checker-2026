import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface StatsResponse {
  totalCheckIns: number
  moodDistribution: { mood: number; count: number }[]
  consecutiveDays: number
  averageMood: number
}

// Simple in-memory cache
const cache = new Map<string, { data: StatsResponse; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Check cache
    const cacheKey = `stats:${userId}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data)
    }

    // Get total check-ins
    const totalCheckIns = await prisma.checkIn.count({
      where: { userId },
    })

    // Get mood distribution (for pie chart)
    const moodDistributionRaw = await prisma.checkIn.groupBy({
      by: ['mood'],
      where: { userId },
      _count: { mood: true },
      orderBy: { mood: 'asc' },
    })

    const moodDistribution = moodDistributionRaw.map((item) => ({
      mood: item.mood,
      count: item._count.mood,
    }))

    // Get average mood
    const avgMoodResult = await prisma.checkIn.aggregate({
      where: { userId },
      _avg: { mood: true },
    })
    const averageMood = avgMoodResult._avg.mood ?? 0

    // Calculate consecutive check-in days
    const checkIns = await prisma.checkIn.findMany({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' },
    })

    let consecutiveDays = 0
    if (checkIns.length > 0) {
      consecutiveDays = calculateConsecutiveDays(
        checkIns.map((c) => c.createdAt)
      )
    }

    const stats: StatsResponse = {
      totalCheckIns,
      moodDistribution,
      consecutiveDays,
      averageMood: Math.round(averageMood * 100) / 100,
    }

    // Cache the result
    cache.set(cacheKey, { data: stats, timestamp: Date.now() })

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

/**
 * Calculate consecutive check-in days from a list of dates
 */
function calculateConsecutiveDays(dates: Date[]): number {
  if (dates.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Convert to unique days (midnight timestamps)
  const uniqueDays = new Set<number>()
  dates.forEach((date) => {
    const day = new Date(date)
    day.setHours(0, 0, 0, 0)
    uniqueDays.add(day.getTime())
  })

  const sortedDays = Array.from(uniqueDays).sort((a, b) => b - a)

  // Check if the most recent check-in is today or yesterday
  const mostRecentDay = sortedDays[0]
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)

  if (mostRecentDay !== today.getTime() && mostRecentDay !== yesterday.getTime()) {
    // Streak is broken
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

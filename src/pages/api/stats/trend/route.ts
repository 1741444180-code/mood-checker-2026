import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface TrendDataPoint {
  date: string
  mood: number
  count: number
}

interface TrendResponse {
  data: TrendDataPoint[]
  period: {
    start: string
    end: string
    days: number
  }
}

// Simple in-memory cache
const cache = new Map<string, { data: TrendResponse; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const days = parseInt(searchParams.get('days') || '30', 10)

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

    // Check cache
    const cacheKey = `trend:${userId}:${days}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data)
    }

    // Calculate date range
    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days + 1)
    startDate.setHours(0, 0, 0, 0)

    // Get daily mood aggregates using raw SQL for better performance
    // This groups by date and calculates average mood per day
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

    // Fill in missing days with null/zero data
    const trendData: TrendDataPoint[] = []
    const resultDates = new Map<string, { mood: number; count: number }>()

    rawResults.forEach((row: any) => {
      const dateStr = row.date.toISOString().split('T')[0]
      resultDates.set(dateStr, {
        mood: Math.round(Number(row.mood) * 100) / 100,
        count: Number(row.count),
      })
    })

    // Generate all dates in range
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]
      const data = resultDates.get(dateStr)
      trendData.push({
        date: dateStr,
        mood: data?.mood ?? 0,
        count: data?.count ?? 0,
      })
    }

    const response: TrendResponse = {
      data: trendData,
      period: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        days,
      },
    }

    // Cache the result
    cache.set(cacheKey, { data: response, timestamp: Date.now() })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Trend API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trend data' },
      { status: 500 }
    )
  }
}

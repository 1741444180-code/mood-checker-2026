import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface AnalyticsResponse {
  totalArticles: number
  totalViews: number
  totalFeedback: number
  averageRating: number
  topArticles: Array<{
    id: string
    title: string
    views: number
    helpful: number
    notHelpful: number
    rating: number
  }>
  searchQueries: Array<{
    query: string
    count: number
  }>
  categoryStats: Array<{
    category: string
    count: number
    views: number
  }>
  responseTime: number
}

// In-memory cache for analytics
const cache = new Map<string, { data: AnalyticsResponse; timestamp: number }>()
const CACHE_TTL = 15 * 60 * 1000 // 15 minutes

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')

    // Check cache
    const cacheKey = `analytics:${days}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data)
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get total articles
    const totalArticles = await prisma.helpArticle.count({
      where: { published: true },
    })

    // Get total views
    const articles = await prisma.helpArticle.findMany({
      where: { published: true },
      select: { views: true },
    })
    const totalViews = articles.reduce((sum, article) => sum + article.views, 0)

    // Get total feedback
    const totalFeedback = await prisma.helpFeedback.count({
      where: { createdAt: { gte: startDate } },
    })

    // Get feedback ratings
    const helpfulCount = await prisma.helpFeedback.count({
      where: {
        rating: 'helpful',
        createdAt: { gte: startDate },
      },
    })
    const notHelpfulCount = await prisma.helpFeedback.count({
      where: {
        rating: 'notHelpful',
        createdAt: { gte: startDate },
      },
    })
    const averageRating = totalFeedback > 0
      ? Math.round((helpfulCount / totalFeedback) * 100)
      : 0

    // Get top articles by views
    const topArticlesRaw = await prisma.helpArticle.findMany({
      where: { published: true },
      orderBy: { views: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        views: true,
        helpful: true,
        notHelpful: true,
      },
    })

    const topArticles = topArticlesRaw.map((article) => ({
      ...article,
      rating: article.helpful + article.notHelpful > 0
        ? Math.round((article.helpful / (article.helpful + article.notHelpful)) * 100)
        : 0,
    }))

    // Get category stats
    const categoryStatsRaw = await prisma.helpArticle.groupBy({
      by: ['category'],
      where: { published: true },
      _count: { category: true },
      _sum: { views: true },
    })

    const categoryStats = categoryStatsRaw.map((stat) => ({
      category: stat.category,
      count: stat._count.category,
      views: stat._sum.views || 0,
    }))

    // Get popular search queries (from feedback comments or logs)
    // This is a simplified version - in production you'd have a search_logs table
    const searchQueries: Array<{ query: string; count: number }> = []

    const responseTime = Date.now() - startTime

    const response: AnalyticsResponse = {
      totalArticles,
      totalViews,
      totalFeedback,
      averageRating,
      topArticles,
      searchQueries,
      categoryStats,
      responseTime,
    }

    // Cache the result
    cache.set(cacheKey, { data: response, timestamp: Date.now() })

    console.log(`Analytics API response time: ${responseTime}ms`)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

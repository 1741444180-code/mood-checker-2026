import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface HelpArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  views: number
  helpful: number
  notHelpful: number
  published: boolean
  createdAt: Date
  updatedAt: Date
}

interface ArticlesResponse {
  articles: HelpArticle[]
  total: number
  page: number
  pageSize: number
}

// In-memory cache for articles
const cache = new Map<string, { data: ArticlesResponse; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const category = searchParams.get('category')
    const published = searchParams.get('published') !== 'false'

    // Check cache
    const cacheKey = `articles:${page}:${pageSize}:${category}:${published}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data)
    }

    // Build query
    const where: any = { published }
    if (category) {
      where.category = category
    }

    // Get total count
    const total = await prisma.helpArticle.count({ where })

    // Get articles with pagination
    const articles = await prisma.helpArticle.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        tags: true,
        views: true,
        helpful: true,
        notHelpful: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    const response: ArticlesResponse = {
      articles,
      total,
      page,
      pageSize,
    }

    // Cache the result
    cache.set(cacheKey, { data: response, timestamp: Date.now() })

    const responseTime = Date.now() - startTime
    console.log(`Articles API response time: ${responseTime}ms`)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Articles API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

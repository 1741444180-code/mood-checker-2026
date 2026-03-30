import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface SearchArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  views: number
  helpful: number
  published: boolean
  relevance?: number
}

interface SearchResponse {
  results: SearchArticle[]
  total: number
  query: string
  responseTime: number
}

// Simple in-memory cache for search results
const cache = new Map<string, { data: SearchResponse; timestamp: number }>()
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const searchQuery = query.trim().toLowerCase()
    
    // Check cache
    const cacheKey = `search:${searchQuery}:${category}:${limit}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data)
    }

    // Build search query
    const where: any = {
      published: true,
      OR: [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { content: { contains: searchQuery, mode: 'insensitive' } },
        { tags: { has: searchQuery } },
      ],
    }

    if (category) {
      where.category = category
    }

    // Execute search
    const results = await prisma.helpArticle.findMany({
      where,
      take: limit,
      orderBy: { views: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        tags: true,
        views: true,
        helpful: true,
        published: true,
      },
    })

    // Calculate relevance scores and highlight matches
    const scoredResults = results.map((article) => {
      let relevance = 0
      
      // Title match (highest weight)
      if (article.title.toLowerCase().includes(searchQuery)) {
        relevance += 10
      }
      
      // Tag match (high weight)
      if (article.tags.some((tag) => tag.toLowerCase().includes(searchQuery))) {
        relevance += 5
      }
      
      // Content match (lower weight)
      if (article.content.toLowerCase().includes(searchQuery)) {
        relevance += 2
      }
      
      // Boost by helpfulness
      relevance += article.helpful * 0.1
      
      return {
        ...article,
        relevance,
      }
    })

    // Sort by relevance
    scoredResults.sort((a, b) => b.relevance - a.relevance)

    const responseTime = Date.now() - startTime

    const response: SearchResponse = {
      results: scoredResults,
      total: scoredResults.length,
      query: searchQuery,
      responseTime,
    }

    // Cache the result
    cache.set(cacheKey, { data: response, timestamp: Date.now() })

    console.log(`Search API response time: ${responseTime}ms, results: ${scoredResults.length}`)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Failed to search articles' },
      { status: 500 }
    )
  }
}

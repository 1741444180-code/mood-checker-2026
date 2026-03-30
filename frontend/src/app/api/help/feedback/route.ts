import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface FeedbackRequest {
  articleId?: string
  userId?: string
  rating: 'helpful' | 'notHelpful'
  comment?: string
  email?: string
}

interface FeedbackResponse {
  success: boolean
  message: string
  feedbackId?: string
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body: FeedbackRequest = await request.json()
    
    // Validate required fields
    if (!body.rating) {
      return NextResponse.json(
        { success: false, error: 'Rating is required' },
        { status: 400 }
      )
    }

    if (body.rating !== 'helpful' && body.rating !== 'notHelpful') {
      return NextResponse.json(
        { success: false, error: 'Invalid rating value' },
        { status: 400 }
      )
    }

    // Create feedback record
    const feedback = await prisma.helpFeedback.create({
      data: {
        articleId: body.articleId || null,
        userId: body.userId || null,
        rating: body.rating,
        comment: body.comment || null,
        email: body.email || null,
        createdAt: new Date(),
      },
    })

    // Update article stats if articleId is provided
    if (body.articleId) {
      const updateData = body.rating === 'helpful' 
        ? { helpful: { increment: 1 } }
        : { notHelpful: { increment: 1 } }
      
      await prisma.helpArticle.update({
        where: { id: body.articleId },
        data: updateData,
      })
    }

    const responseTime = Date.now() - startTime
    
    const response: FeedbackResponse = {
      success: true,
      message: 'Feedback submitted successfully',
      feedbackId: feedback.id,
    }

    console.log(`Feedback API response time: ${responseTime}ms`)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const searchParams = request.nextUrl.searchParams
    const articleId = searchParams.get('articleId')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}
    if (articleId) {
      where.articleId = articleId
    }

    const feedbacks = await prisma.helpFeedback.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        articleId: true,
        userId: true,
        rating: true,
        comment: true,
        createdAt: true,
      },
    })

    const responseTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      feedbacks,
      total: feedbacks.length,
      responseTime,
    })
  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}

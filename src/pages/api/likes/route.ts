import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface LikeRequest {
  userId: string
  checkInId: string
}

interface LikeResponse {
  success: boolean
  liked: boolean
  likeCount: number
}

/**
 * GET - 获取点赞数和当前用户的点赞状态
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const checkInId = searchParams.get('checkInId')

    if (!userId || !checkInId) {
      return NextResponse.json(
        { error: 'userId and checkInId are required' },
        { status: 400 }
      )
    }

    // 获取点赞总数
    const likeCount = await prisma.like.count({
      where: { checkInId },
    })

    // 检查当前用户是否已点赞
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_checkInId: {
          userId,
          checkInId,
        },
      },
    })

    return NextResponse.json({
      success: true,
      liked: !!existingLike,
      likeCount,
    })
  } catch (error) {
    console.error('Get likes error:', error)
    return NextResponse.json(
      { error: 'Failed to get likes' },
      { status: 500 }
    )
  }
}

/**
 * POST - 点赞
 */
export async function POST(request: NextRequest) {
  try {
    const body: LikeRequest = await request.json()
    const { userId, checkInId } = body

    if (!userId || !checkInId) {
      return NextResponse.json(
        { error: 'userId and checkInId are required' },
        { status: 400 }
      )
    }

    // 检查打卡是否存在
    const checkIn = await prisma.checkIn.findUnique({
      where: { id: checkInId },
    })

    if (!checkIn) {
      return NextResponse.json(
        { error: 'CheckIn not found' },
        { status: 404 }
      )
    }

    // 创建点赞（唯一索引会防止重复点赞）
    const like = await prisma.like.create({
      data: {
        userId,
        checkInId,
      },
    })

    // 获取最新点赞数
    const likeCount = await prisma.like.count({
      where: { checkInId },
    })

    return NextResponse.json({
      success: true,
      liked: true,
      likeCount,
    })
  } catch (error: any) {
    // 处理重复点赞错误
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Already liked' },
        { status: 409 }
      )
    }

    console.error('Like error:', error)
    return NextResponse.json(
      { error: 'Failed to like' },
      { status: 500 }
    )
  }
}

/**
 * DELETE - 取消点赞
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const checkInId = searchParams.get('checkInId')

    if (!userId || !checkInId) {
      return NextResponse.json(
        { error: 'userId and checkInId are required' },
        { status: 400 }
      )
    }

    // 删除点赞
    await prisma.like.delete({
      where: {
        userId_checkInId: {
          userId,
          checkInId,
        },
      },
    })

    // 获取最新点赞数
    const likeCount = await prisma.like.count({
      where: { checkInId },
    })

    return NextResponse.json({
      success: true,
      liked: false,
      likeCount,
    })
  } catch (error: any) {
    // 处理点赞不存在的情况
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Like not found' },
        { status: 404 }
      )
    }

    console.error('Unlike error:', error)
    return NextResponse.json(
      { error: 'Failed to unlike' },
      { status: 500 }
    )
  }
}

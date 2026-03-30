import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Valid theme values
const VALID_THEMES = ['light', 'dark', 'system'] as const
export type Theme = typeof VALID_THEMES[number]

// Request validation schema
const themeRequestSchema = z.object({
  theme: z.enum(VALID_THEMES, {
    message: 'Invalid theme. Supported: light, dark, system',
  }),
})

// Response time tracking helper
const trackResponseTime = async <T>(fn: () => Promise<T>): Promise<{ data: T; responseTime: number }> => {
  const startTime = Date.now()
  const data = await fn()
  const responseTime = Date.now() - startTime
  return { data, responseTime }
}

/**
 * GET /api/user/theme
 * Get user's theme preference
 * 
 * Query params:
 * - userId: string (required)
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        theme: true,
        email: true,
        name: true,
        language: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      )
    }

    const responseTime = Date.now() - startTime

    return NextResponse.json({
      userId: user.id,
      theme: user.theme,
      email: user.email,
      name: user.name,
      language: user.language,
      responseTime: `${responseTime}ms`,
    })
  } catch (error) {
    console.error('GET /api/user/theme error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch user theme preference', 
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/user/theme
 * Update user's theme preference
 * 
 * Body:
 * - userId: string (required)
 * - theme: string (required, must be light, dark, or system)
 */
export async function PUT(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Parse and validate request body
    let body: unknown
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON body', code: 'INVALID_JSON' },
        { status: 400 }
      )
    }

    const validationResult = themeRequestSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          code: 'VALIDATION_ERROR',
          details: validationResult.error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          }))
        },
        { status: 400 }
      )
    }

    const { theme } = validationResult.data
    const userId = (body as any).userId

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, theme: true },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      )
    }

    // Update user theme preference
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { theme },
      select: {
        id: true,
        theme: true,
        email: true,
        name: true,
        language: true,
        updatedAt: true,
      },
    })

    const responseTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      message: `Theme preference updated to ${theme}`,
      user: {
        id: updatedUser.id,
        theme: updatedUser.theme,
        email: updatedUser.email,
        name: updatedUser.name,
        language: updatedUser.language,
        updatedAt: updatedUser.updatedAt,
      },
      responseTime: `${responseTime}ms`,
    })
  } catch (error) {
    console.error('PUT /api/user/theme error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to update theme preference', 
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user/theme
 * Create user with theme preference (if not exists)
 * 
 * Body:
 * - email: string (required)
 * - theme?: string (optional, default: light)
 * - name?: string (optional)
 * - language?: string (optional, default: zh-CN)
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Parse request body
    let body: unknown
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON body', code: 'INVALID_JSON' },
        { status: 400 }
      )
    }

    const { email, theme = 'light', name, language = 'zh-CN' } = body as {
      email: string
      theme?: string
      name?: string
      language?: string
    }

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required', code: 'INVALID_EMAIL' },
        { status: 400 }
      )
    }

    // Validate theme if provided
    if (theme && !VALID_THEMES.includes(theme as Theme)) {
      return NextResponse.json(
        { 
          error: 'Invalid theme', 
          code: 'INVALID_THEME',
          details: `Supported themes: ${VALID_THEMES.join(', ')}`
        },
        { status: 400 }
      )
    }

    // Validate language if provided
    if (language && !['zh-CN', 'en-US'].includes(language)) {
      return NextResponse.json(
        { 
          error: 'Invalid language', 
          code: 'INVALID_LANGUAGE',
          details: 'Supported languages: zh-CN, en-US'
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, theme: true, language: true },
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          error: 'User already exists', 
          code: 'USER_EXISTS',
          user: existingUser
        },
        { status: 409 }
      )
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || null,
        language,
        theme: theme as Theme,
      },
      select: {
        id: true,
        email: true,
        name: true,
        language: true,
        theme: true,
        createdAt: true,
      },
    })

    const responseTime = Date.now() - startTime

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: newUser,
        responseTime: `${responseTime}ms`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/user/theme error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create user', 
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

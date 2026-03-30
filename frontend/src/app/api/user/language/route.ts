import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isSupportedLanguage, defaultLanguage, getTranslation } from '@/i18n/messages'
import { z } from 'zod'

// Request validation schema
const languageRequestSchema = z.object({
  language: z.string().refine(
    (lang) => isSupportedLanguage(lang),
    { message: 'Unsupported language. Supported: zh-CN, en-US' }
  ),
})

// Response time tracking middleware helper
const trackResponseTime = async <T>(fn: () => Promise<T>): Promise<{ data: T; responseTime: number }> => {
  const startTime = Date.now()
  const data = await fn()
  const responseTime = Date.now() - startTime
  return { data, responseTime }
}

/**
 * GET /api/user/language
 * Get user's language preference
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
        language: true,
        email: true,
        name: true,
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
      language: user.language,
      email: user.email,
      name: user.name,
      responseTime: `${responseTime}ms`,
    })
  } catch (error) {
    console.error('GET /api/user/language error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch user language preference', 
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/user/language
 * Update user's language preference
 * 
 * Body:
 * - userId: string (required)
 * - language: string (required, must be zh-CN or en-US)
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

    const validationResult = languageRequestSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          code: 'VALIDATION_ERROR',
          details: validationResult.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          }))
        },
        { status: 400 }
      )
    }

    const { language } = validationResult.data
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
      select: { id: true, language: true },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      )
    }

    // Update user language preference
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { language },
      select: {
        id: true,
        language: true,
        email: true,
        name: true,
        updatedAt: true,
      },
    })

    const responseTime = Date.now() - startTime

    // Get localized success message
    const successMessage = getTranslation(
      language as 'zh-CN' | 'en-US',
      'user.languageChanged'
    )

    return NextResponse.json({
      success: true,
      message: `${successMessage} ${language}`,
      user: {
        id: updatedUser.id,
        language: updatedUser.language,
        email: updatedUser.email,
        name: updatedUser.name,
        updatedAt: updatedUser.updatedAt,
      },
      responseTime: `${responseTime}ms`,
    })
  } catch (error) {
    console.error('PUT /api/user/language error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to update language preference', 
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user/language
 * Create user with language preference (if not exists)
 * 
 * Body:
 * - email: string (required)
 * - language?: string (optional, default: zh-CN)
 * - name?: string (optional)
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

    const { email, language = defaultLanguage, name } = body as {
      email: string
      language?: string
      name?: string
    }

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required', code: 'INVALID_EMAIL' },
        { status: 400 }
      )
    }

    // Validate language if provided
    if (language && !isSupportedLanguage(language)) {
      return NextResponse.json(
        { 
          error: 'Unsupported language', 
          code: 'UNSUPPORTED_LANGUAGE',
          details: `Supported languages: ${supportedLanguages.join(', ')}`
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, language: true },
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
      },
      select: {
        id: true,
        email: true,
        name: true,
        language: true,
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
    console.error('POST /api/user/language error:', error)
    
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

// Helper for supported languages
const supportedLanguages = ['zh-CN', 'en-US'] as const

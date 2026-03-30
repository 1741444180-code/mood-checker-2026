import { NextRequest, NextResponse } from 'next/server'

// Available themes configuration
const THEMES = {
  light: {
    id: 'light',
    name: '浅色模式',
    nameEn: 'Light Mode',
    colors: {
      background: '#FFFFFF',
      foreground: '#1a1a1a',
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#8b5cf6',
      muted: '#f1f5f9',
      card: '#FFFFFF',
      border: '#e2e8f0',
    },
  },
  dark: {
    id: 'dark',
    name: '暗黑模式',
    nameEn: 'Dark Mode',
    colors: {
      background: '#0f172a',
      foreground: '#f1f5f9',
      primary: '#60a5fa',
      secondary: '#94a3b8',
      accent: '#a78bfa',
      muted: '#1e293b',
      card: '#1e293b',
      border: '#334155',
    },
  },
  system: {
    id: 'system',
    name: '跟随系统',
    nameEn: 'Follow System',
    colors: null, // Dynamic based on system preference
  },
} as const

export type ThemeId = keyof typeof THEMES
export type ThemeConfig = typeof THEMES[ThemeId]

/**
 * GET /api/theme/config
 * Get available theme configurations
 * 
 * Query params:
 * - lang?: string (optional, default: zh-CN) - Language for theme names
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const searchParams = request.nextUrl.searchParams
    const lang = searchParams.get('lang') || 'zh-CN'

    // Validate language parameter
    if (!['zh-CN', 'en-US'].includes(lang)) {
      return NextResponse.json(
        { error: 'Unsupported language. Supported: zh-CN, en-US', code: 'UNSUPPORTED_LANGUAGE' },
        { status: 400 }
      )
    }

    // Format themes based on language
    const formattedThemes = Object.values(THEMES).map(theme => ({
      id: theme.id,
      name: lang === 'en-US' ? theme.nameEn : theme.name,
      colors: theme.colors,
    }))

    const responseTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      themes: formattedThemes,
      default: 'light',
      responseTime: `${responseTime}ms`,
    })
  } catch (error) {
    console.error('GET /api/theme/config error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch theme configurations', 
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/theme/config/:themeId
 * Get specific theme configuration
 */
export async function GET_BY_THEME(request: NextRequest, { params }: { params: { themeId: string } }) {
  const startTime = Date.now()
  const { themeId } = params
  
  try {
    // Validate theme ID
    if (!isValidThemeId(themeId)) {
      return NextResponse.json(
        { 
          error: 'Invalid theme ID', 
          code: 'INVALID_THEME_ID',
          details: `Supported themes: ${Object.keys(THEMES).join(', ')}`
        },
        { status: 400 }
      )
    }

    const theme = THEMES[themeId as ThemeId]
    const responseTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      theme: {
        id: theme.id,
        name: theme.name,
        nameEn: theme.nameEn,
        colors: theme.colors,
      },
      responseTime: `${responseTime}ms`,
    })
  } catch (error) {
    console.error('GET /api/theme/config/:themeId error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch theme configuration', 
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper function to validate theme ID
function isValidThemeId(themeId: string): themeId is ThemeId {
  return themeId in THEMES
}

// Export constants for external use
export { THEMES }

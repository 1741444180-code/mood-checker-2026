// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // 这里可以添加认证逻辑
  // 示例：检查特定路径是否需要认证
  const protectedPaths = ['/dashboard', '/calendar', '/stats', '/profile']
  const isAuthenticated = true // 简化示例，实际应用中需要验证token

  if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
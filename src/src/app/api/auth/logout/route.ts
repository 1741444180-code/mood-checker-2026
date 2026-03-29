// src/app/api/auth/logout/route.ts
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // 实际应用中，这里可能会使token失效或从黑名单中添加token
    // 简单返回成功响应
    return Response.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    return Response.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
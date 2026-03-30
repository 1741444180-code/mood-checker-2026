// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 在实际应用中，这里可以将 token 加入黑名单
    // 或者删除数据库中的 session 记录
    
    // 对于 JWT，我们通常采用客户端删除 token 的方式
    // 服务端可以选择将 token 加入黑名单（需要 Redis 等支持）
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

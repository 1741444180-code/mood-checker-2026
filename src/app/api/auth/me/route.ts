// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // 解析 mock token
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString());

      if (payload.exp < Date.now()) {
        return NextResponse.json(
          { error: 'Token 已过期' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: payload.userId,
          username: payload.username,
          email: payload.email,
          createdAt: '2026-03-28T00:00:00Z',
        },
      });
    } catch {
      return NextResponse.json(
        { error: 'Token 无效' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    );
  }
}

// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken, getTokenFromHeader } from '@/lib/jwt';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // 从请求头获取 token
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 验证 token
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user info' },
      { status: 500 }
    );
  }
}

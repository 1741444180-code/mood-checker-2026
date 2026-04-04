import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: '请输入邮箱和密码' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username: email }],
        password,
      },
    });

    if (!user) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

    const token = Buffer.from(JSON.stringify({
      userId: user.id, email: user.email, username: user.username,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    })).toString('base64');

    return NextResponse.json({
      success: true, token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: '登录失败' }, { status: 500 });
  }
}

// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

// 测试账号（无数据库模式）
const TEST_USERS = [
  {
    id: 1,
    username: 'jianquan',
    email: 'jianquan@test.com',
    password: 'jq123456',
    avatar: null,
  },
  {
    id: 2,
    username: 'test',
    email: 'test@test.com',
    password: 'test123',
    avatar: null,
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 验证必填字段
    if (!email || !password) {
      return NextResponse.json(
        { error: '请输入邮箱和密码' },
        { status: 400 }
      );
    }

    // 查找测试用户（支持邮箱或用户名登录）
    const user = TEST_USERS.find(
      (u) => (u.email === email || u.username === email) && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    // 生成简单的 mock token
    const token = Buffer.from(JSON.stringify({
      userId: user.id,
      email: user.email,
      username: user.username,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天有效
    })).toString('base64');

    // 返回用户信息
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '登录失败，请重试' },
      { status: 500 }
    );
  }
}

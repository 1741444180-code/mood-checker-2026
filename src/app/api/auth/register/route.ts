// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';

// 内存中存储注册用户（测试模式）
const registeredUsers: any[] = [];
let nextId = 100;

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // 验证必填字段
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: '请填写用户名、邮箱和密码' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '邮箱格式不正确' },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码至少6位' },
        { status: 400 }
      );
    }

    // 检查是否已存在
    const exists = registeredUsers.find(u => u.email === email || u.username === username);
    if (exists) {
      return NextResponse.json(
        { error: '该邮箱或用户名已注册' },
        { status: 409 }
      );
    }

    // 创建用户
    const newUser = {
      id: nextId++,
      username,
      email,
      password,
      createdAt: new Date().toISOString(),
    };
    registeredUsers.push(newUser);

    // 生成 mock token
    const token = Buffer.from(JSON.stringify({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    })).toString('base64');

    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: '注册失败，请重试' },
      { status: 500 }
    );
  }
}

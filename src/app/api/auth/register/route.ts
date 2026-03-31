import { NextRequest, NextResponse } from 'next/server';

// 模拟用户数据库
const users: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // 验证必填字段
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: '用户名、邮箱和密码不能为空' },
        { status: 400 }
      );
    }

    // 验证用户名长度
    if (username.length < 2 || username.length > 20) {
      return NextResponse.json(
        { error: '用户名需 2-20 位字符' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '请输入正确的邮箱地址' },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (password.length < 6 || password.length > 20) {
      return NextResponse.json(
        { error: '密码需 6-20 位，包含字母和数字' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已注册
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    // 创建新用户
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password, // 实际项目应该加密存储
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    console.log('用户注册成功:', newUser.email);

    return NextResponse.json(
      { 
        message: '注册成功',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('注册失败:', error);
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
}

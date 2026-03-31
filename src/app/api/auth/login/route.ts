import { NextRequest, NextResponse } from 'next/server';

// 模拟用户数据
const users = [
  { id: 1, username: 'testuser', email: 'test@test.com', password: 'Test123456' }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 验证必填字段
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      );
    }

    // 查找用户
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    // 返回用户信息（实际项目应该返回 JWT token）
    return NextResponse.json(
      { 
        message: '登录成功',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token: 'mock-jwt-token-' + user.id
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json(
      { error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}

// src/app/api/auth/login/route.ts
import { NextRequest } from 'next/server'

// 模拟用户数据
const mockUsers = [
  { id: 'user1', username: 'testuser', email: 'test@example.com', password: 'hashed_password' },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // 简单验证
    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // 查找用户
    const user = mockUsers.find(u => u.email === email)

    if (!user) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // 注意：在实际应用中，这里应该验证密码哈希
    // 这里为了演示目的简化处理
    if (password !== 'password') { // 简单验证，实际应验证哈希
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // 生成模拟token（实际应用中应使用JWT等）
    const token = `mock_token_for_${user.id}`

    return Response.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      }
    })
  } catch (error) {
    return Response.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
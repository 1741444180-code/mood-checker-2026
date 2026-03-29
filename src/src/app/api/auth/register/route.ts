// src/app/api/auth/register/route.ts
import { NextRequest } from 'next/server'

// 模拟用户数据
let mockUsers = [
  { id: 'user1', username: 'testuser', email: 'test@example.com', password: 'hashed_password' },
]

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    // 简单验证
    if (!username || !email || !password) {
      return Response.json(
        { error: 'Username, email and password are required' },
        { status: 400 }
      )
    }

    // 检查用户是否已存在
    const existingUserByEmail = mockUsers.find(u => u.email === email)
    const existingUserByUsername = mockUsers.find(u => u.username === username)

    if (existingUserByEmail) {
      return Response.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    if (existingUserByUsername) {
      return Response.json(
        { error: 'User with this username already exists' },
        { status: 409 }
      )
    }

    // 创建新用户（实际应用中应加密密码）
    const newUser = {
      id: `user${mockUsers.length + 1}`,
      username,
      email,
      password: `hashed_${password}`, // 实际应用中应使用bcrypt等加密
    }

    mockUsers.push(newUser)

    // 生成模拟token
    const token = `mock_token_for_${newUser.id}`

    return Response.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      }
    }, { status: 201 })
  } catch (error) {
    return Response.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
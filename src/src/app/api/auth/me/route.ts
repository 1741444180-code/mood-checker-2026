// src/app/api/auth/me/route.ts
import { NextRequest } from 'next/server'

// 模拟用户数据
const mockUsers = [
  { id: 'user1', username: 'testuser', email: 'test@example.com', password: 'hashed_password' },
]

export async function GET(request: NextRequest) {
  try {
    // 从请求头获取Authorization token
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // 移除 "Bearer " 前缀
    
    // 验证token（简化验证）
    if (!token.startsWith('mock_token_for_')) {
      return Response.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // 从token中提取用户ID
    const userId = token.replace('mock_token_for_', '')
    
    // 查找用户
    const user = mockUsers.find(u => u.id === userId)

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return Response.json({
      id: user.id,
      username: user.username,
      email: user.email,
    })
  } catch (error) {
    return Response.json(
      { error: 'Failed to get user info' },
      { status: 500 }
    )
  }
}
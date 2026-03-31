// src/app/api/user/info/route.ts
import { NextRequest } from 'next/server'

// 模拟用户数据
const mockUser = {
  id: 'user1',
  username: 'testuser',
  email: 'test@example.com',
  avatar: null,
  createdAt: '2026-03-01T10:00:00Z',
  lastLoginAt: '2026-03-28T09:30:00Z',
  timezone: 'Asia/Shanghai',
  totalCheckIns: 28,
  streak: 7, // 连续打卡天数
};

export async function GET(request: NextRequest) {
  try {
    // 从请求头获取认证信息
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 实际应用中，会从token中解析用户ID，然后查询数据库
    // 这里返回模拟的用户信息
    return Response.json(mockUser);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get user info' },
      { status: 500 }
    );
  }
}
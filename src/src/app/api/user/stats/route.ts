// src/app/api/user/stats/route.ts
import { NextRequest } from 'next/server'

// 模拟用户统计数据
const mockUserStats = {
  userId: 'user1',
  totalCheckIns: 28,
  streak: 7,
  longestStreak: 12,
  moodDistribution: {
    '开心': 12,
    '平静': 8,
    '焦虑': 5,
    '疲惫': 2,
    '兴奋': 1,
  },
  monthlyBreakdown: {
    '2026-03': { total: 15, completed: 12 },
    '2026-02': { total: 28, completed: 22 },
    '2026-01': { total: 31, completed: 28 },
  },
  averageMoodScore: 3.8,
  mostCommonMood: '开心',
  lastUpdated: '2026-03-28T10:00:00Z',
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

    // 从查询参数获取用户ID（如果有）
    const userId = request.nextUrl.searchParams.get('userId');
    
    // 实际应用中会根据用户ID查询数据库
    // 这里返回模拟的统计数据
    return Response.json(mockUserStats);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get user stats' },
      { status: 500 }
    );
  }
}
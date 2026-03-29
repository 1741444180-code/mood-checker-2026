// src/app/api/user/stats/overview/route.ts
import { NextRequest } from 'next/server'

// 模拟用户统计概览数据
const mockStatsOverview = {
  userId: 'user1',
  period: '2026-03-01 to 2026-03-28',
  summary: {
    totalCheckIns: 28,
    avgMoodScore: 3.8,
    moodDistribution: {
      '开心': 40,
      '平静': 25,
      '焦虑': 15,
      '疲惫': 10,
      '兴奋': 5,
      '生气': 3,
      '低落': 2,
    },
    streak: 7,
    longestStreak: 12,
    topMood: '开心',
    moodTrend: 'improving',
  },
  weeklyComparison: {
    currentWeekAvg: 4.0,
    previousWeekAvg: 3.7,
    change: 0.3,
    changePercentage: 8.1,
  },
  monthlyComparison: {
    currentMonthAvg: 3.8,
    previousMonthAvg: 3.5,
    change: 0.3,
    changePercentage: 8.6,
  },
  moodPatterns: {
    bestTimeOfDay: 'evening',
    worstTimeOfDay: 'morning',
    bestDayOfWeek: 'sunday',
    worstDayOfWeek: 'monday',
  },
  achievements: [
    { id: 1, name: '连续打卡7天', description: '连续7天记录心情', earnedDate: '2026-03-24', icon: '🔥' },
    { id: 2, name: '情绪探索者', description: '体验了5种不同心情', earnedDate: '2026-03-18', icon: '🧪' },
    { id: 3, name: '积极心态', description: '开心心情占比超过50%', earnedDate: '2026-03-10', icon: '☀️' },
  ],
  insights: [
    '本月心情总体呈上升趋势',
    '周末心情明显好于工作日',
    '下午和晚上的心情普遍较好',
  ],
  recommendations: [
    '继续保持现有积极习惯',
    '在工作日安排更多放松时间',
  ],
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

    // 从查询参数获取时间范围
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');
    const period = request.nextUrl.searchParams.get('period') || 'monthly'; // daily, weekly, monthly, quarterly

    // 实际应用中会根据时间范围动态生成概览
    // 这里返回模拟的概览数据
    
    return Response.json(mockStatsOverview);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get stats overview' },
      { status: 500 }
    );
  }
}
// src/app/api/user/history/overview/route.ts
import { NextRequest } from 'next/server'

// 模拟用户历史概览数据
const mockHistoryOverview = {
  userId: 'user1',
  period: '2026-01-01 to 2026-03-28',
  summary: {
    totalDays: 87, // 从2026-01-01到2026-03-28
    totalCheckIns: 78,
    checkInRate: 89.7, // 百分比
    avgMoodScore: 3.6,
    moodVariety: 5, // 体验了多少种不同心情
    streak: 7,
    longestStreak: 15,
    firstEntryDate: '2026-01-03',
    lastEntryDate: '2026-03-28',
  },
  moodEvolution: [
    { month: '2026-01', avgScore: 3.4, totalCheckIns: 25 },
    { month: '2026-02', avgScore: 3.5, totalCheckIns: 28 },
    { month: '2026-03', avgScore: 3.8, totalCheckIns: 25 }, // 截至目前
  ],
  seasonalInsights: {
    spring: { avgScore: 3.8, bestMood: '开心', days: 18 },
    winter: { avgScore: 3.4, bestMood: '平静', days: 42 },
  },
  patterns: {
    weekdayVsWeekend: {
      weekdayAvg: 3.5,
      weekendAvg: 4.1,
      difference: 0.6,
    },
    timeOfDay: {
      morning: 3.3,
      afternoon: 3.7,
      evening: 4.0,
    },
    dayOfWeek: {
      monday: 3.2,
      tuesday: 3.4,
      wednesday: 3.5,
      thursday: 3.6,
      friday: 3.8,
      saturday: 4.2,
      sunday: 4.1,
    },
  },
  milestones: [
    { date: '2026-01-10', type: 'first_check_in', description: '第一次心情打卡' },
    { date: '2026-01-17', type: 'first_streak', value: 7, description: '首次达成7天连续打卡' },
    { date: '2026-02-14', type: 'first_custom_mood', value: '专注', description: '创建第一个自定义心情' },
    { date: '2026-03-01', type: 'month_complete', description: '完成第一个完整月份' },
    { date: '2026-03-15', type: 'longest_streak', value: 15, description: '创造最长连续打卡记录' },
  ],
  achievements: [
    { id: 1, name: '新手入门', description: '完成第一次心情打卡', earnedDate: '2026-01-03', icon: '👋' },
    { id: 2, name: '一周之约', description: '连续打卡7天', earnedDate: '2026-01-10', icon: '📅' },
    { id: 3, name: '月度坚持', description: '一个月内打卡20天以上', earnedDate: '2026-02-01', icon: '🗓️' },
    { id: 4, name: '心情探索者', description: '体验了所有基础心情类型', earnedDate: '2026-02-10', icon: '🔍' },
    { id: 5, name: '季节适应', description: '跨越两个季节的持续打卡', earnedDate: '2026-03-21', icon: '🌸' },
  ],
  projections: {
    estimatedAnnualCheckIns: 320, // 基于当前频率估算
    projectedAvgMood: 3.9, // 基于趋势预测
  },
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
    const granularity = request.nextUrl.searchParams.get('granularity') || 'overview'; // overview, monthly, weekly

    // 实际应用中会根据时间范围和粒度动态生成概览
    // 这里返回模拟的历史概览数据
    
    return Response.json(mockHistoryOverview);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get history overview' },
      { status: 500 }
    );
  }
}
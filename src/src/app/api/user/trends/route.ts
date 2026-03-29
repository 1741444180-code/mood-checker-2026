// src/app/api/user/trends/route.ts
import { NextRequest } from 'next/server'

// 模拟用户心情趋势数据
const mockTrends = {
  userId: 'user1',
  period: '2026-01-01 to 2026-03-28',
  overallTrend: 'improving', // improving, declining, stable
  moodChanges: {
    '开心': { change: '+15%', direction: 'up' },
    '平静': { change: '+5%', direction: 'up' },
    '焦虑': { change: '-10%', direction: 'down' },
    '疲惫': { change: '-8%', direction: 'down' },
    '生气': { change: '-12%', direction: 'down' },
  },
  monthlyComparison: [
    { month: '2026-01', avgMoodScore: 3.2, totalCheckIns: 25 },
    { month: '2026-02', avgMoodScore: 3.5, totalCheckIns: 28 },
    { month: '2026-03', avgMoodScore: 3.8, totalCheckIns: 28 }, // 截至目前
  ],
  seasonalTrends: {
    spring: { avgMoodScore: 3.7, peakMood: '开心' },
    winter: { avgMoodScore: 3.2, peakMood: '平静' },
  },
  moodPredictions: {
    nextWeek: {
      predictedAvg: 3.9,
      likelyMoods: ['开心', '平静'],
      confidence: 0.75,
    },
    nextMonth: {
      predictedAvg: 3.8,
      likelyMoods: ['开心', '平静', '兴奋'],
      confidence: 0.65,
    },
  },
  insights: [
    '你的心情在过去三个月中有明显改善趋势',
    '春季对你的情绪有积极影响',
    '工作日的焦虑水平高于周末',
    '你的积极情绪（开心、平静）比例正在稳步增长',
  ],
  recommendations: [
    '继续保持当前的良好习惯',
    '在工作日尝试更多的减压活动',
    '维持周末的积极活动以延续好心情',
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
    const granularity = request.nextUrl.searchParams.get('granularity') || 'monthly'; // daily, weekly, monthly, quarterly

    // 实际应用中会根据时间范围和粒度动态生成趋势分析
    // 这里返回模拟的趋势数据
    
    return Response.json(mockTrends);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get mood trends' },
      { status: 500 }
    );
  }
}
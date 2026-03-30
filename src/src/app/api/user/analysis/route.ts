// src/app/api/user/analysis/route.ts
import { NextRequest } from 'next/server'

// 模拟用户心情分析数据
const mockAnalysis = {
  userId: 'user1',
  period: '2026-03-01 to 2026-03-28',
  moodTrends: {
    overallMood: 'positive',
    moodDirection: 'improving', // improving, declining, stable
    avgMoodScore: 3.8,
    mostCommonMood: '开心',
    leastCommonMood: '疲惫',
  },
  patterns: {
    // 心情模式：工作日 vs 周末
    weekdayVsWeekend: {
      weekdayAvg: 3.5,
      weekendAvg: 4.2,
    },
    // 时间段心情模式
    timeOfDayPatterns: {
      morning: 3.7,
      afternoon: 3.9,
      evening: 4.0,
    },
    // 心情触发因素
    triggers: [
      { factor: '工作', positiveImpact: 30, negativeImpact: 40 },
      { factor: '生活', positiveImpact: 50, negativeImpact: 10 },
      { factor: '社交', positiveImpact: 60, negativeImpact: 5 },
    ],
  },
  insights: [
    '你在周末的心情明显比工作日更好',
    '晚上是你心情最好的时段',
    '工作是影响你心情的主要因素，既有正面也有负面',
    '社交活动对你的情绪有显著的正面影响',
  ],
  recommendations: [
    '考虑在工作日安排一些让你开心的小活动',
    '保持现有的良好睡眠习惯',
    '增加与朋友的社交活动',
    '注意工作与生活的平衡',
  ],
  updatedAt: '2026-03-28T10:00:00Z',
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
    
    // 实际应用中会根据时间范围动态生成分析
    // 这里返回模拟的分析数据
    
    return Response.json(mockAnalysis);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get mood analysis' },
      { status: 500 }
    );
  }
}
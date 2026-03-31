// src/app/api/user/insights/route.ts
import { NextRequest } from 'next/server'

// 模拟用户心情洞察数据
const mockInsights = {
  userId: 'user1',
  period: '2026-01-01 to 2026-03-28',
  overallMood: {
    avgScore: 3.7,
    trend: 'improving', // improving, declining, stable
    dominantMood: '开心',
  },
  patterns: {
    weekdayVsWeekend: {
      weekdayAvg: 3.5,
      weekendAvg: 4.2,
      difference: 0.7,
    },
    timeOfDay: {
      morning: 3.4,
      afternoon: 3.8,
      evening: 4.1,
    },
    moodTriggers: [
      { trigger: '工作', positiveImpact: 35, negativeImpact: 40 },
      { trigger: '生活', positiveImpact: 50, negativeImpact: 15 },
      { trigger: '社交', positiveImpact: 65, negativeImpact: 5 },
      { trigger: '健康', positiveImpact: 45, negativeImpact: 25 },
    ],
  },
  comparisons: {
    vsLastMonth: {
      avgChange: 0.3,
      moodChange: 'improving',
      totalCheckInsChange: 5,
    },
    vsAllUsers: {
      percentile: 65, // 用户心情分数超过65%的其他用户
      category: 'above_average', // above_average, average, below_average
    },
  },
  predictions: {
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
  recommendations: [
    '继续保持现有的良好习惯，特别是周末的积极活动',
    '考虑在工作日安排一些类似周末的放松活动',
    '增加社交活动频率，这对您的心情有显著的正面影响',
    '注意工作压力对心情的影响，适时调整工作节奏',
  ],
  milestones: [
    { date: '2026-03-24', type: 'streak', value: 7, description: '连续打卡7天里程碑' },
    { date: '2026-03-15', type: 'mood_high', value: 4.8, description: '本月最高心情分数' },
    { date: '2026-02-10', type: 'first_custom_mood', value: '专注', description: '创建第一个自定义心情类型' },
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
    const detailLevel = request.nextUrl.searchParams.get('detail') || 'summary'; // summary, detailed

    // 实际应用中会根据时间范围和详细程度动态生成洞察
    // 这里返回模拟的洞察数据
    
    // 如果只需要摘要，移除一些详细的分析
    if (detailLevel === 'summary') {
      const summaryInsights = { ...mockInsights };
      // 可以移除一些详细数据
      return Response.json(summaryInsights);
    }
    
    return Response.json(mockInsights);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get insights' },
      { status: 500 }
    );
  }
}
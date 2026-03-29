// src/app/api/user/insights/overview/route.ts
import { NextRequest } from 'next/server'

// 模拟用户洞察概览数据
const mockInsightsOverview = {
  userId: 'user1',
  period: '2026-01-01 to 2026-03-28',
  keyInsights: [
    {
      id: 1,
      title: '心情改善趋势',
      description: '过去3个月心情分数提升了0.4分',
      metric: 'mood_improvement',
      value: 0.4,
      trend: 'up',
      impact: 'high',
      timeframe: '3_months',
    },
    {
      id: 2,
      title: '最佳心情时间',
      description: '晚上7-9点心情最好，平均分数4.2',
      metric: 'best_time_of_day',
      value: '晚上',
      trend: 'stable',
      impact: 'medium',
      timeframe: 'all_time',
    },
    {
      id: 3,
      title: '周末效应',
      description: '周末心情比工作日高0.7分',
      metric: 'weekend_effect',
      value: 0.7,
      trend: 'stable',
      impact: 'high',
      timeframe: 'all_time',
    },
    {
      id: 4,
      title: '心情触发因素',
      description: '工作是最大的心情波动来源',
      metric: 'trigger_analysis',
      value: 'work',
      trend: 'improving',
      impact: 'high',
      timeframe: '2_months',
    },
  ],
  moodCorrelations: [
    {
      factor: '天气',
      correlation: 0.3,
      description: '晴天心情稍好',
    },
    {
      factor: '睡眠',
      correlation: 0.5,
      description: '充足睡眠显著改善心情',
    },
    {
      factor: '运动',
      correlation: 0.4,
      description: '运动后心情明显提升',
    },
    {
      factor: '社交',
      correlation: 0.6,
      description: '社交活动对心情影响最大',
    },
  ],
  behaviorPatterns: [
    {
      pattern: '工作日焦虑',
      frequency: '3_times_per_week',
      impact: 'high',
      recommendation: '尝试工作间隙放松技巧',
    },
    {
      pattern: '周末充电',
      frequency: 'weekly',
      impact: 'positive',
      recommendation: '保持周末积极活动',
    },
    {
      pattern: '晚间平静',
      frequency: 'daily',
      impact: 'positive',
      recommendation: '利用晚间时间进行反思',
    },
  ],
  prediction: {
    nextWeek: {
      predictedAvg: 3.9,
      likelyMoods: ['开心', '平静'],
      confidence: 0.78,
    },
    nextMonth: {
      predictedAvg: 4.0,
      likelyMoods: ['开心', '平静', '兴奋'],
      confidence: 0.72,
    },
  },
  personalizedTips: [
    {
      id: 1,
      title: '晚间放松',
      description: '继续保持晚上7-9点的积极习惯',
      category: 'timing',
      effectiveness: 0.85,
    },
    {
      id: 2,
      title: '工作间隙',
      description: '在工作日中午尝试5分钟呼吸练习',
      category: 'stress_management',
      effectiveness: 0.72,
    },
    {
      id: 3,
      title: '周末规划',
      description: '保持周末的多样化活动',
      category: 'lifestyle',
      effectiveness: 0.78,
    },
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
    const detailLevel = request.nextUrl.searchParams.get('detail') || 'overview'; // overview, detailed

    // 实际应用中会根据时间范围和详细程度动态生成洞察
    // 这里返回模拟的洞察概览数据
    
    return Response.json(mockInsightsOverview);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get insights overview' },
      { status: 500 }
    );
  }
}
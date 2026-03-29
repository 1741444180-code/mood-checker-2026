// src/app/api/user/suggestions/effectiveness/route.ts
import { NextRequest } from 'next/server'

// 模拟用户建议有效性统计数据
const mockSuggestionsEffectiveness = {
  userId: 'user1',
  period: '2026-01-01 to 2026-03-28',
  summary: {
    totalSuggestionsUsed: 128,
    effectiveSuggestions: 109, // 有效改善心情的建议
    effectivenessRate: 0.85, // 85%的建议有效
    avgImprovement: 0.7, // 平均心情改善分数
    mostEffectiveCategory: 'positive_psychology',
    leastEffectiveCategory: 'anger_management',
  },
  categoryEffectiveness: {
    relaxation: {
      used: 45,
      effective: 39,
      effectivenessRate: 0.87,
      avgImprovement: 0.75,
    },
    energy: {
      used: 28,
      effective: 22,
      effectivenessRate: 0.79,
      avgImprovement: 0.65,
    },
    positive_psychology: {
      used: 32,
      effective: 30,
      effectivenessRate: 0.94,
      avgImprovement: 0.85,
    },
    anger_management: {
      used: 15,
      effective: 10,
      effectivenessRate: 0.67,
      avgImprovement: 0.55,
    },
    mindfulness: {
      used: 8,
      effective: 8,
      effectivenessRate: 1.0,
      avgImprovement: 0.92,
    },
  },
  suggestionEffectiveness: [
    {
      id: 1,
      name: '深呼吸放松法',
      used: 23,
      effective: 21,
      effectivenessRate: 0.91,
      avgImprovement: 0.82,
      moodImproved: ['焦虑', '生气'],
      bestContext: '压力情境下',
    },
    {
      id: 2,
      name: '短暂休息',
      used: 15,
      effective: 13,
      effectivenessRate: 0.87,
      avgImprovement: 0.68,
      moodImproved: ['疲惫'],
      bestContext: '长时间工作后',
    },
    {
      id: 3,
      name: '感恩练习',
      used: 18,
      effective: 17,
      effectivenessRate: 0.94,
      avgImprovement: 0.88,
      moodImproved: ['低落', '焦虑'],
      bestContext: '情绪低落时',
    },
    {
      id: 4,
      name: '冷静计数法',
      used: 12,
      effective: 8,
      effectivenessRate: 0.67,
      avgImprovement: 0.52,
      moodImproved: ['生气', '焦虑'],
      bestContext: '愤怒初期',
    },
    {
      id: 5,
      name: '正念冥想',
      used: 10,
      effective: 10,
      effectivenessRate: 1.0,
      avgImprovement: 0.91,
      moodImproved: ['焦虑', '压力', '疲惫'],
      bestContext: '安静环境下',
    },
  ],
  moodSpecificEffectiveness: {
    '焦虑': {
      mostEffective: '深呼吸放松法',
      effectivenessRate: 0.89,
      avgImprovement: 0.78,
      recommendedFrequency: 'as_needed',
    },
    '疲惫': {
      mostEffective: '短暂休息',
      effectivenessRate: 0.85,
      avgImprovement: 0.65,
      recommendedFrequency: 'when_felt',
    },
    '低落': {
      mostEffective: '感恩练习',
      effectivenessRate: 0.92,
      avgImprovement: 0.85,
      recommendedFrequency: 'daily',
    },
    '生气': {
      mostEffective: '冷静计数法',
      effectivenessRate: 0.75,
      avgImprovement: 0.62,
      recommendedFrequency: 'immediate_response',
    },
    '压力': {
      mostEffective: '正念冥想',
      effectivenessRate: 0.95,
      avgImprovement: 0.88,
      recommendedFrequency: 'preventive',
    },
  },
  contextualEffectiveness: {
    timeOfDay: {
      morning: { effectivenessRate: 0.82, avgImprovement: 0.68 },
      afternoon: { effectivenessRate: 0.85, avgImprovement: 0.72 },
      evening: { effectivenessRate: 0.88, avgImprovement: 0.76 },
    },
    dayOfWeek: {
      monday: { effectivenessRate: 0.78, avgImprovement: 0.65 },
      tuesday: { effectivenessRate: 0.83, avgImprovement: 0.70 },
      wednesday: { effectivenessRate: 0.86, avgImprovement: 0.73 },
      thursday: { effectivenessRate: 0.87, avgImprovement: 0.74 },
      friday: { effectivenessRate: 0.89, avgImprovement: 0.77 },
      saturday: { effectivenessRate: 0.91, avgImprovement: 0.79 },
      sunday: { effectivenessRate: 0.85, avgImprovement: 0.72 },
    },
  },
  trends: {
    monthlyEffectiveness: [
      { month: '2026-01', effectivenessRate: 0.82, avgImprovement: 0.68 },
      { month: '2026-02', effectivenessRate: 0.86, avgImprovement: 0.73 },
      { month: '2026-03', effectivenessRate: 0.88, avgImprovement: 0.76 }, // 截至目前
    ],
  },
  recommendations: [
    '继续使用高效率的建议，如感恩练习和正念冥想',
    '在不同情境下使用最适合的建议',
    '记录建议使用前后的心情变化以优化选择',
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

    // 从查询参数获取过滤条件
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');
    const category = request.nextUrl.searchParams.get('category');
    const moodType = request.nextUrl.searchParams.get('moodType');
    const sortBy = request.nextUrl.searchParams.get('sortBy') || 'effectivenessRate'; // effectivenessRate, avgImprovement
    const sortOrder = request.nextUrl.searchParams.get('sortOrder') || 'desc'; // asc, desc
    const granularity = request.nextUrl.searchParams.get('granularity') || 'overview'; // overview, monthly, weekly

    // 实际应用中会根据参数动态生成统计
    // 这里返回模拟的建议有效性统计数据
    
    return Response.json(mockSuggestionsEffectiveness);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get suggestions effectiveness' },
      { status: 500 }
    );
  }
}
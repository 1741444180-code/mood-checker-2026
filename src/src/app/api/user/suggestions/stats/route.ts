// src/app/api/user/suggestions/stats/route.ts
import { NextRequest } from 'next/server'

// 模拟用户建议使用统计数据
const mockSuggestionsStats = {
  userId: 'user1',
  period: '2026-01-01 to 2026-03-28',
  summary: {
    totalSuggestionsUsed: 128,
    uniqueSuggestionsUsed: 24,
    avgRating: 4.4,
    avgEffectiveness: 0.78,
    mostUsedCategory: 'relaxation',
    mostEffectiveCategory: 'positive_psychology',
    successRate: 0.85, // 成功改善心情的比例
  },
  categoryStats: {
    relaxation: {
      usedCount: 45,
      avgRating: 4.6,
      avgEffectiveness: 0.82,
      successRate: 0.89,
    },
    energy: {
      usedCount: 28,
      avgRating: 4.3,
      avgEffectiveness: 0.75,
      successRate: 0.82,
    },
    positive_psychology: {
      usedCount: 32,
      avgRating: 4.5,
      avgEffectiveness: 0.85,
      successRate: 0.91,
    },
    anger_management: {
      usedCount: 15,
      avgRating: 4.2,
      avgEffectiveness: 0.71,
      successRate: 0.78,
    },
    mindfulness: {
      usedCount: 8,
      avgRating: 4.7,
      avgEffectiveness: 0.88,
      successRate: 0.93,
    },
  },
  suggestionPerformance: [
    {
      id: 1,
      name: '深呼吸放松法',
      usedCount: 23,
      avgRating: 4.7,
      effectiveness: 0.85,
      successRate: 0.91,
      moodImproved: ['焦虑', '生气'],
    },
    {
      id: 2,
      name: '短暂休息',
      usedCount: 15,
      avgRating: 4.3,
      effectiveness: 0.78,
      successRate: 0.85,
      moodImproved: ['疲惫'],
    },
    {
      id: 3,
      name: '感恩练习',
      usedCount: 18,
      avgRating: 4.5,
      effectiveness: 0.87,
      successRate: 0.94,
      moodImproved: ['低落', '焦虑'],
    },
    {
      id: 4,
      name: '冷静计数法',
      usedCount: 12,
      avgRating: 4.2,
      effectiveness: 0.72,
      successRate: 0.79,
      moodImproved: ['生气', '焦虑'],
    },
    {
      id: 5,
      name: '正念冥想',
      usedCount: 10,
      avgRating: 4.8,
      effectiveness: 0.91,
      successRate: 0.96,
      moodImproved: ['焦虑', '压力', '疲惫'],
    },
  ],
  moodImprovement: {
    '焦虑': { avgImprovement: 0.8, successRate: 0.87, mostEffective: '深呼吸放松法' },
    '疲惫': { avgImprovement: 0.6, successRate: 0.82, mostEffective: '短暂休息' },
    '低落': { avgImprovement: 0.9, successRate: 0.92, mostEffective: '感恩练习' },
    '生气': { avgImprovement: 0.7, successRate: 0.85, mostEffective: '冷静计数法' },
    '压力': { avgImprovement: 0.9, successRate: 0.93, mostEffective: '正念冥想' },
  },
  trends: {
    monthlyUsage: [
      { month: '2026-01', count: 35, avgRating: 4.3 },
      { month: '2026-02', count: 48, avgRating: 4.4 },
      { month: '2026-03', count: 45, avgRating: 4.5 }, // 截至目前
    ],
    weeklyUsage: [
      { week: '2026-W01', count: 8, avgRating: 4.2 },
      { week: '2026-W02', count: 12, avgRating: 4.3 },
      { week: '2026-W03', count: 6, avgRating: 4.1 },
      { week: '2026-W04', count: 9, avgRating: 4.4 },
      { week: '2026-W05', count: 4, avgRating: 4.0 },
      { week: '2026-W06', count: 11, avgRating: 4.5 },
      { week: '2026-W07', count: 13, avgRating: 4.6 },
      { week: '2026-W08', count: 9, avgRating: 4.4 },
      { week: '2026-W09', count: 14, avgRating: 4.5 },
      { week: '2026-W10', count: 16, avgRating: 4.6 },
      { week: '2026-W11', count: 10, avgRating: 4.3 },
      { week: '2026-W12', count: 7, avgRating: 4.2 },
      { week: '2026-W13', count: 11, avgRating: 4.5 },
    ],
  },
  recommendations: [
    '继续使用高效果的建议，如感恩练习和正念冥想',
    '尝试尚未使用过的放松类建议',
    '记录每次使用建议后的具体效果',
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
    const sortBy = request.nextUrl.searchParams.get('sortBy') || 'usage'; // usage, rating, effectiveness
    const sortOrder = request.nextUrl.searchParams.get('sortOrder') || 'desc'; // asc, desc
    const granularity = request.nextUrl.searchParams.get('granularity') || 'overview'; // overview, monthly, weekly

    // 实际应用中会根据参数动态生成统计
    // 这里返回模拟的建议使用统计数据
    
    return Response.json(mockSuggestionsStats);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get suggestions stats' },
      { status: 500 }
    );
  }
}
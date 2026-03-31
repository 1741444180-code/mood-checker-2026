// src/app/api/user/feedback/overview/route.ts
import { NextRequest } from 'next/server'

// 模拟用户反馈概览数据
const mockFeedbackOverview = {
  userId: 'user1',
  period: '2026-01-01 to 2026-03-28',
  summary: {
    totalFeedback: 45,
    positiveFeedback: 28,
    negativeFeedback: 12,
    neutralFeedback: 5,
    avgRating: 4.2,
    mostCommonTags: ['工作', '生活', '健康'],
    mostCommonMood: '开心',
  },
  moodAnalysis: {
    '开心': {
      positiveFeedback: 15,
      negativeFeedback: 2,
      avgRating: 4.6,
      commonTags: ['成就', '社交', '户外'],
    },
    '平静': {
      positiveFeedback: 8,
      negativeFeedback: 1,
      avgRating: 4.3,
      commonTags: ['冥想', '阅读', '音乐'],
    },
    '焦虑': {
      positiveFeedback: 2,
      negativeFeedback: 6,
      avgRating: 2.8,
      commonTags: ['工作', '压力', '未来'],
    },
    '疲惫': {
      positiveFeedback: 1,
      negativeFeedback: 3,
      avgRating: 2.2,
      commonTags: ['工作', '睡眠', '忙碌'],
    },
  },
  tagAnalysis: {
    '工作': {
      occurrences: 22,
      positiveRatio: 0.6,
      avgRating: 3.8,
      associatedMoods: ['焦虑', '疲惫', '开心'],
    },
    '生活': {
      occurrences: 18,
      positiveRatio: 0.8,
      avgRating: 4.4,
      associatedMoods: ['开心', '平静'],
    },
    '健康': {
      occurrences: 15,
      positiveRatio: 0.5,
      avgRating: 3.7,
      associatedMoods: ['疲惫', '平静'],
    },
    '社交': {
      occurrences: 12,
      positiveRatio: 0.9,
      avgRating: 4.7,
      associatedMoods: ['开心', '兴奋'],
    },
  },
  trends: {
    monthly: [
      { month: '2026-01', avgRating: 4.0, totalFeedback: 12 },
      { month: '2026-02', avgRating: 4.1, totalFeedback: 18 },
      { month: '2026-03', avgRating: 4.4, totalFeedback: 15 }, // 截至目前
    ],
    weekly: [
      { week: '2026-W01', avgRating: 3.8, totalFeedback: 3 },
      { week: '2026-W02', avgRating: 4.2, totalFeedback: 4 },
      { week: '2026-W03', avgRating: 4.0, totalFeedback: 2 },
      { week: '2026-W04', avgRating: 4.1, totalFeedback: 3 },
      { week: '2026-W05', avgRating: 3.9, totalFeedback: 1 },
      { week: '2026-W06', avgRating: 4.3, totalFeedback: 5 },
      { week: '2026-W07', avgRating: 4.5, totalFeedback: 4 },
      { week: '2026-W08', avgRating: 4.2, totalFeedback: 3 },
      { week: '2026-W09', avgRating: 4.4, totalFeedback: 4 },
      { week: '2026-W10', avgRating: 4.6, totalFeedback: 5 },
      { week: '2026-W11', avgRating: 4.3, totalFeedback: 3 },
      { week: '2026-W12', avgRating: 4.1, totalFeedback: 2 },
      { week: '2026-W13', avgRating: 4.5, totalFeedback: 4 },
    ],
  },
  insights: [
    '您的开心心情通常伴随着高满意度的反馈',
    '工作相关的反馈情绪波动较大',
    '社交活动几乎总是带来积极的反馈',
    '近几个月的整体满意度在提升',
  ],
  recommendations: [
    '继续记录开心时刻的详细反馈',
    '对焦虑和疲惫心情添加更多情境细节',
    '尝试识别工作压力的具体来源',
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
    const moodType = request.nextUrl.searchParams.get('moodType');
    const tag = request.nextUrl.searchParams.get('tag');
    const minRating = parseFloat(request.nextUrl.searchParams.get('minRating') || '0');
    const granularity = request.nextUrl.searchParams.get('granularity') || 'overview'; // overview, monthly, weekly

    // 实际应用中会根据参数动态生成概览
    // 这里返回模拟的反馈概览数据
    
    return Response.json(mockFeedbackOverview);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get feedback overview' },
      { status: 500 }
    );
  }
}
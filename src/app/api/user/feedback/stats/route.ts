// src/app/api/user/feedback/stats/route.ts
import { NextRequest } from 'next/server'

// 模拟用户反馈统计数据
const mockFeedbackStats = {
  userId: 'user1',
  period: '2026-01-01 to 2026-03-28',
  summary: {
    totalFeedback: 45,
    avgRating: 4.2,
    positiveFeedback: 28,
    negativeFeedback: 12,
    neutralFeedback: 5,
    positiveRate: 0.62, // 62%正面反馈
    mostCommonMood: '开心',
    mostCommonTag: '生活',
  },
  moodBasedStats: {
    '开心': {
      count: 18,
      avgRating: 4.6,
      positiveRate: 0.89,
      commonTags: ['成就', '社交', '户外'],
    },
    '平静': {
      count: 12,
      avgRating: 4.3,
      positiveRate: 0.75,
      commonTags: ['冥想', '阅读', '音乐'],
    },
    '焦虑': {
      count: 8,
      avgRating: 2.8,
      positiveRate: 0.25,
      commonTags: ['工作', '压力', '未来'],
    },
    '疲惫': {
      count: 5,
      avgRating: 2.2,
      positiveRate: 0.2,
      commonTags: ['工作', '睡眠', '忙碌'],
    },
    '兴奋': {
      count: 2,
      avgRating: 4.8,
      positiveRate: 1.0,
      commonTags: ['社交', '娱乐'],
    },
  },
  tagBasedStats: {
    '工作': {
      count: 22,
      avgRating: 3.8,
      positiveRate: 0.6,
      associatedMoods: ['焦虑', '疲惫', '开心'],
    },
    '生活': {
      count: 18,
      avgRating: 4.4,
      positiveRate: 0.8,
      associatedMoods: ['开心', '平静'],
    },
    '健康': {
      count: 15,
      avgRating: 3.7,
      positiveRate: 0.5,
      associatedMoods: ['疲惫', '平静'],
    },
    '社交': {
      count: 12,
      avgRating: 4.7,
      positiveRate: 0.9,
      associatedMoods: ['开心', '兴奋'],
    },
    '成就': {
      count: 10,
      avgRating: 4.8,
      positiveRate: 1.0,
      associatedMoods: ['开心', '兴奋'],
    },
  },
  temporalStats: {
    timeOfDay: {
      morning: { count: 8, avgRating: 3.9, positiveRate: 0.5 },
      afternoon: { count: 15, avgRating: 4.1, positiveRate: 0.6 },
      evening: { count: 22, avgRating: 4.4, positiveRate: 0.68 },
    },
    dayOfWeek: {
      monday: { count: 5, avgRating: 3.7, positiveRate: 0.4 },
      tuesday: { count: 7, avgRating: 4.0, positiveRate: 0.57 },
      wednesday: { count: 6, avgRating: 4.2, positiveRate: 0.67 },
      thursday: { count: 8, avgRating: 4.3, positiveRate: 0.75 },
      friday: { count: 6, avgRating: 4.5, positiveRate: 0.83 },
      saturday: { count: 8, avgRating: 4.6, positiveRate: 0.88 },
      sunday: { count: 5, avgRating: 4.3, positiveRate: 0.8 },
    },
  },
  trends: {
    monthly: [
      { month: '2026-01', count: 12, avgRating: 4.0, positiveRate: 0.58 },
      { month: '2026-02', count: 18, avgRating: 4.1, positiveRate: 0.61 },
      { month: '2026-03', count: 15, avgRating: 4.4, positiveRate: 0.73 }, // 截至目前
    ],
    weekly: [
      { week: '2026-W01', count: 3, avgRating: 3.8, positiveRate: 0.33 },
      { week: '2026-W02', count: 4, avgRating: 4.2, positiveRate: 0.75 },
      { week: '2026-W03', count: 2, avgRating: 3.9, positiveRate: 0.5 },
      { week: '2026-W04', count: 3, avgRating: 4.1, positiveRate: 0.67 },
      { week: '2026-W05', count: 1, avgRating: 3.5, positiveRate: 0.0 },
      { week: '2026-W06', count: 5, avgRating: 4.3, positiveRate: 0.8 },
      { week: '2026-W07', count: 4, avgRating: 4.4, positiveRate: 0.75 },
      { week: '2026-W08', count: 3, avgRating: 4.2, positiveRate: 0.67 },
      { week: '2026-W09', count: 4, avgRating: 4.5, positiveRate: 0.75 },
      { week: '2026-W10', count: 5, avgRating: 4.6, positiveRate: 0.8 },
      { week: '2026-W11', count: 3, avgRating: 4.3, positiveRate: 0.67 },
      { week: '2026-W12', count: 2, avgRating: 4.0, positiveRate: 0.5 },
      { week: '2026-W13', count: 4, avgRating: 4.5, positiveRate: 0.75 },
    ],
  },
  insights: [
    '您的心情记录越来越积极，3月份正面率达到了73%',
    '晚上是您心情最好的时间段',
    '周末（周六）的心情评分最高',
    '工作相关的心情记录差异较大',
    '社交活动几乎总是带来高评分的反馈',
  ],
  recommendations: [
    '继续保持积极的记录习惯',
    '在工作日尝试更多提升心情的活动',
    '关注焦虑和疲惫情绪的触发因素',
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

    // 实际应用中会根据参数动态生成统计
    // 这里返回模拟的反馈统计数据
    
    return Response.json(mockFeedbackStats);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get feedback stats' },
      { status: 500 }
    );
  }
}
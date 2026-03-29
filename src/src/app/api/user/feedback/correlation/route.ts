// src/app/api/user/feedback/correlation/route.ts
import { NextRequest } from 'next/server'

// 模拟用户反馈与心情的相关性分析数据
const mockFeedbackCorrelation = {
  userId: 'user1',
  period: '2026-01-01 to 2026-03-28',
  summary: {
    moodFeedbackCorrelation: 0.78, // 心情与反馈的相关系数
    avgRatingByPositiveMood: 4.6, // 正面心情的平均反馈评分
    avgRatingByNegativeMood: 2.8, // 负面心情的平均反馈评分
    strongestCorrelation: '开心-正面反馈',
    weakestCorrelation: '疲惫-正面反馈',
  },
  moodFeedbackMatrix: {
    '开心': {
      positiveFeedback: 0.89, // 89%的反馈是正面的
      negativeFeedback: 0.06, // 6%的反馈是负面的
      neutralFeedback: 0.05, // 5%的反馈是中性的
      avgRating: 4.7,
      avgFeedbackLength: 42, // 平均反馈长度（字数）
    },
    '平静': {
      positiveFeedback: 0.75,
      negativeFeedback: 0.08,
      neutralFeedback: 0.17,
      avgRating: 4.3,
      avgFeedbackLength: 38,
    },
    '焦虑': {
      positiveFeedback: 0.25,
      negativeFeedback: 0.58,
      neutralFeedback: 0.17,
      avgRating: 2.8,
      avgFeedbackLength: 56, // 焦虑时反馈更详细
    },
    '疲惫': {
      positiveFeedback: 0.2,
      negativeFeedback: 0.6,
      neutralFeedback: 0.2,
      avgRating: 2.2,
      avgFeedbackLength: 48,
    },
    '兴奋': {
      positiveFeedback: 1.0,
      negativeFeedback: 0.0,
      neutralFeedback: 0.0,
      avgRating: 4.8,
      avgFeedbackLength: 35,
    },
    '生气': {
      positiveFeedback: 0.1,
      negativeFeedback: 0.8,
      neutralFeedback: 0.1,
      avgRating: 1.8,
      avgFeedbackLength: 62, // 生气时反馈更详细
    },
    '低落': {
      positiveFeedback: 0.15,
      negativeFeedback: 0.75,
      neutralFeedback: 0.1,
      avgRating: 2.0,
      avgFeedbackLength: 51,
    },
  },
  tagMoodCorrelations: {
    '工作': {
      associatedMoods: ['焦虑', '疲惫', '开心'],
      avgRating: 3.8,
      positiveRate: 0.6,
      context: 'mixed_emotions',
    },
    '生活': {
      associatedMoods: ['开心', '平静'],
      avgRating: 4.4,
      positiveRate: 0.8,
      context: 'positive_emotions',
    },
    '健康': {
      associatedMoods: ['疲惫', '平静'],
      avgRating: 3.7,
      positiveRate: 0.5,
      context: 'neutral_to_negative',
    },
    '社交': {
      associatedMoods: ['开心', '兴奋'],
      avgRating: 4.7,
      positiveRate: 0.9,
      context: 'highly_positive',
    },
    '成就': {
      associatedMoods: ['开心', '兴奋'],
      avgRating: 4.8,
      positiveRate: 1.0,
      context: 'extremely_positive',
    },
    '压力': {
      associatedMoods: ['焦虑', '疲惫'],
      avgRating: 2.5,
      positiveRate: 0.1,
      context: 'highly_negative',
    },
  },
  temporalCorrelations: {
    timeOfDay: {
      morning: { moodFeedbackCorrelation: 0.72, avgRating: 4.0, positiveRate: 0.65 },
      afternoon: { moodFeedbackCorrelation: 0.75, avgRating: 4.1, positiveRate: 0.68 },
      evening: { moodFeedbackCorrelation: 0.82, avgRating: 4.4, positiveRate: 0.75 },
    },
    dayOfWeek: {
      monday: { moodFeedbackCorrelation: 0.68, avgRating: 3.8, positiveRate: 0.6 },
      tuesday: { moodFeedbackCorrelation: 0.73, avgRating: 4.0, positiveRate: 0.65 },
      wednesday: { moodFeedbackCorrelation: 0.76, avgRating: 4.1, positiveRate: 0.68 },
      thursday: { moodFeedbackCorrelation: 0.78, avgRating: 4.2, positiveRate: 0.72 },
      friday: { moodFeedbackCorrelation: 0.81, avgRating: 4.4, positiveRate: 0.77 },
      saturday: { moodFeedbackCorrelation: 0.85, avgRating: 4.6, positiveRate: 0.82 },
      sunday: { moodFeedbackCorrelation: 0.83, avgRating: 4.5, positiveRate: 0.8 },
    },
  },
  predictiveIndicators: {
    strongPredictors: [
      {
        indicator: 'feedback_length',
        correlation: 0.65, // 反馈长度与心情的相关性
        interpretation: '较长的反馈通常与负面心情相关',
      },
      {
        indicator: 'tag_usage',
        correlation: 0.58, // 标签使用与心情的相关性
        interpretation: '使用"压力"、"工作"标签通常预示负面心情',
      },
    ],
    weakPredictors: [
      {
        indicator: 'time_of_day',
        correlation: 0.32, // 时间与心情的相关性
        interpretation: '晚上心情通常较好，但不是强预测因子',
      },
    ],
  },
  insights: [
    '您的反馈与心情高度相关（0.78）',
    '开心时的反馈绝大多数是正面的（89%）',
    '焦虑和疲惫时的反馈主要是负面的',
    '社交活动几乎总是带来正面反馈',
    '晚上和周末的反馈相关性更高',
  ],
  recommendations: [
    '在负面心情时尝试添加更多细节到反馈中',
    '关注工作压力对心情和反馈的影响',
    '利用高相关性的时间段进行心情调节',
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
    const granularity = request.nextUrl.searchParams.get('granularity') || 'overview'; // overview, daily, weekly

    // 实际应用中会根据参数动态生成相关性分析
    // 这里返回模拟的反馈与心情相关性分析数据
    
    return Response.json(mockFeedbackCorrelation);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get feedback correlation' },
      { status: 500 }
    );
  }
}
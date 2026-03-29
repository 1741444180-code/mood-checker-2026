// src/app/api/user/templates/stats/route.ts
import { NextRequest } from 'next/server'

// 模拟用户模板使用统计数据
const mockTemplateStats = {
  userId: 'user1',
  period: '2026-01-01 to 2026-03-28',
  summary: {
    totalUses: 89,
    uniqueTemplatesUsed: 6,
    avgFillRate: 0.78, // 平均填写率
    mostUsedTemplate: '早晨例行公事',
    mostEffectiveTemplate: '感恩时刻',
    avgCompletionTime: 1.2, // 平均填写时间（分钟）
  },
  templatePerformance: [
    {
      id: 1,
      name: '早晨例行公事',
      uses: 28,
      avgRating: 4.6,
      avgCompletionTime: 1.1,
      moodConsistency: 0.85, // 心情记录的一致性
      noteCompleteness: 0.72, // 备注填写完整性
      tagUsageRate: 0.95, // 标签使用率
    },
    {
      id: 2,
      name: '工作日结束',
      uses: 22,
      avgRating: 4.3,
      avgCompletionTime: 1.3,
      moodConsistency: 0.78,
      noteCompleteness: 0.68,
      tagUsageRate: 0.89,
    },
    {
      id: 3,
      name: '周末放松',
      uses: 15,
      avgRating: 4.7,
      avgCompletionTime: 1.0,
      moodConsistency: 0.91,
      noteCompleteness: 0.75,
      tagUsageRate: 0.92,
    },
    {
      id: 4,
      name: '运动后',
      uses: 12,
      avgRating: 4.5,
      avgCompletionTime: 0.9,
      moodConsistency: 0.88,
      noteCompleteness: 0.70,
      tagUsageRate: 0.85,
    },
    {
      id: 5,
      name: '睡前反思',
      uses: 8,
      avgRating: 4.2,
      avgCompletionTime: 1.5,
      moodConsistency: 0.82,
      noteCompleteness: 0.78,
      tagUsageRate: 0.75,
    },
    {
      id: 6,
      name: '压力时刻',
      uses: 4,
      avgRating: 3.9,
      avgCompletionTime: 1.8,
      moodConsistency: 0.75,
      noteCompleteness: 0.85,
      tagUsageRate: 0.80,
    },
  ],
  usagePatterns: {
    timeOfDay: {
      morning: { usage: 0.32, avgRating: 4.4 },
      afternoon: { usage: 0.25, avgRating: 4.1 },
      evening: { usage: 0.43, avgRating: 4.6 },
    },
    dayOfWeek: {
      monday: { usage: 0.12, avgRating: 4.0 },
      tuesday: { usage: 0.15, avgRating: 4.2 },
      wednesday: { usage: 0.14, avgRating: 4.3 },
      thursday: { usage: 0.13, avgRating: 4.4 },
      friday: { usage: 0.16, avgRating: 4.5 },
      saturday: { usage: 0.18, avgRating: 4.7 },
      sunday: { usage: 0.12, avgRating: 4.6 },
    },
    moodBasedUsage: {
      '开心': { usage: 0.28, preferredTemplates: ['周末放松', '运动后'] },
      '平静': { usage: 0.25, preferredTemplates: ['早晨例行公事', '睡前反思'] },
      '焦虑': { usage: 0.18, preferredTemplates: ['压力时刻', '睡前反思'] },
      '疲惫': { usage: 0.15, preferredTemplates: ['工作日结束'] },
      '兴奋': { usage: 0.08, preferredTemplates: ['运动后', '周末放松'] },
      '生气': { usage: 0.05, preferredTemplates: ['压力时刻'] },
      '低落': { usage: 0.01, preferredTemplates: [] },
    },
  },
  trends: {
    monthlyUsage: [
      { month: '2026-01', count: 25, avgRating: 4.3 },
      { month: '2026-02', count: 32, avgRating: 4.4 },
      { month: '2026-03', count: 32, avgRating: 4.5 }, // 截至目前
    ],
    weeklyUsage: [
      { week: '2026-W01', count: 6, avgRating: 4.2 },
      { week: '2026-W02', count: 8, avgRating: 4.3 },
      { week: '2026-W03', count: 4, avgRating: 4.1 },
      { week: '2026-W04', count: 7, avgRating: 4.4 },
      { week: '2026-W05', count: 3, avgRating: 4.0 },
      { week: '2026-W06', count: 9, avgRating: 4.5 },
      { week: '2026-W07', count: 11, avgRating: 4.6 },
      { week: '2026-W08', count: 7, avgRating: 4.4 },
      { week: '2026-W09', count: 12, avgRating: 4.6 },
      { week: '2026-W10', count: 14, avgRating: 4.7 },
      { week: '2026-W11', count: 8, avgRating: 4.4 },
      { week: '2026-W12', count: 5, avgRating: 4.2 },
      { week: '2026-W13', count: 9, avgRating: 4.5 },
    ],
  },
  recommendations: [
    '继续使用高评价的模板，如"周末放松"',
    '尝试在不同时间段使用不同的模板',
    '完善"压力时刻"模板的使用，以更好地管理焦虑情绪',
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
    const templateId = request.nextUrl.searchParams.get('templateId');
    const sortBy = request.nextUrl.searchParams.get('sortBy') || 'uses'; // uses, rating, completionTime
    const sortOrder = request.nextUrl.searchParams.get('sortOrder') || 'desc'; // asc, desc
    const granularity = request.nextUrl.searchParams.get('granularity') || 'overview'; // overview, monthly, weekly

    // 实际应用中会根据参数动态生成统计
    // 这里返回模拟的模板使用统计数据
    
    return Response.json(mockTemplateStats);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get template stats' },
      { status: 500 }
    );
  }
}
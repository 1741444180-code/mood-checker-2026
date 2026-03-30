// src/app/api/user/templates/effectiveness/route.ts
import { NextRequest } from 'next/server'

// 模拟用户模板有效性统计数据
const mockTemplateEffectiveness = {
  userId: 'user1',
  period: '2026-01-01 to 2026-03-28',
  summary: {
    totalTemplateUses: 89,
    consistentUsers: 67, // 一致使用模板的次数
    consistencyRate: 0.75, // 75%的时间一致使用
    avgMoodImprovement: 0.65, // 使用模板后心情平均改善
    mostEffectiveTemplate: '感恩时刻',
    moodTrackingImprovement: 0.82, // 使用模板后心情追踪的改善
  },
  templateEffectiveness: [
    {
      id: 1,
      name: '早晨例行公事',
      uses: 28,
      consistency: 0.82, // 使用一致性
      moodImpact: 0.58, // 对心情的影响
      avgRating: 4.6,
      completionRate: 0.92, // 完成率
      effectivenessScore: 0.85, // 效果评分
    },
    {
      id: 2,
      name: '工作日结束',
      uses: 22,
      consistency: 0.78,
      moodImpact: 0.45,
      avgRating: 4.3,
      completionRate: 0.87,
      effectivenessScore: 0.78,
    },
    {
      id: 3,
      name: '周末放松',
      uses: 15,
      consistency: 0.89,
      moodImpact: 0.72,
      avgRating: 4.7,
      completionRate: 0.95,
      effectivenessScore: 0.91,
    },
    {
      id: 4,
      name: '运动后',
      uses: 12,
      consistency: 0.85,
      moodImpact: 0.68,
      avgRating: 4.5,
      completionRate: 0.90,
      effectivenessScore: 0.87,
    },
    {
      id: 5,
      name: '睡前反思',
      uses: 8,
      consistency: 0.72,
      moodImpact: 0.62,
      avgRating: 4.2,
      completionRate: 0.78,
      effectivenessScore: 0.75,
    },
    {
      id: 6,
      name: '压力时刻',
      uses: 4,
      consistency: 0.65,
      moodImpact: 0.42,
      avgRating: 3.9,
      completionRate: 0.70,
      effectivenessScore: 0.68,
    },
  ],
  moodBasedEffectiveness: {
    '开心': {
      mostEffectiveTemplate: '周末放松',
      effectivenessScore: 0.92,
      avgMoodImpact: 0.75,
    },
    '平静': {
      mostEffectiveTemplate: '早晨例行公事',
      effectivenessScore: 0.84,
      avgMoodImpact: 0.58,
    },
    '焦虑': {
      mostEffectiveTemplate: '压力时刻',
      effectivenessScore: 0.68,
      avgMoodImpact: 0.42,
    },
    '疲惫': {
      mostEffectiveTemplate: '工作日结束',
      effectivenessScore: 0.78,
      avgMoodImpact: 0.45,
    },
    '兴奋': {
      mostEffectiveTemplate: '运动后',
      effectivenessScore: 0.87,
      avgMoodImpact: 0.68,
    },
  },
  usagePatternEffectiveness: {
    consistentUsers: {
      avgMoodImprovement: 0.72,
      consistencyThreshold: 0.8, // 80%以上算一致使用
      usersAboveThreshold: 4,
    },
    occasionalUsers: {
      avgMoodImprovement: 0.45,
      consistencyThreshold: 0.3, // 30%以下算偶尔使用
      usersBelowThreshold: 1,
    },
    regularUsers: {
      avgMoodImprovement: 0.68,
      consistencyRange: [0.3, 0.8], // 30%-80%算定期使用
      usersInRange: 1,
    },
  },
  temporalEffectiveness: {
    timeOfDay: {
      morning: { avgMoodImpact: 0.58, effectivenessScore: 0.82 },
      afternoon: { avgMoodImpact: 0.52, effectivenessScore: 0.76 },
      evening: { avgMoodImpact: 0.71, effectivenessScore: 0.88 },
    },
    dayOfWeek: {
      monday: { avgMoodImpact: 0.48, effectivenessScore: 0.72 },
      tuesday: { avgMoodImpact: 0.55, effectivenessScore: 0.78 },
      wednesday: { avgMoodImpact: 0.60, effectivenessScore: 0.81 },
      thursday: { avgMoodImpact: 0.62, effectivenessScore: 0.83 },
      friday: { avgMoodImpact: 0.68, effectivenessScore: 0.86 },
      saturday: { avgMoodImpact: 0.75, effectivenessScore: 0.92 },
      sunday: { avgMoodImpact: 0.70, effectivenessScore: 0.88 },
    },
  },
  trends: {
    monthlyEffectiveness: [
      { month: '2026-01', avgEffectiveness: 0.78, avgMoodImpact: 0.58 },
      { month: '2026-02', avgEffectiveness: 0.82, avgMoodImpact: 0.62 },
      { month: '2026-03', avgEffectiveness: 0.85, avgMoodImpact: 0.68 }, // 截至目前
    ],
  },
  recommendations: [
    '继续使用高效果的模板，如"周末放松"和"运动后"',
    '提高"压力时刻"模板的一致性使用',
    '在晚上使用模板以获得最佳效果',
    '定期评估模板的有效性并进行调整',
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
    const moodType = request.nextUrl.searchParams.get('moodType');
    const sortBy = request.nextUrl.searchParams.get('sortBy') || 'effectivenessScore'; // effectivenessScore, moodImpact, consistency
    const sortOrder = request.nextUrl.searchParams.get('sortOrder') || 'desc'; // asc, desc
    const granularity = request.nextUrl.searchParams.get('granularity') || 'overview'; // overview, monthly, weekly

    // 实际应用中会根据参数动态生成统计
    // 这里返回模拟的模板有效性统计数据
    
    return Response.json(mockTemplateEffectiveness);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get template effectiveness' },
      { status: 500 }
    );
  }
}
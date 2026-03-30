// src/app/api/user/goals/completion/route.ts
import { NextRequest } from 'next/server'

// 模拟用户目标完成情况统计数据
const mockGoalCompletion = {
  userId: 'user1',
  period: '2026-01-01 to 2026-03-28',
  summary: {
    totalGoalsSet: 8,
    goalsCompleted: 4,
    goalsFailed: 1,
    goalsInProgress: 3,
    completionRate: 0.57, // 57%完成率
    avgTimeToComplete: 42, // 平均完成天数
    avgGoalDuration: 68, // 平均目标持续天数
    successRate: 0.8, // 80%成功率 (完成/完成+失败)
  },
  categoryCompletion: {
    habit: {
      total: 3,
      completed: 2,
      failed: 0,
      inProgress: 1,
      completionRate: 0.67,
      successRate: 1.0,
      avgDuration: 35,
      avgTimeToComplete: 30,
    },
    emotion: {
      total: 2,
      completed: 1,
      failed: 0,
      inProgress: 1,
      completionRate: 0.5,
      successRate: 1.0,
      avgDuration: 89,
      avgTimeToComplete: 72,
    },
    stress: {
      total: 3,
      completed: 1,
      failed: 1,
      inProgress: 1,
      completionRate: 0.33,
      successRate: 0.5,
      avgDuration: 120,
      avgTimeToComplete: 55,
    },
  },
  goalCompletionDetails: [
    {
      id: 1,
      title: '提高积极情绪频率',
      category: 'emotion',
      status: 'in_progress',
      progress: 65,
      startedAt: '2026-03-01',
      deadline: '2026-05-31',
      estimatedCompletion: '2026-05-15',
      successProbability: 0.78,
      daysRemaining: 64,
    },
    {
      id: 2,
      title: '减少焦虑情绪',
      category: 'stress',
      status: 'in_progress',
      progress: 50,
      startedAt: '2026-03-01',
      deadline: '2026-06-30',
      estimatedCompletion: '2026-06-10',
      successProbability: 0.65,
      daysRemaining: 94,
    },
    {
      id: 3,
      title: '建立打卡习惯',
      category: 'habit',
      status: 'in_progress',
      progress: 93.3,
      startedAt: '2026-03-01',
      deadline: '2026-03-31',
      estimatedCompletion: '2026-03-29',
      successProbability: 0.95,
      daysRemaining: 1,
    },
    {
      id: 4,
      title: '完成第一个月打卡',
      category: 'habit',
      status: 'completed',
      completedAt: '2026-03-02',
      duration: 30,
      success: true,
    },
    {
      id: 5,
      title: '降低焦虑频率',
      category: 'stress',
      status: 'completed',
      completedAt: '2026-02-25',
      duration: 55,
      success: true,
    },
    {
      id: 6,
      title: '情绪稳定性训练',
      category: 'emotion',
      status: 'failed',
      failureReason: 'lack_of_consistency',
      duration: 45,
      success: false,
    },
  ],
  milestoneCompletion: {
    totalMilestones: 15,
    completedMilestones: 12,
    milestoneCompletionRate: 0.8,
    avgTimeToMilestone: 12, // 平均每12天达到一个里程碑
    mostCommonMilestone: '25% progress',
  },
  completionTrends: {
    monthlyCompletion: [
      { month: '2026-01', newGoals: 2, completed: 0, failed: 0 },
      { month: '2026-02', newGoals: 3, completed: 1, failed: 0 },
      { month: '2026-03', newGoals: 3, completed: 3, failed: 1 }, // 截至目前
    ],
    weeklyCompletion: [
      { week: '2026-W01', newGoals: 1, completed: 0, failed: 0 },
      { week: '2026-W02', newGoals: 1, completed: 0, failed: 0 },
      { week: '2026-W03', newGoals: 0, completed: 0, failed: 0 },
      { week: '2026-W04', newGoals: 0, completed: 0, failed: 0 },
      { week: '2026-W05', newGoals: 0, completed: 0, failed: 0 },
      { week: '2026-W06', newGoals: 1, completed: 0, failed: 0 },
      { week: '2026-W07', newGoals: 1, completed: 1, failed: 0 },
      { week: '2026-W08', newGoals: 1, completed: 0, failed: 0 },
      { week: '2026-W09', newGoals: 1, completed: 1, failed: 0 },
      { week: '2026-W10', newGoals: 1, completed: 1, failed: 0 },
      { week: '2026-W11', newGoals: 1, completed: 1, failed: 0 },
      { week: '2026-W12', newGoals: 0, completed: 0, failed: 1 },
      { week: '2026-W13', newGoals: 1, completed: 0, failed: 0 },
    ],
  },
  successFactors: [
    {
      factor: 'goal_clarity',
      impact: 0.85, // 影响力 0-1
      description: '明确的目标定义有助于提高完成率',
      examples: ['完成第一个月打卡', '降低焦虑频率'],
    },
    {
      factor: 'deadline_realism',
      impact: 0.78,
      description: '合理的时间期限对完成率很重要',
      examples: ['情绪稳定性训练（失败）'],
    },
    {
      factor: 'milestone_frequency',
      impact: 0.72,
      description: '频繁的里程碑有助于保持动力',
      examples: ['建立打卡习惯'],
    },
  ],
  failureAnalysis: {
    commonReasons: [
      { reason: 'lack_of_consistency', count: 1, percentage: 1.0 },
    ],
    preventableFailures: 1,
    lessonsLearned: [
      '设定更现实的目标期限',
      '增加中间里程碑以保持动力',
      '制定更具体的行动计划',
    ],
  },
  recommendations: [
    '为"提高积极情绪频率"目标设定更多中间里程碑',
    '考虑延长"减少焦虑情绪"目标的期限',
    '基于成功经验优化新目标设定',
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
    const status = request.nextUrl.searchParams.get('status'); // completed, in_progress, failed
    const sortBy = request.nextUrl.searchParams.get('sortBy') || 'completionRate'; // completionRate, successRate, duration
    const sortOrder = request.nextUrl.searchParams.get('sortOrder') || 'desc'; // asc, desc
    const granularity = request.nextUrl.searchParams.get('granularity') || 'overview'; // overview, monthly, weekly

    // 实际应用中会根据参数动态生成统计
    // 这里返回模拟的目标完成情况统计数据
    
    return Response.json(mockGoalCompletion);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get goal completion stats' },
      { status: 500 }
    );
  }
}
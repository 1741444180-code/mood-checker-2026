// src/app/api/user/goals/stats/route.ts
import { NextRequest } from 'next/server'

// 模拟用户目标统计数据
const mockGoalStats = {
  userId: 'user1',
  period: '2026-01-01 to 2026-03-28',
  summary: {
    totalGoalsSet: 8,
    goalsCompleted: 4,
    goalsFailed: 1,
    goalsInProgress: 3,
    successRate: 0.8, // 80%成功率
    avgCompletionTime: 42, // 平均完成天数
    mostAchievedCategory: 'habit',
  },
  categoryPerformance: {
    habit: {
      total: 3,
      completed: 2,
      successRate: 0.67,
      avgTimeToComplete: 35,
    },
    emotion: {
      total: 2,
      completed: 1,
      successRate: 0.5,
      avgTimeToComplete: 45,
    },
    stress: {
      total: 3,
      completed: 1,
      successRate: 0.33,
      avgTimeToComplete: 62,
    },
  },
  goalPerformance: [
    {
      id: 1,
      title: '提高积极情绪频率',
      category: 'emotion',
      daysToComplete: null, // 仍在进行
      progress: 65,
      startedAt: '2026-03-01',
      deadline: '2026-05-31',
      estimatedCompletion: '2026-05-15',
      successProbability: 0.78,
    },
    {
      id: 2,
      title: '减少焦虑情绪',
      category: 'stress',
      daysToComplete: null, // 仍在进行
      progress: 50,
      startedAt: '2026-03-01',
      deadline: '2026-06-30',
      estimatedCompletion: '2026-06-10',
      successProbability: 0.65,
    },
    {
      id: 3,
      title: '建立打卡习惯',
      category: 'habit',
      daysToComplete: null, // 仍在进行
      progress: 93.3,
      startedAt: '2026-03-01',
      deadline: '2026-03-31',
      estimatedCompletion: '2026-03-29',
      successProbability: 0.95,
    },
    {
      id: 4,
      title: '完成第一个月打卡',
      category: 'habit',
      daysToComplete: 30,
      completedAt: '2026-03-02',
      success: true,
    },
    {
      id: 5,
      title: '降低焦虑频率',
      category: 'stress',
      daysToComplete: 55,
      completedAt: '2026-02-25',
      success: true,
    },
  ],
  milestoneAchievements: {
    totalMilestones: 15,
    achievedMilestones: 12,
    milestoneSuccessRate: 0.8,
    mostCommonMilestone: '25% progress',
  },
  trends: {
    monthlyGoalSetting: [
      { month: '2026-01', newGoals: 2, completed: 1 },
      { month: '2026-02', newGoals: 3, completed: 1 },
      { month: '2026-03', newGoals: 3, completed: 2 }, // 截至目前
    ],
    weeklyProgress: [
      { week: '2026-W01', newGoals: 1, completed: 0 },
      { week: '2026-W02', newGoals: 1, completed: 0 },
      { week: '2026-W03', newGoals: 0, completed: 0 },
      { week: '2026-W04', newGoals: 0, completed: 0 },
      { week: '2026-W05', newGoals: 0, completed: 0 },
      { week: '2026-W06', newGoals: 1, completed: 0 },
      { week: '2026-W07', newGoals: 1, completed: 1 },
      { week: '2026-W08', newGoals: 1, completed: 0 },
      { week: '2026-W09', newGoals: 1, completed: 1 },
      { week: '2026-W10', newGoals: 1, completed: 0 },
      { week: '2026-W11', newGoals: 1, completed: 0 },
      { week: '2026-W12', newGoals: 0, completed: 0 },
      { week: '2026-W13', newGoals: 1, completed: 0 },
    ],
  },
  insights: [
    '您的习惯类目标完成率最高(67%)',
    '情绪类目标需要更具体的行动计划',
    '压力管理目标最具挑战性，可能需要调整策略',
    '您倾向于在月初设定新目标',
  ],
  recommendations: [
    '为情绪类目标设置更多中间里程碑',
    '将长期目标分解为更小的可执行步骤',
    '参考已完成目标的成功经验',
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
    const status = request.nextUrl.searchParams.get('status'); // active, completed, failed
    const sortBy = request.nextUrl.searchParams.get('sortBy') || 'successRate'; // successRate, progress, deadline
    const sortOrder = request.nextUrl.searchParams.get('sortOrder') || 'desc'; // asc, desc
    const granularity = request.nextUrl.searchParams.get('granularity') || 'overview'; // overview, monthly, weekly

    // 实际应用中会根据参数动态生成统计
    // 这里返回模拟的目标统计数据
    
    return Response.json(mockGoalStats);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get goal stats' },
      { status: 500 }
    );
  }
}
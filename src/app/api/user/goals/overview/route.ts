// src/app/api/user/goals/overview/route.ts
import { NextRequest } from 'next/server'

// 模拟用户目标概览数据
const mockGoalsOverview = {
  userId: 'user1',
  summary: {
    totalGoals: 8,
    activeGoals: 3,
    completedGoals: 4,
    failedGoals: 1,
    avgProgress: 68.5,
    mostRecentAchievement: '连续打卡30天',
  },
  activeGoals: [
    {
      id: 1,
      title: '提高积极情绪频率',
      description: '增加开心和平静心情的比例至70%以上',
      target: 70,
      current: 65,
      unit: 'percentage',
      startDate: '2026-03-01',
      endDate: '2026-05-31',
      progress: 65,
      status: 'in_progress',
      priority: 'high',
      category: 'emotion',
      milestones: [
        { name: '达到60%', value: 60, achieved: true, date: '2026-03-15' },
        { name: '达到65%', value: 65, achieved: true, date: '2026-03-28' },
        { name: '达到70%', value: 70, achieved: false, date: null },
      ],
      actions: [
        '每天记录心情',
        '增加户外活动',
        '练习正念冥想',
      ],
      daysRemaining: 64,
    },
    {
      id: 2,
      title: '减少焦虑情绪',
      description: '将焦虑心情的比例降至10%以下',
      target: 10,
      current: 15,
      unit: 'percentage',
      startDate: '2026-03-01',
      endDate: '2026-06-30',
      progress: 50, // 进度百分比（基于目标完成度）
      status: 'in_progress',
      priority: 'medium',
      category: 'stress',
      milestones: [
        { name: '降至20%', value: 20, achieved: true, date: '2026-03-20' },
        { name: '降至15%', value: 15, achieved: true, date: '2026-03-28' },
        { name: '降至10%', value: 10, achieved: false, date: null },
      ],
      actions: [
        '学习放松技巧',
        '规律作息',
        '寻求社交支持',
      ],
      daysRemaining: 94,
    },
    {
      id: 3,
      title: '建立打卡习惯',
      description: '连续打卡30天',
      target: 30,
      current: 28,
      unit: 'days',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      progress: 93.3,
      status: 'in_progress',
      priority: 'high',
      category: 'habit',
      milestones: [
        { name: '连续7天', value: 7, achieved: true, date: '2026-03-07' },
        { name: '连续15天', value: 15, achieved: true, date: '2026-03-15' },
        { name: '连续21天', value: 21, achieved: true, date: '2026-03-21' },
        { name: '连续30天', value: 30, achieved: false, date: null },
      ],
      actions: [
        '设置每日提醒',
        '选择固定时间打卡',
        '记录打卡感受',
      ],
      daysRemaining: 3,
    },
  ],
  completedGoals: [
    {
      id: 4,
      title: '完成第一个月打卡',
      description: '连续打卡30天',
      target: 30,
      current: 30,
      unit: 'days',
      startDate: '2026-02-01',
      endDate: '2026-03-02',
      progress: 100,
      status: 'completed',
      priority: 'low',
      category: 'habit',
      completedDate: '2026-03-02',
      achievement: '首次连续打卡里程碑',
    },
    {
      id: 5,
      title: '降低焦虑频率',
      description: '将焦虑心情比例降至20%以下',
      target: 20,
      current: 18,
      unit: 'percentage',
      startDate: '2026-01-01',
      endDate: '2026-02-28',
      progress: 100,
      status: 'completed',
      priority: 'high',
      category: 'stress',
      completedDate: '2026-02-25',
      achievement: '情绪管理进步',
    },
  ],
  goalInsights: {
    achievementRate: 0.8, // 完成率
    avgCompletionTime: 42, // 平均完成天数
    mostSuccessfulCategory: 'habit',
    improvementAreas: ['stress management'],
  },
  recommendations: [
    '您即将完成"建立打卡习惯"目标，继续保持!',
    '考虑设定新的情绪管理目标',
    '回顾已完成的目标，总结成功经验',
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
    const status = request.nextUrl.searchParams.get('status'); // active, completed, failed, all
    const category = request.nextUrl.searchParams.get('category'); // emotion, stress, habit, etc.
    const priority = request.nextUrl.searchParams.get('priority'); // low, medium, high
    const sortBy = request.nextUrl.searchParams.get('sortBy') || 'priority'; // priority, progress, deadline
    const sortOrder = request.nextUrl.searchParams.get('sortOrder') || 'desc'; // asc, desc

    // 根据状态过滤目标
    let goals = [];
    if (!status || status === 'all') {
      goals = [
        ...mockGoalsOverview.activeGoals,
        ...mockGoalsOverview.completedGoals,
      ];
    } else if (status === 'active') {
      goals = mockGoalsOverview.activeGoals;
    } else if (status === 'completed') {
      goals = mockGoalsOverview.completedGoals;
    }

    // 过滤类别
    if (category) {
      goals = goals.filter(g => g.category === category);
    }

    // 过滤优先级
    if (priority) {
      goals = goals.filter(g => g.priority === priority);
    }

    // 排序
    goals.sort((a: any, b: any) => {
      let comparison = 0;
      if (sortBy === 'priority') {
        const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
        comparison = sortOrder === 'asc' ? 
          priorityOrder[a.priority] - priorityOrder[b.priority] : 
          priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === 'progress') {
        comparison = sortOrder === 'asc' ? a.progress - b.progress : b.progress - a.progress;
      } else if (sortBy === 'deadline') {
        const dateA = new Date(a.endDate || a.completedDate || '').getTime();
        const dateB = new Date(b.endDate || b.completedDate || '').getTime();
        comparison = sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return comparison;
    });

    return Response.json({
      ...mockGoalsOverview,
      goals,
      filteredBy: { status, category, priority, sortBy, sortOrder },
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get goals overview' },
      { status: 500 }
    );
  }
}
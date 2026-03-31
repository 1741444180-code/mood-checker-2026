// src/app/api/user/goals/route.ts
import { NextRequest } from 'next/server'

// 模拟用户心情目标数据
const mockGoals = [
  {
    id: 1,
    userId: 'user1',
    title: '提高积极情绪频率',
    description: '增加开心和平静心情的比例至70%以上',
    target: 70,
    current: 65,
    unit: 'percentage',
    startDate: '2026-03-01',
    endDate: '2026-05-31',
    progress: 65,
    status: 'in_progress', // not_started, in_progress, completed, failed
    priority: 'high', // low, medium, high
    category: 'emotion',
    createdAt: '2026-02-28T10:00:00Z',
    updatedAt: '2026-03-28T09:00:00Z',
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
  },
  {
    id: 2,
    userId: 'user1',
    title: '减少焦虑情绪',
    description: '将焦虑心情的比例降至10%以下',
    target: 10,
    current: 15,
    unit: 'percentage',
    startDate: '2026-03-01',
    endDate: '2026-06-30',
    progress: 50, // 进度百分比
    status: 'in_progress',
    priority: 'medium',
    category: 'stress',
    createdAt: '2026-02-28T10:00:00Z',
    updatedAt: '2026-03-28T09:00:00Z',
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
  },
  {
    id: 3,
    userId: 'user1',
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
    createdAt: '2026-02-28T10:00:00Z',
    updatedAt: '2026-03-28T09:00:00Z',
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
  },
];

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
    const status = request.nextUrl.searchParams.get('status'); // not_started, in_progress, completed, failed
    const category = request.nextUrl.searchParams.get('category'); // emotion, stress, habit, etc.
    const priority = request.nextUrl.searchParams.get('priority'); // low, medium, high
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');

    // 过滤目标
    let filteredGoals = mockGoals;
    
    if (status) {
      filteredGoals = filteredGoals.filter(goal => goal.status === status);
    }
    
    if (category) {
      filteredGoals = filteredGoals.filter(goal => goal.category === category);
    }
    
    if (priority) {
      filteredGoals = filteredGoals.filter(goal => goal.priority === priority);
    }

    // 排序（按优先级和创建日期）
    filteredGoals.sort((a: any, b: any) => {
      // 首先按优先级排序
      const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // 然后按创建日期排序
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    // 分页
    const paginatedGoals = filteredGoals.slice(offset, offset + limit);

    return Response.json({
      goals: paginatedGoals,
      total: filteredGoals.length,
      stats: {
        total: mockGoals.length,
        inProgress: mockGoals.filter(g => g.status === 'in_progress').length,
        completed: mockGoals.filter(g => g.status === 'completed').length,
        notStarted: mockGoals.filter(g => g.status === 'not_started').length,
        failed: mockGoals.filter(g => g.status === 'failed').length,
      },
      hasNext: offset + limit < filteredGoals.length,
      nextOffset: offset + limit < filteredGoals.length ? offset + limit : null,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get goals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { title, description, target, unit, startDate, endDate, category, priority, actions } = data;

    // 简单验证
    if (!title || !target || !unit || !startDate || !endDate || !category) {
      return Response.json(
        { error: 'Title, target, unit, start date, end date, and category are required' },
        { status: 400 }
      );
    }

    // 验证日期
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      return Response.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      );
    }

    // 创建新目标
    const newGoal = {
      id: mockGoals.length + 1,
      userId: 'user1', // 从token获取的实际用户ID
      title,
      description: description || '',
      target,
      current: 0, // 新目标从0开始
      unit,
      startDate,
      endDate,
      progress: 0, // 新目标进度为0%
      status: 'not_started',
      priority: priority || 'medium',
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      milestones: [], // 新目标没有里程碑
      actions: actions || [],
    };

    mockGoals.push(newGoal);

    return Response.json(newGoal, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { goalId, updates } = data;

    if (!goalId || !updates) {
      return Response.json(
        { error: 'Goal ID and updates are required' },
        { status: 400 }
      );
    }

    const goalIndex = mockGoals.findIndex(g => g.id === parseInt(goalId) && g.userId === 'user1');
    if (goalIndex === -1) {
      return Response.json(
        { error: 'Goal not found or you do not have permission to edit it' },
        { status: 404 }
      );
    }

    // 更新目标
    Object.keys(updates).forEach(key => {
      if (mockGoals[goalIndex].hasOwnProperty(key) && 
          key !== 'id' && 
          key !== 'userId' && 
          key !== 'createdAt') { // 不允许修改这些字段
        (mockGoals[goalIndex] as any)[key] = updates[key];
      }
    });

    mockGoals[goalIndex].updatedAt = new Date().toISOString();

    // 重新计算进度（基于当前值和目标值）
    if (updates.current !== undefined && updates.target !== undefined) {
      mockGoals[goalIndex].progress = Math.min(100, Math.round((updates.current / updates.target) * 100));
    }

    // 更新状态基于进度
    if (mockGoals[goalIndex].progress >= 100) {
      mockGoals[goalIndex].status = 'completed';
    } else if (mockGoals[goalIndex].progress > 0) {
      mockGoals[goalIndex].status = 'in_progress';
    }

    return Response.json({
      success: true,
      message: 'Goal updated successfully',
      goal: mockGoals[goalIndex],
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const goalId = url.searchParams.get('goalId');

    if (!goalId) {
      return Response.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      );
    }

    const goalIndex = mockGoals.findIndex(g => g.id === parseInt(goalId) && g.userId === 'user1');
    if (goalIndex === -1) {
      return Response.json(
        { error: 'Goal not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    const deletedGoal = mockGoals.splice(goalIndex, 1)[0];

    return Response.json({
      success: true,
      message: 'Goal deleted successfully',
      goal: deletedGoal,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    );
  }
}
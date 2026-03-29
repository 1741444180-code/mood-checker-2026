// src/app/api/user/challenges/route.ts
import { NextRequest } from 'next/server'

// 模拟用户挑战数据
const mockChallenges = [
  {
    id: 1,
    title: '连续打卡7天',
    description: '坚持7天连续记录心情',
    progress: 5,
    target: 7,
    status: 'active', // active, completed, failed
    startDate: '2026-03-24',
    endDate: '2026-03-30',
    reward: '解锁专属心情徽章',
    createdAt: '2026-03-24T10:00:00Z',
  },
  {
    id: 2,
    title: '积极心态',
    description: '本周至少有5天心情为开心或平静',
    progress: 4,
    target: 5,
    status: 'active',
    startDate: '2026-03-23',
    endDate: '2026-03-29',
    reward: '获得积极心态徽章',
    createdAt: '2026-03-23T10:00:00Z',
  },
  {
    id: 3,
    title: '情绪探索者',
    description: '体验所有基础心情类型',
    progress: 3,
    target: 7,
    status: 'active',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    reward: '获得情绪探索者徽章',
    createdAt: '2026-03-01T10:00:00Z',
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

    // 从查询参数获取状态过滤
    const status = request.nextUrl.searchParams.get('status'); // active, completed, failed, or undefined for all

    // 过滤挑战
    let filteredChallenges = mockChallenges;
    if (status) {
      filteredChallenges = filteredChallenges.filter(challenge => challenge.status === status);
    }

    return Response.json({
      challenges: filteredChallenges,
      total: filteredChallenges.length,
      activeCount: mockChallenges.filter(c => c.status === 'active').length,
      completedCount: mockChallenges.filter(c => c.status === 'completed').length,
      inProgressCount: mockChallenges.filter(c => c.status === 'active').length,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get challenges' },
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
    const { title, description, target, endDate } = data;

    // 简单验证
    if (!title || !target || !endDate) {
      return Response.json(
        { error: 'Title, target, and end date are required' },
        { status: 400 }
      );
    }

    // 创建新挑战
    const newChallenge = {
      id: mockChallenges.length + 1,
      title,
      description: description || '',
      progress: 0,
      target,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate,
      reward: data.reward || '完成挑战后的特殊徽章',
      createdAt: new Date().toISOString(),
    };

    mockChallenges.push(newChallenge);

    return Response.json(newChallenge, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Failed to create challenge' },
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
    const { challengeId, action } = data;

    if (!challengeId || !action) {
      return Response.json(
        { error: 'Challenge ID and action are required' },
        { status: 400 }
      );
    }

    const challenge = mockChallenges.find(c => c.id === parseInt(challengeId));
    if (!challenge) {
      return Response.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'join':
        if (challenge.status === 'completed' || challenge.status === 'failed') {
          return Response.json(
            { error: 'Cannot join a completed or failed challenge' },
            { status: 400 }
          );
        }
        challenge.status = 'active';
        break;

      case 'leave':
        challenge.status = 'failed';
        break;

      case 'complete':
        challenge.status = 'completed';
        challenge.progress = challenge.target;
        break;

      default:
        return Response.json(
          { error: 'Invalid action. Use join, leave, or complete.' },
          { status: 400 }
        );
    }

    return Response.json({
      success: true,
      message: `Challenge ${action}ed successfully`,
      challenge,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to update challenge' },
      { status: 500 }
    );
  }
}
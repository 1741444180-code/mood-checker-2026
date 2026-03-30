// src/app/api/user/tips/route.ts
import { NextRequest } from 'next/server'

// 模拟心情技巧数据
const mockTips = [
  {
    id: 1,
    category: 'stress_management',
    title: '深呼吸减压法',
    content: '当你感到焦虑或压力时，尝试4-7-8呼吸法：吸气4秒，屏息7秒，呼气8秒。重复3-4次，有助于平静心情。',
    moodTypes: ['焦虑', '生气'],
    rating: 4.7,
    likes: 125,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 2,
    category: 'positive_thinking',
    title: '感恩日记',
    content: '每天写下3件让你感到感激的事情，哪怕是很小的事。这有助于培养积极心态，提高整体幸福感。',
    moodTypes: ['低落', '疲惫'],
    rating: 4.5,
    likes: 98,
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 3,
    category: 'energy_boost',
    title: '轻度运动',
    content: '当感到疲惫或低落时，尝试做5-10分钟的简单运动，如散步、拉伸或跳舞。运动能释放内啡肽，改善心情。',
    moodTypes: ['疲惫', '低落'],
    rating: 4.3,
    likes: 87,
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 4,
    category: 'sleep_well',
    title: '睡前放松',
    content: '建立睡前仪式，如泡热水澡、听轻音乐或阅读。良好的睡眠对情绪调节至关重要。',
    moodTypes: ['焦虑', '疲惫'],
    rating: 4.6,
    likes: 112,
    createdAt: '2026-02-10T10:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    // 从查询参数获取过滤条件
    const category = request.nextUrl.searchParams.get('category');
    const moodType = request.nextUrl.searchParams.get('moodType');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');

    // 过滤技巧
    let filteredTips = mockTips;
    
    if (category) {
      filteredTips = filteredTips.filter(tip => tip.category === category);
    }
    
    if (moodType) {
      filteredTips = filteredTips.filter(tip => tip.moodTypes.includes(moodType));
    }

    // 排序（按评分降序）
    filteredTips.sort((a: any, b: any) => b.rating - a.rating);
    
    // 分页
    const paginatedTips = filteredTips.slice(offset, offset + limit);

    return Response.json({
      tips: paginatedTips,
      total: filteredTips.length,
      hasNext: offset + limit < filteredTips.length,
      nextOffset: offset + limit < filteredTips.length ? offset + limit : null,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get tips' },
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
    const { title, content, moodTypes, category } = data;

    // 简单验证
    if (!title || !content || !moodTypes || !category) {
      return Response.json(
        { error: 'Title, content, mood types, and category are required' },
        { status: 400 }
      );
    }

    // 创建新技巧
    const newTip = {
      id: mockTips.length + 1,
      category,
      title,
      content,
      moodTypes: Array.isArray(moodTypes) ? moodTypes : [moodTypes],
      rating: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    mockTips.push(newTip);

    return Response.json(newTip, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Failed to create tip' },
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
    const { tipId, action } = data;

    if (!tipId || !action) {
      return Response.json(
        { error: 'Tip ID and action are required' },
        { status: 400 }
      );
    }

    const tip = mockTips.find(t => t.id === parseInt(tipId));
    if (!tip) {
      return Response.json(
        { error: 'Tip not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'like':
        tip.likes += 1;
        // 简单的评分更新逻辑
        tip.rating = parseFloat(((tip.rating * (tip.likes - 1) + 5) / tip.likes).toFixed(1));
        break;

      case 'dislike':
        tip.likes = Math.max(0, tip.likes - 1);
        break;

      default:
        return Response.json(
          { error: 'Invalid action. Use like or dislike.' },
          { status: 400 }
        );
    }

    return Response.json({
      success: true,
      message: `Tip ${action}ed successfully`,
      tip,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to update tip' },
      { status: 500 }
    );
  }
}
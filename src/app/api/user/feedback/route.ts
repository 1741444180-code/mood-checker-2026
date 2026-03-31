// src/app/api/user/feedback/route.ts
import { NextRequest } from 'next/server'

// 模拟用户反馈数据
const mockFeedback = [
  {
    id: 1,
    userId: 'user1',
    moodRecordId: 1,
    moodType: '开心',
    feedbackType: 'positive', // positive, negative, neutral
    content: '今天心情很好，是因为完成了重要的工作任务',
    rating: 5,
    tags: ['工作', '成就'],
    createdAt: '2026-03-28T10:30:00Z',
    updatedAt: '2026-03-28T10:30:00Z',
  },
  {
    id: 2,
    userId: 'user1',
    moodRecordId: 4,
    moodType: '焦虑',
    feedbackType: 'negative',
    content: '工作压力很大，需要找到更好的应对方式',
    rating: 2,
    tags: ['工作', '压力'],
    createdAt: '2026-03-25T22:30:00Z',
    updatedAt: '2026-03-25T22:30:00Z',
  },
  {
    id: 3,
    userId: 'user1',
    moodRecordId: 7,
    moodType: '疲惫',
    feedbackType: 'negative',
    content: '昨晚睡得不好，影响了今天的精神状态',
    rating: 2,
    tags: ['健康', '睡眠'],
    createdAt: '2026-03-22T23:50:00Z',
    updatedAt: '2026-03-22T23:50:00Z',
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
    const moodType = request.nextUrl.searchParams.get('moodType');
    const feedbackType = request.nextUrl.searchParams.get('feedbackType'); // positive, negative, neutral
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');
    const tag = request.nextUrl.searchParams.get('tag');
    const rating = request.nextUrl.searchParams.get('rating'); // 1-5
    const moodRecordId = request.nextUrl.searchParams.get('moodRecordId');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');

    // 过滤反馈
    let filteredFeedback = mockFeedback;
    
    if (moodType) {
      filteredFeedback = filteredFeedback.filter(f => f.moodType === moodType);
    }
    
    if (feedbackType) {
      filteredFeedback = filteredFeedback.filter(f => f.feedbackType === feedbackType);
    }
    
    if (startDate) {
      filteredFeedback = filteredFeedback.filter(f => f.createdAt >= startDate);
    }
    
    if (endDate) {
      filteredFeedback = filteredFeedback.filter(f => f.createdAt <= endDate);
    }
    
    if (tag) {
      filteredFeedback = filteredFeedback.filter(f => f.tags.includes(tag));
    }
    
    if (rating) {
      filteredFeedback = filteredFeedback.filter(f => f.rating === parseInt(rating));
    }
    
    if (moodRecordId) {
      filteredFeedback = filteredFeedback.filter(f => f.moodRecordId === parseInt(moodRecordId));
    }

    // 排序（按创建时间倒序）
    filteredFeedback.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // 分页
    const paginatedFeedback = filteredFeedback.slice(offset, offset + limit);

    return Response.json({
      feedback: paginatedFeedback,
      total: filteredFeedback.length,
      stats: {
        total: mockFeedback.length,
        positive: mockFeedback.filter(f => f.feedbackType === 'positive').length,
        negative: mockFeedback.filter(f => f.feedbackType === 'negative').length,
        neutral: mockFeedback.filter(f => f.feedbackType === 'neutral').length,
        avgRating: parseFloat((mockFeedback.reduce((sum, f) => sum + f.rating, 0) / mockFeedback.length).toFixed(2)),
      },
      hasNext: offset + limit < filteredFeedback.length,
      nextOffset: offset + limit < filteredFeedback.length ? offset + limit : null,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get feedback' },
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
    const { moodRecordId, moodType, feedbackType, content, rating, tags } = data;

    // 简单验证
    if (!moodRecordId || !moodType || !feedbackType || !content) {
      return Response.json(
        { error: 'Mood record ID, mood type, feedback type, and content are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return Response.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (!['positive', 'negative', 'neutral'].includes(feedbackType)) {
      return Response.json(
        { error: 'Feedback type must be positive, negative, or neutral' },
        { status: 400 }
      );
    }

    // 创建新反馈
    const newFeedback = {
      id: mockFeedback.length + 1,
      userId: 'user1', // 从token获取的实际用户ID
      moodRecordId,
      moodType,
      feedbackType,
      content,
      rating,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockFeedback.push(newFeedback);

    return Response.json(newFeedback, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Failed to create feedback' },
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
    const { feedbackId, updates } = data;

    if (!feedbackId || !updates) {
      return Response.json(
        { error: 'Feedback ID and updates are required' },
        { status: 400 }
      );
    }

    const feedbackIndex = mockFeedback.findIndex(f => f.id === parseInt(feedbackId) && f.userId === 'user1');
    if (feedbackIndex === -1) {
      return Response.json(
        { error: 'Feedback not found or you do not have permission to edit it' },
        { status: 404 }
      );
    }

    // 更新反馈
    Object.keys(updates).forEach(key => {
      if (mockFeedback[feedbackIndex].hasOwnProperty(key) && 
          key !== 'id' && 
          key !== 'userId' && 
          key !== 'moodRecordId' && 
          key !== 'createdAt') { // 不允许修改这些字段
        (mockFeedback[feedbackIndex] as any)[key] = updates[key];
      }
    });

    mockFeedback[feedbackIndex].updatedAt = new Date().toISOString();

    return Response.json({
      success: true,
      message: 'Feedback updated successfully',
      feedback: mockFeedback[feedbackIndex],
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to update feedback' },
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
    const feedbackId = url.searchParams.get('feedbackId');

    if (!feedbackId) {
      return Response.json(
        { error: 'Feedback ID is required' },
        { status: 400 }
      );
    }

    const feedbackIndex = mockFeedback.findIndex(f => f.id === parseInt(feedbackId) && f.userId === 'user1');
    if (feedbackIndex === -1) {
      return Response.json(
        { error: 'Feedback not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    const deletedFeedback = mockFeedback.splice(feedbackIndex, 1)[0];

    return Response.json({
      success: true,
      message: 'Feedback deleted successfully',
      feedback: deletedFeedback,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to delete feedback' },
      { status: 500 }
    );
  }
}
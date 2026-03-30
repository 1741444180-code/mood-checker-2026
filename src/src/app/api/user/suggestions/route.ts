// src/app/api/user/suggestions/route.ts
import { NextRequest } from 'next/server'

// 模拟心情建议数据
const mockSuggestions = [
  {
    id: 1,
    moodType: '焦虑',
    title: '深呼吸放松法',
    description: '通过控制呼吸来缓解焦虑情绪',
    content: '当你感到焦虑时，尝试4-7-8呼吸法：吸气4秒，屏息7秒，呼气8秒。重复3-4次，有助于平静心情，减轻焦虑感。',
    category: 'relaxation',
    tags: ['呼吸', '放松', '焦虑'],
    difficulty: 'easy', // easy, medium, hard
    duration: '5分钟',
    rating: 4.7,
    likes: 125,
    usageCount: 89,
    isActive: true,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 2,
    moodType: '疲惫',
    title: '短暂休息',
    description: '通过短暂休息恢复精力',
    content: '当感到疲惫时，尝试进行5-10分钟的短暂休息。可以闭目养神，或者做一些简单的拉伸运动，有助于恢复精力。',
    category: 'energy',
    tags: ['休息', '拉伸', '能量'],
    difficulty: 'easy',
    duration: '5-10分钟',
    rating: 4.3,
    likes: 98,
    usageCount: 156,
    isActive: true,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 3,
    moodType: '低落',
    title: '感恩练习',
    description: '通过感恩练习提升心情',
    content: '每天写下3件让你感到感激的事情，哪怕是很小的事。这有助于转移注意力，培养积极心态，逐渐改善低落的心情。',
    category: 'positive_psychology',
    tags: ['感恩', '积极思考', '情绪提升'],
    difficulty: 'easy',
    duration: '每天5分钟',
    rating: 4.5,
    likes: 112,
    usageCount: 76,
    isActive: true,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 4,
    moodType: '生气',
    title: '冷静计数法',
    description: '通过计数来平复愤怒情绪',
    content: '当感到愤怒时，尝试从1数到10（或更高级别的数字），专注于数数的过程，这有助于分散注意力，让情绪逐渐平复下来。',
    category: 'anger_management',
    tags: ['冷静', '计数', '情绪调节'],
    difficulty: 'easy',
    duration: '几分钟',
    rating: 4.2,
    likes: 87,
    usageCount: 64,
    isActive: true,
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    // 从查询参数获取过滤条件
    const moodType = request.nextUrl.searchParams.get('moodType');
    const category = request.nextUrl.searchParams.get('category');
    const tag = request.nextUrl.searchParams.get('tag');
    const difficulty = request.nextUrl.searchParams.get('difficulty');
    const minRating = parseFloat(request.nextUrl.searchParams.get('minRating') || '0');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');

    // 过滤建议
    let filteredSuggestions = mockSuggestions.filter(s => s.isActive);
    
    if (moodType) {
      filteredSuggestions = filteredSuggestions.filter(s => s.moodType === moodType);
    }
    
    if (category) {
      filteredSuggestions = filteredSuggestions.filter(s => s.category === category);
    }
    
    if (tag) {
      filteredSuggestions = filteredSuggestions.filter(s => s.tags.includes(tag));
    }
    
    if (difficulty) {
      filteredSuggestions = filteredSuggestions.filter(s => s.difficulty === difficulty);
    }
    
    if (minRating > 0) {
      filteredSuggestions = filteredSuggestions.filter(s => s.rating >= minRating);
    }

    // 排序（按评分和使用次数）
    filteredSuggestions.sort((a: any, b: any) => {
      // 首先按评分排序
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      // 然后按使用次数排序
      return b.usageCount - a.usageCount;
    });
    
    // 分页
    const paginatedSuggestions = filteredSuggestions.slice(offset, offset + limit);

    return Response.json({
      suggestions: paginatedSuggestions,
      total: filteredSuggestions.length,
      hasNext: offset + limit < filteredSuggestions.length,
      nextOffset: offset + limit < filteredSuggestions.length ? offset + limit : null,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get suggestions' },
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

    // 只有管理员才能创建建议
    // 在实际应用中，这里会检查用户角色
    const isAdmin = false; // 简化示例
    
    if (!isAdmin) {
      return Response.json(
        { error: 'Only administrators can create suggestions' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { moodType, title, description, content, category, tags, difficulty, duration } = data;

    // 简单验证
    if (!moodType || !title || !content || !category) {
      return Response.json(
        { error: 'Mood type, title, content, and category are required' },
        { status: 400 }
      );
    }

    // 创建新建议
    const newSuggestion = {
      id: mockSuggestions.length + 1,
      moodType,
      title,
      description: description || '',
      content,
      category,
      tags: tags || [],
      difficulty: difficulty || 'medium',
      duration: duration || '5-10分钟',
      rating: 0,
      likes: 0,
      usageCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockSuggestions.push(newSuggestion);

    return Response.json(newSuggestion, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Failed to create suggestion' },
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

    // 只有管理员才能更新建议
    const isAdmin = false; // 简化示例
    
    if (!isAdmin) {
      return Response.json(
        { error: 'Only administrators can update suggestions' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { suggestionId, updates } = data;

    if (!suggestionId || !updates) {
      return Response.json(
        { error: 'Suggestion ID and updates are required' },
        { status: 400 }
      );
    }

    const suggestionIndex = mockSuggestions.findIndex(s => s.id === parseInt(suggestionId));
    if (suggestionIndex === -1) {
      return Response.json(
        { error: 'Suggestion not found' },
        { status: 404 }
      );
    }

    // 更新建议
    Object.keys(updates).forEach(key => {
      if (mockSuggestions[suggestionIndex].hasOwnProperty(key) && 
          key !== 'id' && 
          key !== 'createdAt') { // 不允许修改这些字段
        (mockSuggestions[suggestionIndex] as any)[key] = updates[key];
      }
    });

    mockSuggestions[suggestionIndex].updatedAt = new Date().toISOString();

    return Response.json({
      success: true,
      message: 'Suggestion updated successfully',
      suggestion: mockSuggestions[suggestionIndex],
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to update suggestion' },
      { status: 500 }
    );
  }
}


// src/app/api/user/suggestions/like/route.ts
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
    const { suggestionId } = data;

    if (!suggestionId) {
      return Response.json(
        { error: 'Suggestion ID is required' },
        { status: 400 }
      );
    }

    const suggestion = mockSuggestions.find(s => s.id === parseInt(suggestionId));
    if (!suggestion) {
      return Response.json(
        { error: 'Suggestion not found' },
        { status: 404 }
      );
    }

    // 更新点赞数
    suggestion.likes += 1;
    // 简单的评分更新逻辑
    suggestion.rating = parseFloat(((suggestion.rating * (suggestion.likes - 1) + 5) / suggestion.likes).toFixed(1));
    suggestion.updatedAt = new Date().toISOString();

    return Response.json({
      success: true,
      message: 'Suggestion liked successfully',
      suggestion,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to like suggestion' },
      { status: 500 }
    );
  }
}
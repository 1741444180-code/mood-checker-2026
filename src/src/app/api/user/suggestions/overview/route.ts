// src/app/api/user/suggestions/overview/route.ts
import { NextRequest } from 'next/server'

// 模拟用户建议概览数据
const mockSuggestionsOverview = {
  userId: 'user1',
  period: '2026-03-28',
  personalizedSuggestions: [
    {
      id: 1,
      moodType: '焦虑',
      title: '深呼吸放松法',
      description: '通过控制呼吸来缓解焦虑情绪',
      category: 'relaxation',
      difficulty: 'easy',
      duration: '5分钟',
      rating: 4.7,
      relevance: 0.95, // 相关性分数，0-1
      reason: '检测到您近期焦虑情绪较多',
      usageCount: 23,
      lastUsed: '2026-03-27T15:30:00Z',
    },
    {
      id: 2,
      moodType: '疲惫',
      title: '短暂休息',
      description: '通过短暂休息恢复精力',
      category: 'energy',
      difficulty: 'easy',
      duration: '5-10分钟',
      rating: 4.3,
      relevance: 0.88,
      reason: '根据您的作息模式推荐',
      usageCount: 15,
      lastUsed: '2026-03-26T12:15:00Z',
    },
    {
      id: 3,
      moodType: '低落',
      title: '感恩练习',
      description: '通过感恩练习提升心情',
      category: 'positive_psychology',
      difficulty: 'easy',
      duration: '每天5分钟',
      rating: 4.5,
      relevance: 0.82,
      reason: '适合改善低落情绪',
      usageCount: 8,
      lastUsed: '2026-03-25T19:45:00Z',
    },
  ],
  trendingSuggestions: [
    {
      id: 4,
      moodType: '压力',
      title: '正念冥想',
      description: '通过正念冥想减轻压力',
      category: 'mindfulness',
      difficulty: 'medium',
      duration: '10-15分钟',
      rating: 4.8,
      popularity: 0.92, // 流行度分数，0-1
      usageCount: 156,
      lastUsed: '2026-03-28T09:15:00Z',
    },
    {
      id: 5,
      moodType: '愤怒',
      title: '冷静技巧',
      description: '快速平复愤怒情绪的方法',
      category: 'anger_management',
      difficulty: 'easy',
      duration: '几分钟',
      rating: 4.6,
      popularity: 0.87,
      usageCount: 98,
      lastUsed: '2026-03-27T16:20:00Z',
    },
  ],
  moodBasedSuggestions: {
    '开心': [
      {
        id: 6,
        title: '保持积极',
        description: '延续开心情绪的方法',
        category: 'positive_reinforcement',
        difficulty: 'easy',
        duration: '日常',
        rating: 4.4,
        usageCount: 67,
      },
    ],
    '平静': [
      {
        id: 7,
        title: '深度放松',
        description: '进一步深化平静状态',
        category: 'relaxation',
        difficulty: 'medium',
        duration: '10-20分钟',
        rating: 4.2,
        usageCount: 45,
      },
    ],
    '焦虑': [
      {
        id: 1,
        title: '深呼吸放松法',
        description: '通过控制呼吸来缓解焦虑情绪',
        category: 'relaxation',
        difficulty: 'easy',
        duration: '5分钟',
        rating: 4.7,
        usageCount: 23,
      },
    ],
  },
  usageStats: {
    totalSuggestionsUsed: 46,
    avgRating: 4.5,
    mostUsedCategory: 'relaxation',
    completionRate: 0.78, // 完成率
    weeklyUsage: 12, // 本周使用次数
  },
  recommendations: [
    '继续使用推荐给您的建议，特别是针对焦虑情绪的',
    '尝试使用流行度高的建议，如正念冥想',
    '定期评估建议效果，标记有用或无用',
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
    const moodType = request.nextUrl.searchParams.get('moodType');
    const category = request.nextUrl.searchParams.get('category');
    const minRating = parseFloat(request.nextUrl.searchParams.get('minRating') || '0');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');

    // 过滤建议
    let filteredSuggestions = mockSuggestionsOverview.personalizedSuggestions;
    
    if (moodType) {
      filteredSuggestions = filteredSuggestions.filter(s => s.moodType === moodType);
    }
    
    if (category) {
      filteredSuggestions = filteredSuggestions.filter(s => s.category === category);
    }
    
    if (minRating > 0) {
      filteredSuggestions = filteredSuggestions.filter(s => s.rating >= minRating);
    }

    // 限制数量
    filteredSuggestions = filteredSuggestions.slice(0, limit);

    return Response.json({
      ...mockSuggestionsOverview,
      personalizedSuggestions: filteredSuggestions,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get suggestions overview' },
      { status: 500 }
    );
  }
}
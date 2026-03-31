// src/app/api/user/templates/overview/route.ts
import { NextRequest } from 'next/server'

// 模拟用户模板概览数据
const mockTemplatesOverview = {
  userId: 'user1',
  summary: {
    totalTemplates: 12,
    publicTemplates: 8,
    userTemplates: 4,
    mostUsedTemplate: '早晨例行公事',
    recentlyUsed: '工作日结束',
  },
  publicTemplates: [
    {
      id: 1,
      name: '早晨例行公事',
      description: '记录早上的心情和计划',
      moodType: '平静',
      defaultNote: '新的一天开始了，充满期待！今天计划：',
      defaultTags: ['生活', '计划'],
      usageCount: 156,
      rating: 4.7,
      creator: 'system',
      isPublic: true,
    },
    {
      id: 2,
      name: '工作日结束',
      description: '记录工作日的感受',
      moodType: '疲惫',
      defaultNote: '今天的工作结束了，感觉...',
      defaultTags: ['工作', '反思'],
      usageCount: 89,
      rating: 4.3,
      creator: 'system',
      isPublic: true,
    },
    {
      id: 3,
      name: '周末放松',
      description: '记录周末的休闲时光',
      moodType: '开心',
      defaultNote: '美好的周末，享受了...',
      defaultTags: ['生活', '休闲'],
      usageCount: 124,
      rating: 4.6,
      creator: 'system',
      isPublic: true,
    },
    {
      id: 4,
      name: '运动后',
      description: '记录运动后的感觉',
      moodType: '开心',
      defaultNote: '刚完成了今天的运动，感觉精力充沛！',
      defaultTags: ['健康', '运动'],
      usageCount: 67,
      rating: 4.5,
      creator: 'system',
      isPublic: true,
    },
  ],
  userTemplates: [
    {
      id: 5,
      name: '睡前反思',
      description: '记录一天的收获和感悟',
      moodType: '平静',
      defaultNote: '今天学到了/经历了...',
      defaultTags: ['反思', '成长'],
      usageCount: 23,
      rating: 4.2,
      creator: 'user1',
      isPublic: false,
    },
    {
      id: 6,
      name: '压力时刻',
      description: '记录压力下的想法和应对',
      moodType: '焦虑',
      defaultNote: '现在感到压力，但我会...',
      defaultTags: ['压力', '应对'],
      usageCount: 15,
      rating: 4.0,
      creator: 'user1',
      isPublic: false,
    },
  ],
  suggestedTemplates: [
    {
      id: 7,
      name: '感恩时刻',
      description: '记录值得感恩的事情',
      moodType: '开心',
      defaultNote: '今天值得感恩的是...',
      defaultTags: ['感恩', '积极'],
      usageCount: 0,
      rating: 0,
      creator: 'system',
      isPublic: true,
      relevance: 0.85, // 相关性分数，0-1
      reason: '根据您的打卡习惯推荐',
    },
    {
      id: 8,
      name: '社交时光',
      description: '记录社交活动的感受',
      moodType: '开心',
      defaultNote: '今天和朋友在一起，感觉...',
      defaultTags: ['社交', '快乐'],
      usageCount: 0,
      rating: 0,
      creator: 'system',
      isPublic: true,
      relevance: 0.78,
      reason: '您经常记录与社交相关的心情',
    },
  ],
  usageStats: {
    totalUses: 298,
    avgUsesPerDay: 1.07,
    mostPopularMoodType: '平静',
    weeklyGrowth: 0.12, // 使用量周增长率
  },
  recommendations: [
    '尝试使用推荐的模板，特别是"感恩时刻"',
    '创建更多针对特定情境的自定义模板',
    '分享有用的自定义模板给其他用户',
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
    const type = request.nextUrl.searchParams.get('type'); // public, user, suggested, all
    const moodType = request.nextUrl.searchParams.get('moodType');
    const sortBy = request.nextUrl.searchParams.get('sortBy') || 'usage'; // usage, rating, name, date
    const sortOrder = request.nextUrl.searchParams.get('sortOrder') || 'desc'; // asc, desc
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');

    // 根据类型过滤模板
    let templates = [];
    if (!type || type === 'all') {
      templates = [
        ...mockTemplatesOverview.publicTemplates,
        ...mockTemplatesOverview.userTemplates,
        ...mockTemplatesOverview.suggestedTemplates,
      ];
    } else if (type === 'public') {
      templates = mockTemplatesOverview.publicTemplates;
    } else if (type === 'user') {
      templates = mockTemplatesOverview.userTemplates;
    } else if (type === 'suggested') {
      templates = mockTemplatesOverview.suggestedTemplates;
    }

    // 过滤心情类型
    if (moodType) {
      templates = templates.filter((t: any) => t.moodType === moodType);
    }

    // 排序
    templates.sort((a: any, b: any) => {
      let comparison = 0;
      if (sortBy === 'usage') {
        comparison = sortOrder === 'asc' ? a.usageCount - b.usageCount : b.usageCount - a.usageCount;
      } else if (sortBy === 'rating') {
        comparison = sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      } else if (sortBy === 'name') {
        comparison = sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      return comparison;
    });

    // 限制数量
    templates = templates.slice(0, limit);

    return Response.json({
      ...mockTemplatesOverview,
      templates,
      filteredBy: { type, moodType, sortBy, sortOrder },
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get templates overview' },
      { status: 500 }
    );
  }
}
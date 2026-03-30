import { NextRequest, NextResponse } from 'next/server';

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  updatedAt: string;
  views?: number;
}

// Mock data - In production, this would come from a database
const articles: HelpArticle[] = [
  {
    id: '1',
    title: '如何注册新账户',
    category: 'account',
    content: '注册新账户非常简单：打开应用，点击"注册"按钮，输入您的邮箱地址和密码，验证邮箱地址，完成个人信息设置，开始记录您的心情！',
    updatedAt: '2026-03-30T10:00:00Z',
    views: 1250,
  },
  {
    id: '2',
    title: '忘记密码怎么办',
    category: 'account',
    content: '如果您忘记了密码，可以通过以下步骤重置：在登录页面点击"忘记密码"，输入注册时的邮箱地址，查收重置密码邮件，点击邮件中的链接设置新密码。',
    updatedAt: '2026-03-30T10:00:00Z',
    views: 890,
  },
  {
    id: '3',
    title: '如何记录每天的心情',
    category: 'mood',
    content: '记录心情只需几步：点击首页的"记录心情"按钮，选择当前的心情状态，可以添加文字描述（可选），选择心情标签（可选），点击保存完成记录。',
    updatedAt: '2026-03-30T10:00:00Z',
    views: 2100,
  },
  {
    id: '4',
    title: '查看心情统计报告',
    category: 'data',
    content: '查看统计报告的步骤：点击底部导航栏的"统计"图标，选择查看时间范围（周/月/年），查看心情分布图表，查看详细趋势分析。',
    updatedAt: '2026-03-30T10:00:00Z',
    views: 1560,
  },
  {
    id: '5',
    title: '设置打卡提醒',
    category: 'settings',
    content: '设置提醒很简单：进入"设置"页面，找到"提醒设置"，开启提醒开关，设置提醒时间，选择提醒频率（每天/工作日/自定义）。',
    updatedAt: '2026-03-30T10:00:00Z',
    views: 980,
  },
  {
    id: '6',
    title: '数据导出功能说明',
    category: 'data',
    content: '支持数据导出功能：进入"设置"页面，选择"数据管理"，点击"导出数据"，选择导出格式（CSV/PDF），数据将发送到您的邮箱。',
    updatedAt: '2026-03-30T10:00:00Z',
    views: 750,
  },
];

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query is required',
        },
        { status: 400 }
      );
    }

    // Normalize search query
    const searchTerms = query.toLowerCase().trim().split(/\s+/);

    // Search in title and content
    let results = articles.filter(article => {
      const titleMatch = searchTerms.some(term =>
        article.title.toLowerCase().includes(term)
      );
      const contentMatch = searchTerms.some(term =>
        article.content.toLowerCase().includes(term)
      );
      
      // Category filter if provided
      if (category && article.category !== category) {
        return false;
      }
      
      return titleMatch || contentMatch;
    });

    // Sort by relevance (title matches first, then by views)
    results.sort((a, b) => {
      const aTitleMatch = searchTerms.some(term =>
        a.title.toLowerCase().includes(term)
      );
      const bTitleMatch = searchTerms.some(term =>
        b.title.toLowerCase().includes(term)
      );
      
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      
      return (b.views || 0) - (a.views || 0);
    });

    // Limit results
    results = results.slice(0, limit);

    // Highlight search terms (simple implementation)
    const highlightedResults = results.map(article => ({
      ...article,
      title: highlightTerms(article.title, searchTerms),
      content: highlightTerms(article.content.substring(0, 200) + '...', searchTerms),
    }));

    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        success: true,
        results: highlightedResults,
        query: query,
        totalResults: results.length,
        responseTime: `${responseTime}ms`,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('Error searching articles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Search failed',
      },
      { status: 500 }
    );
  }
}

// Helper function to highlight search terms
function highlightTerms(text: string, terms: string[]): string {
  let highlighted = text;
  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlighted = highlighted.replace(regex, '<mark>$1</mark>');
  });
  return highlighted;
}

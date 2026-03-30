import { NextRequest, NextResponse } from 'next/server';

interface AnalyticsData {
  totalViews: number;
  totalArticles: number;
  topArticles: Array<{
    id: string;
    title: string;
    views: number;
    category: string;
  }>;
  categoryDistribution: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  searchQueries: Array<{
    query: string;
    count: number;
    noResults: number;
  }>;
  feedbackStats: {
    total: number;
    pending: number;
    resolved: number;
    averageResolutionTime: string;
  };
  timeRange: {
    start: string;
    end: string;
  };
}

// Mock data - In production, aggregate from database
const mockAnalytics: AnalyticsData = {
  totalViews: 15420,
  totalArticles: 48,
  topArticles: [
    { id: '3', title: '如何记录每天的心情', views: 2100, category: 'mood' },
    { id: '4', title: '查看心情统计报告', views: 1560, category: 'data' },
    { id: '1', title: '如何注册新账户', views: 1250, category: 'account' },
    { id: '5', title: '设置打卡提醒', views: 980, category: 'settings' },
    { id: '2', title: '忘记密码怎么办', views: 890, category: 'account' },
  ],
  categoryDistribution: [
    { category: 'mood', count: 15, percentage: 31.25 },
    { category: 'account', count: 12, percentage: 25.0 },
    { category: 'data', count: 10, percentage: 20.83 },
    { category: 'settings', count: 8, percentage: 16.67 },
    { category: 'other', count: 3, percentage: 6.25 },
  ],
  searchQueries: [
    { query: '心情记录', count: 320, noResults: 12 },
    { query: '统计报告', count: 280, noResults: 8 },
    { query: '提醒设置', count: 210, noResults: 5 },
    { query: '数据导出', count: 180, noResults: 15 },
    { query: '密码重置', count: 150, noResults: 3 },
  ],
  feedbackStats: {
    total: 156,
    pending: 12,
    resolved: 142,
    averageResolutionTime: '18h 24m',
  },
  timeRange: {
    start: '2026-03-01T00:00:00Z',
    end: '2026-03-30T23:59:59Z',
  },
};

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'overview';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // In production, filter by date range and aggregate from database
    let analytics: Partial<AnalyticsData> = {};

    switch (type) {
      case 'overview':
        analytics = {
          totalViews: mockAnalytics.totalViews,
          totalArticles: mockAnalytics.totalArticles,
          feedbackStats: mockAnalytics.feedbackStats,
          timeRange: mockAnalytics.timeRange,
        };
        break;

      case 'top-articles':
        analytics = {
          topArticles: mockAnalytics.topArticles,
          timeRange: mockAnalytics.timeRange,
        };
        break;

      case 'categories':
        analytics = {
          categoryDistribution: mockAnalytics.categoryDistribution,
          timeRange: mockAnalytics.timeRange,
        };
        break;

      case 'searches':
        analytics = {
          searchQueries: mockAnalytics.searchQueries,
          timeRange: mockAnalytics.timeRange,
        };
        break;

      case 'feedback':
        analytics = {
          feedbackStats: mockAnalytics.feedbackStats,
          timeRange: mockAnalytics.timeRange,
        };
        break;

      default:
        analytics = mockAnalytics;
    }

    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        success: true,
        data: analytics,
        responseTime: `${responseTime}ms`,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch analytics',
      },
      { status: 500 }
    );
  }
}

// Helper function to track article views (call this from article detail pages)
export async function trackView(articleId: string) {
  try {
    // In production, increment view count in database
    // await db.article.update({
    //   where: { id: articleId },
    //   data: { views: { increment: 1 } },
    // });
    console.log(`Tracking view for article: ${articleId}`);
  } catch (error) {
    console.error('Error tracking view:', error);
  }
}

// Helper function to track search queries (call this from search endpoint)
export async function trackSearch(query: string, resultsCount: number) {
  try {
    // In production, log search query to analytics database
    // await db.searchQuery.create({
    //   data: {
    //     query,
    //     resultsCount,
    //     timestamp: new Date(),
    //   },
    // });
    console.log(`Tracking search: "${query}" - ${resultsCount} results`);
  } catch (error) {
    console.error('Error tracking search:', error);
  }
}

// src/app/api/user/reports/route.ts
import { NextRequest } from 'next/server'

// 模拟用户报告数据
const mockReports = [
  {
    id: 1,
    userId: 'user1',
    title: '3月心情报告',
    description: '2026年3月的心情统计与分析',
    type: 'monthly',
    period: '2026-03-01 to 2026-03-28',
    generatedAt: '2026-03-28T10:00:00Z',
    status: 'completed',
    data: {
      totalCheckIns: 28,
      avgMoodScore: 3.8,
      moodDistribution: {
        '开心': 40,
        '平静': 25,
        '焦虑': 15,
        '疲惫': 10,
        '兴奋': 5,
        '生气': 3,
        '低落': 2,
      },
      streak: 7,
      longestStreak: 12,
      topMood: '开心',
      moodTrend: 'improving',
      insights: [
        '本月心情总体呈上升趋势',
        '工作日心情略低于周末',
        '下午和晚上的心情普遍较好',
      ],
      recommendations: [
        '继续保持现有积极习惯',
        '在工作日安排更多放松时间',
      ],
    },
    fileUrl: '/api/user/reports/1/download', // 可下载的报告文件
  },
  {
    id: 2,
    userId: 'user1',
    title: '周报: 3月第4周',
    description: '2026年3月22日至3月28日的心情报告',
    type: 'weekly',
    period: '2026-03-22 to 2026-03-28',
    generatedAt: '2026-03-28T09:00:00Z',
    status: 'completed',
    data: {
      totalCheckIns: 7,
      avgMoodScore: 4.0,
      moodDistribution: {
        '开心': 45,
        '平静': 30,
        '兴奋': 15,
        '疲惫': 10,
      },
      streak: 7,
      topMood: '开心',
      moodTrend: 'stable',
      insights: [
        '本周心情保持稳定',
        '周末心情明显好于工作日',
      ],
      recommendations: [
        '继续保持规律的打卡习惯',
      ],
    },
    fileUrl: '/api/user/reports/2/download',
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
    const type = request.nextUrl.searchParams.get('type'); // 'daily', 'weekly', 'monthly', 'quarterly', 'annual'
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');

    // 过滤报告
    let filteredReports = mockReports;
    
    if (type) {
      filteredReports = filteredReports.filter(report => report.type === type);
    }
    
    if (startDate) {
      filteredReports = filteredReports.filter(report => report.generatedAt >= startDate);
    }
    
    if (endDate) {
      filteredReports = filteredReports.filter(report => report.generatedAt <= endDate);
    }

    // 排序（按生成时间倒序）
    filteredReports.sort((a: any, b: any) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
    
    // 分页
    const paginatedReports = filteredReports.slice(offset, offset + limit);

    return Response.json({
      reports: paginatedReports,
      total: filteredReports.length,
      hasNext: offset + limit < filteredReports.length,
      nextOffset: offset + limit < filteredReports.length ? offset + limit : null,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get reports' },
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
    const { type, startDate, endDate, includeCharts, includeInsights } = data;

    // 简单验证
    if (!type || !startDate || !endDate) {
      return Response.json(
        { error: 'Type, start date, and end date are required' },
        { status: 400 }
      );
    }

    // 验证报告类型
    if (!['daily', 'weekly', 'monthly', 'quarterly', 'annual'].includes(type)) {
      return Response.json(
        { error: 'Type must be daily, weekly, monthly, quarterly, or annual' },
        { status: 400 }
      );
    }

    // 创建新报告
    const newReport = {
      id: mockReports.length + 1,
      userId: 'user1', // 从token获取的实际用户ID
      title: `${new Date(startDate).toLocaleDateString('zh-CN')} 到 ${new Date(endDate).toLocaleDateString('zh-CN')} ${type === 'monthly' ? '月' : type === 'weekly' ? '周' : type === 'daily' ? '日' : type === 'quarterly' ? '季度' : '年度'}报`,
      description: `${new Date(startDate).getFullYear()}年${new Date(startDate).getMonth() + 1}月${new Date(startDate).getDate()}日至${new Date(endDate).getMonth() + 1}月${new Date(endDate).getDate()}日的心情报告`,
      type,
      period: `${startDate} to ${endDate}`,
      generatedAt: new Date().toISOString(),
      status: 'processing', // 新创建的报告状态为处理中
      data: null, // 处理完成前数据为空
      fileUrl: `/api/user/reports/${mockReports.length + 1}/download`,
    };

    // 在实际应用中，这里会启动后台任务来生成报告
    // 模拟生成报告的过程
    setTimeout(() => {
      newReport.status = 'completed';
      newReport.data = {
        totalCheckIns: Math.floor(Math.random() * 30) + 10, // 随机生成数据
        avgMoodScore: parseFloat((Math.random() * 2 + 2.5).toFixed(1)), // 2.5-4.5之间随机
        moodDistribution: {
          '开心': Math.floor(Math.random() * 50) + 20,
          '平静': Math.floor(Math.random() * 30) + 15,
          '焦虑': Math.floor(Math.random() * 20) + 5,
          '疲惫': Math.floor(Math.random() * 15) + 5,
          '兴奋': Math.floor(Math.random() * 10) + 1,
          '生气': Math.floor(Math.random() * 5) + 1,
          '低落': Math.floor(Math.random() * 5) + 1,
        },
        streak: Math.floor(Math.random() * 10) + 1,
        longestStreak: Math.floor(Math.random() * 20) + 5,
        topMood: ['开心', '平静', '焦虑'][Math.floor(Math.random() * 3)],
        moodTrend: ['improving', 'declining', 'stable'][Math.floor(Math.random() * 3)],
        insights: [
          '根据您的打卡记录，本期间心情呈现特定模式',
          '某些日子或时间段的心情相对固定',
        ],
        recommendations: [
          '继续维持良好的心情记录习惯',
          '注意情绪波动较大的时期',
        ],
      };
    }, 2000); // 模拟2秒的处理时间

    mockReports.push(newReport);

    return Response.json(newReport, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}
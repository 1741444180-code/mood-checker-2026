// src/app/api/user/reports/[id]/route.ts
import { NextRequest } from 'next/server'

// 模拟报告数据
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
  },
];

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    
    // 查找报告
    const report = mockReports.find(r => r.id === id);
    
    if (!report) {
      return Response.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // 检查权限
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ') || report.userId !== 'user1') {
      return Response.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return Response.json(report);
  } catch (error) {
    return Response.json(
      { error: 'Failed to get report' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 查找报告
    const reportIndex = mockReports.findIndex(r => r.id === id && r.userId === 'user1');
    
    if (reportIndex === -1) {
      return Response.json(
        { error: 'Report not found or you do not have permission to edit it' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const { title, description } = data;

    // 更新报告
    if (title) mockReports[reportIndex].title = title;
    if (description) mockReports[reportIndex].description = description;

    return Response.json({
      success: true,
      message: 'Report updated successfully',
      report: mockReports[reportIndex],
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to update report' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 查找报告
    const reportIndex = mockReports.findIndex(r => r.id === id && r.userId === 'user1');
    
    if (reportIndex === -1) {
      return Response.json(
        { error: 'Report not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    const deletedReport = mockReports.splice(reportIndex, 1)[0];

    return Response.json({
      success: true,
      message: 'Report deleted successfully',
      report: deletedReport,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to delete report' },
      { status: 500 }
    );
  }
}
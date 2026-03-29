// src/app/api/user/reports/[id]/download/route.ts
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

    // 检查报告是否已完成
    if (report.status !== 'completed') {
      return Response.json(
        { error: 'Report is not ready for download yet' },
        { status: 400 }
      );
    }

    // 生成报告内容（这里简化为JSON格式，实际可以生成PDF或其他格式）
    const reportContent = `
# ${report.title}

**期间:** ${report.period}
**生成时间:** ${new Date(report.generatedAt).toLocaleString('zh-CN')}
**类型:** ${report.type === 'monthly' ? '月报' : report.type === 'weekly' ? '周报' : '日报'}

## 统计摘要
- 总打卡次数: ${report.data.totalCheckIns}
- 平均心情分数: ${report.data.avgMoodScore}
- 连续打卡天数: ${report.data.streak}
- 最长连续天数: ${report.data.longestStreak}
- 主导心情: ${report.data.topMood}
- 心情趋势: ${report.data.moodTrend === 'improving' ? '改善' : report.data.moodTrend === 'declining' ? '下降' : '稳定'}

## 心情分布
${Object.entries(report.data.moodDistribution).map(([mood, percentage]) => `- ${mood}: ${percentage}%`).join('\n')}

## 洞察
${report.data.insights.map(insight => `- ${insight}`).join('\n')}

## 建议
${report.data.recommendations.map(rec => `- ${rec}`).join('\n')}

---
报告生成于 ${new Date().toLocaleString('zh-CN')}
`;

    // 返回文件下载
    return new Response(reportContent, {
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
        'Content-Disposition': `attachment; filename="${report.title}.txt"`,
      },
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to download report' },
      { status: 500 }
    );
  }
}
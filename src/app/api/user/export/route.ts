// src/app/api/user/export/route.ts
import { NextRequest } from 'next/server'

// 模拟用户数据
const mockUserData = {
  user: {
    id: 'user1',
    username: 'testuser',
    email: 'test@example.com',
    createdAt: '2026-03-01T10:00:00Z',
    timezone: 'Asia/Shanghai',
  },
  moodRecords: [
    { id: 1, date: '2026-03-28', moodType: '开心', note: '今天天气很好', tags: ['生活'], createdAt: '2026-03-28T08:30:00Z' },
    { id: 2, date: '2026-03-27', moodType: '平静', note: '看了一本书', tags: ['生活'], createdAt: '2026-03-27T21:15:00Z' },
    { id: 3, date: '2026-03-26', moodType: '开心', note: '完成了工作', tags: ['工作'], createdAt: '2026-03-26T20:45:00Z' },
  ],
  settings: {
    reminderTime: '21:00',
    reminderEnabled: true,
    weeklyReport: false,
    publicProfile: false,
    theme: 'light',
  },
  stats: {
    totalCheckIns: 28,
    streak: 7,
    moodDistribution: {
      '开心': 12,
      '平静': 8,
      '焦虑': 5,
      '疲惫': 2,
      '兴奋': 1,
    },
    averageMoodScore: 3.8,
  }
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

    // 从查询参数获取导出格式
    const format = request.nextUrl.searchParams.get('format') || 'json';
    
    if (format === 'json') {
      // 设置响应头以触发下载
      return new Response(JSON.stringify(mockUserData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename=user-data-export.json',
        },
      });
    } else if (format === 'csv') {
      // 创建CSV格式的响应
      let csvContent = '日期,心情类型,备注,标签\n';
      
      mockUserData.moodRecords.forEach(record => {
        csvContent += `"${record.date}","${record.moodType}","${record.note || ''}","${record.tags.join(';')}"\n`;
      });
      
      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=user-data-export.csv',
        },
      });
    } else {
      return Response.json(
        { error: 'Unsupported export format. Use json or csv.' },
        { status: 400 }
      );
    }
  } catch (error) {
    return Response.json(
      { error: 'Failed to export user data' },
      { status: 500 }
    );
  }
}
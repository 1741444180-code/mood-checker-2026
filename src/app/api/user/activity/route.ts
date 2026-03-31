// src/app/api/user/activity/route.ts
import { NextRequest } from 'next/server'

// 模拟用户活动日志数据
const mockActivityLogs = [
  { id: 1, userId: 'user1', action: 'mood_created', targetId: 1, timestamp: '2026-03-28T08:30:00Z', details: { moodType: '开心', note: '今天天气很好' } },
  { id: 2, userId: 'user1', action: 'settings_updated', targetId: null, timestamp: '2026-03-27T15:20:00Z', details: { field: 'theme', oldValue: 'light', newValue: 'dark' } },
  { id: 3, userId: 'user1', action: 'comment_added', targetId: 1, timestamp: '2026-03-26T19:45:00Z', details: { content: '看到你开心我也很开心！' } },
  { id: 4, userId: 'user1', action: 'profile_viewed', targetId: 'user2', timestamp: '2026-03-25T14:10:00Z', details: {} },
  { id: 5, userId: 'user1', action: 'stats_exported', targetId: null, timestamp: '2026-03-24T10:30:00Z', details: { format: 'json' } },
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
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');
    const action = request.nextUrl.searchParams.get('action');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50');
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');

    // 过滤活动日志
    let filteredLogs = mockActivityLogs;
    
    if (startDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= startDate);
    }
    
    if (endDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= endDate);
    }
    
    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action);
    }

    // 排序（按时间倒序）
    filteredLogs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // 分页
    const paginatedLogs = filteredLogs.slice(offset, offset + limit);

    return Response.json({
      activities: paginatedLogs,
      total: filteredLogs.length,
      hasNext: offset + limit < filteredLogs.length,
      nextOffset: offset + limit < filteredLogs.length ? offset + limit : null,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get activity logs' },
      { status: 500 }
    );
  }
}
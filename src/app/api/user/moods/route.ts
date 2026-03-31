// src/app/api/user/moods/route.ts
import { NextRequest } from 'next/server'

// 模拟用户心情记录数据
const mockUserMoodRecords = [
  { id: 1, userId: 'user1', date: '2026-03-28', moodType: '开心', note: '今天天气很好', tags: ['生活'], createdAt: '2026-03-28T08:30:00Z' },
  { id: 2, userId: 'user1', date: '2026-03-27', moodType: '平静', note: '看了一本书', tags: ['生活'], createdAt: '2026-03-27T21:15:00Z' },
  { id: 3, userId: 'user1', date: '2026-03-26', moodType: '开心', note: '完成了工作', tags: ['工作'], createdAt: '2026-03-26T20:45:00Z' },
  { id: 4, userId: 'user1', date: '2026-03-25', moodType: '焦虑', note: '有压力', tags: ['工作'], createdAt: '2026-03-25T22:10:00Z' },
  { id: 5, userId: 'user1', date: '2026-03-24', moodType: '平静', note: '周末放松', tags: ['生活'], createdAt: '2026-03-24T19:20:00Z' },
  { id: 6, userId: 'user1', date: '2026-03-23', moodType: '兴奋', note: '收到了好消息', tags: ['生活'], createdAt: '2026-03-23T12:30:00Z' },
  { id: 7, userId: 'user1', date: '2026-03-22', moodType: '疲惫', note: '加班到很晚', tags: ['工作'], createdAt: '2026-03-22T23:45:00Z' },
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

    // 从查询参数获取额外的过滤条件
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');
    const moodType = request.nextUrl.searchParams.get('moodType');
    const tag = request.nextUrl.searchParams.get('tag');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50');
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');

    // 过滤心情记录
    let filteredRecords = mockUserMoodRecords;
    
    // 假设所有记录都属于当前认证的用户
    // 实际应用中会从token中解析用户ID并进行验证
    
    if (startDate) {
      filteredRecords = filteredRecords.filter(record => record.date >= startDate);
    }
    
    if (endDate) {
      filteredRecords = filteredRecords.filter(record => record.date <= endDate);
    }
    
    if (moodType) {
      filteredRecords = filteredRecords.filter(record => record.moodType === moodType);
    }
    
    if (tag) {
      filteredRecords = filteredRecords.filter(record => record.tags.includes(tag));
    }

    // 排序（按日期降序）
    filteredRecords.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // 分页
    const paginatedRecords = filteredRecords.slice(offset, offset + limit);

    return Response.json({
      records: paginatedRecords,
      total: filteredRecords.length,
      hasNext: offset + limit < filteredRecords.length,
      nextOffset: offset + limit < filteredRecords.length ? offset + limit : null,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get user mood records' },
      { status: 500 }
    );
  }
}
// src/app/api/moods/history/route.ts
import { NextRequest } from 'next/server'

// 模拟心情记录数据
const mockMoodRecords = [
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
    // 从查询参数获取用户ID和日期范围
    const userId = request.nextUrl.searchParams.get('userId');
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');
    const limit = request.nextUrl.searchParams.get('limit') || '50';
    const offset = request.nextUrl.searchParams.get('offset') || '0';

    // 过滤心情记录
    let filteredRecords = mockMoodRecords;
    
    if (userId) {
      filteredRecords = filteredRecords.filter(record => record.userId === userId);
    }
    
    if (startDate) {
      filteredRecords = filteredRecords.filter(record => record.date >= startDate);
    }
    
    if (endDate) {
      filteredRecords = filteredRecords.filter(record => record.date <= endDate);
    }

    // 排序（按日期降序）
    filteredRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // 分页
    const start = parseInt(offset);
    const end = start + parseInt(limit);
    const paginatedRecords = filteredRecords.slice(start, end);

    return Response.json({
      records: paginatedRecords,
      total: filteredRecords.length,
      hasNext: end < filteredRecords.length,
      nextOffset: end < filteredRecords.length ? end : null,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get mood history' },
      { status: 500 }
    );
  }
}
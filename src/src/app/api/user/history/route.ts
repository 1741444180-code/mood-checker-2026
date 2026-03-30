// src/app/api/user/history/route.ts
import { NextRequest } from 'next/server'

// 模拟用户心情历史数据
const mockHistory = [
  { date: '2026-03-28', moodType: '开心', moodScore: 4.2, note: '今天天气很好', tags: ['生活'] },
  { date: '2026-03-27', moodType: '平静', moodScore: 3.8, note: '看了一本书', tags: ['生活'] },
  { date: '2026-03-26', moodType: '开心', moodScore: 4.0, note: '完成了工作', tags: ['工作'] },
  { date: '2026-03-25', moodType: '焦虑', moodScore: 2.5, note: '有压力', tags: ['工作'] },
  { date: '2026-03-24', moodType: '平静', moodScore: 3.7, note: '周末放松', tags: ['生活'] },
  { date: '2026-03-23', moodType: '兴奋', moodScore: 4.5, note: '收到了好消息', tags: ['生活'] },
  { date: '2026-03-22', moodType: '疲惫', moodScore: 2.2, note: '加班到很晚', tags: ['工作'] },
  { date: '2026-03-21', moodType: '开心', moodScore: 4.1, note: '和朋友聚餐', tags: ['生活'] },
  { date: '2026-03-20', moodType: '平静', moodScore: 3.6, note: '冥想练习', tags: ['生活'] },
  { date: '2026-03-19', moodType: '焦虑', moodScore: 2.8, note: '项目截止日期临近', tags: ['工作'] },
  { date: '2026-03-18', moodType: '开心', moodScore: 4.3, note: '解决了难题', tags: ['工作'] },
  { date: '2026-03-17', moodType: '平静', moodScore: 3.5, note: '听音乐', tags: ['生活'] },
  { date: '2026-03-16', moodType: '疲惫', moodScore: 2.0, note: '睡眠不足', tags: ['生活'] },
  { date: '2026-03-15', moodType: '开心', moodScore: 4.0, note: '周末愉快', tags: ['生活'] },
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
    const moodType = request.nextUrl.searchParams.get('moodType');
    const tag = request.nextUrl.searchParams.get('tag');
    const sortBy = request.nextUrl.searchParams.get('sortBy') || 'date'; // date, moodScore
    const sortOrder = request.nextUrl.searchParams.get('sortOrder') || 'desc'; // asc, desc
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50');
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');

    // 过滤历史记录
    let filteredHistory = mockHistory;
    
    if (startDate) {
      filteredHistory = filteredHistory.filter(record => record.date >= startDate);
    }
    
    if (endDate) {
      filteredHistory = filteredHistory.filter(record => record.date <= endDate);
    }
    
    if (moodType) {
      filteredHistory = filteredHistory.filter(record => record.moodType === moodType);
    }
    
    if (tag) {
      filteredHistory = filteredHistory.filter(record => record.tags.includes(tag));
    }

    // 排序
    filteredHistory.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'moodScore') {
        comparison = sortOrder === 'asc' ? a.moodScore - b.moodScore : b.moodScore - a.moodScore;
      } else { // 默认按日期排序
        comparison = sortOrder === 'asc' ? 
          new Date(a.date).getTime() - new Date(b.date).getTime() : 
          new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return comparison;
    });
    
    // 分页
    const paginatedHistory = filteredHistory.slice(offset, offset + limit);

    // 计算统计信息
    const stats = {
      totalRecords: filteredHistory.length,
      avgMoodScore: filteredHistory.length > 0 ? 
        parseFloat((filteredHistory.reduce((sum, record) => sum + record.moodScore, 0) / filteredHistory.length).toFixed(2)) : 0,
      moodDistribution: filteredHistory.reduce((acc, record) => {
        acc[record.moodType] = (acc[record.moodType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      tagDistribution: filteredHistory.reduce((acc, record) => {
        record.tags.forEach(tag => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>),
      dateRange: {
        start: filteredHistory.length > 0 ? filteredHistory[filteredHistory.length - 1].date : null,
        end: filteredHistory.length > 0 ? filteredHistory[0].date : null,
      },
    };

    return Response.json({
      history: paginatedHistory,
      stats,
      total: filteredHistory.length,
      hasNext: offset + limit < filteredHistory.length,
      nextOffset: offset + limit < filteredHistory.length ? offset + limit : null,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get history' },
      { status: 500 }
    );
  }
}
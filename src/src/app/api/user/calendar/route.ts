// src/app/api/user/calendar/route.ts
import { NextRequest } from 'next/server'

// 模拟用户心情记录数据
const mockUserMoodRecords = [
  { id: 1, userId: 'user1', date: '2026-03-28', moodType: '开心', note: '今天天气很好', tags: ['生活'] },
  { id: 2, userId: 'user1', date: '2026-03-27', moodType: '平静', note: '看了一本书', tags: ['生活'] },
  { id: 3, userId: 'user1', date: '2026-03-26', moodType: '开心', note: '完成了工作', tags: ['工作'] },
  { id: 4, userId: 'user1', date: '2026-03-25', moodType: '焦虑', note: '有压力', tags: ['工作'] },
  { id: 5, userId: 'user1', date: '2026-03-24', moodType: '平静', note: '周末放松', tags: ['生活'] },
  { id: 6, userId: 'user1', date: '2026-03-23', moodType: '兴奋', note: '收到了好消息', tags: ['生活'] },
  { id: 7, userId: 'user1', date: '2026-03-21', moodType: '疲惫', note: '加班到很晚', tags: ['工作'] },
  { id: 8, userId: 'user1', date: '2026-03-18', moodType: '开心', note: '和朋友聚餐', tags: ['生活'] },
  { id: 9, userId: 'user1', date: '2026-03-15', moodType: '平静', note: '冥想练习', tags: ['生活'] },
  { id: 10, userId: 'user1', date: '2026-03-10', moodType: '焦虑', note: '项目截止日期临近', tags: ['工作'] },
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

    // 从查询参数获取月份
    const month = request.nextUrl.searchParams.get('month') || '2026-03';
    
    // 过滤指定月份的心景记录
    const filteredRecords = mockUserMoodRecords.filter(record => 
      record.date.startsWith(month)
    );

    // 计算该月的打卡率
    const yearMonth = month.split('-');
    const year = parseInt(yearMonth[0]);
    const monthNum = parseInt(yearMonth[1]);
    
    // 计算该月天数
    const daysInMonth = new Date(year, monthNum, 0).getDate();
    
    // 计算打卡天数
    const checkInDays = filteredRecords.length;
    
    // 计算打卡率
    const checkInRate = Math.round((checkInDays / daysInMonth) * 100);

    return Response.json({
      month,
      daysInMonth,
      checkInDays,
      checkInRate: `${checkInRate}%`,
      moodRecords: filteredRecords,
      calendarData: filteredRecords.map(record => ({
        date: record.date,
        moodType: record.moodType,
        note: record.note,
        tags: record.tags,
      }))
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get user calendar data' },
      { status: 500 }
    );
  }
}
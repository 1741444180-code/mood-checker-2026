// src/app/api/stats/rankings/route.ts
import { NextRequest } from 'next/server'

// 模拟用户数据
const mockUsers = [
  { id: 'user1', username: 'Alice', averageMoodScore: 4.2, checkInCount: 28 },
  { id: 'user2', username: 'Bob', averageMoodScore: 3.8, checkInCount: 30 },
  { id: 'user3', username: 'Charlie', averageMoodScore: 4.5, checkInCount: 22 },
  { id: 'user4', username: 'Diana', averageMoodScore: 4.0, checkInCount: 25 },
  { id: 'user5', username: 'Eve', averageMoodScore: 3.9, checkInCount: 27 },
];

export async function GET(request: NextRequest) {
  try {
    // 从查询参数获取类型和时间范围
    const type = request.nextUrl.searchParams.get('type') || 'active'; // active or happy
    const range = request.nextUrl.searchParams.get('range') || 'all'; // week, month, all
    
    // 根据类型排序用户
    let sortedUsers = [...mockUsers];
    if (type === 'happy') {
      // 按平均心情分数排序
      sortedUsers.sort((a: any, b: any) => b.averageMoodScore - a.averageMoodScore);
    } else {
      // 按打卡次数排序（默认）
      sortedUsers.sort((a: any, b: any) => b.checkInCount - a.checkInCount);
    }
    
    // 限制返回前10名
    const topUsers = sortedUsers.slice(0, 10);
    
    return Response.json({
      rankings: topUsers,
      type,
      range,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get rankings' },
      { status: 500 }
    );
  }
}
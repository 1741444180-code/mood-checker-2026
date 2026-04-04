import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function getUserId(request: NextRequest): number | null {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return null;
    const data = JSON.parse(Buffer.from(token, 'base64').toString());
    if (data.exp < Date.now()) return null;
    return data.userId;
  } catch { return null; }
}

// GET /api/stats - 获取统计数据
export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const allRecords = await prisma.moodRecord.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });

  const totalCheckIns = allRecords.length;

  // 计算连续打卡天数
  let consecutiveDays = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const found = allRecords.find(r => {
      const d = new Date(r.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === checkDate.getTime();
    });
    if (found) consecutiveDays++;
    else break;
  }

  // 平均心情
  const avgMood = totalCheckIns > 0
    ? (allRecords.reduce((sum, r) => sum + r.moodLevel, 0) / totalCheckIns).toFixed(1)
    : '0';

  // 心情分布
  const distribution: Record<string, number> = {};
  allRecords.forEach(r => {
    const key = `${r.moodEmoji} ${r.moodLabel}`;
    distribution[key] = (distribution[key] || 0) + 1;
  });

  // 最近 7 天趋势
  const weekTrend = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const record = allRecords.find(r => {
      const rd = new Date(r.date);
      rd.setHours(0, 0, 0, 0);
      return rd.getTime() === d.getTime();
    });
    weekTrend.push({
      date: d.toISOString().split('T')[0],
      moodLevel: record?.moodLevel || 0,
      moodEmoji: record?.moodEmoji || '',
    });
  }

  return NextResponse.json({
    success: true,
    stats: { totalCheckIns, consecutiveDays, avgMood, distribution, weekTrend },
  });
}

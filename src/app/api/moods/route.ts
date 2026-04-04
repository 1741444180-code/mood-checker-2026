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

// GET /api/moods - 获取心情记录
export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '30');

  const since = new Date();
  since.setDate(since.getDate() - days);

  const records = await prisma.moodRecord.findMany({
    where: { userId, date: { gte: since } },
    orderBy: { date: 'desc' },
  });

  return NextResponse.json({ success: true, records });
}

// POST /api/moods - 创建心情记录
export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: '未登录' }, { status: 401 });

  try {
    const { moodLevel, moodEmoji, moodLabel, note, tags } = await request.json();

    if (!moodLevel || !moodEmoji || !moodLabel) {
      return NextResponse.json({ error: '请选择心情' }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // upsert: 今天已打卡则更新，否则创建
    const record = await prisma.moodRecord.upsert({
      where: { userId_date: { userId, date: today } },
      update: { moodLevel, moodEmoji, moodLabel, note, tags: tags?.join(',') },
      create: { userId, date: today, moodLevel, moodEmoji, moodLabel, note, tags: tags?.join(',') },
    });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('Mood create error:', error);
    return NextResponse.json({ error: '打卡失败' }, { status: 500 });
  }
}

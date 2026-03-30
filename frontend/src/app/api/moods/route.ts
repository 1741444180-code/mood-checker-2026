import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, moodType, note, tags } = body;

    // 验证必填字段
    if (!userId || !moodType) {
      return NextResponse.json(
        { error: '用户 ID 和心情类型不能为空' },
        { status: 400 }
      );
    }

    // 验证心情类型
    const validMoods = ['开心', '平静', '低落', '生气', '焦虑', '疲惫', '兴奋'];
    if (!validMoods.includes(moodType)) {
      return NextResponse.json(
        { error: '无效的心情类型' },
        { status: 400 }
      );
    }

    // 创建心情记录
    const mood = await prisma.moodRecord.create({
      data: {
        userId: userId,
        moodType: moodType,
        note: note || '',
        tags: tags ? (Array.isArray(tags) ? tags.join(',') : tags) : '',
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      },
    });

    console.log('心情打卡成功:', mood);

    return NextResponse.json(
      { 
        message: '打卡成功',
        mood: {
          id: mood.id,
          moodType: mood.moodType,
          note: mood.note,
          tags: mood.tags,
          date: mood.date,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('打卡失败:', error);
    return NextResponse.json(
      { error: '打卡失败，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: '用户 ID 不能为空' },
        { status: 400 }
      );
    }

    const moods = await prisma.moodRecord.findMany({
      where: {
        userId: parseInt(userId),
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(
      { 
        message: '获取成功',
        moods: moods,
        total: moods.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('获取失败:', error);
    return NextResponse.json(
      { error: '获取失败，请稍后重试' },
      { status: 500 }
    );
  }
}

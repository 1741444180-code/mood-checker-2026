// src/app/api/moods/route.ts
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // 从请求中获取查询参数
    const userId = request.nextUrl.searchParams.get('userId');
    const date = request.nextUrl.searchParams.get('date');

    // 构建查询条件
    const whereClause: any = {};
    if (userId) {
      const userIdNum = parseInt(userId as string, 10);
      if (isNaN(userIdNum)) {
        return Response.json({ error: 'Invalid User ID' }, { status: 400 });
      }
      whereClause.userId = userIdNum;
    }
    if (date) {
      whereClause.date = date;
    }

    const moods = await prisma.moodRecord.findMany({
      where: whereClause,
      include: {
        customMood: true, // 包含关联的自定义心情数据
      },
      orderBy: {
        date: 'desc',
      },
    });

    return Response.json(moods);
  } catch (error) {
    console.error('Error fetching moods:', error);
    return Response.json(
      { error: 'Failed to fetch mood records' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { userId, date, moodType, note, tags, customMoodId } = data;

    // 验证必需字段
    if (!userId || !date || !moodType) {
      return Response.json(
        { error: 'Missing required fields: userId, date, moodType' },
        { status: 400 }
      );
    }

    const userIdNum = parseInt(userId as string, 10);
    if (isNaN(userIdNum)) {
      return Response.json({ error: 'Invalid User ID' }, { status: 400 });
    }

    // 如果提供了 customMoodId，验证它是否存在且属于该用户
    let customMoodIdNum: number | null = null;
    if (customMoodId !== undefined && customMoodId !== null) {
      customMoodIdNum = parseInt(customMoodId as string, 10);
      if (isNaN(customMoodIdNum)) {
        return Response.json({ error: 'Invalid Custom Mood ID' }, { status: 400 });
      }

      // 验证自定义心情是否属于该用户
      const customMood = await prisma.customMood.findUnique({
        where: {
          id: customMoodIdNum,
          userId: userIdNum,
        },
      });

      if (!customMood) {
        return Response.json(
          { error: 'Custom mood not found or does not belong to user' },
          { status: 404 }
        );
      }
    }

    // 检查是否已存在今天的记录
    const existingMood = await prisma.moodRecord.findFirst({
      where: {
        userId: userIdNum,
        date: new Date(date),
      },
    });

    if (existingMood) {
      return Response.json(
        { error: 'Mood already recorded for this date' },
        { status: 409 }
      );
    }

    // 创建新心情记录
    const newMood = await prisma.moodRecord.create({
      data: {
        userId: userIdNum,
        date: new Date(date),
        moodLevel: 3, // 默认心情等级
        moodType,
        customMoodId: customMoodIdNum,
        note: note || null,
        tags: tags ? tags.join(',') : null, // 存储为逗号分隔的字符串
      },
      include: {
        customMood: true, // 返回关联的自定义心情数据
      },
    });

    return Response.json(newMood, { status: 201 });
  } catch (error) {
    console.error('Error creating mood entry:', error);
    return Response.json(
      { error: 'Failed to create mood entry' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
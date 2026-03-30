import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 获取当前会话用户
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // 从查询参数中获取过滤条件
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const includeCompleted = searchParams.get('includeCompleted');

    // 构建查询条件
    let whereClause: any = {
      userId: userId,
    };

    // 如果指定了开始日期，则只获取该日期之后的事件
    if (startDate) {
      whereClause.startTime = {
        gte: new Date(startDate),
      };
    }

    // 如果没有指定includeCompleted，则只获取未完成的事件
    if (includeCompleted !== 'true') {
      whereClause.completed = false;
    }

    // 如果指定了结束日期，则限制事件的开始时间在该日期之前
    if (endDate) {
      whereClause.startTime = {
        ...whereClause.startTime,
        lte: new Date(endDate),
      };
    }

    // 查询日历事件
    const events = await prisma.calendarEvent.findMany({
      where: whereClause,
      orderBy: {
        startTime: 'asc',
      },
    });

    return Response.json({ 
      success: true, 
      data: events 
    });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 获取当前会话用户
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // 解析请求体
    const body = await request.json();
    const { 
      title, 
      description, 
      startTime, 
      endTime, 
      location, 
      reminderMinutes,
      category,
      priority
    } = body;

    // 验证必要字段
    if (!title || !startTime) {
      return Response.json({ error: 'Title and startTime are required' }, { status: 400 });
    }

    // 创建日历事件
    const calendarEvent = await prisma.calendarEvent.create({
      data: {
        userId: userId,
        title: title.trim(),
        description: description?.trim() || '',
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        location: location?.trim() || '',
        reminderMinutes: reminderMinutes || 15,
        category: category || 'general',
        priority: priority || 'medium',
        completed: false,
      },
    });

    return Response.json({ 
      success: true, 
      data: calendarEvent 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT 方法用于更新日历事件
export async function PUT(request: NextRequest) {
  try {
    // 获取当前会话用户
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // 解析请求体
    const body = await request.json();
    const { id, title, description, startTime, endTime, location, reminderMinutes, category, priority, completed } = body;

    if (!id) {
      return Response.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // 验证事件是否属于当前用户
    const existingEvent = await prisma.calendarEvent.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!existingEvent) {
      return Response.json({ error: 'Event not found or unauthorized' }, { status: 404 });
    }

    // 更新日历事件
    const updatedEvent = await prisma.calendarEvent.update({
      where: {
        id: id,
      },
      data: {
        title: title?.trim(),
        description: description?.trim(),
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        location: location?.trim(),
        reminderMinutes: reminderMinutes,
        category: category,
        priority: priority,
        completed: completed,
        updatedAt: new Date(),
      },
    });

    return Response.json({ 
      success: true, 
      data: updatedEvent 
    });
  } catch (error) {
    console.error('Error updating calendar event:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE 方法用于删除日历事件
export async function DELETE(request: NextRequest) {
  try {
    // 获取当前会话用户
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // 从查询参数获取事件ID
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('id');

    if (!eventId) {
      return Response.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // 验证事件是否属于当前用户
    const existingEvent = await prisma.calendarEvent.findFirst({
      where: {
        id: eventId,
        userId: userId,
      },
    });

    if (!existingEvent) {
      return Response.json({ error: 'Event not found or unauthorized' }, { status: 404 });
    }

    // 删除日历事件
    await prisma.calendarEvent.delete({
      where: {
        id: eventId,
      },
    });

    return Response.json({ 
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    const { 
      emailNotifications, 
      pushNotifications, 
      smsNotifications,
      notificationFrequency,
      calendarReminders
    } = body;

    // 更新或创建通知设置
    const notificationSettings = await prisma.notificationSettings.upsert({
      where: {
        userId: userId,
      },
      update: {
        emailNotifications: Boolean(emailNotifications),
        pushNotifications: Boolean(pushNotifications),
        smsNotifications: Boolean(smsNotifications),
        notificationFrequency: notificationFrequency || 'immediate',
        calendarReminders: Boolean(calendarReminders),
        updatedAt: new Date(),
      },
      create: {
        userId: userId,
        emailNotifications: Boolean(emailNotifications),
        pushNotifications: Boolean(pushNotifications),
        smsNotifications: Boolean(smsNotifications),
        notificationFrequency: notificationFrequency || 'immediate',
        calendarReminders: Boolean(calendarReminders),
      },
    });

    return Response.json({ 
      success: true, 
      data: notificationSettings 
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // 获取当前会话用户
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // 获取通知设置
    const notificationSettings = await prisma.notificationSettings.findUnique({
      where: {
        userId: userId,
      },
    });

    return Response.json({ 
      success: true, 
      data: notificationSettings || null 
    });
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { markAsReadAndNotify } from '@/lib/websocket';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationIds, userId } = body;

    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return Response.json({ error: 'Notification IDs are required and must be an array' }, { status: 400 });
    }

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 使用辅助函数标记为已读并通知用户
    const result = await markAsReadAndNotify(userId, notificationIds);

    return Response.json({
      success: true,
      message: `${result.count} notifications marked as read`,
      count: result.count,
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return Response.json({ error: 'Failed to mark notifications as read' }, { status: 500 });
  }
}
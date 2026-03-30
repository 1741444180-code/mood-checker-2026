import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/messages/read - 标记消息为已读
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, messageIds } = body;

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      // 如果没有提供特定消息ID，则标记所有未读消息为已读
      const updatedMessages = await prisma.notification.updateMany({
        where: {
          userId: userId,
          read: false,
        },
        data: {
          read: true,
          readAt: new Date(),
        },
      });

      return Response.json({ 
        message: `${updatedMessages.count} unread message(s) marked as read`,
        updatedCount: updatedMessages.count
      });
    }

    // 标记指定的消息为已读
    const updatedMessages = await prisma.notification.updateMany({
      where: {
        id: {
          in: messageIds,
        },
        userId: userId,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return Response.json({ 
      message: `${updatedMessages.count} message(s) marked as read`,
      updatedCount: updatedMessages.count
    });
  } catch (error) {
    console.error('Error updating message read status:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
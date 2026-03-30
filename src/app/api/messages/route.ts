import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/messages - 获取消息列表
export async function GET(req: NextRequest) {
  try {
    // 在实际应用中，这里应该是认证用户的方法
    // 为了演示，我们直接从查询参数获取userId
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 获取用户的消息，按时间倒序排列
    const messages = await prisma.notification.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // 限制返回最多50条消息
    });

    return Response.json({ messages, count: messages.length });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/messages - 删除消息
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, messageIds } = body;

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return Response.json({ error: 'Message IDs are required and must be an array' }, { status: 400 });
    }

    // 删除指定的消息（确保属于该用户）
    const deletedMessages = await prisma.notification.deleteMany({
      where: {
        id: {
          in: messageIds,
        },
        userId: userId,
      },
    });

    return Response.json({ 
      message: `${deletedMessages.count} message(s) deleted successfully`,
      deletedCount: deletedMessages.count
    });
  } catch (error) {
    console.error('Error deleting messages:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/friends/accept - 接受好友请求
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { requestId, action } = body; // action 默认为 'accept'，也可以是 'reject'

    if (!requestId) {
      return Response.json({ error: 'Request ID is required' }, { status: 400 });
    }

    // 确保 action 是有效的值
    const validAction = action === 'reject' ? 'reject' : 'accept'; // 默认接受

    // 获取请求信息
    const request = await prisma.friendRequest.findUnique({
      where: { id: requestId },
      include: {
        sender: true,
        receiver: true
      }
    });

    if (!request) {
      return Response.json({ error: 'Friend request not found' }, { status: 404 });
    }

    if (request.status !== 'pending') {
      return Response.json({ error: 'Friend request is not pending' }, { status: 400 });
    }

    // 更新请求状态
    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: validAction === 'accept' ? 'accepted' : 'rejected' }
    });

    if (validAction === 'accept') {
      // 创建好友关系（双向）
      await prisma.friendship.create({
        data: {
          userId: request.senderId,
          friendId: request.receiverId
        }
      });

      // 同时创建反向关系，确保双方都能看到对方为好友
      await prisma.friendship.create({
        data: {
          userId: request.receiverId,
          friendId: request.senderId
        }
      });
      
      // 创建系统通知告知发送方好友请求已被接受
      await prisma.notification.create({
        data: {
          userId: request.senderId,
          title: '好友请求已接受',
          content: `${request.receiver.username} 接受了您的好友请求`,
          type: 'friend_request_accepted',
          read: false
        }
      });
    }

    // 创建系统通知告知接收方他们现在是好友了（如果是接受的话）
    if (validAction === 'accept') {
      await prisma.notification.create({
        data: {
          userId: request.receiverId,
          title: '好友请求已处理',
          content: `您和 ${request.sender.username} 现在是好友了！`,
          type: 'friend_request_accepted',
          read: false
        }
      });
    } else {
      // 如果是拒绝，也创建通知
      await prisma.notification.create({
        data: {
          userId: request.senderId,
          title: '好友请求被拒绝',
          content: `${request.receiver.username} 拒绝了您的好友请求`,
          type: 'friend_request_rejected',
          read: false
        }
      });
    }

    const actionText = validAction === 'accept' ? 'accepted' : 'rejected';
    return Response.json({ message: `Friend request ${actionText} successfully` });
  } catch (error) {
    console.error('Error responding to friend request:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
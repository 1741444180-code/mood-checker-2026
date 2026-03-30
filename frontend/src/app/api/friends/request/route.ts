import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/friends/request - 发送好友请求
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { senderId, receiverId } = body;

    if (!senderId || !receiverId) {
      return Response.json({ error: 'Sender ID and Receiver ID are required' }, { status: 400 });
    }

    if (senderId === receiverId) {
      return Response.json({ error: 'Cannot send friend request to yourself' }, { status: 400 });
    }

    // 检查是否已经是好友
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: senderId, friendId: receiverId },
          { userId: receiverId, friendId: senderId }
        ]
      }
    });

    if (existingFriendship) {
      return Response.json({ error: 'Users are already friends' }, { status: 409 });
    }

    // 检查是否已发送过好友请求
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId } // 检查反向请求
        ]
      }
    });

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        return Response.json({ error: 'Friend request already exists' }, { status: 409 });
      } else if (existingRequest.status === 'rejected') {
        // 如果之前被拒绝，允许重新发送
        await prisma.friendRequest.update({
          where: { id: existingRequest.id },
          data: { status: 'pending' }
        });
        
        return Response.json({ message: 'Friend request re-sent successfully' });
      }
    } else {
      // 创建新的好友请求
      await prisma.friendRequest.create({
        data: {
          senderId,
          receiverId,
          status: 'pending'
        }
      });
    }

    return Response.json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
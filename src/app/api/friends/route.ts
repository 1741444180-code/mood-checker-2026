import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/friends - 获取好友列表
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 获取用户的所有好友（双向关系）
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId: userId },
          { friendId: userId }
        ],
        // 确保只获取已接受的好友关系
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            coins: true
          }
        },
        friend: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            coins: true
          }
        }
      }
    });

    // 整理好友数据，确保返回的是用户的实际好友（而非用户自己）
    const friends = friendships
      .map(friendship => {
        // 如果 userId 是 friendship.userId，则好友是 friend
        // 如果 userId 是 friendship.friendId，则好友是 user
        if (friendship.userId === userId) {
          return friendship.friend;
        } else if (friendship.friendId === userId) {
          return friendship.user;
        }
        return null;
      })
      .filter(Boolean); // 移除可能的 null 值

    return Response.json({ friends, count: friends.length });
  } catch (error) {
    console.error('Error fetching friends:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
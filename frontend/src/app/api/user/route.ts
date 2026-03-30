import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session'; // 假设我们有会话管理

export async function GET(request: NextRequest) {
  try {
    // 获取当前用户ID (这里假设通过会话获取)
    const session = await getSession();
    if (!session?.userId) {
      return Response.json({ 
        success: false, 
        message: '未登录或会话无效' 
      }, { status: 401 });
    }

    const userId = session.userId;

    // 查询用户已获得的徽章
    const userBadges = await prisma.userBadge.findMany({
      where: {
        userId: userId,
      },
      include: {
        badge: true, // 包含徽章详细信息
      },
      orderBy: [
        { badge: { rarity: 'asc' } },
        { unlockedAt: 'desc' }
      ]
    });

    // 返回用户拥有的徽章
    const badgesWithUnlockInfo = userBadges.map(userBadge => ({
      ...userBadge.badge,
      unlockedAt: userBadge.unlockedAt,
    }));

    return Response.json({ 
      success: true, 
      data: badgesWithUnlockInfo,
      message: '用户徽章获取成功'
    });
  } catch (error) {
    console.error('获取用户徽章失败:', error);
    return Response.json({ 
      success: false, 
      message: '获取用户徽章失败' 
    }, { status: 500 });
  }
}
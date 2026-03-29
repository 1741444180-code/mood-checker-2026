import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session'; // 假设我们有会话管理

export async function POST(request: NextRequest) {
  try {
    // 获取当前用户ID
    const session = await getSession();
    if (!session?.userId) {
      return Response.json({ 
        success: false, 
        message: '未登录或会话无效' 
      }, { status: 401 });
    }

    const userId = session.userId;
    
    // 从请求体获取徽章ID
    const body = await request.json();
    const { badgeId } = body;

    if (!badgeId) {
      return Response.json({ 
        success: false, 
        message: '缺少徽章ID' 
      }, { status: 400 });
    }

    // 检查徽章是否存在
    const badge = await prisma.badge.findUnique({
      where: { id: badgeId }
    });

    if (!badge) {
      return Response.json({ 
        success: false, 
        message: '徽章不存在' 
      }, { status: 404 });
    }

    // 检查用户是否已经拥有该徽章
    const existingUserBadge = await prisma.userBadge.findFirst({
      where: {
        userId: userId,
        badgeId: badgeId,
      }
    });

    if (existingUserBadge) {
      return Response.json({ 
        success: false, 
        message: '用户已经拥有该徽章' 
      }, { status: 400 });
    }

    // 创建用户徽章记录
    const newUserBadge = await prisma.userBadge.create({
      data: {
        userId: userId,
        badgeId: badgeId,
      },
      include: {
        badge: true
      }
    });

    return Response.json({ 
      success: true, 
      data: {
        badge: newUserBadge.badge,
        unlockedAt: newUserBadge.unlockedAt
      },
      message: '徽章解锁成功'
    });
  } catch (error) {
    console.error('解锁徽章失败:', error);
    return Response.json({ 
      success: false, 
      message: '解锁徽章失败' 
    }, { status: 500 });
  }
}
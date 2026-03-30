import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/notifications/read-all - 标记所有通知为已读
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const now = new Date();

    // 更新该用户所有未读通知为已读
    const result = await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        read: false,
      },
      data: {
        read: true,
        readAt: now,
      },
    });

    return NextResponse.json({
      success: true,
      message: `已标记 ${result.count} 条通知为已读`,
      count: result.count,
    });
  } catch (error) {
    console.error('标记所有通知已读失败:', error);
    return NextResponse.json(
      { error: '操作失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications/read-all - 清空所有已读通知
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    // 删除该用户所有已读通知
    const result = await prisma.notification.deleteMany({
      where: {
        userId: session.user.id,
        read: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `已删除 ${result.count} 条已读通知`,
      count: result.count,
    });
  } catch (error) {
    console.error('清空已读通知失败:', error);
    return NextResponse.json(
      { error: '操作失败' },
      { status: 500 }
    );
  }
}

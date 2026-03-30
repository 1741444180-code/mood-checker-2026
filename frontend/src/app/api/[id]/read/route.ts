import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/notifications/[id]/read - 标记单个通知为已读
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const notification = await prisma.notification.findUnique({
      where: { id: params.id },
    });

    if (!notification) {
      return NextResponse.json({ error: '通知不存在' }, { status: 404 });
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json({ error: '无权操作' }, { status: 403 });
    }

    const updated = await prisma.notification.update({
      where: { id: params.id },
      data: { read: true, readAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: '通知已标记为已读',
      data: updated,
    });
  } catch (error) {
    console.error('标记通知已读失败:', error);
    return NextResponse.json(
      { error: '标记通知失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications/[id]/read - 标记为未读
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const notification = await prisma.notification.findUnique({
      where: { id: params.id },
    });

    if (!notification) {
      return NextResponse.json({ error: '通知不存在' }, { status: 404 });
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json({ error: '无权操作' }, { status: 403 });
    }

    const updated = await prisma.notification.update({
      where: { id: params.id },
      data: { read: false, readAt: null },
    });

    return NextResponse.json({
      success: true,
      message: '通知已标记为未读',
      data: updated,
    });
  } catch (error) {
    console.error('标记通知未读失败:', error);
    return NextResponse.json(
      { error: '操作失败' },
      { status: 500 }
    );
  }
}

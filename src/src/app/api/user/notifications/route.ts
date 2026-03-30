// src/app/api/user/notifications/route.ts
import { NextRequest } from 'next/server'

// 模拟用户通知数据
const mockNotifications = [
  { id: 1, userId: 'user1', type: 'mood_reminder', title: '记得打卡', message: '今天还没有记录心情哦，花一分钟记录一下吧！', read: false, createdAt: '2026-03-28T08:00:00Z' },
  { id: 2, userId: 'user1', type: 'comment', title: '有人评论了你的心情', message: 'user2 评论了你3月27日的心情："读书是个好习惯"', read: false, createdAt: '2026-03-28T09:30:00Z' },
  { id: 3, userId: 'user1', type: 'streak', title: '连续打卡奖励', message: '恭喜你连续打卡7天！继续保持好习惯。', read: true, createdAt: '2026-03-27T21:00:00Z' },
  { id: 4, userId: 'user1', type: 'weekly_summary', title: '本周心情总结', message: '本周你的心情以平静和开心为主，焦虑情绪有所减少。', read: true, createdAt: '2026-03-27T10:00:00Z' },
];

export async function GET(request: NextRequest) {
  try {
    // 从请求头获取认证信息
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 从查询参数获取过滤条件
    const type = request.nextUrl.searchParams.get('type');
    const readStatus = request.nextUrl.searchParams.get('read'); // 'read', 'unread', or undefined for all
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');

    // 过滤通知
    let filteredNotifications = mockNotifications;
    
    if (type) {
      filteredNotifications = filteredNotifications.filter(notification => notification.type === type);
    }
    
    if (readStatus === 'read') {
      filteredNotifications = filteredNotifications.filter(notification => notification.read === true);
    } else if (readStatus === 'unread') {
      filteredNotifications = filteredNotifications.filter(notification => notification.read === false);
    }

    // 排序（按时间倒序）
    filteredNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // 分页
    const paginatedNotifications = filteredNotifications.slice(offset, offset + limit);

    // 计算未读通知数量
    const unreadCount = filteredNotifications.filter(n => !n.read).length;

    return Response.json({
      notifications: paginatedNotifications,
      total: filteredNotifications.length,
      unreadCount,
      hasNext: offset + limit < filteredNotifications.length,
      nextOffset: offset + limit < filteredNotifications.length ? offset + limit : null,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get notifications' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { notificationIds, markAsRead } = data;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return Response.json(
        { error: 'Notification IDs array is required' },
        { status: 400 }
      );
    }

    // 更新通知状态
    let updatedCount = 0;
    notificationIds.forEach(id => {
      const notification = mockNotifications.find(n => n.id === id);
      if (notification) {
        notification.read = markAsRead !== undefined ? markAsRead : true;
        updatedCount++;
      }
    });

    return Response.json({
      success: true,
      updatedCount,
      message: `Marked ${updatedCount} notifications as ${markAsRead ? 'read' : 'unread'}`,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}
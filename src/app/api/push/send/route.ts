import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// 模拟订阅数据结构
interface PushSubscription {
  id: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userId?: string;
  createdAt: string;
}

// 模拟通知数据结构
interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  userId: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// 模拟存储（实际项目中应该连接数据库）
let mockSubscriptions: PushSubscription[] = [
  {
    id: 'sub_test_1',
    endpoint: 'https://fcm.googleapis.com/fcm/send/test_endpoint',
    keys: {
      p256dh: 'test_p256dh_key',
      auth: 'test_auth_key',
    },
    userId: 'user1',
    createdAt: new Date().toISOString(),
  }
];

let mockNotifications: Notification[] = [];

// 模拟推送通知函数
async function sendWebPush(subscription: PushSubscription, title: string, body: string, data?: any) {
  // 这里是模拟推送逻辑，在实际项目中应使用 web-push 库
  console.log(`向用户推送消息:`, {
    endpoint: subscription.endpoint,
    title,
    body,
    data
  });

  // 模拟推送成功
  return Promise.resolve({ success: true });
}

export async function POST(request: NextRequest) {
  try {
    const { userId, title, body, data }: { 
      userId: string; 
      title: string; 
      body: string; 
      data?: any; 
    } = await request.json();

    // 验证必要参数
    if (!userId || !title || !body) {
      return NextResponse.json(
        { error: 'userId, title 和 body 是必需的' },
        { status: 400 }
      );
    }

    // 查找用户的订阅信息
    const userSubscriptions = mockSubscriptions.filter(sub => sub.userId === userId);
    
    if (userSubscriptions.length === 0) {
      return NextResponse.json(
        { error: '用户未订阅推送通知' },
        { status: 404 }
      );
    }

    // 发送推送通知
    const sendPromises = userSubscriptions.map(subscription => 
      sendWebPush(subscription, title, body, data)
    );

    // 等待所有推送完成
    const results = await Promise.allSettled(sendPromises);
    
    // 统计成功和失败的数量
    const successfulSends = results.filter(result => result.status === 'fulfilled').length;
    const failedSends = results.filter(result => result.status === 'rejected').length;

    // 创建通知记录
    const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      id: notificationId,
      title,
      body,
      type: 'push',
      userId,
      isRead: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockNotifications.push(newNotification);

    console.log(`推送通知结果: 成功 ${successfulSends}, 失败 ${failedSends}`);

    return NextResponse.json({
      success: successfulSends > 0,
      message: `推送通知完成，成功 ${successfulSends} 次，失败 ${failedSends} 次`,
    });
  } catch (error) {
    console.error('发送推送通知失败:', error);
    return NextResponse.json(
      { error: '发送推送通知失败' },
      { status: 500 }
    );
  }
}
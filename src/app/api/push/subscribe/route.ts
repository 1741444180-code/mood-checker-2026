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

// 模拟存储（实际项目中应该连接数据库）
let mockSubscriptions: PushSubscription[] = [];

export async function POST(request: NextRequest) {
  try {
    const { endpoint, keys, userId }: { 
      endpoint: string; 
      keys: { p256dh: string; auth: string }; 
      userId?: string; 
    } = await request.json();

    // 验证必要参数
    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return NextResponse.json(
        { error: 'endpoint 和 keys (p256dh, auth) 是必需的' },
        { status: 400 }
      );
    }

    // 创建订阅记录
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newSubscription: PushSubscription = {
      id: subscriptionId,
      endpoint,
      keys: {
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
      userId: userId || '',
      createdAt: new Date().toISOString(),
    };

    mockSubscriptions.push(newSubscription);

    return NextResponse.json({
      success: true,
      subscriptionId: subscriptionId,
      message: '推送订阅成功',
    });
  } catch (error) {
    console.error('推送订阅失败:', error);
    return NextResponse.json(
      { error: '推送订阅失败' },
      { status: 500 }
    );
  }
}
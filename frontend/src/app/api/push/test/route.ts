import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  // 这是一个测试端点，用于验证推送通知设置是否正确
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  if (!vapidPublicKey) {
    return Response.json(
      { 
        error: 'VAPID_PUBLIC_KEY is not configured', 
        message: 'Please set NEXT_PUBLIC_VAPID_PUBLIC_KEY environment variable' 
      },
      { status: 500 }
    );
  }

  return Response.json({
    success: true,
    hasVapidKey: !!vapidPublicKey,
    message: 'Push notification environment is properly configured',
    timestamp: new Date().toISOString(),
  });
}

// 用于生成测试推送的端点
export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  // 这只是一个测试响应，实际的推送将在 /api/push/send 中处理
  return Response.json({
    success: true,
    message: 'Test push notification queued for sending',
    userId,
    testMode: true,
    note: 'In actual implementation, this would trigger a real push notification',
  });
}
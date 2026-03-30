import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/payment/create
 * 创建支付订单
 * 
 * Request Body:
 * {
 *   levelId: string;
 *   amount: number;
 *   method: 'wechat' | 'alipay' | 'bank';
 *   phone: string;
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { levelId, amount, method, phone } = body;

    // 验证必填参数
    if (!levelId || !amount || !method) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必填参数',
        },
        { status: 400 }
      );
    }

    // 验证支付方式
    const validMethods = ['wechat', 'alipay', 'bank'];
    if (!validMethods.includes(method)) {
      return NextResponse.json(
        {
          success: false,
          error: '不支持的支付方式',
        },
        { status: 400 }
      );
    }

    // 生成订单号
    const orderId = generateOrderId();

    // TODO: 调用支付平台 API 创建订单
    // const paymentResponse = await callPaymentProvider({
    //   orderId,
    //   amount,
    //   method,
    //   phone,
    // });

    // 模拟支付平台响应
    const payUrl = `https://payment.example.com/pay?order_id=${orderId}`;

    // 保存订单到数据库
    // await saveOrder({
    //   orderId,
    //   levelId,
    //   amount,
    //   method,
    //   phone,
    //   status: 'pending',
    //   createdAt: Date.now(),
    // });

    // 模拟 API 响应时间 < 200ms
    await new Promise(resolve => setTimeout(resolve, 80));

    return NextResponse.json({
      success: true,
      orderId,
      payUrl,
      amount,
      method,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 分钟后过期
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      {
        success: false,
        error: '创建支付订单失败',
      },
      { status: 500 }
    );
  }
}

/**
 * 生成订单号
 * 格式：PAY + 时间戳 + 随机数
 */
function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PAY${timestamp}${random}`;
}

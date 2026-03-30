import { NextResponse } from 'next/server';

/**
 * POST /api/payment/callback
 * 支付回调处理
 * 
 * 接收支付平台的异步通知，验证签名并更新订单状态
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      transactionId,
      amount,
      status,
      sign,
      timestamp,
    } = body;

    // 验证必填参数
    if (!orderId || !status || !sign) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必填参数',
        },
        { status: 400 }
      );
    }

    // TODO: 验证签名
    // const validSign = verifySign(body, process.env.PAYMENT_SECRET_KEY);
    // if (!validSign) {
    //   return NextResponse.json(
    //     { success: false, error: '签名验证失败' },
    //     { status: 400 }
    //   );
    // }

    // 验证签名通过（模拟）
    console.log('Payment callback received:', { orderId, status, amount });

    // 查询订单
    // const order = await getOrderById(orderId);
    // if (!order) {
    //   return NextResponse.json(
    //     { success: false, error: '订单不存在' },
    //     { status: 404 }
    //   );
    // }

    // 处理支付结果
    if (status === 'SUCCESS' || status === 'PAID') {
      // TODO: 更新订单状态
      // await updateOrderStatus(orderId, 'paid', {
      //   transactionId,
      //   paidAt: Date.now(),
      // });

      // TODO: 激活会员
      // await activateVip(order.userId, order.levelId);

      console.log('Payment successful, VIP activated:', orderId);
    } else if (status === 'FAILED' || status === 'CANCELLED') {
      // TODO: 更新订单状态为失败
      // await updateOrderStatus(orderId, 'failed');
      console.log('Payment failed:', orderId);
    }

    // 模拟处理时间
    await new Promise(resolve => setTimeout(resolve, 50));

    // 返回成功响应给支付平台
    return NextResponse.json({
      success: true,
      message: '回调处理成功',
    });
  } catch (error) {
    console.error('Error handling payment callback:', error);
    return NextResponse.json(
      {
        success: false,
        error: '回调处理失败',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payment/callback
 * 支付结果查询（同步通知）
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order_id');

  if (!orderId) {
    return NextResponse.json(
      { success: false, error: '缺少订单号' },
      { status: 400 }
    );
  }

  try {
    // TODO: 查询订单状态
    // const order = await getOrderById(orderId);
    
    // 模拟订单数据
    const order = {
      orderId,
      status: 'paid',
      amount: 19,
      levelId: 'vip',
    };

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error querying payment:', error);
    return NextResponse.json(
      {
        success: false,
        error: '查询失败',
      },
      { status: 500 }
    );
  }
}

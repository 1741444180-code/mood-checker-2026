import { NextResponse } from 'next/server';

/**
 * GET /api/vip/levels
 * 获取会员等级列表
 */
export async function GET() {
  try {
    const levels = [
      {
        id: 'free',
        name: '普通会员',
        price: 0,
        period: '永久',
        features: [
          '每日心情打卡',
          '7 天心情趋势',
          '3 款基础主题',
          '基础数据统计',
        ],
        popular: false,
      },
      {
        id: 'vip',
        name: 'VIP 会员',
        price: 19,
        period: '月',
        features: [
          '所有普通会员权益',
          '30 天心情趋势',
          '15 款精选主题',
          '高级数据分析',
          '导出心情报告',
          '无广告体验',
        ],
        popular: true,
      },
      {
        id: 'svip',
        name: 'SVIP 会员',
        price: 49,
        period: '月',
        features: [
          '所有 VIP 会员权益',
          '无限心情趋势',
          '50+ 款专属主题',
          'AI 心情分析',
          '优先客服支持',
          '专属身份标识',
        ],
        popular: false,
      },
    ];

    // 模拟 API 响应时间 < 200ms
    await new Promise(resolve => setTimeout(resolve, 50));

    return NextResponse.json({
      success: true,
      levels,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching VIP levels:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取会员等级失败',
      },
      { status: 500 }
    );
  }
}

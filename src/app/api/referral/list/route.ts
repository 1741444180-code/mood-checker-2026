import { NextRequest, NextResponse } from 'next/server';

/**
 * 邀请列表 API
 * GET /api/referral/list?userId=xxx&page=1&pageSize=20
 * 
 * 响应：
 * {
 *   success: boolean,
 *   data: {
 *     list: Array<{
 *       id: string,
 *       newUserId: string,
 *       newUserAvatar?: string,
 *       newUserNickname?: string,
 *       registeredAt: string,
 *       status: 'registered' | 'active' | 'rewarded',
 *       rewardPoints: number
 *     }>,
 *     total: number,
 *     page: number,
 *     pageSize: number
 *   },
 *   message: string
 * }
 */

// 模拟数据库
interface ReferralRecord {
  id: string;
  inviterId: string;
  newUserId: string;
  newUserAvatar?: string;
  newUserNickname?: string;
  registeredAt: Date;
  status: 'registered' | 'active' | 'rewarded';
  rewardPoints: number;
}

// 内存存储（开发测试用）
const referrals: ReferralRecord[] = [
  {
    id: '1',
    inviterId: 'user_mahuateng',
    newUserId: 'user_001',
    newUserAvatar: '👤',
    newUserNickname: '小明',
    registeredAt: new Date(Date.now() - 86400000 * 3), // 3 天前
    status: 'rewarded',
    rewardPoints: 100
  },
  {
    id: '2',
    inviterId: 'user_mahuateng',
    newUserId: 'user_002',
    newUserAvatar: '👤',
    newUserNickname: '小红',
    registeredAt: new Date(Date.now() - 86400000), // 1 天前
    status: 'rewarded',
    rewardPoints: 100
  },
  {
    id: '3',
    inviterId: 'user_mahuateng',
    newUserId: 'user_003',
    newUserAvatar: '👤',
    newUserNickname: '小刚',
    registeredAt: new Date(Date.now() - 3600000 * 2), // 2 小时前
    status: 'active',
    rewardPoints: 100
  }
];

/**
 * 查询邀请列表
 */
async function queryReferrals(
  userId: string,
  page: number,
  pageSize: number
): Promise<{ list: ReferralRecord[]; total: number }> {
  // TODO: 实际应从数据库查询
  // const [list, total] = await Promise.all([
  //   db.referral.findMany({
  //     where: { inviterId: userId },
  //     skip: (page - 1) * pageSize,
  //     take: pageSize,
  //     orderBy: { registeredAt: 'desc' },
  //     include: { newUser: { select: { avatar: true, nickname: true } } }
  //   }),
  //   db.referral.count({ where: { inviterId: userId } })
  // ]);

  const filtered = referrals.filter(r => r.inviterId === userId);
  const total = filtered.length;
  const list = filtered.slice((page - 1) * pageSize, page * pageSize);

  return { list, total };
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    // 参数验证
    if (!userId) {
      return NextResponse.json(
        { success: false, message: '用户 ID 不能为空' },
        { status: 400 }
      );
    }

    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { success: false, message: '分页参数无效' },
        { status: 400 }
      );
    }

    // 查询邀请列表
    const { list, total } = await queryReferrals(userId, page, pageSize);

    const duration = Date.now() - startTime;
    console.log(`[Referral] List queried in ${duration}ms: ${total} total`);

    return NextResponse.json({
      success: true,
      data: {
        list: list.map(item => ({
          id: item.id,
          newUserId: item.newUserId,
          newUserAvatar: item.newUserAvatar,
          newUserNickname: item.newUserNickname,
          registeredAt: item.registeredAt.toISOString(),
          status: item.status,
          rewardPoints: item.rewardPoints
        })),
        total,
        page,
        pageSize
      },
      message: '查询成功'
    });

  } catch (error) {
    console.error('[Referral] List error:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { success: false, message: '请使用 GET 方法' },
    { status: 405 }
  );
}

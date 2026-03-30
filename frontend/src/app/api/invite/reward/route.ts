import { NextRequest, NextResponse } from 'next/server';

/**
 * 奖励发放 API
 * POST /api/invite/reward
 * 
 * 请求体：
 * {
 *   inviterId: string - 邀请人 ID
 *   newUserId: string - 新用户 ID
 *   action: 'register' | 'complete_profile' | 'first_checkin' - 触发动作
 * }
 * 
 * 响应：
 * {
 *   success: boolean,
 *   reward: {
 *     points: number - 积分，
 *     badge?: string - 勋章
 *   },
 *   message: string
 * }
 */

// 奖励配置
const REWARD_CONFIG = {
  register: {
    points: 100,
    badge: null
  },
  complete_profile: {
    points: 50,
    badge: null
  },
  first_checkin: {
    points: 50,
    badge: null
  }
};

// 里程碑奖励
const MILESTONE_REWARDS = [
  { count: 1, points: 0, badge: '新人勋章' },
  { count: 5, points: 500, badge: '达人勋章' },
  { count: 10, points: 1000, badge: '大师勋章' },
  { count: 20, points: 2000, badge: '火热勋章' },
  { count: 50, points: 5000, badge: '钻石勋章' },
  { count: 100, points: 10000, badge: '传奇勋章' }
];

// 模拟数据库
interface UserReward {
  userId: string;
  totalPoints: number;
  inviteCount: number;
  badges: string[];
}

const userRewards = new Map<string, UserReward>();

// 初始化测试数据
userRewards.set('user_mahuateng', {
  userId: 'user_mahuateng',
  totalPoints: 1250,
  inviteCount: 3,
  badges: ['新人勋章']
});

/**
 * 获取用户奖励信息
 */
async function getUserReward(userId: string): Promise<UserReward | null> {
  // TODO: 实际应从数据库查询
  return userRewards.get(userId) || null;
}

/**
 * 更新用户奖励
 */
async function updateUserReward(userId: string, points: number, badge?: string): Promise<UserReward> {
  let reward = userRewards.get(userId);
  
  if (!reward) {
    reward = {
      userId,
      totalPoints: 0,
      inviteCount: 0,
      badges: []
    };
  }

  reward.totalPoints += points;
  if (badge && !reward.badges.includes(badge)) {
    reward.badges.push(badge);
  }

  // TODO: 实际应保存到数据库
  // await db.userReward.upsert({
  //   where: { userId },
  //   update: { totalPoints: reward.totalPoints, badges: reward.badges },
  //   create: reward
  // });

  userRewards.set(userId, reward);
  return reward;
}

/**
 * 增加邀请计数
 */
async function incrementInviteCount(userId: string): Promise<number> {
  let reward = userRewards.get(userId);
  
  if (!reward) {
    reward = {
      userId,
      totalPoints: 0,
      inviteCount: 0,
      badges: []
    };
  }

  reward.inviteCount += 1;
  userRewards.set(userId, reward);

  // TODO: 实际应保存到数据库
  return reward.inviteCount;
}

/**
 * 检查并发放里程碑奖励
 */
function checkMilestone(count: number) {
  const milestone = MILESTONE_REWARDS.filter(m => m.count === count)[0];
  if (milestone) {
    return {
      points: milestone.points,
      badge: milestone.badge
    };
  }
  return { points: 0, badge: null };
}

/**
 * 记录奖励流水
 */
async function logRewardRecord(
  userId: string,
  points: number,
  badge: string | null,
  source: string,
  sourceUserId: string
): Promise<void> {
  // TODO: 实际应保存到奖励流水表
  // await db.rewardLog.create({
  //   data: {
  //     userId,
  //     points,
  //     badge,
  //     source,
  //     sourceUserId,
  //     createdAt: new Date()
  //   }
  // });
  console.log(`[Reward] ${userId} got ${points} points${badge ? ' + ' + badge : ''} from ${source} (${sourceUserId})`);
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { inviterId, newUserId, action } = body;

    // 参数验证
    if (!inviterId || !newUserId || !action) {
      return NextResponse.json(
        { success: false, message: '参数不完整' },
        { status: 400 }
      );
    }

    // 验证动作类型
    if (!REWARD_CONFIG[action as keyof typeof REWARD_CONFIG]) {
      return NextResponse.json(
        { success: false, message: '无效的动作类型' },
        { status: 400 }
      );
    }

    const baseReward = REWARD_CONFIG[action as keyof typeof REWARD_CONFIG];
    
    // 发放基础奖励
    let totalPoints = baseReward.points;
    let badge: string | null = baseReward.badge;

    // 如果是注册动作，增加邀请计数并检查里程碑
    if (action === 'register') {
      const newCount = await incrementInviteCount(inviterId);
      const milestone = checkMilestone(newCount);
      
      if (milestone.points > 0) {
        totalPoints += milestone.points;
      }
      if (milestone.badge) {
        badge = milestone.badge;
      }
    }

    // 更新用户奖励
    await updateUserReward(inviterId, totalPoints, badge || undefined);

    // 记录奖励流水
    await logRewardRecord(
      inviterId,
      totalPoints,
      badge,
      action,
      newUserId
    );

    const duration = Date.now() - startTime;
    console.log(`[Reward] Issued in ${duration}ms: ${inviterId} got ${totalPoints} points`);

    return NextResponse.json({
      success: true,
      reward: {
        points: totalPoints,
        badge: badge || undefined
      },
      message: '奖励发放成功'
    });

  } catch (error) {
    console.error('[Reward] Error:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, message: '请使用 POST 方法' },
    { status: 405 }
  );
}

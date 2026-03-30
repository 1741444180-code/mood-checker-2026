import { NextRequest, NextResponse } from 'next/server';

/**
 * 验证邀请码 API
 * POST /api/invite/verify
 * 
 * 请求体：
 * {
 *   code: string - 邀请码
 *   newUserId: string - 新用户 ID
 * }
 * 
 * 响应：
 * {
 *   success: boolean,
 *   valid: boolean - 是否有效，
 *   inviterId?: string - 邀请人 ID，
 *   message: string
 * }
 */

// 模拟数据库（实际应使用真实数据库）
interface InviteCodeRecord {
  code: string;
  userId: string;
  createdAt: Date;
}

// 内存存储（开发测试用）
const inviteCodes = new Map<string, InviteCodeRecord>();
const usedByUsers = new Set<string>(); // 已使用过邀请码的用户

// 初始化一些测试数据
inviteCodes.set('MH2026', { code: 'MH2026', userId: 'user_mahuateng', createdAt: new Date() });
inviteCodes.set('TEST01', { code: 'TEST01', userId: 'user_test1', createdAt: new Date() });
inviteCodes.set('TEST02', { code: 'TEST02', userId: 'user_test2', createdAt: new Date() });

/**
 * 从数据库查询邀请码
 */
async function findInviteCode(code: string): Promise<InviteCodeRecord | null> {
  // TODO: 实际应从数据库查询
  // return await db.inviteCode.findUnique({ where: { code } });
  return inviteCodes.get(code) || null;
}

/**
 * 检查用户是否已使用过邀请码
 */
async function hasUserUsedInvite(userId: string): Promise<boolean> {
  // TODO: 实际应从数据库查询
  // const record = await db.user.findUnique({
  //   where: { id: userId },
  //   select: { invitedBy: true }
  // });
  // return !!record?.invitedBy;
  return usedByUsers.has(userId);
}

/**
 * 绑定邀请关系
 */
async function bindReferral(newUserId: string, inviterId: string): Promise<void> {
  // TODO: 实际应保存到数据库
  // await db.user.update({
  //   where: { id: newUserId },
  //   data: { invitedBy: inviterId }
  // });
  // await db.referral.create({
  //   data: {
  //     inviterId,
  //     newUserId,
  //     createdAt: new Date()
  //   }
  // });
  usedByUsers.add(newUserId);
  console.log(`[Referral] Bound: ${newUserId} invited by ${inviterId}`);
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { code, newUserId } = body;

    // 参数验证
    if (!code || !newUserId) {
      return NextResponse.json(
        { 
          success: false, 
          valid: false,
          message: '邀请码和用户 ID 不能为空' 
        },
        { status: 400 }
      );
    }

    // 检查用户是否已使用过邀请码
    if (await hasUserUsedInvite(newUserId)) {
      return NextResponse.json(
        { 
          success: true, 
          valid: false,
          message: '您已使用过邀请码' 
        }
      );
    }

    // 验证邀请码
    const inviteRecord = await findInviteCode(code);
    
    if (!inviteRecord) {
      return NextResponse.json(
        { 
          success: true, 
          valid: false,
          message: '邀请码无效' 
        }
      );
    }

    // 不能用自己的邀请码邀请自己
    if (inviteRecord.userId === newUserId) {
      return NextResponse.json(
        { 
          success: true, 
          valid: false,
          message: '不能使用自己的邀请码' 
        }
      );
    }

    // 绑定邀请关系
    await bindReferral(newUserId, inviteRecord.userId);

    const duration = Date.now() - startTime;
    console.log(`[Invite] Verified in ${duration}ms: ${code}`);

    return NextResponse.json({
      success: true,
      valid: true,
      inviterId: inviteRecord.userId,
      message: '邀请码验证成功'
    });

  } catch (error) {
    console.error('[Invite] Verify error:', error);
    return NextResponse.json(
      { 
        success: false, 
        valid: false,
        message: '服务器错误，请稍后重试' 
      },
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

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * 生成邀请码 API
 * POST /api/invite/generate
 * 
 * 请求体：
 * {
 *   userId: string - 用户 ID
 * }
 * 
 * 响应：
 * {
 *   success: boolean,
 *   code: string - 邀请码，
 *   message: string
 * }
 */

// 邀请码配置
const INVITE_CODE_LENGTH = 6;
const INVITE_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 排除易混淆字符

/**
 * 生成随机邀请码
 */
function generateInviteCode(): string {
  let code = '';
  const array = new Uint8Array(INVITE_CODE_LENGTH);
  crypto.randomFillSync(array);
  
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
    code += INVITE_CODE_CHARS[array[i] % INVITE_CODE_CHARS.length];
  }
  
  return code;
}

/**
 * 检查邀请码是否已存在
 * 实际应查询数据库，这里用内存模拟
 */
const usedCodes = new Set<string>();

async function isCodeExists(code: string): Promise<boolean> {
  // TODO: 实际应从数据库查询
  // const result = await db.inviteCode.findUnique({ where: { code } });
  // return !!result;
  return usedCodes.has(code);
}

/**
 * 保存邀请码到数据库
 */
async function saveInviteCode(userId: string, code: string): Promise<void> {
  // TODO: 实际应保存到数据库
  // await db.inviteCode.create({
  //   data: { userId, code, createdAt: new Date() }
  // });
  usedCodes.add(code);
  console.log(`[Invite] User ${userId} generated code: ${code}`);
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { userId } = body;

    // 参数验证
    if (!userId) {
      return NextResponse.json(
        { success: false, message: '用户 ID 不能为空' },
        { status: 400 }
      );
    }

    // 检查用户是否已有邀请码
    // TODO: 实际应从数据库查询
    // const existingCode = await db.inviteCode.findUnique({ where: { userId } });
    // if (existingCode) {
    //   return NextResponse.json({
    //     success: true,
    //     code: existingCode.code,
    //     message: '邀请码已存在'
    //   });
    // }

    // 生成唯一邀请码（最多尝试 10 次）
    let code: string;
    let attempts = 0;
    do {
      code = generateInviteCode();
      attempts++;
      if (attempts > 10) {
        throw new Error('生成邀请码失败，请重试');
      }
    } while (await isCodeExists(code));

    // 保存邀请码
    await saveInviteCode(userId, code);

    const duration = Date.now() - startTime;
    console.log(`[Invite] Code generated in ${duration}ms`);

    return NextResponse.json({
      success: true,
      code,
      message: '邀请码生成成功'
    });

  } catch (error) {
    console.error('[Invite] Generate error:', error);
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

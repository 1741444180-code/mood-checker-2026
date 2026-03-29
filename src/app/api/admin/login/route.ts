import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { encryptData, verifyEncryptedData } from '@/utils/encryption';

const prisma = new PrismaClient();

// POST /api/admin/login - 管理员登录接口
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // 查找用户
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    // 检查用户是否存在
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // 检查用户是否具有管理员权限
    if (!user.isAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    const adminUser = user;

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 验证密码 - 这里假设密码已经加密存储
    // 在实际应用中，你需要使用bcrypt或其他密码哈希库
    const isValidPassword = verifyEncryptedData(
      password,
      adminUser.password,
      adminUser.passwordSalt || ''
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 生成JWT令牌
    const token = jwt.sign(
      {
        userId: adminUser.id,
        username: adminUser.username,
        isAdmin: adminUser.isAdmin,
      },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );

    // 返回成功响应，包含令牌
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        isAdmin: adminUser.isAdmin,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
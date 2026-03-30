import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { userId, type, content, email, contactInfo } = body;

    // 验证必需字段
    if (!content) {
      return Response.json(
        { error: '反馈内容不能为空' },
        { status: 400 }
      );
    }

    // 创建反馈记录
    const feedback = await prisma.feedback.create({
      data: {
        userId: userId || null,
        type: type || 'general',
        content,
        email: email || null,
        contactInfo: contactInfo || null,
        status: 'pending',
      },
    });

    return Response.json(
      { 
        success: true, 
        message: '反馈提交成功',
        data: { id: feedback.id }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('提交反馈时发生错误:', error);
    
    return Response.json(
      { error: '提交反馈失败' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
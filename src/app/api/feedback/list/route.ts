import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 获取查询参数
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';

    // 构建查询条件
    const whereClause: any = {};
    if (type) {
      whereClause.type = type;
    }
    if (status) {
      whereClause.status = status;
    }

    // 查询反馈列表
    const feedbackList = await prisma.feedback.findMany({
      where: whereClause,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 获取总数
    const total = await prisma.feedback.count({
      where: whereClause,
    });

    return Response.json({
      success: true,
      data: {
        list: feedbackList,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('获取反馈列表时发生错误:', error);
    
    return Response.json(
      { error: '获取反馈列表失败' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 获取查询参数
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';

    // 构建查询条件
    const whereClause: any = {
      status: 'published', // 只返回已发布的FAQ
    };
    
    if (category) {
      whereClause.category = category;
    }
    
    if (search) {
      whereClause.OR = [
        {
          question: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          answer: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // 查询FAQ列表
    const faqs = await prisma.faq.findMany({
      where: whereClause,
      orderBy: [
        {
          sortOrder: 'asc', // 按排序顺序排列
        },
        {
          createdAt: 'desc', // 创建时间倒序作为次要排序
        },
      ],
      select: {
        id: true,
        question: true,
        answer: true,
        category: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // 解析每个FAQ的标签
    const faqsWithParsedTags = faqs.map(faq => {
      let parsedTags = [];
      try {
        parsedTags = JSON.parse(faq.tags || '[]');
        if (!Array.isArray(parsedTags)) {
          parsedTags = [];
        }
      } catch (e) {
        console.warn(`无法解析FAQ ${faq.id} 的标签:`, e);
        parsedTags = [];
      }
      
      return {
        ...faq,
        tags: parsedTags,
      };
    });

    return Response.json({
      success: true,
      data: {
        list: faqsWithParsedTags,
      },
    });
  } catch (error) {
    console.error('获取FAQ时发生错误:', error);
    
    return Response.json(
      { error: '获取FAQ失败' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 获取查询参数
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // 构建查询条件
    const whereClause: any = {
      status: 'published', // 只返回已发布的文章
    };
    
    if (category) {
      whereClause.category = category;
    }
    
    if (search) {
      whereClause.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          content: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // 查询帮助文章列表
    const articles = await prisma.helpArticle.findMany({
      where: whereClause,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        sortOrder: 'asc',
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        summary: true,
        content: false, // 不返回完整内容，避免响应过大
        category: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        viewCount: true,
      },
    });

    // 查询完整内容（如果需要）
    const articleIds = articles.map(article => article.id);
    const articlesWithContent = await prisma.helpArticle.findMany({
      where: {
        id: {
          in: articleIds,
        },
      },
      select: {
        id: true,
        content: true,
      },
    });

    // 合并内容到结果中，并解析标签
    const result = articles.map(article => {
      const fullArticle = articlesWithContent.find(a => a.id === article.id);
      
      // 解析标签JSON字符串
      let parsedTags = [];
      try {
        parsedTags = JSON.parse(article.tags || '[]');
        if (!Array.isArray(parsedTags)) {
          parsedTags = [];
        }
      } catch (e) {
        console.warn(`无法解析文章 ${article.id} 的标签:`, e);
        parsedTags = [];
      }
      
      return {
        ...article,
        content: fullArticle?.content || '',
        tags: parsedTags,
      };
    });

    // 获取总数
    const total = await prisma.helpArticle.count({
      where: whereClause,
    });

    return Response.json({
      success: true,
      data: {
        list: result,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('获取帮助文章时发生错误:', error);
    
    return Response.json(
      { error: '获取帮助文章失败' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
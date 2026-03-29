import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 从查询参数获取分页信息
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    // 确保分页参数有效
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.min(100, Math.max(1, limit)); // 限制每页最多100条记录
    
    // 计算偏移量
    const skip = (pageNumber - 1) * limitNumber;
    
    // 查询用户徽章数量进行排名
    // 注意：这里我们需要统计每个用户的徽章数量
    const leaderboardData = await prisma.userBadge.groupBy({
      by: ['userId'],
      _count: {
        id: true, // 计算每个用户拥有的徽章数量
      },
      orderBy: {
        _count: {
          id: 'desc' // 按徽章数量降序排列
        }
      }
    });

    // 获取用户详细信息
    const userIds = leaderboardData.map(item => item.userId);
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds
        }
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      }
    });

    // 将用户信息与徽章数量合并
    const leaderboardWithUserInfo = leaderboardData.map((item, index) => {
      const user = users.find(u => u.id === item.userId);
      return {
        rank: skip + index + 1, // 考虑分页的排名
        userId: item.userId,
        username: user?.username || '未知用户',
        avatar: user?.avatar,
        badgeCount: item._count.id,
      };
    });

    // 应用分页
    const pagedLeaderboard = leaderboardWithUserInfo.slice(skip, skip + limitNumber);

    // 获取总记录数用于计算总页数
    const totalRecords = leaderboardData.length;
    const totalPages = Math.ceil(totalRecords / limitNumber);

    return Response.json({ 
      success: true, 
      data: {
        items: pagedLeaderboard,
        pagination: {
          currentPage: pageNumber,
          totalPages: totalPages,
          totalRecords: totalRecords,
          pageSize: limitNumber,
        }
      },
      message: '排行榜获取成功'
    });
  } catch (error) {
    console.error('获取排行榜失败:', error);
    return Response.json({ 
      success: false, 
      message: '获取排行榜失败' 
    }, { status: 500 });
  }
}
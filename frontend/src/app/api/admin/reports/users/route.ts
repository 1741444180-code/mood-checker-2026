import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/admin/reports/users - 用户增长报表接口
export async function GET(req: NextRequest) {
  try {
    // 验证管理员权限
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    // 获取查询参数
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'monthly'; // daily, weekly, monthly, yearly
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    let whereClause: any = {};
    
    // 构建时间范围查询条件
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.createdAt.lte = new Date(endDate);
      }
    }

    // 获取用户总数
    const totalUsers = await prisma.user.count({
      where: whereClause
    });

    // 获取新注册用户数
    const newUserCount = await prisma.user.count({
      where: {
        ...whereClause,
        // 如果没有指定时间范围，则默认为最近30天
        createdAt: whereClause.createdAt || {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // 获取活跃用户数 (基于通知的创建时间作为活跃指标)
    const activeUsers = await prisma.notification.groupBy({
      by: ['userId'],
      where: {
        ...whereClause,
        createdAt: whereClause.createdAt || {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 默认过去7天
        }
      },
      _count: {
        userId: true
      }
    });

    // 获取用户增长趋势数据
    let groupByClause: any;
    switch (period) {
      case 'daily':
        groupByClause = {
          day: {
            path: 'createdAt',
            cast: 'date'
          }
        };
        break;
      case 'weekly':
        groupByClause = {
          week: {
            path: 'createdAt',
            cast: 'date'
          }
        };
        break;
      case 'monthly':
        groupByClause = {
          month: {
            path: 'createdAt',
            cast: 'date'
          }
        };
        break;
      case 'yearly':
        groupByClause = {
          year: {
            path: 'createdAt',
            cast: 'date'
          }
        };
        break;
      default:
        groupByClause = {
          month: {
            path: 'createdAt',
            cast: 'date'
          }
        };
    }

    // 获取每日新增用户趋势
    const userGrowthTrend = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: whereClause.createdAt || {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 默认过去30天
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // 转换日期格式以适合作为趋势数据
    const formattedTrend = userGrowthTrend.map((item: any) => ({
      date: item.createdAt.toISOString().split('T')[0],
      newUsers: item._count.id
    }));

    // 用户统计摘要
    const userStats = await prisma.user.aggregate({
      where: whereClause,
      _avg: {
        coins: true
      },
      _max: {
        coins: true
      },
      _min: {
        coins: true
      }
    });

    const userReport = {
      totalUsers,
      newUserCount,
      activeUsersCount: activeUsers.length,
      avgCoinsPerUser: userStats._avg.coins ? Math.round(userStats._avg.coins * 100) / 100 : 0,
      maxCoins: userStats._max.coins || 0,
      minCoins: userStats._min.coins || 0,
      period,
      startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: endDate || new Date().toISOString().split('T')[0],
      growthTrend: formattedTrend.slice(-7) // 最近7天的趋势
    };

    return NextResponse.json(userReport);
  } catch (error) {
    console.error('Error fetching user report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 获取最近30天的趋势数据
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 按日期分组统计订单数量和收入
    const dailyStats = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
          lte: new Date()
        },
        deletedAt: null
      },
      _sum: {
        totalAmount: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // 按周统计数据
    const weeklyStats = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 过去7天
          lte: new Date()
        },
        deletedAt: null
      },
      _sum: {
        totalAmount: true,
        quantity: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // 获取环比增长数据
    const currentPeriod = new Date();
    const lastPeriod = new Date();
    lastPeriod.setMonth(lastPeriod.getMonth() - 1);

    const [
      currentMonthData,
      lastMonthData,
      currentWeekData,
      lastWeekData
    ] = await Promise.all([
      // 当月数据
      prisma.order.aggregate({
        _sum: {
          totalAmount: true
        },
        _count: true,
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
          },
          deletedAt: null
        }
      }),
      // 上月数据
      prisma.order.aggregate({
        _sum: {
          totalAmount: true
        },
        _count: true,
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            lte: new Date(new Date().getFullYear(), new Date().getMonth(), 0)
          },
          deletedAt: null
        }
      }),
      // 本周数据
      prisma.order.aggregate({
        _sum: {
          totalAmount: true
        },
        _count: true,
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - new Date().getDay())),
            lte: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 6))
          },
          deletedAt: null
        }
      }),
      // 上周数据
      prisma.order.aggregate({
        _sum: {
          totalAmount: true
        },
        _count: true,
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() - 7)),
            lte: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() - 1))
          },
          deletedAt: null
        }
      })
    ]);

    // 计算增长率
    const revenueMoM = lastMonthData._sum.totalAmount && lastMonthData._sum.totalAmount > 0
      ? ((currentMonthData._sum.totalAmount! - lastMonthData._sum.totalAmount!) / lastMonthData._sum.totalAmount!) * 100
      : 0;

    const ordersMoM = lastMonthData._count && lastMonthData._count > 0
      ? ((currentMonthData._count - lastMonthData._count) / lastMonthData._count) * 100
      : 0;

    const revenueWoW = lastWeekData._sum.totalAmount && lastWeekData._sum.totalAmount > 0
      ? ((currentWeekData._sum.totalAmount! - lastWeekData._sum.totalAmount!) / lastWeekData._sum.totalAmount!) * 100
      : 0;

    const ordersWoW = lastWeekData._count && lastWeekData._count > 0
      ? ((currentWeekData._count - lastWeekData._count) / lastWeekData._count) * 100
      : 0;

    const trendsData = {
      dailyStats: dailyStats.map((d: any) => ({
        date: d.createdAt.toISOString().split('T')[0],
        totalAmount: d._sum.totalAmount || 0,
        count: 1 // Placeholder - would need to count actual orders per day
      })),
      weeklyStats: weeklyStats.map((w: any) => ({
        date: w.createdAt.toISOString().split('T')[0],
        totalAmount: w._sum.totalAmount || 0,
        quantity: w._sum.quantity || 0
      })),
      monthlyComparison: {
        currentMonth: {
          revenue: currentMonthData._sum.totalAmount || 0,
          orders: currentMonthData._count
        },
        lastMonth: {
          revenue: lastMonthData._sum.totalAmount || 0,
          orders: lastMonthData._count
        },
        revenueGrowth: revenueMoM,
        ordersGrowth: ordersMoM
      },
      weeklyComparison: {
        currentWeek: {
          revenue: currentWeekData._sum.totalAmount || 0,
          orders: currentWeekData._count
        },
        lastWeek: {
          revenue: lastWeekData._sum.totalAmount || 0,
          orders: lastWeekData._count
        },
        revenueGrowth: revenueWoW,
        ordersGrowth: ordersWoW
      },
      updatedAt: new Date().toISOString()
    };

    return Response.json(trendsData);
  } catch (error) {
    console.error('Error fetching trends data:', error);
    return Response.json(
      { error: 'Failed to fetch trends data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
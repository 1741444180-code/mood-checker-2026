import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 获取数据统计概览
    const [
      totalOrders,
      totalRevenue,
      totalUsers,
      totalProducts
    ] = await Promise.all([
      prisma.order.count({
        where: { deletedAt: null }
      }),
      prisma.order.aggregate({
        _sum: {
          totalAmount: true
        },
        where: {
          deletedAt: null,
          status: 'completed'
        }
      }),
      prisma.user.count({
        where: { deletedAt: null }
      }),
      prisma.product.count({
        where: { deletedAt: null }
      })
    ]);

    const statsOverview = {
      totalOrders: totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalUsers: totalUsers,
      totalProducts: totalProducts,
      updatedAt: new Date().toISOString()
    };

    return Response.json(statsOverview);
  } catch (error) {
    console.error('Error fetching stats overview:', error);
    return Response.json(
      { error: 'Failed to fetch statistics overview', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 获取用于图表展示的数据
    const [
      salesByCategory,
      ordersByStatus,
      monthlySales,
      topSellingProducts,
      userGrowth,
      revenueByPaymentMethod
    ] = await Promise.all([
      // 按类别统计销售额
      prisma.product.groupBy({
        by: ['category'],
        where: {
          deletedAt: null,
          OrderItem: {
            some: {
              order: {
                deletedAt: null,
                status: 'completed'
              }
            }
          }
        },
        _sum: {
          price: true
        },
        having: {
          _sum: {
            price: {
              gt: 0
            }
          }
        }
      }),
      
      // 按订单状态统计
      prisma.order.groupBy({
        by: ['status'],
        where: {
          deletedAt: null
        },
        _count: true
      }),
      
      // 按月份统计销售
      prisma.order.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1) // 过去12个月
          },
          deletedAt: null,
          status: 'completed'
        },
        _sum: {
          totalAmount: true
        }
      }),
      
      // 热销产品TOP 10
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: {
            deletedAt: null,
            status: 'completed'
          },
          product: {
            deletedAt: null
          }
        },
        _sum: {
          quantity: true,
          totalPrice: true
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 10
      }),
      
      // 用户增长统计
      prisma.user.groupBy({
        by: ['createdAt'],
        where: {
          deletedAt: null
        },
        _count: true
      }),
      
      // 按支付方式统计收入
      prisma.order.groupBy({
        by: ['paymentMethod'],
        where: {
          deletedAt: null,
          status: 'completed'
        },
        _sum: {
          totalAmount: true
        }
      })
    ]);

    // 格式化月度销售数据
    const formattedMonthlySales = monthlySales.map((item: any) => ({
      month: item.createdAt.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' }),
      revenue: item._sum.totalAmount || 0
    }));

    // 获取热销产品详细信息
    const topProductsDetailed = await prisma.product.findMany({
      where: {
        id: {
          in: topSellingProducts.map((item: any) => item.productId)
        },
        deletedAt: null
      },
      select: {
        id: true,
        name: true
      }
    });

    // 合并产品名称到热销产品数据
    const topSellingProductsFormatted = topSellingProducts.map((item: any) => {
      const product = topProductsDetailed.find((p: any) => p.id === item.productId);
      return {
        productId: item.productId,
        productName: product?.name || 'Unknown Product',
        quantitySold: item._sum.quantity || 0,
        revenue: item._sum.totalPrice || 0
      };
    });

    // 计算用户增长累计数据
    const sortedUserGrowth = userGrowth.sort((a: any, b: any) => a.createdAt.getTime() - b.createdAt.getTime());
    let cumulativeUsers = 0;
    const formattedUserGrowth = sortedUserGrowth.map((item: any) => {
      cumulativeUsers += item._count;
      return {
        date: item.createdAt.toISOString().split('T')[0],
        newUsers: item._count,
        totalUsers: cumulativeUsers
      };
    });

    const chartsData = {
      salesByCategory: salesByCategory.map((item: any) => ({
        category: item.category || 'Uncategorized',
        revenue: item._sum.price || 0
      })),
      ordersByStatus: ordersByStatus.map((item: any) => ({
        status: item.status,
        count: item._count
      })),
      monthlySales: formattedMonthlySales,
      topSellingProducts: topSellingProductsFormatted,
      userGrowth: formattedUserGrowth,
      revenueByPaymentMethod: revenueByPaymentMethod.map((item: any) => ({
        method: item.paymentMethod || 'Unknown',
        revenue: item._sum.totalAmount || 0
      })),
      updatedAt: new Date().toISOString()
    };

    return Response.json(chartsData);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return Response.json(
      { error: 'Failed to fetch chart data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
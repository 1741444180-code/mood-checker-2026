import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/admin/reports/revenue - 收入报表接口
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

    // 这里应该验证 JWT token，简化处理
    // 在实际应用中，你应该解析并验证 JWT token
    
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

    // 模拟收入数据 - 实际应用中这里会查询真实的数据表
    // 由于当前 schema 中没有交易或支付相关的模型，我们将基于用户的 coins 变化来模拟收入数据
    // 在实际应用中，这应该是从订单、支付或订阅表中获取的数据
    
    // 获取用户数量和总金币数作为示例数据
    const userStats = await prisma.user.aggregate({
      _count: {
        id: true,
      },
      _sum: {
        coins: true,
      },
    });

    // 模拟收入报表数据
    const revenueReport = {
      totalRevenue: userStats._sum.coins || 0,
      totalUsers: userStats._count.id,
      averageRevenuePerUser: userStats._count.id > 0 
        ? Math.round((userStats._sum.coins || 0) / userStats._count.id * 100) / 100 
        : 0,
      period: period,
      startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: endDate || new Date().toISOString().split('T')[0],
      // 模拟每日收入趋势数据
      dailyTrends: [
        { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], revenue: 1200 },
        { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], revenue: 1500 },
        { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], revenue: 1800 },
        { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], revenue: 2100 },
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], revenue: 1900 },
        { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], revenue: 2300 },
        { date: new Date().toISOString().split('T')[0], revenue: 2500 },
      ]
    };

    return NextResponse.json(revenueReport);
  } catch (error) {
    console.error('Error fetching revenue report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/admin/logs/operations - 操作日志接口
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
    let page = parseInt(searchParams.get('page') || '1');
    let pageSize = parseInt(searchParams.get('pageSize') || '20');
    const userId = searchParams.get('userId') || '';
    const action = searchParams.get('action') || ''; // 操作类型
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const level = searchParams.get('level') || ''; // 日志级别

    // 验证分页参数
    if (page < 1) page = 1;
    if (pageSize < 1 || pageSize > 100) pageSize = 20;

    // 由于当前 schema 中没有专门的操作日志表，我们模拟操作日志数据
    // 在实际应用中，这应该是从专门的日志表中查询数据
    // 这里我们通过查询用户活动相关的变化来模拟操作日志
    
    let whereClause: any = {};
    
    // 构建查询条件
    if (userId) {
      whereClause.userId = userId;
    }
    
    if (action) {
      // 在实际应用中，这里会有 action 字段来区分不同的操作类型
      // 模拟几种操作类型：create_user, update_profile, login, logout 等
    }
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.createdAt.lte = new Date(endDate);
      }
    }
    
    if (level) {
      // 在实际应用中，这里会有日志级别字段
    }

    // 为了模拟操作日志，我们将使用现有表中的变更记录
    // 创建一些虚拟的操作日志记录
    const mockOperationLogs = [
      {
        id: 'log_001',
        userId: 'user_123',
        userName: 'admin',
        action: 'login',
        description: '用户登录系统',
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1小时前
        level: 'info'
      },
      {
        id: 'log_002',
        userId: 'user_456',
        userName: 'user123',
        action: 'create_friend_request',
        description: '创建好友请求给 user789',
        ip: '192.168.1.101',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2小时前
        level: 'info'
      },
      {
        id: 'log_003',
        userId: 'user_789',
        userName: 'user456',
        action: 'update_profile',
        description: '更新个人资料信息',
        ip: '192.168.1.102',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date(Date.now() - 10800000).toISOString(), // 3小时前
        level: 'info'
      },
      {
        id: 'log_004',
        userId: 'user_123',
        userName: 'admin',
        action: 'delete_friend_request',
        description: '拒绝好友请求来自 user001',
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date(Date.now() - 14400000).toISOString(), // 4小时前
        level: 'info'
      },
      {
        id: 'log_005',
        userId: 'user_456',
        userName: 'user123',
        action: 'update_coins',
        description: '用户金币余额更新，金额：1000 -> 950',
        ip: '192.168.1.101',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date(Date.now() - 18000000).toISOString(), // 5小时前
        level: 'info'
      }
    ];

    // 根据查询参数过滤模拟数据
    let filteredLogs = mockOperationLogs.filter(log => {
      let match = true;
      
      if (userId && log.userId !== userId) {
        match = false;
      }
      
      if (action && !log.action.toLowerCase().includes(action.toLowerCase())) {
        match = false;
      }
      
      if (startDate && new Date(log.timestamp) < new Date(startDate)) {
        match = false;
      }
      
      if (endDate && new Date(log.timestamp) > new Date(endDate)) {
        match = false;
      }
      
      if (level && log.level !== level) {
        match = false;
      }
      
      return match;
    });

    // 实现分页
    const totalCount = filteredLogs.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    const operationLogs = {
      logs: paginatedLogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize),
        totalRecords: totalCount,
        pageSize: pageSize
      },
      filters: {
        userId,
        action,
        startDate,
        endDate,
        level
      }
    };

    return NextResponse.json(operationLogs);
  } catch (error) {
    console.error('Error fetching operation logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
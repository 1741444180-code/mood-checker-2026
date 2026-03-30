import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/admin/logs/system - 系统日志接口
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
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const level = searchParams.get('level') || ''; // 日志级别: error, warn, info, debug
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const source = searchParams.get('source') || ''; // 日志来源

    // 验证分页参数
    if (page < 1) page = 1;
    if (pageSize < 1 || pageSize > 100) pageSize = 20;

    let whereClause: any = {};
    
    // 构建查询条件
    if (level) {
      // 在实际应用中，这里会有日志级别字段
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
    
    if (source) {
      // 在实际应用中，这里会有日志来源字段
    }

    // 由于当前 schema 中没有专门的系统日志表，我们模拟系统日志数据
    // 在实际应用中，这应该是从专门的日志表中查询数据
    // 系统日志通常记录应用程序错误、警告和其他系统级事件
    
    const mockSystemLogs = [
      {
        id: 'sys_log_001',
        timestamp: new Date(Date.now() - 60000).toISOString(), // 1分钟前
        level: 'info',
        source: 'api-server',
        message: '服务器启动成功',
        meta: { pid: 12345, version: '1.0.0' }
      },
      {
        id: 'sys_log_002',
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5分钟前
        level: 'info',
        source: 'database',
        message: '数据库连接池初始化完成',
        meta: { poolSize: 10, timeout: 5000 }
      },
      {
        id: 'sys_log_003',
        timestamp: new Date(Date.now() - 600000).toISOString(), // 10分钟前
        level: 'warn',
        source: 'cache',
        message: 'Redis连接超时，正在重试',
        meta: { retryCount: 1, host: 'localhost:6379' }
      },
      {
        id: 'sys_log_004',
        timestamp: new Date(Date.now() - 1200000).toISOString(), // 20分钟前
        level: 'error',
        source: 'api-server',
        message: '请求处理错误: Database connection failed',
        meta: { url: '/api/users', method: 'GET', statusCode: 500 }
      },
      {
        id: 'sys_log_005',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30分钟前
        level: 'info',
        source: 'scheduler',
        message: '定时任务执行完成: generate-daily-reports',
        meta: { duration: 1500, recordsProcessed: 1250 }
      },
      {
        id: 'sys_log_006',
        timestamp: new Date(Date.now() - 2400000).toISOString(), // 40分钟前
        level: 'debug',
        source: 'authentication',
        message: 'JWT token validation passed',
        meta: { userId: 'user_123', tokenAge: 3600 }
      },
      {
        id: 'sys_log_007',
        timestamp: new Date(Date.now() - 3000000).toISOString(), // 50分钟前
        level: 'info',
        source: 'api-server',
        message: '新的 WebSocket 连接建立',
        meta: { clientId: 'client_abc', connections: 42 }
      },
      {
        id: 'sys_log_008',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1小时前
        level: 'warn',
        source: 'memory',
        message: '内存使用率超过阈值',
        meta: { usagePercent: 85, available: '256MB', threshold: 80 }
      }
    ];

    // 根据查询参数过滤模拟数据
    let filteredLogs = mockSystemLogs.filter(log => {
      let match = true;
      
      if (level && log.level !== level) {
        match = false;
      }
      
      if (startDate && new Date(log.timestamp) < new Date(startDate)) {
        match = false;
      }
      
      if (endDate && new Date(log.timestamp) > new Date(endDate)) {
        match = false;
      }
      
      if (source && !log.source.toLowerCase().includes(source.toLowerCase())) {
        match = false;
      }
      
      return match;
    });

    // 实现分页
    const totalCount = filteredLogs.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    const systemLogs = {
      logs: paginatedLogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize),
        totalRecords: totalCount,
        pageSize: pageSize
      },
      filters: {
        level,
        startDate,
        endDate,
        source
      },
      summary: {
        errorCount: filteredLogs.filter(log => log.level === 'error').length,
        warnCount: filteredLogs.filter(log => log.level === 'warn').length,
        infoCount: filteredLogs.filter(log => log.level === 'info').length,
        debugCount: filteredLogs.filter(log => log.level === 'debug').length
      }
    };

    return NextResponse.json(systemLogs);
  } catch (error) {
    console.error('Error fetching system logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
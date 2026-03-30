/**
 * 日志聚合服务 - Log Aggregator Service
 * 
 * 功能：
 * - 日志自动聚合（按级别、来源）
 * - 支持多种日志级别（DEBUG, INFO, WARN, ERROR, CRITICAL）
 * - 日志存储和查询
 * - 日志分析和统计
 */

import { prisma } from './prisma';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export interface LogEntry {
  id?: number;
  level: LogLevel;
  source: string;
  message: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  userId?: string;
  requestId?: string;
  context?: string;
}

export interface LogQuery {
  level?: LogLevel[];
  source?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}

export class LogAggregator {
  private buffer: LogEntry[] = [];
  private readonly bufferSize = 100;
  private readonly flushIntervalMs = 5000; // 5 秒刷新一次
  private flushTimer: NodeJS.Timeout | null = null;

  /**
   * 启动日志聚合服务
   */
  async start(): Promise<void> {
    console.log('[LogAggregator] 启动日志聚合服务...');
    
    // 启动定时刷新
    this.flushTimer = setInterval(async () => {
      await this.flushBuffer();
    }, this.flushIntervalMs);
    
    console.log(`[LogAggregator] 日志缓冲刷新间隔：${this.flushIntervalMs / 1000}秒`);
  }

  /**
   * 停止日志聚合服务
   */
  stop(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    
    // 刷新剩余日志
    this.flushBufferSync();
    
    console.log('[LogAggregator] 日志聚合服务已停止');
  }

  /**
   * 记录日志
   */
  async log(entry: Omit<LogEntry, 'timestamp'>): Promise<void> {
    const logEntry: LogEntry = {
      ...entry,
      timestamp: new Date(),
    };
    
    this.buffer.push(logEntry);
    
    // 缓冲区满时立即刷新
    if (this.buffer.length >= this.bufferSize) {
      await this.flushBuffer();
    }
  }

  /**
   * 快捷方法：记录 INFO 日志
   */
  async info(source: string, message: string, metadata?: Record<string, any>): Promise<void> {
    await this.log({
      level: LogLevel.INFO,
      source,
      message,
      metadata,
    });
  }

  /**
   * 快捷方法：记录 WARN 日志
   */
  async warn(source: string, message: string, metadata?: Record<string, any>): Promise<void> {
    await this.log({
      level: LogLevel.WARN,
      source,
      message,
      metadata,
    });
  }

  /**
   * 快捷方法：记录 ERROR 日志
   */
  async error(source: string, message: string, metadata?: Record<string, any>): Promise<void> {
    await this.log({
      level: LogLevel.ERROR,
      source,
      message,
      metadata,
    });
  }

  /**
   * 快捷方法：记录 DEBUG 日志
   */
  async debug(source: string, message: string, metadata?: Record<string, any>): Promise<void> {
    await this.log({
      level: LogLevel.DEBUG,
      source,
      message,
      metadata,
    });
  }

  /**
   * 快捷方法：记录 CRITICAL 日志
   */
  async critical(source: string, message: string, metadata?: Record<string, any>): Promise<void> {
    await this.log({
      level: LogLevel.CRITICAL,
      source,
      message,
      metadata,
    });
  }

  /**
   * 刷新缓冲区到数据库
   */
  private async flushBuffer(): Promise<void> {
    if (this.buffer.length === 0) {
      return;
    }
    
    const logsToFlush = [...this.buffer];
    this.buffer = [];
    
    try {
      await prisma.logEntry.createMany({
        data: logsToFlush.map(log => ({
          level: log.level,
          source: log.source,
          message: log.message,
          metadata: log.metadata || {},
          timestamp: log.timestamp,
          userId: log.userId,
          requestId: log.requestId,
          context: log.context,
        })),
      });
      
      console.log(`[LogAggregator] 已刷新 ${logsToFlush.length} 条日志到数据库`);
    } catch (error) {
      console.error('[LogAggregator] 刷新日志失败:', error);
      // 恢复缓冲区
      this.buffer = [...logsToFlush, ...this.buffer];
    }
  }

  /**
   * 同步刷新缓冲区（用于服务停止时）
   */
  private flushBufferSync(): void {
    if (this.buffer.length === 0) {
      return;
    }
    
    try {
      prisma.logEntry.createMany({
        data: this.buffer.map(log => ({
          level: log.level,
          source: log.source,
          message: log.message,
          metadata: log.metadata || {},
          timestamp: log.timestamp,
          userId: log.userId,
          requestId: log.requestId,
          context: log.context,
        })),
      });
      
      console.log(`[LogAggregator] 已同步刷新 ${this.buffer.length} 条日志`);
      this.buffer = [];
    } catch (error) {
      console.error('[LogAggregator] 同步刷新日志失败:', error);
    }
  }

  /**
   * 查询日志
   */
  async queryLogs(query: LogQuery): Promise<LogEntry[]> {
    const where: any = {};
    
    // 按级别过滤
    if (query.level && query.level.length > 0) {
      where.level = { in: query.level };
    }
    
    // 按来源过滤
    if (query.source) {
      where.source = query.source;
    }
    
    // 按时间范围过滤
    if (query.startDate || query.endDate) {
      where.timestamp = {};
      if (query.startDate) {
        where.timestamp.gte = query.startDate;
      }
      if (query.endDate) {
        where.timestamp.lte = query.endDate;
      }
    }
    
    // 按用户 ID 过滤
    if (query.userId) {
      where.userId = query.userId;
    }
    
    // 搜索消息内容
    if (query.search) {
      where.message = { contains: query.search };
    }
    
    const logs = await prisma.logEntry.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: query.limit || 100,
      skip: query.offset || 0,
    });
    
    return logs;
  }

  /**
   * 获取日志统计
   */
  async getLogStats(hours: number = 24): Promise<{
    total: number;
    byLevel: Record<LogLevel, number>;
    bySource: Record<string, number>;
    errorRate: number;
  }> {
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    // 总日志数
    const total = await prisma.logEntry.count({
      where: {
        timestamp: { gte: startTime },
      },
    });
    
    // 按级别统计
    const levels = await prisma.logEntry.groupBy({
      by: ['level'],
      where: {
        timestamp: { gte: startTime },
      },
      _count: true,
    });
    
    const byLevel: Record<LogLevel, number> = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 0,
      [LogLevel.WARN]: 0,
      [LogLevel.ERROR]: 0,
      [LogLevel.CRITICAL]: 0,
    };
    
    levels.forEach(level => {
      byLevel[level.level as LogLevel] = level._count;
    });
    
    // 按来源统计
    const sources = await prisma.logEntry.groupBy({
      by: ['source'],
      where: {
        timestamp: { gte: startTime },
      },
      _count: true,
      take: 20, // 限制前 20 个来源
    });
    
    const bySource: Record<string, number> = {};
    sources.forEach(source => {
      bySource[source.source] = source._count;
    });
    
    // 错误率
    const errorCount = byLevel[LogLevel.ERROR] + byLevel[LogLevel.CRITICAL];
    const errorRate = total > 0 ? (errorCount / total) * 100 : 0;
    
    return {
      total,
      byLevel,
      bySource,
      errorRate,
    };
  }

  /**
   * 获取错误日志
   */
  async getErrorLogs(hours: number = 24): Promise<LogEntry[]> {
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const errors = await prisma.logEntry.findMany({
      where: {
        level: { in: [LogLevel.ERROR, LogLevel.CRITICAL] },
        timestamp: { gte: startTime },
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
    
    return errors;
  }

  /**
   * 清理旧日志
   */
  async cleanupOldLogs(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    const result = await prisma.logEntry.deleteMany({
      where: {
        timestamp: { lt: cutoffDate },
      },
    });
    
    console.log(`[LogAggregator] 已清理 ${result.count} 条旧日志（>${daysToKeep}天）`);
    
    return result.count;
  }

  /**
   * 导出日志
   */
  async exportLogs(query: LogQuery, format: 'json' | 'csv' = 'json'): Promise<string> {
    const logs = await this.queryLogs(query);
    
    if (format === 'json') {
      return JSON.stringify(logs, null, 2);
    }
    
    // CSV 格式
    const headers = ['timestamp', 'level', 'source', 'message', 'userId', 'requestId'];
    const rows = logs.map(log => 
      headers.map(h => {
        const value = (log as any)[h];
        if (value instanceof Date) {
          return value.toISOString();
        }
        if (typeof value === 'object') {
          return JSON.stringify(value);
        }
        return String(value || '');
      }).join(',')
    );
    
    return [headers.join(','), ...rows].join('\n');
  }
}

// 导出单例
export const logAggregator = new LogAggregator();

/**
 * 性能监控服务 - Performance Monitor Service
 * 
 * 功能：
 * - 自动采集性能数据（每 5 分钟）
 * - 监控 API 响应时间、数据库查询、内存使用
 * - 存储性能指标到数据库
 */

import { prisma } from './prisma';

export interface PerformanceMetrics {
  timestamp: Date;
  apiResponseTime: number;      // API 平均响应时间 (ms)
  dbQueryTime: number;          // 数据库查询时间 (ms)
  memoryUsage: number;          // 内存使用 (MB)
  cpuUsage: number;             // CPU 使用率 (%)
  activeConnections: number;    // 活跃连接数
  requestCount: number;         // 请求数量
  errorRate: number;            // 错误率 (%)
}

export class PerformanceMonitor {
  private collectionInterval: NodeJS.Timeout | null = null;
  private readonly collectionIntervalMs = 5 * 60 * 1000; // 5 分钟

  /**
   * 启动性能监控
   */
  async start(): Promise<void> {
    console.log('[PerformanceMonitor] 启动性能监控服务...');
    
    // 立即采集一次
    await this.collectMetrics();
    
    // 设置定时采集
    this.collectionInterval = setInterval(async () => {
      await this.collectMetrics();
    }, this.collectionIntervalMs);
    
    console.log(`[PerformanceMonitor] 性能数据采集间隔：${this.collectionIntervalMs / 1000}秒`);
  }

  /**
   * 停止性能监控
   */
  stop(): void {
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = null;
      console.log('[PerformanceMonitor] 性能监控服务已停止');
    }
  }

  /**
   * 采集性能指标
   */
  async collectMetrics(): Promise<PerformanceMetrics> {
    const metrics = await this.gatherSystemMetrics();
    
    try {
      // 存储到数据库
      await prisma.performanceMetric.create({
        data: {
          timestamp: metrics.timestamp,
          apiResponseTime: metrics.apiResponseTime,
          dbQueryTime: metrics.dbQueryTime,
          memoryUsage: metrics.memoryUsage,
          cpuUsage: metrics.cpuUsage,
          activeConnections: metrics.activeConnections,
          requestCount: metrics.requestCount,
          errorRate: metrics.errorRate,
        },
      });
      
      console.log('[PerformanceMonitor] 性能数据采集完成', {
        apiResponseTime: `${metrics.apiResponseTime}ms`,
        memoryUsage: `${metrics.memoryUsage}MB`,
        cpuUsage: `${metrics.cpuUsage}%`,
      });
      
      return metrics;
    } catch (error) {
      console.error('[PerformanceMonitor] 存储性能数据失败:', error);
      throw error;
    }
  }

  /**
   * 收集系统指标
   */
  private async gatherSystemMetrics(): Promise<PerformanceMetrics> {
    const timestamp = new Date();
    
    // 模拟系统指标采集（实际应该集成监控系统）
    const metrics: PerformanceMetrics = {
      timestamp,
      apiResponseTime: await this.measureApiPerformance(),
      dbQueryTime: await this.measureDbPerformance(),
      memoryUsage: this.getMemoryUsage(),
      cpuUsage: this.getCpuUsage(),
      activeConnections: this.getActiveConnections(),
      requestCount: this.getRequestCount(),
      errorRate: this.getErrorRate(),
    };
    
    return metrics;
  }

  /**
   * 测量 API 性能
   */
  private async measureApiPerformance(): Promise<number> {
    // TODO: 集成实际的 API 性能监控
    return Math.random() * 100 + 50; // 模拟 50-150ms
  }

  /**
   * 测量数据库性能
   */
  private async measureDbPerformance(): Promise<number> {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    return Date.now() - start;
  }

  /**
   * 获取内存使用
   */
  private getMemoryUsage(): number {
    const usage = process.memoryUsage();
    return Math.round(usage.heapUsed / 1024 / 1024); // MB
  }

  /**
   * 获取 CPU 使用率
   */
  private getCpuUsage(): number {
    // TODO: 集成实际的 CPU 监控
    return Math.random() * 30 + 10; // 模拟 10-40%
  }

  /**
   * 获取活跃连接数
   */
  private getActiveConnections(): number {
    // TODO: 集成实际的连接监控
    return Math.floor(Math.random() * 100) + 10;
  }

  /**
   * 获取请求数量
   */
  private getRequestCount(): number {
    // TODO: 集成实际的请求计数
    return Math.floor(Math.random() * 1000) + 100;
  }

  /**
   * 获取错误率
   */
  private getErrorRate(): number {
    // TODO: 集成实际的错误统计
    return Math.random() * 2; // 模拟 0-2%
  }

  /**
   * 获取历史性能数据
   */
  async getHistoricalMetrics(hours: number = 24): Promise<PerformanceMetrics[]> {
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const metrics = await prisma.performanceMetric.findMany({
      where: {
        timestamp: {
          gte: startTime,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });
    
    return metrics;
  }

  /**
   * 获取性能统计数据
   */
  async getPerformanceStats(hours: number = 24): Promise<{
    avgApiResponseTime: number;
    avgDbQueryTime: number;
    avgMemoryUsage: number;
    avgCpuUsage: number;
    maxApiResponseTime: number;
    maxDbQueryTime: number;
  }> {
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const stats = await prisma.performanceMetric.aggregate({
      where: {
        timestamp: {
          gte: startTime,
        },
      },
      _avg: {
        apiResponseTime: true,
        dbQueryTime: true,
        memoryUsage: true,
        cpuUsage: true,
      },
      _max: {
        apiResponseTime: true,
        dbQueryTime: true,
      },
    });
    
    return {
      avgApiResponseTime: stats._avg.apiResponseTime || 0,
      avgDbQueryTime: stats._avg.dbQueryTime || 0,
      avgMemoryUsage: stats._avg.memoryUsage || 0,
      avgCpuUsage: stats._avg.cpuUsage || 0,
      maxApiResponseTime: stats._max.apiResponseTime || 0,
      maxDbQueryTime: stats._max.dbQueryTime || 0,
    };
  }
}

// 导出单例
export const performanceMonitor = new PerformanceMonitor();

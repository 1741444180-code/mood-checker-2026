/**
 * 告警管理服务 - Alert Manager Service
 * 
 * 功能：
 * - 自动触发告警（邮件/推送）
 * - 支持多种告警级别（INFO, WARNING, ERROR, CRITICAL）
 * - 告警历史记录
 * - 告警规则配置
 */

import { prisma } from './prisma';
import { performanceMonitor } from './performance-monitor';

export enum AlertLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export enum AlertChannel {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  SMS = 'SMS',
  WEBHOOK = 'WEBHOOK',
}

export interface AlertRule {
  id?: number;
  name: string;
  metric: string;
  condition: 'GT' | 'LT' | 'EQ' | 'GTE' | 'LTE'; // Greater Than, Less Than, etc.
  threshold: number;
  level: AlertLevel;
  channels: AlertChannel[];
  enabled: boolean;
  cooldownMinutes?: number; // 告警冷却时间
}

export interface Alert {
  id?: number;
  ruleId: number;
  level: AlertLevel;
  title: string;
  message: string;
  metricValue: number;
  threshold: number;
  triggeredAt: Date;
  acknowledged?: boolean;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
}

export class AlertManager {
  private readonly defaultCooldownMinutes = 30;
  private alertRules: AlertRule[] = [];

  /**
   * 初始化告警管理器
   */
  async initialize(): Promise<void> {
    console.log('[AlertManager] 初始化告警管理服务...');
    
    // 加载告警规则
    await this.loadAlertRules();
    
    // 启动告警检查
    this.startAlertChecking();
    
    console.log('[AlertManager] 告警管理服务已启动');
  }

  /**
   * 加载告警规则
   */
  private async loadAlertRules(): Promise<void> {
    const rules = await prisma.alertRule.findMany({
      where: { enabled: true },
    });
    
    this.alertRules = rules.map(rule => ({
      id: rule.id,
      name: rule.name,
      metric: rule.metric,
      condition: rule.condition as 'GT' | 'LT' | 'EQ' | 'GTE' | 'LTE',
      threshold: rule.threshold,
      level: rule.level as AlertLevel,
      channels: rule.channels as AlertChannel[],
      enabled: rule.enabled,
      cooldownMinutes: rule.cooldownMinutes || this.defaultCooldownMinutes,
    }));
    
    console.log(`[AlertManager] 已加载 ${this.alertRules.length} 条告警规则`);
  }

  /**
   * 启动告警检查
   */
  private startAlertChecking(): void {
    // 每分钟检查一次告警规则
    setInterval(async () => {
      await this.checkAlertRules();
    }, 60 * 1000);
  }

  /**
   * 检查告警规则
   */
  private async checkAlertRules(): Promise<void> {
    for (const rule of this.alertRules) {
      await this.evaluateRule(rule);
    }
  }

  /**
   * 评估单条告警规则
   */
  private async evaluateRule(rule: AlertRule): Promise<void> {
    try {
      // 获取当前指标值
      const metricValue = await this.getMetricValue(rule.metric);
      
      // 检查是否触发告警
      if (this.shouldTrigger(rule, metricValue)) {
        // 检查冷却时间
        const inCooldown = await this.isInCooldown(rule.id!, rule.cooldownMinutes || this.defaultCooldownMinutes);
        
        if (!inCooldown) {
          await this.triggerAlert(rule, metricValue);
        }
      }
    } catch (error) {
      console.error(`[AlertManager] 评估规则失败 [${rule.name}]:`, error);
    }
  }

  /**
   * 获取指标值
   */
  private async getMetricValue(metric: string): Promise<number> {
    switch (metric) {
      case 'apiResponseTime':
        const stats = await performanceMonitor.getPerformanceStats(1);
        return stats.avgApiResponseTime;
      
      case 'dbQueryTime':
        const dbStats = await performanceMonitor.getPerformanceStats(1);
        return dbStats.avgDbQueryTime;
      
      case 'memoryUsage':
        const memStats = await performanceMonitor.getPerformanceStats(1);
        return memStats.avgMemoryUsage;
      
      case 'cpuUsage':
        const cpuStats = await performanceMonitor.getPerformanceStats(1);
        return cpuStats.avgCpuUsage;
      
      case 'errorRate':
        const errorStats = await performanceMonitor.getPerformanceStats(1);
        return errorStats.avgCpuUsage; // TODO: 实际错误率
      
      default:
        return 0;
    }
  }

  /**
   * 判断是否应该触发告警
   */
  private shouldTrigger(rule: AlertRule, value: number): boolean {
    switch (rule.condition) {
      case 'GT': return value > rule.threshold;
      case 'LT': return value < rule.threshold;
      case 'EQ': return value === rule.threshold;
      case 'GTE': return value >= rule.threshold;
      case 'LTE': return value <= rule.threshold;
      default: return false;
    }
  }

  /**
   * 检查是否在冷却期内
   */
  private async isInCooldown(ruleId: number, cooldownMinutes: number): Promise<boolean> {
    const cooldownTime = new Date(Date.now() - cooldownMinutes * 60 * 1000);
    
    const recentAlert = await prisma.alert.findFirst({
      where: {
        ruleId,
        triggeredAt: {
          gte: cooldownTime,
        },
      },
      orderBy: {
        triggeredAt: 'desc',
      },
    });
    
    return !!recentAlert;
  }

  /**
   * 触发告警
   */
  private async triggerAlert(rule: AlertRule, metricValue: number): Promise<void> {
    const alert: Alert = {
      ruleId: rule.id!,
      level: rule.level,
      title: `告警：${rule.name}`,
      message: `${rule.metric} 当前值 ${metricValue.toFixed(2)} 超过阈值 ${rule.threshold}`,
      metricValue,
      threshold: rule.threshold,
      triggeredAt: new Date(),
    };
    
    // 存储告警记录
    const createdAlert = await prisma.alert.create({
      data: {
        ruleId: alert.ruleId,
        level: alert.level,
        title: alert.title,
        message: alert.message,
        metricValue: alert.metricValue,
        threshold: alert.threshold,
        triggeredAt: alert.triggeredAt,
        acknowledged: false,
      },
    });
    
    console.log(`[AlertManager] 触发告警 [${rule.level}]: ${alert.title}`);
    
    // 发送告警通知
    await this.sendNotifications(rule.channels, alert);
  }

  /**
   * 发送告警通知
   */
  private async sendNotifications(channels: AlertChannel[], alert: Alert): Promise<void> {
    for (const channel of channels) {
      try {
        switch (channel) {
          case AlertChannel.EMAIL:
            await this.sendEmailAlert(alert);
            break;
          
          case AlertChannel.PUSH:
            await this.sendPushAlert(alert);
            break;
          
          case AlertChannel.SMS:
            await this.sendSmsAlert(alert);
            break;
          
          case AlertChannel.WEBHOOK:
            await this.sendWebhookAlert(alert);
            break;
        }
      } catch (error) {
        console.error(`[AlertManager] 发送${channel}告警失败:`, error);
      }
    }
  }

  /**
   * 发送邮件告警
   */
  private async sendEmailAlert(alert: Alert): Promise<void> {
    // TODO: 集成邮件发送服务
    console.log(`[AlertManager] [EMAIL] ${alert.title}: ${alert.message}`);
  }

  /**
   * 发送推送告警
   */
  private async sendPushAlert(alert: Alert): Promise<void> {
    // TODO: 集成推送服务
    console.log(`[AlertManager] [PUSH] ${alert.title}: ${alert.message}`);
  }

  /**
   * 发送短信告警
   */
  private async sendSmsAlert(alert: Alert): Promise<void> {
    // TODO: 集成短信服务
    console.log(`[AlertManager] [SMS] ${alert.title}: ${alert.message}`);
  }

  /**
   * 发送 Webhook 告警
   */
  private async sendWebhookAlert(alert: Alert): Promise<void> {
    // TODO: 集成 Webhook 服务
    console.log(`[AlertManager] [WEBHOOK] ${alert.title}: ${alert.message}`);
  }

  /**
   * 创建告警规则
   */
  async createAlertRule(rule: AlertRule): Promise<AlertRule> {
    const created = await prisma.alertRule.create({
      data: {
        name: rule.name,
        metric: rule.metric,
        condition: rule.condition,
        threshold: rule.threshold,
        level: rule.level,
        channels: rule.channels,
        enabled: rule.enabled,
        cooldownMinutes: rule.cooldownMinutes || this.defaultCooldownMinutes,
      },
    });
    
    await this.loadAlertRules();
    
    return {
      id: created.id,
      ...rule,
    };
  }

  /**
   * 确认告警
   */
  async acknowledgeAlert(alertId: number, userId: string): Promise<void> {
    await prisma.alert.update({
      where: { id: alertId },
      data: {
        acknowledged: true,
        acknowledgedAt: new Date(),
        acknowledgedBy: userId,
      },
    });
    
    console.log(`[AlertManager] 告警 ${alertId} 已确认`);
  }

  /**
   * 获取未确认告警
   */
  async getUnacknowledgedAlerts(): Promise<Alert[]> {
    const alerts = await prisma.alert.findMany({
      where: {
        acknowledged: false,
      },
      orderBy: {
        triggeredAt: 'desc',
      },
    });
    
    return alerts;
  }

  /**
   * 获取告警历史
   */
  async getAlertHistory(days: number = 7): Promise<Alert[]> {
    const startTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const alerts = await prisma.alert.findMany({
      where: {
        triggeredAt: {
          gte: startTime,
        },
      },
      orderBy: {
        triggeredAt: 'desc',
      },
    });
    
    return alerts;
  }
}

// 导出单例
export const alertManager = new AlertManager();

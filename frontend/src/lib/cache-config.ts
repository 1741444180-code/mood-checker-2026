/**
 * 缓存配置文件
 * 定义全局缓存策略和 TTL 配置
 */

export interface CacheConfig {
  ttl: number; // 默认 TTL（秒）
  prefix: string; // 缓存键前缀
  enabled: boolean; // 是否启用缓存
  maxMemory?: number; // 最大内存缓存条目数
}

/**
 * 不同业务场景的 TTL 配置（单位：秒）
 */
export const CACHE_TTL = {
  // 用户相关 - 较短 TTL，保证数据实时性
  USER_PROFILE: 300, // 5 分钟
  USER_SESSION: 1800, // 30 分钟
  
  // 心情打卡 - 中等 TTL
  CHECKIN_LIST: 60, // 1 分钟
  CHECKIN_STATS: 300, // 5 分钟
  CHECKIN_DETAIL: 120, // 2 分钟
  
  // 点赞数据 - 较短 TTL，高频更新
  LIKE_COUNT: 30, // 30 秒
  LIKE_STATUS: 60, // 1 分钟
  
  // 统计分析 - 较长 TTL，计算密集型
  ANALYSIS_STATS: 600, // 10 分钟
  ANALYSIS_TREND: 900, // 15 分钟
  EXPORT_DATA: 1800, // 30 分钟
  
  // 通用配置
  CONFIG: 3600, // 1 小时
  DEFAULT: 300, // 5 分钟
} as const;

/**
 * 缓存键命名规范
 * 格式：{prefix}:{module}:{type}:{id}:{field}
 */
export const CACHE_KEYS = {
  // 用户缓存
  user: (userId: string, field?: string) => 
    `mimi:user:${userId}${field ? `:${field}` : ''}`,
  
  // 心情打卡缓存
  checkin: {
    list: (userId: string, page: number = 1) => 
      `mimi:checkin:list:${userId}:p${page}`,
    stats: (userId: string, period: string) => 
      `mimi:checkin:stats:${userId}:${period}`,
    detail: (checkinId: string) => 
      `mimi:checkin:detail:${checkinId}`,
  },
  
  // 点赞缓存
  like: {
    count: (targetId: string) => 
      `mimi:like:count:${targetId}`,
    status: (userId: string, targetId: string) => 
      `mimi:like:status:${userId}:${targetId}`,
  },
  
  // 统计分析缓存
  analysis: {
    stats: (type: string, params: string) => 
      `mimi:analysis:stats:${type}:${params}`,
    trend: (type: string, period: string) => 
      `mimi:analysis:trend:${type}:${period}`,
  },
  
  // 导出数据缓存
  export: {
    csv: (userId: string, hash: string) => 
      `mimi:export:csv:${userId}:${hash}`,
    excel: (userId: string, hash: string) => 
      `mimi:export:excel:${userId}:${hash}`,
    json: (userId: string, hash: string) => 
      `mimi:export:json:${userId}:${hash}`,
  },
} as const;

/**
 * 默认缓存配置
 */
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttl: CACHE_TTL.DEFAULT,
  prefix: 'mimi',
  enabled: process.env.CACHE_ENABLED !== 'false',
  maxMemory: 1000,
};

/**
 * 获取特定模块的缓存配置
 */
export function getCacheConfig(module: keyof typeof CACHE_TTL): CacheConfig {
  return {
    ...DEFAULT_CACHE_CONFIG,
    ttl: CACHE_TTL[module] || CACHE_TTL.DEFAULT,
  };
}

/**
 * 检查缓存是否启用
 */
export function isCacheEnabled(): boolean {
  return process.env.CACHE_ENABLED !== 'false';
}

/**
 * 获取 Redis 连接配置
 */
export const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  keyPrefix: 'mimi:',
  retryStrategy: (times: number) => {
    if (times > 5) {
      return null; // 放弃重连
    }
    return Math.min(times * 200, 3000); // 指数退避
  },
};

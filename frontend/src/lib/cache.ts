/**
 * 缓存工具函数
 * 提供统一的缓存操作接口（支持内存和 Redis）
 */

import { getRedisClient } from './redis';
import { 
  CACHE_KEYS, 
  CACHE_TTL, 
  isCacheEnabled,
  getCacheConfig 
} from './cache-config';

/**
 * 内存缓存（LRU 简单实现）
 * 作为 Redis 的降级方案
 */
class MemoryCache {
  private cache: Map<string, { value: any; expiry: number }>;
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value as T;
  }

  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    // LRU 淘汰策略
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, {
      value,
      expiry: Date.now() + (ttlSeconds * 1000),
    });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async delPattern(pattern: string): Promise<void> {
    const keys = Array.from(this.cache.keys()).filter(k => 
      k.startsWith(pattern.replace('*', ''))
    );
    keys.forEach(key => this.cache.delete(key));
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}

// 全局内存缓存实例
const memoryCache = new MemoryCache(1000);

/**
 * 缓存服务类
 */
export class CacheService {
  private redisClient: any = null;
  private useRedis: boolean = false;

  constructor() {
    this.init();
  }

  private async init() {
    if (!isCacheEnabled()) {
      console.log('[Cache] 缓存已禁用');
      return;
    }

    try {
      this.redisClient = await getRedisClient();
      this.useRedis = true;
      console.log('[Cache] Redis 连接成功');
    } catch (error) {
      console.warn('[Cache] Redis 连接失败，使用内存缓存:', error);
      this.useRedis = false;
    }
  }

  /**
   * 获取缓存
   */
  async get<T>(key: string): Promise<T | null> {
    if (!isCacheEnabled()) return null;

    try {
      if (this.useRedis && this.redisClient) {
        const value = await this.redisClient.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        return await memoryCache.get<T>(key);
      }
    } catch (error) {
      console.error('[Cache] 获取缓存失败:', key, error);
      return null;
    }
  }

  /**
   * 设置缓存
   */
  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    if (!isCacheEnabled()) return;

    try {
      if (this.useRedis && this.redisClient) {
        const ttl = ttlSeconds || CACHE_TTL.DEFAULT;
        await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
      } else {
        await memoryCache.set(key, value, ttlSeconds || CACHE_TTL.DEFAULT);
      }
    } catch (error) {
      console.error('[Cache] 设置缓存失败:', key, error);
    }
  }

  /**
   * 删除缓存
   */
  async del(key: string): Promise<void> {
    if (!isCacheEnabled()) return;

    try {
      if (this.useRedis && this.redisClient) {
        await this.redisClient.del(key);
      } else {
        await memoryCache.del(key);
      }
    } catch (error) {
      console.error('[Cache] 删除缓存失败:', key, error);
    }
  }

  /**
   * 删除匹配模式的缓存
   */
  async delPattern(pattern: string): Promise<void> {
    if (!isCacheEnabled()) return;

    try {
      if (this.useRedis && this.redisClient) {
        const keys = await this.redisClient.keys(pattern);
        if (keys.length > 0) {
          await this.redisClient.del(...keys);
        }
      } else {
        await memoryCache.delPattern(pattern);
      }
    } catch (error) {
      console.error('[Cache] 批量删除缓存失败:', pattern, error);
    }
  }

  /**
   * 检查缓存是否存在
   */
  async exists(key: string): Promise<boolean> {
    if (!isCacheEnabled()) return false;

    try {
      if (this.useRedis && this.redisClient) {
        const result = await this.redisClient.exists(key);
        return result === 1;
      } else {
        const value = await memoryCache.get(key);
        return value !== null;
      }
    } catch (error) {
      console.error('[Cache] 检查缓存失败:', key, error);
      return false;
    }
  }

  /**
   * 获取或设置缓存（带缓存穿透保护）
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlSeconds?: number
  ): Promise<T> {
    // 先尝试从缓存获取
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // 缓存未命中，执行查询
    const value = await fetchFn();
    
    // 写入缓存（即使是 null 也缓存，防止穿透）
    await this.set(key, value, ttlSeconds);
    
    return value;
  }

  /**
   * 清除所有缓存
   */
  async clear(): Promise<void> {
    if (!isCacheEnabled()) return;

    try {
      if (this.useRedis && this.redisClient) {
        await this.redisClient.flushdb();
      } else {
        await memoryCache.clear();
      }
      console.log('[Cache] 缓存已清空');
    } catch (error) {
      console.error('[Cache] 清空缓存失败:', error);
    }
  }
}

// 导出单例
export const cache = new CacheService();

/**
 * 快捷缓存函数（无需实例化）
 */
export const cacheUtils = {
  /**
   * 获取缓存
   */
  get: async <T>(key: string): Promise<T | null> => {
    return cache.get<T>(key);
  },

  /**
   * 设置缓存
   */
  set: async (key: string, value: any, ttlSeconds?: number): Promise<void> => {
    await cache.set(key, value, ttlSeconds);
  },

  /**
   * 删除缓存
   */
  del: async (key: string): Promise<void> => {
    await cache.del(key);
  },

  /**
   * 获取或设置缓存
   */
  getOrSet: async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlSeconds?: number
  ): Promise<T> => {
    return cache.getOrSet<T>(key, fetchFn, ttlSeconds);
  },

  /**
   * 缓存键生成器
   */
  keys: CACHE_KEYS,

  /**
   * TTL 配置
   */
  ttl: CACHE_TTL,
};

// 默认导出
export default cacheUtils;

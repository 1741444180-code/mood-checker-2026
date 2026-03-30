/**
 * Redis 缓存实现
 * 提供高级缓存操作和模式
 */

import { getRedisClient } from './redis';
import { CACHE_TTL, CACHE_KEYS } from './cache-config';

/**
 * Redis 缓存服务类
 * 提供更丰富的缓存操作模式
 */
export class RedisCacheService {
  private client: any = null;
  private connected: boolean = false;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      this.client = await getRedisClient();
      this.connected = true;
    } catch (error) {
      console.error('[RedisCache] 初始化失败:', error);
      this.connected = false;
    }
  }

  /**
   * 检查服务是否可用
   */
  isAvailable(): boolean {
    return this.connected && this.client !== null;
  }

  /**
   * 基础操作：获取
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.isAvailable()) return null;

    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('[RedisCache] 获取失败:', key, error);
      return null;
    }
  }

  /**
   * 基础操作：设置
   */
  async set(key: string, value: any, ttlSeconds: number = CACHE_TTL.DEFAULT): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      const serialized = JSON.stringify(value);
      await this.client.set(key, serialized, 'EX', ttlSeconds);
    } catch (error) {
      console.error('[RedisCache] 设置失败:', key, error);
    }
  }

  /**
   * 基础操作：删除
   */
  async del(key: string): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      await this.client.del(key);
    } catch (error) {
      console.error('[RedisCache] 删除失败:', key, error);
    }
  }

  /**
   * 原子操作：自增
   */
  async incr(key: string, ttlSeconds?: number): Promise<number> {
    if (!this.isAvailable()) return 0;

    try {
      const result = await this.client.incr(key);
      
      // 如果是新键，设置过期时间
      if (result === 1 && ttlSeconds) {
        await this.client.expire(key, ttlSeconds);
      }
      
      return result;
    } catch (error) {
      console.error('[RedisCache] 自增失败:', key, error);
      return 0;
    }
  }

  /**
   * 原子操作：自减
   */
  async decr(key: string, ttlSeconds?: number): Promise<number> {
    if (!this.isAvailable()) return 0;

    try {
      const result = await this.client.decr(key);
      
      if (result === -1 && ttlSeconds) {
        await this.client.expire(key, ttlSeconds);
      }
      
      return result;
    } catch (error) {
      console.error('[RedisCache] 自减失败:', key, error);
      return 0;
    }
  }

  /**
   * 集合操作：添加到集合
   */
  async sadd(key: string, ...values: string[]): Promise<number> {
    if (!this.isAvailable()) return 0;

    try {
      return await this.client.sadd(key, ...values);
    } catch (error) {
      console.error('[RedisCache] 集合添加失败:', key, error);
      return 0;
    }
  }

  /**
   * 集合操作：从集合中移除
   */
  async srem(key: string, ...values: string[]): Promise<number> {
    if (!this.isAvailable()) return 0;

    try {
      return await this.client.srem(key, ...values);
    } catch (error) {
      console.error('[RedisCache] 集合移除失败:', key, error);
      return 0;
    }
  }

  /**
   * 集合操作：获取集合所有成员
   */
  async smembers(key: string): Promise<string[]> {
    if (!this.isAvailable()) return [];

    try {
      return await this.client.smembers(key);
    } catch (error) {
      console.error('[RedisCache] 获取集合失败:', key, error);
      return [];
    }
  }

  /**
   * 集合操作：检查成员是否存在
   */
  async sismember(key: string, value: string): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      const result = await this.client.sismember(key, value);
      return result === 1;
    } catch (error) {
      console.error('[RedisCache] 检查成员失败:', key, error);
      return false;
    }
  }

  /**
   * 列表操作：推入列表左侧
   */
  async lpush(key: string, ...values: any[]): Promise<number> {
    if (!this.isAvailable()) return 0;

    try {
      const serialized = values.map(v => JSON.stringify(v));
      return await this.client.lpush(key, ...serialized);
    } catch (error) {
      console.error('[RedisCache] 列表推入失败:', key, error);
      return 0;
    }
  }

  /**
   * 列表操作：获取列表范围
   */
  async lrange(key: string, start: number, stop: number): Promise<any[]> {
    if (!this.isAvailable()) return [];

    try {
      const result = await this.client.lrange(key, start, stop);
      return result.map((item: string) => JSON.parse(item));
    } catch (error) {
      console.error('[RedisCache] 获取列表失败:', key, error);
      return [];
    }
  }

  /**
   * 有序集合操作：添加成员
   */
  async zadd(key: string, score: number, member: string): Promise<number> {
    if (!this.isAvailable()) return 0;

    try {
      return await this.client.zadd(key, score, member);
    } catch (error) {
      console.error('[RedisCache] 有序集合添加失败:', key, error);
      return 0;
    }
  }

  /**
   * 有序集合操作：获取前 N 名
   */
  async ztop(key: string, count: number = 10): Promise<{ member: string; score: number }[]> {
    if (!this.isAvailable()) return [];

    try {
      const result = await this.client.zrevrange(key, 0, count - 1, 'WITHSCORES') as string[];
      const pairs: { member: string; score: number }[] = [];
      
      for (let i = 0; i < result.length; i += 2) {
        pairs.push({
          member: result[i],
          score: parseFloat(result[i + 1]),
        });
      }
      
      return pairs;
    } catch (error) {
      console.error('[RedisCache] 获取排行榜失败:', key, error);
      return [];
    }
  }

  /**
   * 分布式锁：尝试获取锁
   */
  async tryLock(
    lockKey: string,
    lockValue: string,
    ttlSeconds: number = 10
  ): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      // 使用 SET NX EX 实现原子锁
      const result = await this.client.set(lockKey, lockValue, 'NX', 'EX', ttlSeconds);
      return result === 'OK';
    } catch (error) {
      console.error('[RedisCache] 获取锁失败:', lockKey, error);
      return false;
    }
  }

  /**
   * 分布式锁：释放锁
   */
  async unlock(lockKey: string, lockValue: string): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      // 使用 Lua 脚本确保只删除自己的锁
      const script = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `;
      
      const result = await this.client.eval(script, 1, lockKey, lockValue);
      return result === 1;
    } catch (error) {
      console.error('[RedisCache] 释放锁失败:', lockKey, error);
      return false;
    }
  }

  /**
   * 批量获取缓存
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    if (!this.isAvailable()) return keys.map(() => null);

    try {
      const results = await this.client.mget(...keys);
      return results.map((item: string | null) => 
        item ? JSON.parse(item) : null
      );
    } catch (error) {
      console.error('[RedisCache] 批量获取失败:', error);
      return keys.map(() => null);
    }
  }

  /**
   * 批量删除缓存
   */
  async mdel(keys: string[]): Promise<number> {
    if (!this.isAvailable()) return 0;

    try {
      return await this.client.del(...keys);
    } catch (error) {
      console.error('[RedisCache] 批量删除失败:', error);
      return 0;
    }
  }

  /**
   * 缓存预热：批量设置缓存
   */
  async warmup(
    items: Array<{ key: string; value: any; ttl?: number }>
  ): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      const pipeline = this.client.pipeline();
      
      items.forEach(({ key, value, ttl }) => {
        const serialized = JSON.stringify(value);
        if (ttl) {
          pipeline.set(key, serialized, 'EX', ttl);
        } else {
          pipeline.set(key, serialized);
        }
      });
      
      await pipeline.exec();
      console.log(`[RedisCache] 预热完成，共 ${items.length} 项`);
    } catch (error) {
      console.error('[RedisCache] 缓存预热失败:', error);
    }
  }
}

// 导出单例
export const redisCache = new RedisCacheService();

// 默认导出
export default redisCache;

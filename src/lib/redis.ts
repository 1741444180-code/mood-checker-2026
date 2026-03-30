/**
 * Redis 客户端配置
 * 基于 ioredis 的 Redis 连接管理
 */

import Redis from 'ioredis';
import { REDIS_CONFIG } from './cache-config';

let redisClient: Redis | null = null;
let redisConnectionPromise: Promise<Redis> | null = null;

/**
 * 获取 Redis 客户端实例（单例模式）
 * 支持延迟初始化和连接复用
 */
export async function getRedisClient(): Promise<Redis> {
  // 如果已有可用连接，直接返回
  if (redisClient && redisClient.status === 'ready') {
    return redisClient;
  }

  // 如果正在连接中，等待连接完成
  if (redisConnectionPromise) {
    return redisConnectionPromise;
  }

  // 创建新的连接
  redisConnectionPromise = new Promise<Redis>((resolve, reject) => {
    try {
      const client = new Redis({
        host: REDIS_CONFIG.host,
        port: REDIS_CONFIG.port,
        password: REDIS_CONFIG.password,
        db: REDIS_CONFIG.db,
        keyPrefix: REDIS_CONFIG.keyPrefix,
        retryStrategy: REDIS_CONFIG.retryStrategy,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        showFriendlyErrorStack: true,
      });

      client.on('connect', () => {
        console.log('[Redis] 连接到 Redis 服务器');
      });

      client.on('ready', () => {
        console.log('[Redis] Redis 连接就绪');
        redisClient = client;
        redisConnectionPromise = null;
        resolve(client);
      });

      client.on('error', (err) => {
        console.error('[Redis] Redis 错误:', err.message);
        if (!redisClient) {
          redisConnectionPromise = null;
          reject(err);
        }
      });

      client.on('close', () => {
        console.log('[Redis] Redis 连接关闭');
        if (redisClient === client) {
          redisClient = null;
        }
      });

      client.on('reconnecting', () => {
        console.log('[Redis] 正在重新连接 Redis...');
      });

      // 开始连接
      client.connect().catch(reject);
    } catch (error) {
      redisConnectionPromise = null;
      reject(error);
    }
  });

  return redisConnectionPromise;
}

/**
 * 检查 Redis 连接状态
 */
export async function checkRedisConnection(): Promise<{
  connected: boolean;
  latency?: number;
  version?: string;
}> {
  try {
    const startTime = Date.now();
    const client = await getRedisClient();
    
    // 执行 PING 测试延迟
    await client.ping();
    const latency = Date.now() - startTime;
    
    // 获取 Redis 版本
    const info = await client.info('server');
    const versionMatch = info.match(/redis_version:(\d+\.\d+\.\d+)/);
    const version = versionMatch ? versionMatch[1] : 'unknown';
    
    return {
      connected: true,
      latency,
      version,
    };
  } catch (error) {
    console.error('[Redis] 连接检查失败:', error);
    return {
      connected: false,
    };
  }
}

/**
 * 关闭 Redis 连接
 * 通常在应用关闭时调用
 */
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.quit();
      console.log('[Redis] Redis 连接已关闭');
    } catch (error) {
      console.error('[Redis] 关闭连接失败:', error);
    } finally {
      redisClient = null;
      redisConnectionPromise = null;
    }
  }
}

/**
 * 创建新的 Redis 客户端（用于特殊场景）
 * 不共享单例连接
 */
export function createRedisClient(options?: Partial<typeof REDIS_CONFIG>): Redis {
  const config = { ...REDIS_CONFIG, ...options };
  
  return new Redis({
    host: config.host,
    port: config.port,
    password: config.password,
    db: config.db,
    keyPrefix: config.keyPrefix,
    retryStrategy: config.retryStrategy,
  });
}

// 导出默认客户端
export default getRedisClient;

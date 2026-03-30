/**
 * 缓存中间件
 * 用于 Next.js API 路由的缓存处理
 */

import { NextRequest, NextResponse } from 'next/server';
import { cacheUtils } from '../lib/cache';
import { CACHE_TTL } from '../lib/cache-config';

/**
 * 缓存中间件配置
 */
export interface CacheMiddlewareConfig {
  ttl?: number; // 缓存时间（秒）
  key?: string | ((req: NextRequest) => string); // 缓存键
  methods?: string[]; // 需要缓存的 HTTP 方法
  varyByQuery?: boolean; // 是否根据查询参数区分缓存
  varyByHeader?: string[]; // 是否根据请求头区分缓存
  skipWhen?: (req: NextRequest) => boolean; // 跳过缓存的条件
  transformKey?: (key: string) => string; // 自定义缓存键转换
}

/**
 * 缓存中间件
 * 
 * 用法:
 * export const GET = cacheMiddleware(async (req) => {
 *   // 你的处理逻辑
 *   return NextResponse.json({ data: '...' });
 * }, { ttl: 300 });
 */
export function cacheMiddleware<T extends NextRequest>(
  handler: (req: T) => Promise<NextResponse>,
  config: CacheMiddlewareConfig = {}
) {
  const {
    ttl = CACHE_TTL.DEFAULT,
    key,
    methods = ['GET'],
    varyByQuery = true,
    varyByHeader = [],
    skipWhen,
    transformKey = (k) => k,
  } = config;

  return async (req: T): Promise<NextResponse> => {
    // 检查是否应该跳过缓存
    if (skipWhen?.(req)) {
      return handler(req);
    }

    // 检查请求方法
    if (!methods.includes(req.method)) {
      return handler(req);
    }

    // 生成缓存键
    const cacheKey = generateCacheKey(req, {
      customKey: key,
      varyByQuery,
      varyByHeader,
      transformKey,
    });

    // 尝试从缓存获取
    const cachedResponse = await cacheUtils.get<string>(cacheKey);
    if (cachedResponse) {
      console.log(`[CacheMiddleware] 缓存命中: ${cacheKey}`);
      
      const parsed = JSON.parse(cachedResponse);
      return new NextResponse(parsed.body, {
        status: parsed.status,
        headers: {
          ...parsed.headers,
          'X-Cache': 'HIT',
          'X-Cache-Key': cacheKey,
        },
      });
    }

    console.log(`[CacheMiddleware] 缓存未命中: ${cacheKey}`);

    // 执行处理函数
    const response = await handler(req);

    // 只缓存成功的响应
    if (response.status >= 200 && response.status < 300) {
      const responseClone = response.clone();
      
      try {
        const body = await responseClone.text();
        const headers: Record<string, string> = {};
        
        for (const [key, value] of responseClone.headers.entries()) {
          headers[key] = value;
        }

        await cacheUtils.set(
          cacheKey,
          {
            body,
            status: responseClone.status,
            headers,
          },
          ttl
        );
        
        console.log(`[CacheMiddleware] 已缓存: ${cacheKey}, TTL: ${ttl}s`);
      } catch (error) {
        console.error('[CacheMiddleware] 缓存响应失败:', error);
      }
    }

    // 添加缓存相关响应头
    const responseWithHeaders = new NextResponse(response.body, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        'X-Cache': 'MISS',
        'X-Cache-Key': cacheKey,
        'Cache-Control': `public, max-age=${ttl}`,
      },
    });

    return responseWithHeaders;
  };
}

/**
 * 生成缓存键
 */
function generateCacheKey(
  req: NextRequest,
  options: {
    customKey?: string | ((req: NextRequest) => string);
    varyByQuery: boolean;
    varyByHeader: string[];
    transformKey: (key: string) => string;
  }
): string {
  const { customKey, varyByQuery, varyByHeader, transformKey } = options;

  // 如果有自定义键生成函数，使用它
  if (typeof customKey === 'function') {
    return transformKey(customKey(req));
  }

  // 如果有自定义键，直接使用
  if (typeof customKey === 'string') {
    return transformKey(customKey);
  }

  // 默认：基于 URL 生成键
  const url = new URL(req.url);
  let key = `${req.method}:${url.pathname}`;

  // 添加查询参数
  if (varyByQuery) {
    const queryParams = Array.from(url.searchParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    
    if (queryParams) {
      key += `?${queryParams}`;
    }
  }

  // 添加指定的请求头
  if (varyByHeader.length > 0) {
    const headerValues = varyByHeader
      .map(header => `${header}:${req.headers.get(header) || ''}`)
      .join('|');
    
    if (headerValues) {
      key += `|headers:${headerValues}`;
    }
  }

  return transformKey(key);
}

/**
 * 缓存失效中间件
 * 用于在特定操作后清除相关缓存
 */
export function invalidateCache(patterns: string | string[]) {
  const patternList = Array.isArray(patterns) ? patterns : [patterns];

  return async function invalidate(): Promise<void> {
    for (const pattern of patternList) {
      await cacheUtils.del(pattern);
      console.log(`[CacheMiddleware] 缓存已失效: ${pattern}`);
    }
  };
}

/**
 * 快捷缓存装饰器（用于类方法）
 */
export function Cached(ttl?: number, keyPrefix?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${keyPrefix || 'method'}:${propertyKey}:${JSON.stringify(args)}`;
      
      // 尝试从缓存获取
      const cached = await cacheUtils.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // 执行原方法
      const result = await originalMethod.apply(this, args);

      // 缓存结果
      await cacheUtils.set(cacheKey, result, ttl);

      return result;
    };

    return descriptor;
  };
}

/**
 * 批量缓存失效工具
 */
export const cacheInvalidation = {
  /**
   * 失效用户相关缓存
   */
  user: async (userId: string) => {
    await cacheUtils.del(`mimi:user:${userId}`);
    await cacheUtils.del(`mimi:user:${userId}:*`);
  },

  /**
   * 失效打卡相关缓存
   */
  checkin: async (userId: string) => {
    await cacheUtils.del(`mimi:checkin:list:${userId}*`);
    await cacheUtils.del(`mimi:checkin:stats:${userId}*`);
  },

  /**
   * 失效点赞相关缓存
   */
  like: async (targetId: string) => {
    await cacheUtils.del(`mimi:like:count:${targetId}`);
    await cacheUtils.del(`mimi:like:status:*:${targetId}`);
  },

  /**
   * 失效分析相关缓存
   */
  analysis: async (type?: string) => {
    if (type) {
      await cacheUtils.del(`mimi:analysis:stats:${type}*`);
      await cacheUtils.del(`mimi:analysis:trend:${type}*`);
    } else {
      await cacheUtils.del(`mimi:analysis:*`);
    }
  },

  /**
   * 失效导出相关缓存
   */
  export: async (userId?: string) => {
    if (userId) {
      await cacheUtils.del(`mimi:export:*:${userId}*`);
    } else {
      await cacheUtils.del(`mimi:export:*`);
    }
  },

  /**
   * 失效所有缓存（谨慎使用）
   */
  all: async () => {
    await cacheUtils.del(`mimi:*`);
  },
};

export default cacheMiddleware;

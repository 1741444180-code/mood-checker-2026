/**
 * 推送通知服务
 * 支持 Web Push 和移动端推送
 */

import { prisma } from '@/lib/prisma';

// VAPID 密钥配置（生产环境应从环境变量读取）
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT; // 你的联系邮箱

/**
 * 推送订阅接口
 */
export interface PushSubscription {
  endpoint: string;
  expirationTime?: string | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

/**
 * 保存用户的推送订阅
 */
export async function savePushSubscription(
  userId: string,
  subscription: PushSubscription
) {
  try {
    // 检查是否已存在相同的订阅
    const existing = await prisma.pushSubscription.findFirst({
      where: {
        userId,
        endpoint: subscription.endpoint,
      },
    });

    if (existing) {
      // 更新现有订阅
      await prisma.pushSubscription.update({
        where: { id: existing.id },
        data: {
          subscription: JSON.stringify(subscription),
          expiresAt: subscription.expirationTime
            ? new Date(subscription.expirationTime)
            : null,
        },
      });
      return existing;
    }

    // 创建新订阅
    const created = await prisma.pushSubscription.create({
      data: {
        userId,
        endpoint: subscription.endpoint,
        subscription: JSON.stringify(subscription),
        expiresAt: subscription.expirationTime
          ? new Date(subscription.expirationTime)
          : null,
      },
    });

    return created;
  } catch (error) {
    console.error('保存推送订阅失败:', error);
    throw error;
  }
}

/**
 * 获取用户的所有推送订阅
 */
export async function getUserSubscriptions(userId: string) {
  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return subscriptions.map((sub) => ({
      ...sub,
      subscription: JSON.parse(sub.subscription) as PushSubscription,
    }));
  } catch (error) {
    console.error('获取用户订阅失败:', error);
    return [];
  }
}

/**
 * 删除推送订阅
 */
export async function removePushSubscription(
  userId: string,
  endpoint: string
) {
  try {
    await prisma.pushSubscription.deleteMany({
      where: {
        userId,
        endpoint,
      },
    });
    return true;
  } catch (error) {
    console.error('删除推送订阅失败:', error);
    return false;
  }
}

/**
 * 发送推送通知
 */
export async function sendPushNotification(
  userId: string,
  title: string,
  message: string,
  data?: {
    notificationId?: string;
    url?: string;
    icon?: string;
    badge?: string;
  }
) {
  try {
    const subscriptions = await getUserSubscriptions(userId);

    if (subscriptions.length === 0) {
      console.log(`用户 ${userId} 没有推送订阅`);
      return { success: false, sent: 0 };
    }

    const payload = JSON.stringify({
      title,
      body: message,
      icon: data?.icon || '/icon-192x192.png',
      badge: data?.badge || '/badge-72x72.png',
      data: {
        notificationId: data?.notificationId,
        url: data?.url || '/notifications',
        timestamp: Date.now(),
      },
    });

    let sentCount = 0;
    const errors: string[] = [];

    // 并发发送所有订阅
    const promises = subscriptions.map(async (sub) => {
      try {
        // 检查订阅是否过期
        if (sub.expiresAt && new Date(sub.expiresAt) < new Date()) {
          await removePushSubscription(userId, sub.endpoint);
          return;
        }

        const response = await fetch(sub.subscription.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 这里需要添加 Web Push 加密和认证头
            // 生产环境应使用 web-push 库
          },
          body: payload,
        });

        if (response.ok) {
          sentCount++;
        } else if (response.status === 410) {
          // 订阅已失效，删除
          await removePushSubscription(userId, sub.endpoint);
        } else {
          errors.push(`发送失败：${response.status}`);
        }
      } catch (error) {
        console.error(`发送到 ${sub.endpoint} 失败:`, error);
        errors.push(error instanceof Error ? error.message : '未知错误');
      }
    });

    await Promise.allSettled(promises);

    return {
      success: sentCount > 0,
      sent: sentCount,
      total: subscriptions.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error('发送推送通知失败:', error);
    return { success: false, sent: 0, error: '发送失败' };
  }
}

/**
 * 广播推送通知给多个用户
 */
export async function broadcastPushNotification(
  userIds: string[],
  title: string,
  message: string,
  data?: {
    url?: string;
    icon?: string;
    badge?: string;
  }
) {
  const results = await Promise.all(
    userIds.map((userId) =>
      sendPushNotification(userId, title, message, data)
    )
  );

  const totalSent = results.reduce((sum, r) => sum + r.sent, 0);
  const totalUsers = userIds.length;

  return {
    success: totalSent > 0,
    sent: totalSent,
    totalUsers,
    results,
  };
}

/**
 * 获取 VAPID 公钥（用于前端初始化推送）
 */
export function getVapidPublicKey() {
  return VAPID_PUBLIC_KEY;
}

/**
 * 检查推送是否可用
 */
export function isPushAvailable() {
  return !!(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);
}

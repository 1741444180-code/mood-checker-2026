/**
 * WebSocket 消息类型定义
 * 用于服务器推送通知到客户端
 */

// 消息类型枚举
export enum MessageType {
  // 通知相关
  NOTIFICATION_NEW = 'notification:new',
  NOTIFICATION_READ = 'notification:read',
  NOTIFICATION_READ_ALL = 'notification:read_all',
  
  // 连接管理
  CONNECTION_ACK = 'connection:ack',
  CONNECTION_ERROR = 'connection:error',
  
  // 心跳
  PING = 'ping',
  PONG = 'pong',
}

// 基础消息接口
export interface BaseMessage {
  type: MessageType;
  timestamp: number;
}

// 通知数据接口
export interface NotificationData {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
  readAt?: Date | null;
}

// 新通知消息
export interface NewNotificationMessage extends BaseMessage {
  type: MessageType.NOTIFICATION_NEW;
  data: NotificationData;
}

// 通知已读消息
export interface NotificationReadMessage extends BaseMessage {
  type: MessageType.NOTIFICATION_READ;
  data: {
    notificationId: string;
    readAt: Date;
  };
}

// 全部已读消息
export interface NotificationReadAllMessage extends BaseMessage {
  type: MessageType.NOTIFICATION_READ_ALL;
  data: {
    count: number;
    readAt: Date;
  };
}

// 连接确认消息
export interface ConnectionAckMessage extends BaseMessage {
  type: MessageType.CONNECTION_ACK;
  data: {
    userId: string;
    connectedAt: Date;
  };
}

// 连接错误消息
export interface ConnectionErrorMessage extends BaseMessage {
  type: MessageType.CONNECTION_ERROR;
  data: {
    error: string;
    code?: string;
  };
}

// 心跳消息
export interface PingMessage extends BaseMessage {
  type: MessageType.PING;
}

export interface PongMessage extends BaseMessage {
  type: MessageType.PONG;
  data: {
    latency?: number;
  };
}

// 联合类型
export type WebSocketMessage =
  | NewNotificationMessage
  | NotificationReadMessage
  | NotificationReadAllMessage
  | ConnectionAckMessage
  | ConnectionErrorMessage
  | PingMessage
  | PongMessage;

/**
 * 创建消息的辅助函数
 */
export function createMessage<T extends BaseMessage>(
  type: T['type'],
  data?: T extends { data: any } ? T['data'] : never
): T {
  return {
    type,
    timestamp: Date.now(),
    ...(data ? { data } : {}),
  } as T;
}

/**
 * 创建新通知消息
 */
export function createNewNotificationMessage(
  notification: NotificationData
): NewNotificationMessage {
  return createMessage(MessageType.NOTIFICATION_NEW, notification);
}

/**
 * 创建通知已读消息
 */
export function createNotificationReadMessage(
  notificationId: string,
  readAt: Date
): NotificationReadMessage {
  return createMessage(MessageType.NOTIFICATION_READ, {
    notificationId,
    readAt,
  });
}

/**
 * 创建全部已读消息
 */
export function createNotificationReadAllMessage(
  count: number,
  readAt: Date
): NotificationReadAllMessage {
  return createMessage(MessageType.NOTIFICATION_READ_ALL, {
    count,
    readAt,
  });
}

/**
 * 创建连接确认消息
 */
export function createConnectionAckMessage(
  userId: string
): ConnectionAckMessage {
  return createMessage(MessageType.CONNECTION_ACK, {
    userId,
    connectedAt: new Date(),
  });
}

/**
 * 创建连接错误消息
 */
export function createConnectionErrorMessage(
  error: string,
  code?: string
): ConnectionErrorMessage {
  return createMessage(MessageType.CONNECTION_ERROR, {
    error,
    code,
  });
}

/**
 * 创建心跳消息
 */
export function createPingMessage(): PingMessage {
  return createMessage(MessageType.PING);
}

export function createPongMessage(latency?: number): PongMessage {
  return createMessage(MessageType.PONG, { latency });
}

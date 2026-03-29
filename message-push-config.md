# 消息推送配置文档

## 概述

本文档描述了基于WebSocket的实时消息推送系统的配置和使用方法。系统复用了Day6的WebSocket服务器，并扩展了消息队列功能（可选Redis支持）。

## 技术栈

- **WebSocket**: 实时双向通信
- **Redis** (可选): 消息队列和持久化
- **TypeScript**: 类型安全的实现

## 目录结构

```
src/
  └── lib/
      └── websocket-messages.ts    # WebSocket消息推送核心逻辑

scripts/
  └── test-message-push.sh        # 消息推送测试脚本

websocket-server/
  └── server.js                   # WebSocket服务器 (Day6)
```

## 配置说明

### 1. WebSocket服务器配置

WebSocket服务器位于 `websocket-server/server.js`，已配置以下特性：

- **健康检查端点**: `/health`
- **压缩支持**: perMessageDeflate 启用
- **错误处理**: 完善的错误和连接管理
- **日志记录**: 连接/断开/消息日志

### 2. 消息推送服务配置

`src/lib/websocket-messages.ts` 提供了完整的消息推送服务：

#### 核心功能

- **连接管理**: 自动维护客户端连接池
- **心跳机制**: 30秒ping/pong检测连接状态
- **消息广播**: 向所有客户端发送消息
- **用户定向**: 向特定用户发送消息
- **消息队列**: 支持Redis队列（可选）
- **认证支持**: 用户身份验证

#### 接口说明

| 方法 | 参数 | 描述 |
|------|------|------|
| `initWebSocketMessageService` | wss, redisOptions | 初始化消息服务 |
| `broadcastMessage` | payload | 广播消息给所有客户端 |
| `sendMessageToUser` | userId, payload | 发送消息给特定用户 |
| `pushMessageToQueue` | queueName, payload | 推送消息到队列 |
| `consumeMessageQueue` | queueName | 从队列消费消息 |
| `getConnectionCount` | - | 获取当前连接数 |
| `getActiveUserCount` | - | 获取活跃用户数 |

#### 消息格式

所有消息遵循统一的JSON格式：

```json
{
  "type": "message_type",
  "data": { /* 具体数据 */ },
  "timestamp": 1640995200000,
  "messageId": "optional_id"
}
```

### 3. Redis配置（可选）

如果需要使用Redis作为消息队列，需要提供以下配置：

```javascript
const redisOptions = {
  host: 'localhost',    // Redis主机
  port: 6379,          // Redis端口
  password: 'optional' // Redis密码（可选）
};
```

Redis提供以下优势：
- **消息持久化**: 防止服务重启丢失消息
- **队列管理**: 支持多队列和优先级
- **高可用**: 支持Redis集群

### 4. 环境变量

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| `PORT` | 8080 | WebSocket服务器端口 |
| `REDIS_HOST` | localhost | Redis主机地址 |
| `REDIS_PORT` | 6379 | Redis端口 |
| `REDIS_PASSWORD` | (空) | Redis密码 |

## 使用示例

### 服务端集成

```typescript
import { WebSocket } from 'ws';
import { WebSocketMessageService } from './src/lib/websocket-messages';

// 创建WebSocket服务器
const wss = new WebSocket.Server({ server });

// 初始化消息服务（带Redis）
const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD
};

WebSocketMessageService.init(wss, redisOptions);

// 发送实时通知
WebSocketMessageService.broadcastMessage({
  type: 'notification',
  data: { title: '系统通知', content: '新功能上线！' },
  timestamp: Date.now()
});
```

### 客户端使用

```javascript
// 连接WebSocket
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  console.log('Connected');
  
  // 认证用户
  ws.send(JSON.stringify({
    type: 'authenticate',
    data: { userId: 'user123' }
  }));
  
  // 订阅频道（如果使用Redis pub/sub）
  ws.send(JSON.stringify({
    type: 'subscribe',
    data: { channel: 'notifications' }
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message);
  
  switch (message.type) {
    case 'notification':
      // 处理通知
      showNotification(message.data);
      break;
    case 'error':
      // 处理错误
      console.error(message.data.message);
      break;
  }
};
```

## 测试

使用提供的测试脚本验证消息推送功能：

```bash
chmod +x scripts/test-message-push.sh
./scripts/test-message-push.sh
```

## 监控指标

- **连接数**: `getConnectionCount()`
- **活跃用户数**: `getActiveUserCount()`
- **消息延迟**: 通过timestamp计算
- **错误率**: 日志中的错误信息

## 故障排除

### 常见问题

1. **连接失败**
   - 检查WebSocket服务器是否运行
   - 验证防火墙设置
   - 确认端口是否正确

2. **消息丢失**
   - 检查Redis连接（如果启用）
   - 验证客户端连接状态
   - 查看服务端日志

3. **性能问题**
   - 监控连接数和内存使用
   - 考虑使用Redis分担负载
   - 优化消息频率

### 日志位置

- WebSocket服务器日志: 控制台输出
- Redis连接日志: 控制台输出
- 错误日志: `console.error` 输出

## 扩展性

系统设计支持以下扩展：

- **多服务器部署**: 通过Redis pub/sub同步消息
- **消息过滤**: 基于用户角色或权限的消息路由
- **离线消息**: Redis队列存储离线消息
- **消息确认**: 客户端确认接收机制

## 版本信息

- **文档版本**: 1.0
- **最后更新**: 2026-03-29
- **作者**: 老张（运维工程师）
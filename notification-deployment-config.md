# 推送服务和 WebSocket 服务器部署配置

## 1. 概述

本文档详细说明了心情打卡网站的推送通知服务和 WebSocket 服务器的部署配置。

## 2. Firebase 配置

### 2.1 创建 Firebase 项目

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Cloud Messaging API

### 2.2 生成服务账号密钥

1. 在 Firebase Console 中，进入 **Project Settings** > **Service Accounts**
2. 点击 **Generate new private key**
3. 下载 JSON 文件并重命名为 `firebase-service-account.json`
4. 将文件放置在项目根目录

### 2.3 安全存储

- **不要**将 `firebase-service-account.json` 提交到 Git
- 使用 `.gitignore` 排除该文件
- 生产环境中使用环境变量或密钥管理服务

## 3. WebSocket 服务器配置

### 3.1 服务器功能

- WebSocket 连接管理
- 消息广播和单播
- 健康检查端点 `/health`
- 自动压缩（perMessageDeflate）
- 错误处理和日志记录

### 3.2 性能优化

- 支持 100+ 并发连接
- 消息延迟 < 500ms
- 启用消息压缩减少带宽使用

### 3.3 部署要求

- Node.js 18+
- Redis 7+（用于消息队列）
- 环境变量配置

## 4. Vercel 配置

### 4.1 环境变量

在 Vercel 项目设置中配置以下环境变量：

```
FIREBASE_PROJECT_ID=your-project-id
ONESIGNAL_APP_ID=your-app-id
ONESIGNAL_API_KEY=your-api-key
REDIS_HOST=your-redis-host
REDIS_PORT=6379
```

### 4.2 路由配置

`vercel.json` 配置了：
- 静态资源缓存策略
- 安全头信息
- API 重写规则

### 4.3 WebSocket 注意事项

Vercel Serverless Functions 不支持长时间运行的 WebSocket 连接。WebSocket 服务器需要部署到支持长连接的平台（如 Railway、Render 或自托管服务器）。

## 5. 部署步骤

### 5.1 准备阶段

1. 复制 `.env.example` 到 `.env` 并填入实际值
2. 配置 `firebase-service-account.json`
3. 确保 Redis 服务可用

### 5.2 本地测试

```bash
# 启动 WebSocket 服务器
cd websocket-server
npm install
node server.js

# 测试健康检查
curl http://localhost:8080/health

# 运行测试脚本
./scripts/test-websocket.sh
```

### 5.3 CI/CD 部署

1. 推送代码到 main 分支
2. GitHub Actions 自动触发部署流程
3. Vercel 部署前端和 API
4. Railway 部署 WebSocket 服务器

### 5.4 验证部署

- 检查 Vercel 部署状态
- 验证 WebSocket 服务器健康检查
- 测试推送通知功能
- 监控系统性能指标

## 6. 监控方案

### 6.1 健康检查

- WebSocket 服务器：`/health` 端点
- Vercel 应用：内置监控
- Redis：连接状态监控

### 6.2 日志收集

- WebSocket 服务器日志
- 推送服务日志
- 错误日志聚合

### 6.3 性能监控

- 连接数监控
- 消息延迟监控
- 系统资源使用率

## 7. 故障排查

### 7.1 常见问题

#### WebSocket 连接失败
- 检查防火墙设置
- 验证端口是否开放
- 确认 SSL 证书配置

#### 推送通知不工作
- 验证 Firebase 配置
- 检查服务账号权限
- 确认设备订阅状态

#### 性能问题
- 监控 Redis 性能
- 检查系统资源使用
- 优化消息处理逻辑

### 7.2 调试命令

```bash
# 查看 WebSocket 服务器日志
docker logs websocket-server

# 测试 Firebase 连接
node scripts/test-firebase.js

# 检查 Redis 连接
redis-cli ping
```

## 8. 安全考虑

### 8.1 密钥管理

- Firebase 私钥加密存储
- 环境变量不提交到版本控制
- 使用密钥管理服务（生产环境）

### 8.2 连接安全

- WebSocket 使用 WSS（WebSocket Secure）
- 实施连接认证
- 限制连接频率防止滥用

### 8.3 数据保护

- 用户数据加密传输
- 实施访问控制
- 定期安全审计

---

**最后更新**: 2026年3月30日  
**版本**: 1.0  
**作者**: 老张（运维工程师）
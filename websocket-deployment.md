# WebSocket 部署配置指南

## 概述
本文档详细说明了如何使用 Docker + Nginx + SSL 配置 WebSocket 服务器部署，支持 WSS (WebSocket Secure) 加密连接。

## 目录结构
```
.
├── docker-compose.websocket.yml    # Docker Compose 配置文件
├── nginx/
│   └── websocket.conf             # Nginx 配置文件
├── websocket-server/              # WebSocket 服务器代码
│   ├── package.json
│   └── server.js
├── ssl/                           # SSL 证书目录（需手动创建）
└── logs/                          # 日志目录（自动生成）
```

## 部署步骤

### 1. 准备 SSL 证书
在生产环境中，您需要获取有效的 SSL 证书。可以使用 Let's Encrypt 免费证书：

```bash
# 创建 SSL 目录
mkdir -p ssl logs/nginx

# 使用 Certbot 获取证书（示例）
# certbot certonly --standalone -d your-domain.com
# 然后将证书文件复制到 ssl 目录：
# cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/
# cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/
```

**注意**: 在 `ssl/` 目录中需要包含以下文件：
- `fullchain.pem` - 完整的证书链
- `privkey.pem` - 私钥文件

### 2. 配置域名
编辑 `nginx/websocket.conf` 文件，将 `server_name localhost;` 替换为您的实际域名：

```nginx
server_name your-domain.com;
```

### 3. 启动服务
使用 Docker Compose 启动所有服务：

```bash
# 启动服务
docker-compose -f docker-compose.websocket.yml up -d

# 查看服务状态
docker-compose -f docker-compose.websocket.yml ps

# 查看日志
docker-compose -f docker-compose.websocket.yml logs -f
```

### 4. 验证部署

#### 健康检查
```bash
# HTTP 健康检查（应该重定向到 HTTPS）
curl -I http://localhost/health

# HTTPS 健康检查
curl https://localhost/health
```

#### WebSocket 连接测试
使用 `wscat` 工具测试 WebSocket 连接：

```bash
# 安装 wscat
npm install -g wscat

# 测试 WSS 连接（替换 your-domain.com 为实际域名）
wscat -c wss://your-domain.com

# 如果使用自签名证书，添加 --no-check 选项
wscat -c wss://localhost --no-check
```

预期输出：
```
Connected to WebSocket server successfully!
```

发送测试消息：
```
> Hello WebSocket!
< Echo: Hello WebSocket!
```

### 5. 生产环境优化建议

#### 内存和 CPU 限制
在 `docker-compose.websocket.yml` 中为服务添加资源限制：

```yaml
websocket-server:
  # ... 其他配置
  deploy:
    resources:
      limits:
        memory: 512M
        cpus: '0.5'
```

#### 日志轮转
Nginx 日志会自动保存到 `logs/nginx/` 目录。建议配置 logrotate 进行日志轮转。

#### 监控和告警
- 监控 WebSocket 连接数
- 监控内存使用情况
- 设置健康检查告警

## 故障排除

### 常见问题

#### 1. WebSocket 连接失败
- 检查 Nginx 配置中的 `Upgrade` 和 `Connection` 头部是否正确设置
- 确认 SSL 证书有效且路径正确
- 检查防火墙是否开放 443 端口

#### 2. 证书错误
- 确保证书文件权限正确：`chmod 600 ssl/*.pem`
- 确保证书未过期
- 对于自签名证书，客户端需要配置信任

#### 3. 性能问题
- 调整 `proxy_read_timeout` 和 `proxy_send_timeout` 值
- 考虑使用 Redis 或其他消息队列处理大量并发连接

### 调试命令

```bash
# 检查 Nginx 配置语法
docker exec websocket-nginx nginx -t

# 查看 WebSocket 服务器日志
docker logs websocket-server

# 查看 Nginx 访问日志
tail -f logs/nginx/access.log

# 查看 Nginx 错误日志
tail -f logs/nginx/error.log
```

## 安全注意事项

1. **SSL/TLS 配置**: 使用强加密套件，禁用不安全的协议版本
2. **证书管理**: 定期更新证书，使用自动化工具（如 Certbot）管理续期
3. **输入验证**: 在 WebSocket 服务器端对所有消息进行验证和清理
4. **速率限制**: 实现连接和消息速率限制以防止 DoS 攻击
5. **网络隔离**: 使用 Docker 网络隔离服务，限制不必要的端口暴露

## 维护

### 更新 WebSocket 服务器
1. 更新 `websocket-server/` 目录中的代码
2. 重新构建并重启服务：
   ```bash
   docker-compose -f docker-compose.websocket.yml down
   docker-compose -f docker-compose.websocket.yml up -d
   ```

### 证书续期
如果使用 Let's Encrypt，可以设置 cron job 自动续期：

```bash
# 示例 cron job（每月1号）
0 0 1 * * cd /path/to/project && certbot renew && docker restart websocket-nginx
```

## 技术栈说明

- **Docker**: 容器化部署，确保环境一致性
- **Nginx**: 反向代理，处理 SSL 终止和 WebSocket 协议升级
- **Node.js + ws**: 轻量级 WebSocket 服务器实现
- **SSL/TLS**: 提供 WSS 加密连接，确保数据传输安全

---
**最后更新**: 2026-03-29  
**维护者**: 老张（运维工程师）
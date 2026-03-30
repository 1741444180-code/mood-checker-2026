# 排行榜缓存配置文档

## 概述

本文档描述了鱼虾蟹游戏排行榜数据的 Redis 缓存配置方案。该方案包括：
- Redis Docker 容器配置
- 排行榜定时刷新机制（每 5 分钟）
- 缓存过期策略
- 缓存清理脚本

## 技术栈

- **Redis 7**: 高性能内存数据库，用于缓存排行榜数据
- **Docker Compose**: 容器编排
- **Bash 脚本**: 定时任务和缓存管理
- **Cron**: 定时任务调度

## 目录结构

```
.
├── docker-compose.redis.yml    # Redis Docker 配置文件
├── redis.conf                  # Redis 服务器配置文件
├── scripts/
│   ├── refresh-leaderboard.sh  # 排行榜刷新脚本
│   └── clean-leaderboard-cache.sh  # 缓存清理脚本
└── leaderboard-cache-config.md # 本文档
```

## Redis 配置详情

### Docker 配置 (`docker-compose.redis.yml`)

- **镜像**: `redis:7-alpine` (轻量级)
- **端口**: 6379 (默认 Redis 端口)
- **持久化**: 启用 RDB 持久化，数据存储在 `./redis-data` 卷中
- **配置文件**: 挂载自定义 `redis.conf`
- **健康检查**: 自动检测 Redis 服务状态
- **重启策略**: `unless-stopped` (除非手动停止，否则自动重启)

### Redis 服务器配置 (`redis.conf`)

- **内存限制**: 256MB 最大内存
- **内存淘汰策略**: `allkeys-lru` (当内存不足时，删除最近最少使用的键)
- **密码认证**: 启用密码保护 (`leaderboard_cache_2026`)
- **持久化**: 启用 RDB 快照
  - 900秒内至少1个key变化则保存
  - 300秒内至少10个key变化则保存  
  - 60秒内至少10000个key变化则保存
- **数据库**: 16个数据库 (默认使用 DB 0)

## 排行榜数据结构

排行榜使用 Redis **Sorted Set (ZSET)** 数据结构存储：

- **键名格式**: `game:leaderboard:{period}`
  - `game:leaderboard:daily` - 日排行榜
  - `game:leaderboard:weekly` - 周排行榜  
  - `game:leaderboard:monthly` - 月排行榜
- **成员**: 玩家ID (字符串)
- **分数**: 玩家得分 (数值，用于排序)

### 缓存过期策略

| 排行榜类型 | 过期时间 | 说明 |
|------------|----------|------|
| 日排行榜 | 86400 秒 (24小时) | 每天重置 |
| 周排行榜 | 604800 秒 (7天) | 每周重置 |
| 月排行榜 | 2592000 秒 (30天) | 每月重置 |

## 定时刷新机制

### 刷新脚本 (`scripts/refresh-leaderboard.sh`)

- **功能**: 从应用数据库获取最新排行榜数据，更新 Redis 缓存
- **执行频率**: 每 5 分钟
- **特性**:
  - 使用 Redis 事务确保数据一致性
  - 自动设置缓存过期时间
  - 包含错误处理和日志记录
  - 支持优雅退出 (处理 SIGINT/SIGTERM)

### Cron 配置示例

将以下行添加到 crontab (`crontab -e`)：

```bash
# 每 5 分钟刷新排行榜缓存
*/5 * * * * /path/to/workspace/scripts/refresh-leaderboard.sh >> /var/log/leaderboard-refresh.log 2>&1
```

## 缓存清理脚本

### 清理脚本 (`scripts/clean-leaderboard-cache.sh`)

提供三种操作模式：

1. **`clean`** (默认): 清理已过期的键，并为没有设置过期时间的键添加过期时间
2. **`force-clean`**: 强制删除所有排行榜缓存键
3. **`stats`**: 显示缓存统计信息

### 使用示例

```bash
# 清理过期缓存
./scripts/clean-leaderboard-cache.sh clean

# 强制清理所有缓存
./scripts/clean-leaderboard-cache.sh force-clean

# 查看缓存统计
./scripts/clean-leaderboard-cache.sh stats
```

## 部署步骤

1. **启动 Redis 服务**:
   ```bash
   docker-compose -f docker-compose.redis.yml up -d
   ```

2. **验证 Redis 连接**:
   ```bash
   redis-cli -h localhost -p 6379 -a leaderboard_cache_2026 ping
   # 应该返回 "PONG"
   ```

3. **设置定时任务**:
   ```bash
   # 编辑 crontab
   crontab -e
   
   # 添加定时任务行 (替换实际路径)
   */5 * * * * /full/path/to/scripts/refresh-leaderboard.sh >> /var/log/leaderboard-refresh.log 2>&1
   ```

4. **测试刷新脚本**:
   ```bash
   ./scripts/refresh-leaderboard.sh
   ```

5. **验证数据**:
   ```bash
   # 查看排行榜数据
   redis-cli -h localhost -p 6379 -a leaderboard_cache_2026 ZRANGE game:leaderboard:daily 0 -1 WITHSCORES
   ```

## 监控和维护

### 日志监控

- 刷新脚本日志: `/var/log/leaderboard-refresh.log` (根据 cron 配置)
- Redis 日志: 通过 `docker logs redis-leaderboard` 查看

### 性能监控

- 内存使用: `redis-cli INFO memory`
- 连接数: `redis-cli INFO clients`  
- 命令统计: `redis-cli INFO commandstats`

### 故障排除

1. **Redis 无法连接**:
   - 检查 Docker 容器状态: `docker ps`
   - 验证端口是否被占用: `netstat -tlnp | grep 6379`
   - 检查防火墙设置

2. **缓存未更新**:
   - 检查 cron 服务是否运行: `systemctl status cron`
   - 验证脚本路径和权限
   - 检查日志文件中的错误信息

3. **内存不足**:
   - 调整 `redis.conf` 中的 `maxmemory` 设置
   - 考虑优化排行榜数据结构或减少缓存项

## 安全考虑

- **密码保护**: Redis 实例受密码保护，避免未授权访问
- **网络绑定**: 绑定到 `0.0.0.0` 允许外部连接，生产环境中建议限制到特定 IP
- **定期备份**: RDB 持久化提供基本的数据备份能力

## 扩展性

- **多实例支持**: 可以通过修改端口和配置文件轻松部署多个 Redis 实例
- **集群模式**: 对于高并发场景，可以考虑 Redis Cluster 部署
- **监控集成**: 可以集成 Prometheus + Grafana 进行更详细的监控

## 版本信息

- **文档版本**: 1.0
- **创建日期**: 2026-03-29
- **维护者**: 老张 (运维工程师)
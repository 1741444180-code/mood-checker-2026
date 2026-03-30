# 日志存储配置方案

## 概述

本文档描述了应用程序的日志存储配置方案，包括文件日志和数据库日志的实现、日志轮转策略以及日志清理机制。

## 技术栈

- **日志库**: Winston + Winston Daily Rotate File
- **日志轮转**: 基于日期和大小的自动轮转
- **日志清理**: Shell 脚本 + 定时任务 (cron)
- **保留策略**: 30天

## 日志存储方案

### 文件日志

- **位置**: `./logs/` 目录
- **格式**: JSON 格式，包含时间戳、日志级别、消息和元数据
- **文件命名**: `application-YYYY-MM-DD.log`
- **轮转策略**: 
  - 按日期轮转（每日一个文件）
  - 单个文件最大 20MB
  - 自动压缩归档（.gz 格式）
  - 保留 30 天的历史日志

### 数据库日志

- **存储内容**: 仅错误级别（error）及以上的日志
- **表结构建议**:
  ```sql
  CREATE TABLE logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    level VARCHAR(10) NOT NULL,
    message TEXT NOT NULL,
    meta JSON,
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```
- **索引建议**: 在 `level` 和 `timestamp` 字段上创建索引以提高查询性能

## 日志轮转配置

日志轮转通过 `winston-daily-rotate-file` 实现，配置参数如下：

| 参数 | 值 | 说明 |
|------|-----|------|
| filename | `logs/application-%DATE%.log` | 日志文件命名模板 |
| datePattern | `YYYY-MM-DD` | 日期格式 |
| zippedArchive | `true` | 启用压缩归档 |
| maxSize | `20m` | 单个文件最大大小 |
| maxFiles | `30d` | 保留30天的日志 |

## 日志清理脚本

### 脚本位置
`scripts/cleanup-logs.sh`

### 功能说明
- 自动删除超过30天的日志文件（包括 `.log` 和 `.log.gz` 文件）
- 清理空目录
- 提供详细的执行日志

### 使用方法
```bash
# 手动执行
./scripts/cleanup-logs.sh

# 添加到定时任务（每日凌晨2点执行）
0 2 * * * /path/to/project/scripts/cleanup-logs.sh >> /path/to/project/logs/cleanup.log 2>&1
```

## 集成指南

### 安装依赖
```bash
npm install winston winston-daily-rotate-file
```

### 在应用中使用
```typescript
import logger from './lib/logger-config';

// 使用示例
logger.info('应用启动成功');
logger.error('数据库连接失败', { error: dbError });
logger.debug('调试信息', { userId: 123, action: 'login' });
```

### 环境变量配置
- `NODE_ENV`: 设置为 `production` 时，控制台只输出 `info` 及以上级别的日志

## 监控与维护

1. **定期检查**: 确保定时任务正常运行
2. **磁盘空间监控**: 监控 `./logs` 目录的磁盘使用情况
3. **日志质量**: 定期审查日志内容，确保包含足够的上下文信息用于问题排查

## 故障排除

### 日志文件未生成
- 检查 `./logs` 目录是否存在且有写入权限
- 检查应用是否有足够的权限创建文件

### 日志轮转不工作
- 确认 `winston-daily-rotate-file` 版本兼容性
- 检查文件系统时间是否正确

### 清理脚本执行失败
- 检查脚本执行权限 (`chmod +x`)
- 查看清理日志中的错误信息
- 确认定时任务的路径配置正确

## 版本历史

- **v1.0.0** (2026-03-29): 初始版本，实现文件+数据库日志存储、轮转和清理功能
# 监控配置文档

## 概述
本文档详细说明了系统监控配置，包括CPU、内存、磁盘使用率的监控和告警设置。

## 技术栈
- **操作系统**: Linux (通用脚本)
- **容器化**: Docker
- **数据库**: PostgreSQL
- **监控工具**: 自定义Bash脚本 + 系统工具

## 监控组件

### 1. 系统监控脚本 (`scripts/system-monitor.sh`)

#### 功能特性
- **CPU监控**: 实时检查CPU使用率，阈值80%
- **内存监控**: 检查内存使用率，阈值85%
- **磁盘监控**: 检查根分区及其他挂载点使用率，阈值90%
- **日志记录**: 所有检查结果记录到 `/var/log/system-monitor.log`
- **告警通知**: 超过阈值时触发告警（需配置实际通知渠道）

#### 配置参数
| 参数 | 默认值 | 说明 |
|------|--------|------|
| `ALERT_THRESHOLD_CPU` | 80 | CPU使用率告警阈值(%) |
| `ALERT_THRESHOLD_MEM` | 85 | 内存使用率告警阈值(%) |
| `ALERT_THRESHOLD_DISK` | 90 | 磁盘使用率告警阈值(%) |
| `ADMIN_EMAIL` | admin@example.com | 管理员邮箱（需替换为实际邮箱） |

#### 使用方法
```bash
# 手动运行监控检查
./scripts/system-monitor.sh

# 添加到crontab定时执行（每5分钟）
*/5 * * * * /path/to/scripts/system-monitor.sh
```

### 2. 数据库备份脚本 (`scripts/backup-db.sh`)

#### 功能特性
- **自动备份**: 使用`pg_dump`创建PostgreSQL数据库备份
- **压缩存储**: 备份文件自动gzip压缩
- **保留策略**: 自动清理7天前的旧备份
- **权限控制**: 备份文件设置安全权限(600)
- **错误处理**: 完整的错误检查和日志记录

#### 配置参数
| 参数 | 默认值 | 说明 |
|------|--------|------|
| `BACKUP_DIR` | /backups | 备份文件存储目录 |
| `DB_CONTAINER_NAME` | postgres-db | PostgreSQL Docker容器名称 |
| `DB_NAME` | app_db | 要备份的数据库名称 |
| `DB_USER` | postgres | 数据库用户 |
| `BACKUP_RETENTION_DAYS` | 7 | 备份保留天数 |

#### 使用方法
```bash
# 手动运行备份
./scripts/backup-db.sh

# 添加到crontab定时备份（每天凌晨2点）
0 2 * * * /path/to/scripts/backup-db.sh
```

## 日志轮转配置

### 系统监控日志轮转
创建日志轮转配置文件 `/etc/logrotate.d/system-monitor`:

```conf
/var/log/system-monitor.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        # 可选：重启相关服务或发送通知
    endscript
}
```

### 数据库备份日志轮转
备份脚本本身已经包含自动清理逻辑，但如果有额外的日志需要轮转，可以添加类似配置。

## 告警集成建议

当前监控脚本包含基础的告警框架，建议根据实际环境集成以下通知方式：

1. **邮件通知**: 配置SMTP服务器，启用邮件发送功能
2. **即时通讯**: 集成Feishu/Slack/DingTalk webhook
3. **专业监控系统**: 
   - Prometheus + Alertmanager
   - Zabbix
   - Nagios
4. **云服务监控**: 
   - AWS CloudWatch
   - Azure Monitor
   - Google Cloud Operations

## 部署步骤

1. 将脚本文件复制到目标服务器
2. 根据实际环境修改配置参数
3. 设置执行权限: `chmod +x scripts/*.sh`
4. 配置crontab定时任务
5. 配置日志轮转
6. 测试监控和备份功能
7. 配置实际的告警通知渠道

## 维护建议

- 定期测试备份恢复流程
- 监控日志文件大小和轮转效果
- 根据系统负载调整告警阈值
- 定期审查和更新监控配置
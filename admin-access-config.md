# 后台管理运维配置文档

## 概述

本文档详细描述了后台管理系统的安全配置方案，包括管理员角色权限、IP白名单、操作日志记录和敏感操作二次验证等核心安全控制措施。

## 1. 管理员角色权限配置

### 角色定义

系统定义了以下管理员角色，每个角色具有不同的权限级别：

| 角色 | 权限描述 | 具体权限 |
|------|----------|----------|
| **超级管理员** (super_admin) | 拥有系统最高权限，可执行所有操作 | `read, write, delete, config, user_mgmt, system_mgmt` |
| **系统管理员** (sys_admin) | 负责系统维护和配置 | `read, write, config, system_mgmt` |
| **内容管理员** (content_admin) | 负责内容管理和发布 | `read, write, content_mgmt` |
| **审计员** (auditor) | 只读权限，用于安全审计 | `read` |

### 敏感操作列表

以下操作被标记为敏感操作，需要额外的安全验证：

- `delete` - 删除数据或用户
- `config` - 系统配置修改
- `user_mgmt` - 用户管理操作
- `system_mgmt` - 系统管理操作

### 配置文件位置

- **主配置文件**: `/etc/admin-config/access.conf`
- **权限格式**: `角色名:权限列表(逗号分隔)`

## 2. 后台访问 IP 白名单

### 安全策略

仅允许来自预定义IP地址或网段的请求访问后台管理系统，有效防止未授权访问。

### 默认白名单配置

```bash
# 公司办公网络
192.168.1.0/24
10.0.0.0/8

# 运维团队固定IP
203.0.113.10
203.0.113.11
203.0.113.12

# 监控服务器
198.51.100.50

# 本地回环地址
127.0.0.1
::1
```

### 配置文件位置

- **IP白名单文件**: `/etc/admin-config/ip-whitelist.conf`
- **格式**: 每行一个IP地址或CIDR网段，支持注释（以#开头）

### 实施建议

1. **定期审查**: 每月审查白名单，移除不再需要的IP
2. **动态更新**: 对于临时需要访问的IP，使用临时授权机制
3. **日志监控**: 记录所有被拒绝的访问尝试

## 3. 管理员操作日志记录

### 日志架构

系统采用分层日志架构，确保操作可追溯：

- **审计日志**: `/var/log/admin/audit.log` - 所有管理员操作的详细记录
- **告警日志**: `/var/log/admin/alerts.log` - 敏感操作和异常行为记录
- **归档日志**: `/var/log/admin/archive/` - 压缩的历史日志文件

### 日志格式

审计日志采用结构化格式：

```
时间戳 | EVENT_ID:事件ID | USER:用户名 | ACTION:操作类型 | RESOURCE:操作资源 | IP:客户端IP | STATUS:操作状态 | DETAILS:详细信息
```

### 敏感操作关键词

系统自动识别以下关键词并触发告警：

- `delete`, `drop`, `rm` - 删除操作
- `chmod`, `chown` - 权限修改
- `passwd`, `userdel`, `groupdel` - 用户账户操作
- `iptables`, `ufw` - 防火墙配置
- `systemctl stop`, `shutdown`, `reboot` - 系统关机/重启
- `su`, `sudo` - 权限提升操作

### 日志管理策略

- **保留期限**: 90天
- **轮转频率**: 每日轮转
- **存储格式**: 归档日志使用gzip压缩

## 4. 敏感操作二次验证配置

### 二次验证策略

对高风险操作实施多因素认证（MFA），确保操作安全性。

### 配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `mfa_enabled` | `true` | 是否启用二次验证 |
| `mfa_method` | `totp` | 验证方式（sms/email/totp/push） |
| `code_expiry` | `300` | 验证码有效期（秒） |
| `max_attempts` | `3` | 最大尝试次数 |
| `lockout_duration` | `15` | 锁定时间（分钟） |

### 受保护的操作类型

以下操作需要二次验证：

- `delete_user` - 删除用户账户
- `modify_permissions` - 修改权限设置
- `change_password` - 修改密码
- `access_sensitive_data` - 访问敏感数据
- `system_shutdown` - 系统关机
- `backup_restore` - 备份恢复操作

### 配置文件位置

- **MFA配置文件**: `/etc/admin-config/mfa.conf`

## 5. 脚本使用说明

### admin-access-control.sh

用于初始化和配置访问控制策略：

```bash
# 直接运行进行完整配置
./scripts/admin-access-control.sh

# 配置文件将生成在:
# - /etc/admin-config/access.conf
# - /etc/admin-config/ip-whitelist.conf  
# - /etc/admin-config/mfa.conf
```

### admin-audit-log.sh

用于管理审计日志系统：

```bash
# 初始化日志系统
./scripts/admin-audit-log.sh setup

# 执行日志轮转
./scripts/admin-audit-log.sh rotate

# 生成7天审计报告
./scripts/admin-audit-log.sh report 7

# 导出指定日期范围日志
./scripts/admin-audit-log.sh export 2026-03-01 2026-03-31 /tmp/logs.txt

# 记录单个审计事件
./scripts/admin-audit-log.sh log "admin" "user_delete" "user123" "192.168.1.100" "success" "Deleted user account"
```

## 6. 安全最佳实践

### 定期维护

1. **每月审查**管理员账户和权限分配
2. **每周检查**IP白名单的有效性
3. **每日监控**审计日志中的异常活动

### 应急响应

1. **立即撤销**可疑账户的访问权限
2. **临时禁用**受影响的功能模块
3. **保存证据**用于后续调查

### 合规要求

- 所有操作必须可追溯到具体用户
- 敏感操作必须有二次验证记录
- 日志保留期不少于90天
- 定期进行安全审计

## 7. 故障排除

### 常见问题

**Q: 管理员无法登录后台**
- 检查IP是否在白名单中
- 验证用户角色权限配置
- 查看系统日志中的错误信息

**Q: 二次验证不工作**
- 确认MFA配置文件正确
- 检查验证服务是否正常运行
- 验证用户设备时间和服务器时间同步

**Q: 日志文件过大**
- 执行日志轮转：`./admin-audit-log.sh rotate`
- 调整日志保留策略
- 检查是否有异常的高频操作

---

**文档版本**: 1.0  
**最后更新**: 2026-03-29  
**维护人员**: 老张（运维工程师）
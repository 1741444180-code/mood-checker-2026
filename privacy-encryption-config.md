# 隐私数据加密配置文档

## 概述

本文档详细说明了系统中隐私数据的加密存储、数据脱敏策略以及GDPR合规的数据保留策略配置。

## 1. 敏感数据加密存储（bcrypt）

### 技术选型
- **加密算法**: bcrypt
- **盐轮数（Salt Rounds）**: 12
- **理由**: bcrypt是专门为密码哈希设计的算法，具有内置的盐值生成和自适应计算复杂度，能够有效抵御彩虹表攻击和暴力破解。

### 实现文件
- **路径**: `src/lib/encryption.ts`
- **主要函数**:
  - `encryptSensitiveData(data: string)`: 加密敏感数据
  - `verifyEncryptedData(data: string, hashedData: string)`: 验证加密数据

### 使用示例
```typescript
import { encryptSensitiveData, verifyEncryptedData } from './src/lib/encryption';

// 加密用户密码
const hashedPassword = await encryptSensitiveData(userPassword);

// 验证用户登录
const isValid = await verifyEncryptedData(inputPassword, storedHashedPassword);
```

## 2. 数据脱敏策略

### 支持的数据类型
| 数据类型 | 脱敏规则 | 示例 |
|---------|---------|------|
| Email | 保留首尾字母，中间用`*`替换 | `j***n@example.com` |
| 手机号 | 保留前3位和后4位，中间用`*`替换 | `138****5678` |
| 姓名 | 中文保留姓氏，英文保留首字母 | `张*` 或 `J***` |
| 身份证号 | 保留前6位和后4位，中间用`*`替换 | `110101********1234` |
| 地址 | 保留省市区，详细地址用`*`替换 | `北京市海淀区******` |

### 实现函数
- `maskSensitiveData(data: string, type: 'email' | 'phone' | 'name' | 'id_card' | 'address')`

### 使用场景
- 日志记录
- 调试信息
- 用户界面显示（非编辑状态）
- 数据导出（非授权场景）

## 3. GDPR合规数据保留策略

### 数据保留期限配置

| 数据类型 | 保留期限 | 法规依据 |
|---------|---------|---------|
| 用户账户数据 | 2年 | GDPR第17条（被遗忘权） |
| 用户活动日志 | 1年 | 合理业务需求 + 最小化原则 |
| 营销相关数据 | 6个月 | GDPR第6条（同意基础） |
| 交易记录 | 7年 | 财务法规要求（超越GDPR） |
| 删除请求记录 | 3年 | GDPR合规审计需要 |
| 临时会话数据 | 30天 | 最小化存储原则 |

### 实现方式
- **配置常量**: `GDPR_DATA_RETENTION_POLICY` 对象
- **过期检查**: `isDataExpired(createdAt, dataType)` 函数
- **过期时间计算**: `getDataExpiryDate(createdAt, dataType)` 函数

## 4. 数据清理脚本

### 脚本信息
- **路径**: `scripts/cleanup-user-data.sh`
- **执行权限**: 已设置为可执行（`chmod +x`）
- **日志**: 自动记录到 `logs/data-cleanup-YYYYMMDD.log`

### 功能特性
- **自动依赖检查**: 验证Node.js和项目结构
- **多数据类型清理**: 支持用户账户、活动日志、营销数据、会话数据等
- **安全执行**: 使用`set -e`确保错误时立即退出
- **通知支持**: 可配置Webhook通知清理结果
- **试运行模式**: 支持`--dry-run`参数预览操作

### 定时任务配置

#### Linux/Cron配置
```bash
# 每天凌晨2点执行数据清理
0 2 * * * /path/to/project/scripts/cleanup-user-data.sh

# 每周日凌晨3点执行（更保守的频率）
0 3 * * 0 /path/to/project/scripts/cleanup-user-data.sh
```

#### systemd定时器（推荐）
创建 `/etc/systemd/system/gdpr-cleanup.service`:
```ini
[Unit]
Description=GDPR Data Cleanup
After=network.target

[Service]
Type=oneshot
User=appuser
WorkingDirectory=/path/to/project
ExecStart=/path/to/project/scripts/cleanup-user-data.sh
StandardOutput=journal
StandardError=journal
```

创建 `/etc/systemd/system/gdpr-cleanup.timer`:
```ini
[Unit]
Description=Run GDPR cleanup daily
Requires=gdpr-cleanup.service

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

启用定时器:
```bash
sudo systemctl enable gdpr-cleanup.timer
sudo systemctl start gdpr-cleanup.timer
```

## 5. 安全最佳实践

### 密钥管理
- **bcrypt盐值**: 自动生成，无需额外密钥管理
- **环境变量**: 敏感配置应通过环境变量注入
- **权限控制**: 清理脚本应以最小权限用户运行

### 监控和审计
- **日志保留**: 清理脚本日志应保留至少1年
- **失败告警**: 配置清理失败的通知机制
- **定期验证**: 手动验证清理效果，确保无误删

### 应急响应
- **备份策略**: 清理前确保有完整数据备份
- **回滚方案**: 准备数据恢复流程
- **手动覆盖**: 提供紧急停止清理的机制

## 6. 合规性验证

### GDPR关键要求满足情况
- ✅ **数据最小化**: 只收集必要数据，及时清理过期数据
- ✅ **存储限制**: 明确定义各类数据保留期限
- ✅ **完整性保密性**: 使用强加密保护敏感数据
- ✅ **问责制**: 完整的日志记录和审计跟踪

### 定期审查
- **季度审查**: 每季度审查数据保留策略的有效性
- **法规更新**: 跟踪GDPR相关法规变化并及时调整
- **技术评估**: 评估加密算法的安全性，必要时升级

## 7. 未来改进

### 待实现功能
- [ ] 数据库清理脚本 (`scripts/cleanup-db.js`)
- [ ] 用户数据导出功能（GDPR第20条）
- [ ] 自动化合规报告生成
- [ ] 多区域数据保留策略支持

### 性能优化
- [ ] 批量清理操作以减少数据库压力
- [ ] 清理操作的进度监控和中断恢复
- [ ] 并行处理不同数据类型的清理任务

---

**最后更新**: 2026-03-29  
**负责人**: 老张（运维工程师）  
**审核人**: 大伟（项目经理）
# 告警规则配置

## 概述
本文档定义了心情打卡网站的告警规则配置，确保及时发现和响应系统异常。

## 告警级别定义

### P0 - 紧急 (Critical)
- **响应时间**: 立即 (< 5分钟)
- **影响范围**: 全站不可用或核心功能完全失效
- **通知方式**: 电话 + 短信 + 邮件 + Slack

### P1 - 高优先级 (High)
- **响应时间**: 30分钟内
- **影响范围**: 核心功能部分失效或性能严重下降
- **通知方式**: 短信 + 邮件 + Slack

### P2 - 中等优先级 (Medium)
- **响应时间**: 4小时内
- **影响范围**: 非核心功能问题或轻微性能影响
- **通知方式**: 邮件 + Slack

### P3 - 低优先级 (Low)
- **响应时间**: 24小时内
- **影响范围**: 边缘功能问题或信息性告警
- **通知方式**: Slack

## Sentry 告警规则

### 错误率告警
```yaml
# 错误率超过阈值
name: "High Error Rate"
conditions:
  - metric: "error_rate"
    operator: ">"
    threshold: 5.0  # 5%
    duration: "5m"
level: P1
```

### 新错误告警
```yaml
# 新出现的错误类型
name: "New Error Types"
conditions:
  - metric: "new_error_types"
    operator: ">"
    threshold: 0
    duration: "1m"
level: P1
```

### 性能退化告警
```yaml
# 页面加载时间超过阈值
name: "Slow Page Load"
conditions:
  - metric: "page_load_time_p95"
    operator: ">"
    threshold: 5000  # 5秒
    duration: "10m"
level: P2
```

### API错误告警
```yaml
# API错误率
name: "API Error Rate"
conditions:
  - metric: "api_error_rate"
    operator: ">"
    threshold: 1.0  # 1%
    duration: "5m"
level: P1
```

## LogRocket 告警规则

### 用户体验问题
```yaml
# 高崩溃率会话
name: "High Crash Rate Sessions"
conditions:
  - metric: "session_crash_rate"
    operator: ">"
    threshold: 10.0  # 10%
    duration: "15m"
level: P1
```

### 转化漏斗异常
```yaml
# 打卡完成率下降
name: "Mood Submission Drop"
conditions:
  - metric: "submission_conversion_rate"
    operator: "<"
    threshold: 80.0  # 低于80%
    baseline: "7d_rolling_avg"
    deviation: "-20%"  # 相比基线下跌20%
    duration: "30m"
level: P2
```

## 基础设施告警

### 数据库监控
```yaml
# CPU使用率过高
name: "Database High CPU"
conditions:
  - metric: "db_cpu_utilization"
    operator: ">"
    threshold: 80.0
    duration: "5m"
level: P1

# 连接数接近限制
name: "Database Connection Pool Full"
conditions:
  - metric: "db_connections_used_percentage"
    operator: ">"
    threshold: 90.0
    duration: "2m"
level: P1
```

### 应用服务器监控
```yaml
# 内存使用率过高
name: "High Memory Usage"
conditions:
  - metric: "memory_utilization"
    operator: ">"
    threshold: 85.0
    duration: "10m"
level: P2

# 响应时间异常
name: "Slow Response Time"
conditions:
  - metric: "response_time_p95"
    operator: ">"
    threshold: 2000  # 2秒
    duration: "5m"
level: P2
```

### CDN/网络监控
```yaml
# CDN缓存命中率低
name: "Low CDN Cache Hit Rate"
conditions:
  - metric: "cdn_cache_hit_rate"
    operator: "<"
    threshold: 90.0
    duration: "15m"
level: P3
```

## 告警抑制规则

### 维护窗口
```yaml
# 计划维护期间抑制非关键告警
name: "Maintenance Window Suppression"
time_window: "02:00-04:00"
days: ["saturday"]
suppress_levels: ["P2", "P3"]
```

### 级联故障抑制
```yaml
# 当P0告警触发时，抑制相关P1/P2告警
name: "Cascading Failure Suppression"
trigger_condition: "P0_alert_active"
suppress_related: true
duration: "30m"
```

## 通知渠道配置

### 团队分配
| 功能模块 | 主要负责人 | 备用负责人 |
|---------|-----------|-----------|
| 前端 | 建权 | 大伟 |
| 后端 | 马化腾 | 黄金九 |
| 数据库 | 黄金九 | 马化腾 |
| 基础设施 | 老张 | 黄金九 |

### 通知模板

#### P0告警模板
```
🚨 CRITICAL ALERT 🚨
Service: {service_name}
Issue: {alert_name}
Impact: {impact_description}
Current Value: {current_value}
Threshold: {threshold}
Time: {timestamp}

Immediate action required!
Contact: {primary_owner}
Backup: {backup_owner}
Runbook: {runbook_link}
```

#### P1告警模板
```
⚠️ HIGH PRIORITY ALERT ⚠️
Service: {service_name}
Issue: {alert_name}
Current Value: {current_value}
Threshold: {threshold}

Please investigate within 30 minutes.
```

## 告警测试计划

### 定期测试
- **每周**: 发送测试告警验证通知渠道
- **每月**: 模拟故障场景测试响应流程
- **每季度**: 审查和更新告警规则

### 测试指标
- 告警准确率 > 95%
- 误报率 < 5%
- 平均响应时间 < SLA要求
# 数据库索引优化方案

## 概述
本文档提供了针对当前应用的数据库索引优化方案，旨在提高查询性能、减少响应时间和降低数据库负载。

## 当前问题分析
基于常见的应用模式和性能瓶颈，我们识别出以下潜在的慢查询场景：

1. **用户相关查询** - 用户登录、个人信息获取
2. **心情记录查询** - 按日期范围、用户ID查询心情记录
3. **统计查询** - 聚合查询、排行榜计算
4. **关联查询** - 多表连接查询

## 索引优化建议

### 1. 用户表 (users)
```sql
-- 主键索引（通常已存在）
-- CREATE INDEX idx_users_id ON users(id);

-- 邮箱索引（用于登录和唯一性检查）
CREATE INDEX idx_users_email ON users(email);

-- 用户名索引（如果支持用户名登录）
CREATE INDEX idx_users_username ON users(username);

-- 创建时间索引（用于按时间排序的用户列表）
CREATE INDEX idx_users_created_at ON users(created_at);
```

### 2. 心情记录表 (mood_records)
```sql
-- 用户ID + 日期组合索引（最常用的查询模式）
CREATE INDEX idx_mood_records_user_date ON mood_records(user_id, created_at);

-- 仅用户ID索引（用于获取特定用户的所有记录）
CREATE INDEX idx_mood_records_user_id ON mood_records(user_id);

-- 日期索引（用于时间范围查询）
CREATE INDEX idx_mood_records_date ON mood_records(created_at);

-- 心情类型索引（如果需要按心情类型筛选）
CREATE INDEX idx_mood_records_mood_type ON mood_records(mood_type);
```

### 3. 其他辅助表
```sql
-- 如果存在标签表
CREATE INDEX idx_tags_name ON tags(name);

-- 如果存在用户标签关联表
CREATE INDEX idx_user_tags_user_id ON user_tags(user_id);
CREATE INDEX idx_user_tags_tag_id ON user_tags(tag_id);
```

## 查询优化策略

### 1. 避免 SELECT *
只选择需要的字段，减少数据传输量和内存使用。

### 2. 使用 LIMIT 和分页
对于列表查询，始终使用 LIMIT 和适当的分页策略。

### 3. 优化 JOIN 查询
- 确保 JOIN 条件上的字段有索引
- 避免不必要的多表连接
- 考虑使用 EXISTS 替代 IN 子查询

### 4. 合理使用聚合函数
- 对于频繁的聚合查询，考虑使用物化视图或缓存
- 避免在大表上进行全表扫描的聚合操作

## 监控和维护

### 1. 定期分析查询计划
使用 `EXPLAIN ANALYZE` 定期检查关键查询的执行计划。

### 2. 监控索引使用情况
定期检查哪些索引被使用，哪些没有被使用，删除无用索引。

### 3. 数据库统计信息更新
确保数据库统计信息保持最新，以便查询优化器做出正确决策。

## 实施步骤

1. 在开发环境部署索引
2. 测试关键查询性能
3. 在测试环境验证
4. 在生产环境分批部署（考虑使用在线DDL）
5. 监控性能指标变化

## 风险评估

- **存储空间增加**: 索引会占用额外的存储空间
- **写入性能影响**: 索引会略微降低 INSERT/UPDATE/DELETE 性能
- **维护成本**: 需要定期监控和优化索引

## 结论
通过实施上述索引优化方案，预计可以显著改善应用的查询性能，特别是对于高频访问的用户数据和心情记录查询。建议结合应用的实际查询模式进行调整和优化。
-- 数据库索引创建脚本
-- 用于优化心情打卡网站的数据库性能

-- 用户表索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- 心情记录表索引
CREATE INDEX IF NOT EXISTS idx_mood_records_user_date ON mood_records(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_mood_records_user_id ON mood_records(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_records_date ON mood_records(created_at);
CREATE INDEX IF NOT EXISTS idx_mood_records_mood_type ON mood_records(mood_type);

-- 标签表索引（如果存在）
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- 用户标签关联表索引（如果存在）
CREATE INDEX IF NOT EXISTS idx_user_tags_user_id ON user_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tags_tag_id ON user_tags(tag_id);

-- 会话表索引（如果使用数据库存储会话）
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires);

-- 通知表索引（如果存在）
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);

-- 分析查询执行计划的示例
-- EXPLAIN ANALYZE SELECT * FROM mood_records WHERE user_id = 123 AND created_at >= '2026-03-01';

-- 检查索引使用情况的查询（PostgreSQL）
-- SELECT schemaname, tablename, indexname, idx_scan 
-- FROM pg_stat_user_indexes 
-- WHERE schemaname = 'public' 
-- ORDER BY idx_scan DESC;

-- 检查索引使用情况的查询（MySQL）
-- SELECT table_name, index_name, column_name 
-- FROM information_schema.statistics 
-- WHERE table_schema = DATABASE() 
-- ORDER BY table_name, index_name, seq_in_index;

-- 注意：在生产环境执行前，请根据实际的表结构和数据量进行调整
-- 建议在低峰期执行，并监控数据库性能指标
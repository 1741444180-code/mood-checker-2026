-- 心情打卡网站 - 数据库初始化脚本
-- 包含系统默认心情类型的插入语句

-- 插入系统默认心情类型
INSERT INTO mood_types (name, color, icon, sort_order, is_system, created_at) VALUES
('开心', '#FFD700', '😄', 1, true, NOW()),
('平静', '#90EE90', '😊', 2, true, NOW()),
('低落', '#87CEEB', '😔', 3, true, NOW()),
('生气', '#FF6B6B', '😠', 4, true, NOW()),
('焦虑', '#DDA0DD', '😰', 5, true, NOW()),
('疲惫', '#D3D3D3', '😴', 6, true, NOW()),
('兴奋', '#FF69B4', '🤩', 7, true, NOW());

-- 创建数据库连接池配置
-- 这些配置可以在 PostgreSQL 的 postgresql.conf 中设置
/*
max_connections = 200
shared_buffers = 25% of RAM
effective_cache_size = 50% of RAM
maintenance_work_mem = 256MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB
max_worker_processes = 4
max_parallel_workers_per_gather = 2
max_parallel_workers = 4
max_parallel_maintenance_workers = 2
*/

-- 为常用查询创建索引（如果尚未创建）
-- CREATE INDEX IF NOT EXISTS idx_mood_records_user_date ON mood_records(user_id, date DESC);
-- CREATE INDEX IF NOT EXISTS idx_mood_records_date ON mood_records(date);
-- CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
-- CREATE INDEX IF NOT EXISTS idx_comments_mood_record_id ON comments(mood_record_id);

-- 创建用于统计查询的函数（可选）
-- 计算连续打卡天数的函数
/*
CREATE OR REPLACE FUNCTION calculate_continuous_days(p_user_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    continuous_days INTEGER := 0;
    current_date DATE;
    prev_date DATE;
BEGIN
    FOR current_date IN
        SELECT DISTINCT date FROM mood_records 
        WHERE user_id = p_user_id 
        ORDER BY date DESC
    LOOP
        IF prev_date IS NULL THEN
            -- 第一天
            continuous_days := 1;
        ELSIF current_date = prev_date - INTERVAL '1 day' THEN
            -- 连续的日期
            continuous_days := continuous_days + 1;
        ELSE
            -- 不连续，退出循环
            EXIT;
        END IF;
        prev_date := current_date;
    END LOOP;
    
    RETURN continuous_days;
END;
$$ LANGUAGE plpgsql;
*/
-- =====================================================
-- 监控服务数据库迁移脚本
-- 创建时间：2026-03-31 00:46
-- 用途：性能监控、告警管理、日志聚合
-- =====================================================

-- -----------------------------------------------------
-- 1. 性能指标表 (performance_metrics)
-- 存储系统性能数据，每 5 分钟采集一次
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS performance_metrics (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- API 性能
    api_response_time DECIMAL(10,2) NOT NULL COMMENT 'API 平均响应时间 (ms)',
    
    -- 数据库性能
    db_query_time DECIMAL(10,2) NOT NULL COMMENT '数据库查询时间 (ms)',
    
    -- 系统资源
    memory_usage DECIMAL(10,2) NOT NULL COMMENT '内存使用 (MB)',
    cpu_usage DECIMAL(5,2) NOT NULL COMMENT 'CPU 使用率 (%)',
    
    -- 连接和请求
    active_connections INTEGER NOT NULL DEFAULT 0 COMMENT '活跃连接数',
    request_count INTEGER NOT NULL DEFAULT 0 COMMENT '请求数量',
    
    -- 错误统计
    error_rate DECIMAL(5,2) NOT NULL DEFAULT 0 COMMENT '错误率 (%)',
    
    -- 索引
    INDEX idx_timestamp (timestamp),
    INDEX idx_api_response_time (api_response_time),
    INDEX idx_cpu_usage (cpu_usage),
    INDEX idx_memory_usage (memory_usage)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='性能指标表';

-- -----------------------------------------------------
-- 2. 告警规则表 (alert_rules)
-- 存储告警规则配置
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS alert_rules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT '规则名称',
    
    -- 监控指标
    metric VARCHAR(100) NOT NULL COMMENT '监控指标名称',
    
    -- 告警条件
    condition ENUM('GT', 'LT', 'EQ', 'GTE', 'LTE') NOT NULL COMMENT '条件：GT(大于), LT(小于), EQ(等于), GTE(大于等于), LTE(小于等于)',
    threshold DECIMAL(20,4) NOT NULL COMMENT '阈值',
    
    -- 告警级别
    level ENUM('INFO', 'WARNING', 'ERROR', 'CRITICAL') NOT NULL COMMENT '告警级别',
    
    -- 通知渠道
    channels JSON NOT NULL COMMENT '通知渠道列表：["EMAIL", "PUSH", "SMS", "WEBHOOK"]',
    
    -- 规则状态
    enabled BOOLEAN NOT NULL DEFAULT true COMMENT '是否启用',
    cooldown_minutes INTEGER NOT NULL DEFAULT 30 COMMENT '告警冷却时间 (分钟)',
    
    -- 时间戳
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_enabled (enabled),
    INDEX idx_metric (metric),
    INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='告警规则表';

-- -----------------------------------------------------
-- 3. 告警记录表 (alerts)
-- 存储触发的告警记录
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    rule_id INTEGER NOT NULL COMMENT '关联的告警规则 ID',
    
    -- 告警信息
    level ENUM('INFO', 'WARNING', 'ERROR', 'CRITICAL') NOT NULL COMMENT '告警级别',
    title VARCHAR(500) NOT NULL COMMENT '告警标题',
    message TEXT NOT NULL COMMENT '告警详情',
    
    -- 指标值
    metric_value DECIMAL(20,4) NOT NULL COMMENT '触发时的指标值',
    threshold DECIMAL(20,4) NOT NULL COMMENT '触发阈值',
    
    -- 时间戳
    triggered_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '触发时间',
    
    -- 确认信息
    acknowledged BOOLEAN NOT NULL DEFAULT false COMMENT '是否已确认',
    acknowledged_at TIMESTAMP(3) NULL COMMENT '确认时间',
    acknowledged_by VARCHAR(255) NULL COMMENT '确认人 ID',
    
    -- 外键
    CONSTRAINT fk_alert_rule FOREIGN KEY (rule_id) REFERENCES alert_rules(id) ON DELETE CASCADE,
    
    -- 索引
    INDEX idx_rule_id (rule_id),
    INDEX idx_level (level),
    INDEX idx_triggered_at (triggered_at),
    INDEX idx_acknowledged (acknowledged)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='告警记录表';

-- -----------------------------------------------------
-- 4. 日志条目表 (log_entries)
-- 存储应用日志，支持按级别、来源聚合
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS log_entries (
    id SERIAL PRIMARY KEY,
    
    -- 日志信息
    level ENUM('DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL') NOT NULL COMMENT '日志级别',
    source VARCHAR(255) NOT NULL COMMENT '日志来源（模块/服务名）',
    message TEXT NOT NULL COMMENT '日志消息',
    metadata JSON NULL COMMENT '附加元数据',
    
    -- 上下文信息
    timestamp TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '日志时间',
    user_id VARCHAR(255) NULL COMMENT '用户 ID',
    request_id VARCHAR(255) NULL COMMENT '请求 ID',
    context VARCHAR(500) NULL COMMENT '上下文信息',
    
    -- 索引
    INDEX idx_level (level),
    INDEX idx_source (source),
    INDEX idx_timestamp (timestamp),
    INDEX idx_user_id (user_id),
    INDEX idx_request_id (request_id),
    INDEX idx_level_timestamp (level, timestamp),
    INDEX idx_source_timestamp (source, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='日志条目表';

-- -----------------------------------------------------
-- 5. 插入默认告警规则
-- -----------------------------------------------------

-- 规则 1: API 响应时间过长
INSERT INTO alert_rules (name, metric, condition, threshold, level, channels, enabled, cooldown_minutes)
VALUES 
    ('API 响应时间告警', 'apiResponseTime', 'GT', 500, 'WARNING', '["EMAIL", "PUSH"]', true, 30),
    ('数据库查询过慢', 'dbQueryTime', 'GT', 200, 'WARNING', '["EMAIL"]', true, 30),
    ('内存使用过高', 'memoryUsage', 'GT', 800, 'ERROR', '["EMAIL", "PUSH"]', true, 60),
    ('CPU 使用率过高', 'cpuUsage', 'GT', 80, 'ERROR', '["EMAIL", "PUSH"]', true, 60),
    ('错误率超标', 'errorRate', 'GT', 5, 'CRITICAL', '["EMAIL", "SMS", "PUSH"]', true, 15);

-- -----------------------------------------------------
-- 6. 创建视图：性能指标汇总（最近 24 小时）
-- -----------------------------------------------------
CREATE OR REPLACE VIEW v_performance_summary_24h AS
SELECT 
    DATE(timestamp) as date,
    HOUR(timestamp) as hour,
    COUNT(*) as sample_count,
    AVG(api_response_time) as avg_api_response_time,
    MAX(api_response_time) as max_api_response_time,
    MIN(api_response_time) as min_api_response_time,
    AVG(db_query_time) as avg_db_query_time,
    AVG(memory_usage) as avg_memory_usage,
    AVG(cpu_usage) as avg_cpu_usage,
    AVG(error_rate) as avg_error_rate
FROM performance_metrics
WHERE timestamp >= NOW() - INTERVAL 24 HOUR
GROUP BY DATE(timestamp), HOUR(timestamp)
ORDER BY date DESC, hour DESC;

-- -----------------------------------------------------
-- 7. 创建视图：告警统计（最近 7 天）
-- -----------------------------------------------------
CREATE OR REPLACE VIEW v_alert_stats_7d AS
SELECT 
    DATE(triggered_at) as alert_date,
    level,
    COUNT(*) as alert_count,
    SUM(CASE WHEN acknowledged = false THEN 1 ELSE 0 END) as unacknowledged_count
FROM alerts
WHERE triggered_at >= NOW() - INTERVAL 7 DAY
GROUP BY DATE(triggered_at), level
ORDER BY alert_date DESC, level;

-- -----------------------------------------------------
-- 8. 创建视图：日志统计（最近 24 小时）
-- -----------------------------------------------------
CREATE OR REPLACE VIEW v_log_stats_24h AS
SELECT 
    level,
    source,
    COUNT(*) as log_count,
    MAX(timestamp) as last_occurrence
FROM log_entries
WHERE timestamp >= NOW() - INTERVAL 24 HOUR
GROUP BY level, source
ORDER BY log_count DESC;

-- -----------------------------------------------------
-- 迁移完成
-- -----------------------------------------------------

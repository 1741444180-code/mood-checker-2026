#!/bin/bash

# 日志清理脚本
# 保留最近30天的日志文件，删除更早的日志
# 作者: 老张
# 日期: 2026-03-29

set -e

# 配置变量
LOG_DIR="./logs"
RETENTION_DAYS=30
SCRIPT_NAME=$(basename "$0")

# 日志函数
log_info() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO] $1"
}

log_error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $1" >&2
}

log_info "开始执行日志清理任务，保留最近 ${RETENTION_DAYS} 天的日志"

# 检查日志目录是否存在
if [ ! -d "$LOG_DIR" ]; then
    log_info "日志目录 $LOG_DIR 不存在，无需清理"
    exit 0
fi

# 计算需要删除的文件数量（用于报告）
FILES_TO_DELETE=$(find "$LOG_DIR" -type f \( -name "*.log" -o -name "*.log.gz" \) -mtime +$RETENTION_DAYS | wc -l)
log_info "发现 $FILES_TO_DELETE 个过期日志文件需要删除"

# 删除过期的日志文件（包括压缩的日志）
if [ "$FILES_TO_DELETE" -gt 0 ]; then
    find "$LOG_DIR" -type f \( -name "*.log" -o -name "*.log.gz" \) -mtime +$RETENTION_DAYS -delete
    log_info "已成功删除过期日志文件"
else
    log_info "没有发现过期日志文件"
fi

# 清理空目录（可选）
find "$LOG_DIR" -type d -empty -delete 2>/dev/null || true

log_info "日志清理任务完成"

exit 0
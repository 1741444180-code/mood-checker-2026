#!/bin/bash

# GDPR合规数据清理脚本
# 用于定期清理过期的用户数据，确保符合GDPR数据保留策略

set -e  # 遇到错误立即退出

# 配置变量
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_ROOT/logs/data-cleanup-$(date +%Y%m%d).log"

# 创建日志目录
mkdir -p "$PROJECT_ROOT/logs"

# 日志函数
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# 错误处理函数
error_exit() {
    log "ERROR: $1"
    exit 1
}

# 检查依赖
check_dependencies() {
    log "检查依赖..."
    
    # 检查Node.js是否安装
    if ! command -v node &> /dev/null; then
        error_exit "Node.js未安装，请先安装Node.js"
    fi
    
    # 检查项目依赖
    if [ ! -f "$PROJECT_ROOT/package.json" ]; then
        error_exit "未找到package.json，请确保在项目根目录运行此脚本"
    fi
    
    log "依赖检查完成"
}

# 清理过期用户账户数据
cleanup_user_accounts() {
    log "开始清理过期用户账户数据..."
    
    # 计算2年前的时间戳（毫秒）
    TWO_YEARS_AGO=$(($(date +%s) - 365*24*60*60*2))
    TWO_YEARS_AGO_MS=$((TWO_YEARS_AGO * 1000))
    
    # 使用Node.js脚本执行数据库清理（假设存在cleanup-db.js）
    if [ -f "$PROJECT_ROOT/scripts/cleanup-db.js" ]; then
        node "$PROJECT_ROOT/scripts/cleanup-db.js" --type user_account --before $TWO_YEARS_AGO_MS >> "$LOG_FILE" 2>&1
        log "用户账户数据清理完成"
    else
        log "警告: 未找到数据库清理脚本，跳过数据库清理。请手动实现数据库清理逻辑。"
    fi
}

# 清理活动日志
cleanup_activity_logs() {
    log "开始清理过期活动日志..."
    
    # 计算1年前的时间戳（毫秒）
    ONE_YEAR_AGO=$(($(date +%s) - 365*24*60*60))
    ONE_YEAR_AGO_MS=$((ONE_YEAR_AGO * 1000))
    
    # 清理日志文件（如果使用文件存储）
    LOG_DIR="$PROJECT_ROOT/logs/activity"
    if [ -d "$LOG_DIR" ]; then
        find "$LOG_DIR" -name "*.log" -type f -mtime +365 -delete
        log "活动日志文件清理完成"
    fi
    
    # 如果有数据库清理脚本
    if [ -f "$PROJECT_ROOT/scripts/cleanup-db.js" ]; then
        node "$PROJECT_ROOT/scripts/cleanup-db.js" --type activity_logs --before $ONE_YEAR_AGO_MS >> "$LOG_FILE" 2>&1
    fi
}

# 清理营销数据
cleanup_marketing_data() {
    log "开始清理过期营销数据..."
    
    # 计算180天前的时间戳（毫秒）
    SIX_MONTHS_AGO=$(($(date +%s) - 180*24*60*60))
    SIX_MONTHS_AGO_MS=$((SIX_MONTHS_AGO * 1000))
    
    if [ -f "$PROJECT_ROOT/scripts/cleanup-db.js" ]; then
        node "$PROJECT_ROOT/scripts/cleanup-db.js" --type marketing_data --before $SIX_MONTHS_AGO_MS >> "$LOG_FILE" 2>&1
    fi
}

# 清理会话数据
cleanup_session_data() {
    log "开始清理过期会话数据..."
    
    # 计算30天前的时间戳（毫秒）
    THIRTY_DAYS_AGO=$(($(date +%s) - 30*24*60*60))
    THIRTY_DAYS_AGO_MS=$((THIRTY_DAYS_AGO * 1000))
    
    # 清理会话存储目录（如果使用文件存储）
    SESSION_DIR="$PROJECT_ROOT/storage/sessions"
    if [ -d "$SESSION_DIR" ]; then
        find "$SESSION_DIR" -name "*.json" -type f -mtime +30 -delete
        log "会话数据文件清理完成"
    fi
    
    if [ -f "$PROJECT_ROOT/scripts/cleanup-db.js" ]; then
        node "$PROJECT_ROOT/scripts/cleanup-db.js" --type session_data --before $THIRTY_DAYS_AGO_MS >> "$LOG_FILE" 2>&1
    fi
}

# 主清理函数
main() {
    log "=== GDPR数据清理脚本开始执行 ==="
    
    check_dependencies
    
    # 执行各类数据清理
    cleanup_user_accounts
    cleanup_activity_logs
    cleanup_marketing_data
    cleanup_session_data
    
    log "=== GDPR数据清理脚本执行完成 ==="
    
    # 发送通知（可选）
    if command -v curl &> /dev/null && [ -n "$NOTIFICATION_WEBHOOK" ]; then
        curl -X POST -H "Content-Type: application/json" \
             -d "{\"text\":\"GDPR数据清理完成，日志文件: $LOG_FILE\"}" \
             "$NOTIFICATION_WEBHOOK" >> "$LOG_FILE" 2>&1
    fi
}

# 处理命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            log "DRY RUN模式：仅显示将要执行的操作，不会实际删除数据"
            DRY_RUN=true
            shift
            ;;
        --help|-h)
            echo "GDPR数据清理脚本"
            echo "用法: $0 [选项]"
            echo "选项:"
            echo "  --dry-run    试运行模式，不实际删除数据"
            echo "  --help,-h    显示此帮助信息"
            exit 0
            ;;
        *)
            echo "未知参数: $1"
            exit 1
            ;;
    esac
done

# 执行主函数
main
#!/bin/bash
# =============================================================================
# 管理员操作审计日志脚本
# 功能：记录、监控和分析管理员操作日志
# 作者：老张（运维工程师）
# 日期：2026-03-29
# =============================================================================

set -e

# 配置变量
LOG_DIR="/var/log/admin"
AUDIT_LOG="$LOG_DIR/audit.log"
ALERT_LOG="$LOG_DIR/alerts.log"
ARCHIVE_DIR="$LOG_DIR/archive"

# 日志保留策略（天数）
RETENTION_DAYS=90

# 敏感操作关键词（用于告警）
SENSITIVE_KEYWORDS=(
    "delete"
    "drop"
    "rm"
    "chmod"
    "chown"
    "passwd"
    "userdel"
    "groupdel"
    "iptables"
    "ufw"
    "systemctl stop"
    "shutdown"
    "reboot"
    "su"
    "sudo"
)

# 创建日志目录
setup_log_directories() {
    mkdir -p "$LOG_DIR" "$ARCHIVE_DIR"
    touch "$AUDIT_LOG" "$ALERT_LOG"
    chmod 600 "$AUDIT_LOG" "$ALERT_LOG"
}

# 记录审计日志
log_audit_event() {
    local user="$1"
    local action="$2"
    local resource="$3"
    local ip="$4"
    local status="$5"
    local details="$6"
    
    # 生成唯一事件ID
    local event_id=$(uuidgen 2>/dev/null || echo "$(date +%s)_$$")
    
    # 记录详细审计日志
    echo "$(date '+%Y-%m-%d %H:%M:%S') | EVENT_ID:$event_id | USER:$user | ACTION:$action | RESOURCE:$resource | IP:$ip | STATUS:$status | DETAILS:$details" >> "$AUDIT_LOG"
    
    # 检查是否为敏感操作，如果是则记录到告警日志
    check_sensitive_operation "$user" "$action" "$resource" "$ip" "$status" "$details" "$event_id"
}

# 检查敏感操作并记录告警
check_sensitive_operation() {
    local user="$1"
    local action="$2"
    local resource="$3"
    local ip="$4"
    local status="$5"
    local details="$6"
    local event_id="$7"
    
    # 转换为小写进行匹配
    local action_lower=$(echo "$action" | tr '[:upper:]' '[:lower:]')
    local details_lower=$(echo "$details" | tr '[:upper:]' '[:lower:]')
    
    for keyword in "${SENSITIVE_KEYWORDS[@]}"; do
        if [[ "$action_lower" == *"$keyword"* ]] || [[ "$details_lower" == *"$keyword"* ]]; then
            echo "$(date '+%Y-%m-%d %H:%M:%S') | ALERT | EVENT_ID:$event_id | USER:$user | ACTION:$action | RESOURCE:$resource | IP:$ip | STATUS:$status | DETAILS:$details" >> "$ALERT_LOG"
            break
        fi
    done
}

# 日志轮转和归档
rotate_logs() {
    echo "执行日志轮转..."
    
    # 创建时间戳
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    
    # 归档当前日志
    if [ -s "$AUDIT_LOG" ]; then
        gzip -c "$AUDIT_LOG" > "$ARCHIVE_DIR/audit_$timestamp.log.gz"
        > "$AUDIT_LOG"  # 清空原文件
    fi
    
    if [ -s "$ALERT_LOG" ]; then
        gzip -c "$ALERT_LOG" > "$ARCHIVE_DIR/alerts_$timestamp.log.gz"
        > "$ALERT_LOG"
    fi
    
    echo "✓ 日志轮转完成"
}

# 清理过期日志
cleanup_old_logs() {
    echo "清理过期日志（保留 $RETENTION_DAYS 天）..."
    
    # 删除超过保留期限的归档日志
    find "$ARCHIVE_DIR" -name "*.log.gz" -type f -mtime +$RETENTION_DAYS -delete
    
    echo "✓ 过期日志清理完成"
}

# 生成审计报告
generate_audit_report() {
    local days=${1:-7}  # 默认7天
    echo "生成最近 $days 天的审计报告..."
    
    local start_date=$(date -d "$days days ago" '+%Y-%m-%d')
    local report_file="$LOG_DIR/audit_report_$(date '+%Y%m%d').txt"
    
    cat > "$report_file" << EOF
=============================================================================
管理员操作审计报告
生成时间: $(date '+%Y-%m-%d %H:%M:%S')
报告周期: $start_date 至 $(date '+%Y-%m-%d')
=============================================================================

EOF
    
    # 统计总操作数
    local total_ops=$(zcat "$ARCHIVE_DIR"/audit_*.log.gz "$AUDIT_LOG" 2>/dev/null | awk -v start="$start_date" '$1 >= start {count++} END {print count+0}')
    echo "总操作数: $total_ops" >> "$report_file"
    
    # 统计用户操作分布
    echo -e "\n用户操作分布:" >> "$report_file"
    zcat "$ARCHIVE_DIR"/audit_*.log.gz "$AUDIT_LOG" 2>/dev/null | awk -v start="$start_date" '$1 >= start {users[$6]++} END {for (u in users) print u ": " users[u]}' | sort -k2 -nr >> "$report_file"
    
    # 统计操作类型分布
    echo -e "\n操作类型分布:" >> "$report_file"
    zcat "$ARCHIVE_DIR"/audit_*.log.gz "$AUDIT_LOG" 2>/dev/null | awk -v start="$start_date" '$1 >= start {actions[$8]++} END {for (a in actions) print a ": " actions[a]}' | sort -k2 -nr >> "$report_file"
    
    # 列出敏感操作
    echo -e "\n敏感操作记录:" >> "$report_file"
    zcat "$ARCHIVE_DIR"/alerts_*.log.gz "$ALERT_LOG" 2>/dev/null | awk -v start="$start_date" '$1 >= start {print}' >> "$report_file"
    
    echo -e "\n=============================================================================" >> "$report_file"
    echo "审计报告已生成: $report_file"
}

# 实时监控日志（用于调试）
monitor_logs() {
    echo "实时监控管理员操作日志... (按 Ctrl+C 停止)"
    tail -f "$AUDIT_LOG"
}

# 导出日志（指定时间范围）
export_logs() {
    local start_date="$1"
    local end_date="$2"
    local output_file="$3"
    
    if [ -z "$start_date" ] || [ -z "$end_date" ] || [ -z "$output_file" ]; then
        echo "用法: export_logs <开始日期> <结束日期> <输出文件>"
        echo "日期格式: YYYY-MM-DD"
        return 1
    fi
    
    echo "导出 $start_date 至 $end_date 的日志到 $output_file..."
    
    # 合并归档日志和当前日志
    {
        zcat "$ARCHIVE_DIR"/audit_*.log.gz 2>/dev/null
        cat "$AUDIT_LOG"
    } | awk -v start="$start_date" -v end="$end_date" '$1 >= start && $1 <= end {print}' > "$output_file"
    
    echo "日志导出完成: $output_file"
}

# 主函数
main() {
    case "${1:-help}" in
        "setup")
            setup_log_directories
            echo "审计日志系统设置完成"
            ;;
        "rotate")
            rotate_logs
            cleanup_old_logs
            ;;
        "report")
            generate_audit_report "${2:-7}"
            ;;
        "monitor")
            monitor_logs
            ;;
        "export")
            export_logs "$2" "$3" "$4"
            ;;
        "log")
            # 用于记录单个事件
            if [ $# -lt 6 ]; then
                echo "用法: log <用户> <操作> <资源> <IP> <状态> <详情>"
                exit 1
            fi
            log_audit_event "$2" "$3" "$4" "$5" "$6" "$7"
            ;;
        "help"|*)
            cat << EOF
管理员审计日志脚本使用说明:

setup      - 初始化日志目录和文件
rotate     - 执行日志轮转和清理
report [N] - 生成最近N天的审计报告（默认7天）
monitor    - 实时监控日志
export <开始日期> <结束日期> <输出文件> - 导出指定时间范围的日志
log <用户> <操作> <资源> <IP> <状态> <详情> - 记录单个审计事件
help       - 显示此帮助信息

示例:
  ./admin-audit-log.sh setup
  ./admin-audit-log.sh report 30
  ./admin-audit-log.sh export 2026-03-01 2026-03-31 /tmp/march_logs.txt
EOF
            ;;
    esac
}

# 如果直接运行此脚本，则执行主函数
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
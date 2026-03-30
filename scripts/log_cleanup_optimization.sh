#!/bin/bash
# 日志清理优化脚本 - 老张运维优化项目
# 作者: 老张
# 日期: 2026-03-29

set -e

# 配置参数
LOG_RETENTION_DAYS=30          # 日志保留天数
COMPRESS_AGE_DAYS=7            # 多少天前的日志进行压缩
SYSTEM_LOG_DIR="/var/log"
CUSTOM_LOG_DIRS=("/Users/lijianquan/.openclaw/workspace-laozhang/logs" "/tmp/logs")
MAX_LOG_SIZE_MB=100           # 单个日志文件最大大小(MB)

# 创建自定义日志目录（如果不存在）
for dir in "${CUSTOM_LOG_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        echo "创建日志目录: $dir"
    fi
done

# 函数：清理系统日志
cleanup_system_logs() {
    echo "=== 清理系统日志 ==="
    
    # 清理旧的系统日志文件（保留30天）
    find "$SYSTEM_LOG_DIR" -name "*.log*" -type f -mtime +$LOG_RETENTION_DAYS -delete 2>/dev/null || true
    
    # 压缩7天前但未压缩的日志文件
    find "$SYSTEM_LOG_DIR" -name "*.log" -type f -mtime +$COMPRESS_AGE_DAYS ! -name "*.gz" ! -name "*.bz2" -exec gzip {} \; 2>/dev/null || true
    
    echo "系统日志清理完成"
}

# 函数：清理自定义日志目录
cleanup_custom_logs() {
    echo "=== 清理自定义日志目录 ==="
    
    for dir in "${CUSTOM_LOG_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            echo "处理目录: $dir"
            
            # 删除超过保留期限的日志
            find "$dir" -name "*.log*" -type f -mtime +$LOG_RETENTION_DAYS -delete 2>/dev/null || true
            
            # 压缩旧日志
            find "$dir" -name "*.log" -type f -mtime +$COMPRESS_AGE_DAYS ! -name "*.gz" ! -name "*.bz2" -exec gzip {} \; 2>/dev/null || true
            
            # 分割过大的日志文件
            find "$dir" -name "*.log" -type f -size +${MAX_LOG_SIZE_MB}M -exec sh -c '
                for logfile; do
                    echo "分割大日志文件: $logfile"
                    split -b ${MAX_LOG_SIZE_MB}M "$logfile" "$logfile.part."
                    rm "$logfile"
                done
            ' _ {} + 2>/dev/null || true
        fi
    done
    
    echo "自定义日志清理完成"
}

# 函数：优化newsyslog配置
optimize_newsyslog() {
    echo "=== 优化newsyslog配置 ==="
    
    # 创建优化的newsyslog配置文件
    cat > /tmp/optimized_logs.conf << EOF
# 优化的日志轮转配置
# logfilename          [owner:group]    mode count size when  flags [/pid_file] [sig_num]
/var/log/system.log                     640  30    *    \$D0   J
/var/log/wifi.log                       640  30    *    \$D0   J
/var/log/install.log                    640  30    *    \$D0   J
/var/log/fsck_*.log                     640  30    *    \$D0   J
EOF
    
    # 检查是否需要更新配置
    if [ ! -f "/etc/newsyslog.d/optimized_logs.conf" ] || ! cmp -s /tmp/optimized_logs.conf /etc/newsyslog.d/optimized_logs.conf; then
        echo "更新newsyslog配置..."
        # 注意：在实际生产环境中，这需要sudo权限
        # sudo cp /tmp/optimized_logs.conf /etc/newsyslog.d/optimized_logs.conf
        echo "配置文件已准备就绪，需要管理员权限安装到/etc/newsyslog.d/"
    else
        echo "newsyslog配置已是最新"
    fi
    
    rm -f /tmp/optimized_logs.conf
}

# 函数：显示当前磁盘使用情况
show_disk_usage() {
    echo "=== 磁盘使用情况 ==="
    df -h
    echo ""
    echo "日志目录使用情况:"
    du -sh "$SYSTEM_LOG_DIR" 2>/dev/null || echo "无法访问系统日志目录"
    
    for dir in "${CUSTOM_LOG_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            du -sh "$dir" 2>/dev/null || echo "无法访问目录: $dir"
        fi
    done
}

# 主执行流程
main() {
    echo "🚀 开始日志清理优化..."
    echo "配置: 保留天数=$LOG_RETENTION_DAYS, 压缩天数=$COMPRESS_AGE_DAYS, 最大大小=${MAX_LOG_SIZE_MB}MB"
    echo ""
    
    # 显示清理前的磁盘使用情况
    show_disk_usage
    echo ""
    
    # 执行清理
    cleanup_system_logs
    echo ""
    cleanup_custom_logs
    echo ""
    optimize_newsyslog
    echo ""
    
    # 显示清理后的磁盘使用情况
    echo "=== 清理后磁盘使用情况 ==="
    show_disk_usage
    
    echo ""
    echo "✅ 日志清理优化完成！"
    echo ""
    echo "💡 建议：将此脚本添加到cron任务中定期执行"
    echo "例如：每天凌晨2点执行"
    echo "# crontab -e"
    echo "0 2 * * * /path/to/log_cleanup_optimization.sh >> /var/log/cleanup.log 2>&1"
}

# 如果脚本被直接执行，则运行main函数
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
#!/bin/bash
# 性能监控脚本 - 老张运维优化项目
# 作者: 老张
# 日期: 2026-03-29

set -e

# 配置参数
MONITOR_INTERVAL=60           # 监控间隔（秒）
LOG_FILE="/Users/lijianquan/.openclaw/workspace-laozhang/logs/performance_monitor.log"
ALERT_LOG="/Users/lijianquan/.openclaw/workspace-laozhang/logs/performance_alerts.log"

# 告警阈值配置
CPU_THRESHOLD=80              # CPU使用率阈值 (%)
MEMORY_THRESHOLD=85           # 内存使用率阈值 (%)
DISK_THRESHOLD=90             # 磁盘使用率阈值 (%)
NETWORK_THRESHOLD=90          # 网络带宽使用率阈值 (%)

# 创建日志目录
mkdir -p "$(dirname "$LOG_FILE")"

# 函数：获取CPU使用率
get_cpu_usage() {
    # 使用top命令获取CPU使用率
    cpu_idle=$(top -l 1 | grep "CPU usage" | awk '{print $7}' | cut -d'.' -f1)
    if [[ -z "$cpu_idle" ]]; then
        cpu_idle=0
    fi
    cpu_usage=$((100 - cpu_idle))
    echo "$cpu_usage"
}

# 函数：获取内存使用情况
get_memory_usage() {
    # 使用vm_stat获取内存信息
    memory_info=$(vm_stat 2>/dev/null)
    if [[ $? -eq 0 ]]; then
        # 解析vm_stat输出
        pages_free=$(echo "$memory_info" | grep "Pages free:" | awk '{print $3}' | tr -d '.')
        pages_active=$(echo "$memory_info" | grep "Pages active:" | awk '{print $3}' | tr -d '.')
        pages_inactive=$(echo "$memory_info" | grep "Pages inactive:" | awk '{print $3}' | tr -d '.')
        pages_speculative=$(echo "$memory_info" | grep "Pages speculative:" | awk '{print $3}' | tr -d '.')
        pages_wired=$(echo "$memory_info" | grep "Pages wired down:" | awk '{print $4}' | tr -d '.')
        
        # 页面大小通常是4096字节
        page_size=4096
        
        total_pages=$((pages_free + pages_active + pages_inactive + pages_speculative + pages_wired))
        used_pages=$((pages_active + pages_inactive + pages_speculative + pages_wired))
        
        if [[ $total_pages -gt 0 ]]; then
            memory_usage=$((used_pages * 100 / total_pages))
            echo "$memory_usage"
        else
            echo "0"
        fi
    else
        # 备用方法：使用top
        mem_used=$(top -l 1 | grep PhysMem | awk '{print $2}' | tr -d 'M')
        mem_total=$(top -l 1 | grep PhysMem | awk '{print $6}' | tr -d 'M')
        if [[ $mem_total -gt 0 ]]; then
            memory_usage=$((mem_used * 100 / mem_total))
            echo "$memory_usage"
        else
            echo "0"
        fi
    fi
}

# 函数：获取磁盘使用情况
get_disk_usage() {
    # 获取根分区的使用率
    disk_usage=$(df -h / | tail -1 | awk '{print $5}' | tr -d '%')
    echo "$disk_usage"
}

# 函数：获取网络使用情况（简化版）
get_network_usage() {
    # 这是一个简化的网络监控，实际生产环境中应该使用更精确的方法
    # 返回一个固定值作为占位符
    echo "50"
}

# 函数：检查告警阈值
check_alerts() {
    local cpu_usage=$1
    local memory_usage=$2
    local disk_usage=$3
    local network_usage=$4
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    local alerts=()
    
    if [[ $cpu_usage -gt $CPU_THRESHOLD ]]; then
        alerts+=("CPU使用率过高: ${cpu_usage}% > ${CPU_THRESHOLD}%")
    fi
    
    if [[ $memory_usage -gt $MEMORY_THRESHOLD ]]; then
        alerts+=("内存使用率过高: ${memory_usage}% > ${MEMORY_THRESHOLD}%")
    fi
    
    if [[ $disk_usage -gt $DISK_THRESHOLD ]]; then
        alerts+=("磁盘使用率过高: ${disk_usage}% > ${DISK_THRESHOLD}%")
    fi
    
    if [[ $network_usage -gt $NETWORK_THRESHOLD ]]; then
        alerts+=("网络带宽使用率过高: ${network_usage}% > ${NETWORK_THRESHOLD}%")
    fi
    
    # 记录告警
    if [[ ${#alerts[@]} -gt 0 ]]; then
        for alert in "${alerts[@]}"; do
            echo "[$timestamp] ALERT: $alert" >> "$ALERT_LOG"
            echo "[$timestamp] ALERT: $alert"
        done
    fi
}

# 函数：记录性能数据
log_performance_data() {
    local cpu_usage=$1
    local memory_usage=$2
    local disk_usage=$3
    local network_usage=$4
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "[$timestamp] CPU:${cpu_usage}% MEM:${memory_usage}% DISK:${disk_usage}% NET:${network_usage}%" >> "$LOG_FILE"
}

# 函数：显示当前性能状态
show_current_status() {
    local cpu_usage=$1
    local memory_usage=$2
    local disk_usage=$3
    local network_usage=$4
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "=== 当前系统性能状态 ($timestamp) ==="
    echo "CPU使用率: ${cpu_usage}%"
    echo "内存使用率: ${memory_usage}%"
    echo "磁盘使用率: ${disk_usage}%"
    echo "网络使用率: ${network_usage}%"
    echo ""
}

# 主监控循环
main() {
    echo "🚀 启动性能监控..."
    echo "配置: 间隔=${MONITOR_INTERVAL}s, CPU阈值=${CPU_THRESHOLD}%, 内存阈值=${MEMORY_THRESHOLD}%, 磁盘阈值=${DISK_THRESHOLD}%, 网络阈值=${NETWORK_THRESHOLD}%"
    echo ""
    
    while true; do
        # 获取性能指标
        cpu_usage=$(get_cpu_usage)
        memory_usage=$(get_memory_usage)
        disk_usage=$(get_disk_usage)
        network_usage=$(get_network_usage)
        
        # 显示当前状态
        show_current_status "$cpu_usage" "$memory_usage" "$disk_usage" "$network_usage"
        
        # 记录数据
        log_performance_data "$cpu_usage" "$memory_usage" "$disk_usage" "$network_usage"
        
        # 检查告警
        check_alerts "$cpu_usage" "$memory_usage" "$disk_usage" "$network_usage"
        
        # 等待下一个监控周期
        sleep "$MONITOR_INTERVAL"
    done
}

# 如果脚本被直接执行，则运行main函数
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # 检查是否传入了--once参数（只运行一次）
    if [[ "$1" == "--once" ]]; then
        cpu_usage=$(get_cpu_usage)
        memory_usage=$(get_memory_usage)
        disk_usage=$(get_disk_usage)
        network_usage=$(get_network_usage)
        
        show_current_status "$cpu_usage" "$memory_usage" "$disk_usage" "$network_usage"
        log_performance_data "$cpu_usage" "$memory_usage" "$disk_usage" "$network_usage"
        check_alerts "$cpu_usage" "$memory_usage" "$disk_usage" "$network_usage"
    else
        main "$@"
    fi
fi
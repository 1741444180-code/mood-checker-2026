#!/bin/bash

# System Monitoring Script for CPU, Memory, and Disk Usage
# Created by: 老张 (运维工程师)
# Date: 2026-03-29

set -e

# Configuration
ALERT_THRESHOLD_CPU=80      # CPU usage threshold in percentage
ALERT_THRESHOLD_MEM=85      # Memory usage threshold in percentage  
ALERT_THRESHOLD_DISK=90     # Disk usage threshold in percentage
LOG_FILE="/var/log/system-monitor.log"
ADMIN_EMAIL="admin@example.com"  # Replace with actual admin email

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "${LOG_FILE}"
}

# Function to send alert (placeholder - integrate with actual notification system)
send_alert() {
    local subject="$1"
    local message="$2"
    log_message "ALERT: ${subject} - ${message}"
    
    # In production, you would integrate with:
    # - Email (mail command)
    # - Slack/Feishu webhook
    # - Prometheus Alertmanager
    # - Custom notification service
    
    # Example email integration (uncomment when email is configured):
    # echo "${message}" | mail -s "${subject}" "${ADMIN_EMAIL}"
}

# Check CPU usage
check_cpu() {
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print 100 - $8}')
    cpu_usage=${cpu_usage%.*}  # Remove decimal part
    
    log_message "CPU Usage: ${cpu_usage}%"
    
    if [ "${cpu_usage}" -gt "${ALERT_THRESHOLD_CPU}" ]; then
        send_alert "HIGH CPU USAGE ALERT" "CPU usage is at ${cpu_usage}%, which exceeds the threshold of ${ALERT_THRESHOLD_CPU}%"
    fi
}

# Check Memory usage
check_memory() {
    local mem_info=$(free | awk 'NR==2{printf "%.0f", $3*100/$2 }')
    log_message "Memory Usage: ${mem_info}%"
    
    if [ "${mem_info}" -gt "${ALERT_THRESHOLD_MEM}" ]; then
        send_alert "HIGH MEMORY USAGE ALERT" "Memory usage is at ${mem_info}%, which exceeds the threshold of ${ALERT_THRESHOLD_MEM}%"
    fi
}

# Check Disk usage
check_disk() {
    local disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    log_message "Disk Usage (/): ${disk_usage}%"
    
    if [ "${disk_usage}" -gt "${ALERT_THRESHOLD_DISK}" ]; then
        send_alert "HIGH DISK USAGE ALERT" "Disk usage is at ${disk_usage}%, which exceeds the threshold of ${ALERT_THRESHOLD_DISK}%"
    fi
    
    # Also check other important mount points
    df -h | awk 'NR>1 {print $5 " " $6}' | while read -r usage mount; do
        usage_num=${usage%%%}
        if [ "${usage_num}" -gt "${ALERT_THRESHOLD_DISK}" ]; then
            send_alert "HIGH DISK USAGE ALERT" "Mount point ${mount} usage is at ${usage_num}%, which exceeds the threshold of ${ALERT_THRESHOLD_DISK}%"
        fi
    done
}

# Main monitoring function
main() {
    mkdir -p "$(dirname "${LOG_FILE}")"
    
    log_message "Starting system monitoring check..."
    
    check_cpu
    check_memory  
    check_disk
    
    log_message "System monitoring check completed."
}

# Run main function
main "$@"
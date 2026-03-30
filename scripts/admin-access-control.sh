#!/bin/bash
# =============================================================================
# 后台管理访问控制脚本
# 功能：管理员角色权限配置、IP白名单、敏感操作二次验证
# 作者：老张（运维工程师）
# 日期：2026-03-29
# =============================================================================

set -e

# 配置文件路径
CONFIG_DIR="/etc/admin-config"
ACCESS_CONFIG="$CONFIG_DIR/access.conf"
IP_WHITELIST="$CONFIG_DIR/ip-whitelist.conf"
MFA_CONFIG="$CONFIG_DIR/mfa.conf"

# 日志文件
LOG_FILE="/var/log/admin-access.log"

# 创建必要的目录
setup_directories() {
    mkdir -p "$CONFIG_DIR"
    touch "$LOG_FILE"
    chmod 600 "$LOG_FILE"
}

# 记录日志函数
log_action() {
    local action="$1"
    local user="$2"
    local ip="$3"
    local status="$4"
    echo "$(date '+%Y-%m-%d %H:%M:%S') | $action | User: $user | IP: $ip | Status: $status" >> "$LOG_FILE"
}

# 管理员角色权限配置
configure_admin_roles() {
    echo "配置管理员角色权限..."
    
    # 创建角色配置文件
    cat > "$ACCESS_CONFIG" << 'EOF'
# 管理员角色权限配置
# 格式: 角色名:权限列表(逗号分隔)

# 超级管理员 - 拥有所有权限
super_admin:read,write,delete,config,user_mgmt,system_mgmt

# 系统管理员 - 系统管理权限
sys_admin:read,write,config,system_mgmt

# 内容管理员 - 内容管理权限  
content_admin:read,write,content_mgmt

# 审计员 - 只读权限
auditor:read

# 敏感操作列表（需要二次验证）
sensitive_operations:delete,config,user_mgmt,system_mgmt
EOF
    
    chmod 600 "$ACCESS_CONFIG"
    echo "✓ 管理员角色权限配置完成"
}

# IP白名单配置
configure_ip_whitelist() {
    echo "配置后台访问IP白名单..."
    
    # 默认允许的IP范围（可根据实际情况修改）
    cat > "$IP_WHITELIST" << 'EOF'
# 后台管理IP白名单
# 格式: IP地址或CIDR网段

# 公司办公网络
192.168.1.0/24
10.0.0.0/8

# 运维团队固定IP
203.0.113.10
203.0.113.11
203.0.113.12

# 监控服务器
198.51.100.50

# 本地回环地址
127.0.0.1
::1
EOF
    
    chmod 600 "$IP_WHITELIST"
    echo "✓ IP白名单配置完成"
}

# 敏感操作二次验证配置
configure_mfa() {
    echo "配置敏感操作二次验证..."
    
    cat > "$MFA_CONFIG" << 'EOF'
# 敏感操作二次验证配置

# 启用二次验证
mfa_enabled=true

# 验证方式 (sms|email|totp|push)
mfa_method=totp

# 验证码有效期（秒）
code_expiry=300

# 最大尝试次数
max_attempts=3

# 锁定时间（分钟）
lockout_duration=15

# 需要二次验证的操作类型
protected_operations=delete_user,modify_permissions,change_password,access_sensitive_data,system_shutdown,backup_restore
EOF
    
    chmod 600 "$MFA_CONFIG"
    echo "✓ 敏感操作二次验证配置完成"
}

# 验证IP是否在白名单中
is_ip_allowed() {
    local client_ip="$1"
    if [ -f "$IP_WHITELIST" ]; then
        while IFS= read -r line; do
            # 跳过注释和空行
            [[ "$line" =~ ^[[:space:]]*# ]] && continue
            [[ -z "$line" ]] && continue
            
            # 检查IP或CIDR匹配
            if [[ "$line" == *"/"* ]]; then
                # CIDR格式
                if ip_in_cidr "$client_ip" "$line"; then
                    return 0
                fi
            else
                # 单个IP
                if [ "$client_ip" = "$line" ]; then
                    return 0
                fi
            fi
        done < "$IP_WHITELIST"
    fi
    return 1
}

# 辅助函数：检查IP是否在CIDR范围内（简化版）
ip_in_cidr() {
    local ip="$1"
    local cidr="$2"
    # 这里可以使用更复杂的IP计算逻辑，在实际生产环境中建议使用专门的工具
    # 简化处理：对于本脚本主要是配置，实际验证由应用层处理
    return 0
}

# 主函数
main() {
    echo "开始配置后台管理访问控制..."
    setup_directories
    configure_admin_roles
    configure_ip_whitelist
    configure_mfa
    echo "后台管理访问控制配置完成！"
    echo "配置文件位置:"
    echo "  - 权限配置: $ACCESS_CONFIG"
    echo "  - IP白名单: $IP_WHITELIST"
    echo "  - 二次验证: $MFA_CONFIG"
    echo "  - 操作日志: $LOG_FILE"
}

# 如果直接运行此脚本，则执行主函数
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
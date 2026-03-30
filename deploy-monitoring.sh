#!/bin/bash

# 监控系统部署脚本
# 用于部署和配置Sentry、LogRocket监控系统

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查必要环境变量
check_env_vars() {
    log_info "检查环境变量..."
    
    required_vars=(
        "SENTRY_AUTH_TOKEN"
        "NEXT_PUBLIC_SENTRY_DSN"
        "SENTRY_DSN"
        "NEXT_PUBLIC_LOGROCKET_ID"
    )
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log_error "缺少必要的环境变量: ${missing_vars[*]}"
        exit 1
    fi
    
    log_info "所有必要环境变量已设置"
}

# 安装Sentry CLI
install_sentry_cli() {
    log_info "安装Sentry CLI..."
    
    if ! command -v sentry-cli &> /dev/null; then
        curl -sL https://sentry.io/get-cli/ | bash
        log_info "Sentry CLI安装完成"
    else
        log_info "Sentry CLI已安装"
    fi
}

# 配置Sentry项目
configure_sentry() {
    log_info "配置Sentry项目..."
    
    # 设置Sentry认证
    export SENTRY_AUTH_TOKEN
    export SENTRY_URL="https://sentry.io/"
    
    # 创建或验证Sentry项目
    PROJECT_NAME="mood-tracker"
    ORG_SLUG="mood-tracker-org"
    
    # 检查项目是否存在
    if sentry-cli projects list --org "$ORG_SLUG" | grep -q "$PROJECT_NAME"; then
        log_info "Sentry项目 '$PROJECT_NAME' 已存在"
    else
        log_info "创建Sentry项目 '$PROJECT_NAME'"
        sentry-cli projects create "$PROJECT_NAME" --org "$ORG_SLUG"
    fi
    
    # 上传源映射（如果存在）
    if [[ -d ".next" ]]; then
        log_info "上传源映射到Sentry..."
        sentry-cli releases files "$RELEASE_VERSION" upload-sourcemaps .next/static/chunks --url-prefix "/_next/static/chunks"
        sentry-cli releases files "$RELEASE_VERSION" upload-sourcemaps .next/static/css --url-prefix "/_next/static/css"
    fi
    
    log_info "Sentry配置完成"
}

# 验证LogRocket配置
validate_logrocket() {
    log_info "验证LogRocket配置..."
    
    if [[ -z "$NEXT_PUBLIC_LOGROCKET_ID" ]]; then
        log_error "LogRocket ID未设置"
        exit 1
    fi
    
    # 验证LogRocket ID格式 (通常为 app-id/project-id 格式)
    if [[ "$NEXT_PUBLIC_LOGROCKET_ID" =~ ^[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+$ ]]; then
        log_info "LogRocket ID格式有效"
    else
        log_warn "LogRocket ID格式可能无效，请确认: $NEXT_PUBLIC_LOGROCKET_ID"
    fi
}

# 构建应用（如果需要）
build_app() {
    log_info "构建应用..."
    
    if [[ -f "package.json" ]]; then
        npm run build || yarn build
        log_info "应用构建完成"
    else
        log_warn "未找到package.json，跳过构建步骤"
    fi
}

# 部署到生产环境
deploy_to_production() {
    log_info "部署到生产环境..."
    
    # 这里可以根据实际部署方式调整
    # 例如：Vercel、Railway、自托管等
    
    if command -v vercel &> /dev/null; then
        vercel --prod --token "$VERCEL_TOKEN"
    elif [[ -n "$RAILWAY_TOKEN" ]]; then
        railway up --service mood-tracker
    else
        log_info "使用默认部署方式..."
        # 假设使用git push或其他方式
        # 这里可以添加具体的部署命令
    fi
    
    log_info "生产环境部署完成"
}

# 验证监控集成
verify_monitoring() {
    log_info "验证监控集成..."
    
    # 创建测试事件
    TEST_EVENT_ID="monitoring-test-$(date +%s)"
    
    # 发送测试事件到Sentry
    curl -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
        -d '{
            "event_id": "'$TEST_EVENT_ID'",
            "message": "Monitoring deployment test",
            "level": "info",
            "tags": {"deployment_test": "true"}
        }' \
        "https://sentry.io/api/0/projects/mood-tracker-org/mood-tracker/events/"
    
    log_info "已发送测试事件到Sentry (ID: $TEST_EVENT_ID)"
    log_info "请在Sentry控制台验证事件是否接收成功"
    
    # LogRocket验证需要前端交互，这里仅提示
    log_info "请在网站上进行简单操作，验证LogRocket会话记录是否正常"
}

# 主函数
main() {
    log_info "开始部署监控系统..."
    
    # 检查环境变量
    check_env_vars
    
    # 安装依赖
    install_sentry_cli
    
    # 获取发布版本
    if [[ -n "$RELEASE_VERSION" ]]; then
        RELEASE="$RELEASE_VERSION"
    else
        RELEASE="production-$(date +%Y%m%d-%H%M%S)"
    fi
    export RELEASE_VERSION="$RELEASE"
    
    log_info "使用发布版本: $RELEASE_VERSION"
    
    # 配置Sentry
    configure_sentry
    
    # 验证LogRocket
    validate_logrocket
    
    # 构建应用
    build_app
    
    # 部署到生产环境
    deploy_to_production
    
    # 验证监控集成
    verify_monitoring
    
    log_info "监控系统部署完成！"
    log_info "请检查Sentry和LogRocket控制台确认监控数据正常接收。"
}

# 处理中断信号
trap 'log_error "部署被中断"; exit 1' INT TERM

# 执行主函数
main "$@"
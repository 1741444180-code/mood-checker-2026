#!/bin/bash

# 心情打卡帮助中心部署脚本
# 支持本地、测试和生产环境部署

set -e  # 遇到错误立即退出

# 默认配置
ENVIRONMENT="production"
BRANCH="main"
VERBOSE=false
DRY_RUN=false
DEPLOY_METHOD="vercel"  # 可选: vercel, railway, manual

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# 显示帮助信息
show_help() {
    cat << EOF
心情打卡帮助中心部署脚本

用法: $0 [选项]

选项:
    -e, --environment ENV    部署环境 (local|staging|production) [默认: production]
    -b, --branch BRANCH      Git 分支 [默认: main]
    -m, --method METHOD      部署方法 (vercel|railway|manual) [默认: vercel]
    -v, --verbose            详细输出
    -n, --dry-run            仅显示将要执行的操作，不实际部署
    -h, --help               显示此帮助信息

示例:
    $0 --environment staging --branch develop
    $0 --environment production --dry-run
EOF
}

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -b|--branch)
            BRANCH="$2"
            shift 2
            ;;
        -m|--method)
            DEPLOY_METHOD="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -n|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            error "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
done

# 验证环境变量
validate_environment() {
    case $ENVIRONMENT in
        local|staging|production)
            ;;
        *)
            error "无效的环境: $ENVIRONMENT. 必须是 local, staging 或 production."
            exit 1
            ;;
    esac
}

# 验证部署方法
validate_deploy_method() {
    case $DEPLOY_METHOD in
        vercel|railway|manual)
            ;;
        *)
            error "无效的部署方法: $DEPLOY_METHOD. 必须是 vercel, railway 或 manual."
            exit 1
            ;;
    esac
}

# 检查必要工具
check_dependencies() {
    log "检查必要工具..."

    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js 未安装。请先安装 Node.js 18+。"
        exit 1
    fi

    # 检查 npm
    if ! command -v npm &> /dev/null; then
        error "npm 未安装。请先安装 npm。"
        exit 1
    fi

    # 检查 Git
    if ! command -v git &> /dev/null; then
        error "Git 未安装。请先安装 Git。"
        exit 1
    fi

    # 根据部署方法检查特定工具
    if [[ "$DEPLOY_METHOD" == "vercel" ]]; then
        if ! command -v vercel &> /dev/null; then
            warn "Vercel CLI 未安装。尝试全局安装..."
            if [[ "$DRY_RUN" == false ]]; then
                npm install -g vercel
            fi
        fi
    elif [[ "$DEPLOY_METHOD" == "railway" ]]; then
        if ! command -v railway &> /dev/null; then
            warn "Railway CLI 未安装。尝试全局安装..."
            if [[ "$DRY_RUN" == false ]]; then
                npm install -g @railway/cli
            fi
        fi
    fi

    success "所有必要工具已就绪。"
}

# 切换到指定分支
switch_branch() {
    if [[ "$DRY_RUN" == true ]]; then
        log "[DRY RUN] 将切换到分支: $BRANCH"
        return
    fi

    log "切换到分支: $BRANCH"
    if git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
        git checkout "$BRANCH"
        git pull origin "$BRANCH"
    else
        error "分支 $BRANCH 不存在。"
        exit 1
    fi
    success "已切换到分支: $BRANCH"
}

# 安装依赖
install_dependencies() {
    if [[ "$DRY_RUN" == true ]]; then
        log "[DRY RUN] 将安装依赖..."
        return
    fi

    log "安装依赖..."
    npm ci
    success "依赖安装完成。"
}

# 构建文档
build_docs() {
    if [[ "$DRY_RUN" == true ]]; then
        log "[DRY RUN] 将构建文档..."
        return
    fi

    log "构建文档..."
    npm run build
    success "文档构建完成。"
}

# 部署到 Vercel
deploy_vercel() {
    local vercel_env=""
    
    case $ENVIRONMENT in
        local)
            log "本地环境不需要部署到 Vercel。"
            return
            ;;
        staging)
            vercel_env="--environment=preview"
            ;;
        production)
            vercel_env="--prod"
            ;;
    esac

    if [[ "$DRY_RUN" == true ]]; then
        log "[DRY RUN] 将使用 Vercel 部署到 $ENVIRONMENT 环境"
        return
    fi

    log "使用 Vercel 部署到 $ENVIRONMENT 环境..."
    vercel deploy $vercel_env
    success "Vercel 部署完成。"
}

# 部署到 Railway
deploy_railway() {
    if [[ "$DRY_RUN" == true ]]; then
        log "[DRY RUN] 将使用 Railway 部署到 $ENVIRONMENT 环境"
        return
    fi

    log "使用 Railway 部署到 $ENVIRONMENT 环境..."
    
    case $ENVIRONMENT in
        local)
            error "本地环境不能部署到 Railway。"
            exit 1
            ;;
        staging)
            railway up --environment staging
            ;;
        production)
            railway up --environment production
            ;;
    esac
    
    success "Railway 部署完成。"
}

# 手动部署（rsync）
deploy_manual() {
    local target_host=""
    local target_path=""
    
    case $ENVIRONMENT in
        local)
            log "本地环境不需要手动部署。"
            return
            ;;
        staging)
            target_host="${STAGING_HOST:-staging-help.moodtracker.com}"
            target_path="${STAGING_PATH:-/var/www/staging-help.moodtracker.com}"
            ;;
        production)
            target_host="${PRODUCTION_HOST:-help.moodtracker.com}"
            target_path="${PRODUCTION_PATH:-/var/www/help.moodtracker.com}"
            ;;
    esac

    if [[ "$DRY_RUN" == true ]]; then
        log "[DRY RUN] 将使用 rsync 部署到 $target_host:$target_path"
        return
    fi

    log "使用 rsync 部署到 $target_host:$target_path..."
    
    # 确保目标目录存在
    ssh "$target_host" "mkdir -p $target_path"
    
    # 同步文件
    rsync -avz --delete --exclude='.git' build/ "$target_host:$target_path"
    
    success "手动部署完成。"
}

# 主部署函数
deploy() {
    validate_environment
    validate_deploy_method
    check_dependencies
    
    # 如果不是本地环境，切换分支
    if [[ "$ENVIRONMENT" != "local" ]]; then
        switch_branch
    fi
    
    install_dependencies
    build_docs
    
    case $DEPLOY_METHOD in
        vercel)
            deploy_vercel
            ;;
        railway)
            deploy_railway
            ;;
        manual)
            deploy_manual
            ;;
    esac
    
    success "帮助中心部署到 $ENVIRONMENT 环境完成！"
}

# 执行部署
deploy
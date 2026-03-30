# 文档部署指南

## 概述
本文档详细说明了心情打卡网站帮助中心的部署流程，包括本地开发、测试环境部署和生产环境部署。

## 前置条件

### 系统要求
- Node.js 18.x 或更高版本
- npm 8.x 或更高版本（或 Yarn 1.22+）
- Git 2.30+

### 环境变量
创建 `.env` 文件并配置以下变量：

```env
# Algolia 搜索配置（可选）
ALGOLIA_APP_ID=your_app_id
ALGOLIA_API_KEY=your_api_key
ALGOLIA_INDEX_NAME=moodtracker_help

# Google Analytics（可选）
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Sentry 错误监控（可选）
SENTRY_DSN=https://your-sentry-dsn@sentry.io/XXXXXX
```

## 本地开发

### 克隆仓库
```bash
git clone https://github.com/moodtracker/help-center.git
cd help-center
```

### 安装依赖
```bash
# 使用 npm
npm install

# 或使用 Yarn
yarn install
```

### 启动开发服务器
```bash
# 使用 npm
npm start

# 或使用 Yarn
yarn start
```

开发服务器将在 `http://localhost:3000` 启动，并支持热重载。

### 构建本地预览
```bash
# 使用 npm
npm run build

# 或使用 Yarn
yarn build
```

构建完成后，可以使用静态服务器预览：
```bash
npx serve -s build
```

## 测试环境部署

### 手动部署到测试环境
```bash
# 构建生产版本
npm run build

# 部署到测试服务器（示例使用 rsync）
rsync -avz --delete build/ user@test-server:/var/www/staging-help.moodtracker.com/
```

### 自动化测试部署
测试环境部署通过 GitHub Actions 自动完成，详情见 `.github/workflows/help.yml`。

## 生产环境部署

### Vercel 部署（推荐）

#### 1. 连接 GitHub 仓库
- 登录 [Vercel Dashboard](https://vercel.com/dashboard)
- 导入 `moodtracker/help-center` 仓库
- 配置项目设置

#### 2. 环境变量配置
在 Vercel 项目设置中添加以下环境变量：
- `ALGOLIA_APP_ID`
- `ALGOLIA_API_KEY`
- `ALGOLIA_INDEX_NAME`
- `GOOGLE_ANALYTICS_ID`
- `SENTRY_DSN`

#### 3. 构建设置
- **Framework Preset**: Next.js (Docusaurus 会自动检测)
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

#### 4. 自定义域名
- 在 Vercel 项目设置中添加自定义域名：`help.moodtracker.com`
- 按照 Vercel 提供的 DNS 记录更新域名解析

### Railway 部署（备选方案）

#### 1. 创建新项目
```bash
railway login
railway init
```

#### 2. 配置服务
- 选择 "Deploy from GitHub repo"
- 选择 `moodtracker/help-center` 仓库
- 设置环境变量（同 Vercel 配置）

#### 3. 构建配置
- **Build Command**: `npm run build`
- **Start Command**: `npx serve -s build`
- **Port**: `$PORT`

#### 4. 域名配置
- 在 Railway 项目设置中配置自定义域名
- 更新 DNS 记录指向 Railway 提供的 CNAME

## CI/CD 集成

### GitHub Actions
所有推送到 `main` 分支的更改将自动触发生产环境部署。
所有推送到 `develop` 分支的更改将自动触发测试环境部署。

### 部署验证
部署完成后，自动运行以下验证步骤：
1. 检查网站是否可访问
2. 验证关键页面加载正常
3. 检查搜索功能是否工作
4. 验证响应式布局在不同设备上的表现

## 回滚策略

### 紧急回滚
如果生产环境部署出现问题，可以通过以下方式快速回滚：

#### Vercel 回滚
1. 登录 Vercel Dashboard
2. 进入项目部署历史
3. 选择上一个稳定版本
4. 点击 "Promote to Production"

#### 手动回滚
```bash
# 切换到上一个稳定提交
git checkout <previous-stable-commit>

# 重新部署
./deploy-help-system.sh --environment production
```

## 监控与告警

### 可用性监控
- 使用 UptimeRobot 或类似服务监控网站可用性
- 配置邮件/Slack 告警通知

### 性能监控
- 使用 Lighthouse CI 监控核心 Web 指标
- 设置性能回归告警阈值

### 日志管理
- 收集部署日志和错误日志
- 使用 ELK Stack 或类似工具进行日志分析

## 维护任务

### 定期任务
- **每周**: 检查外部链接有效性
- **每月**: 更新依赖包版本
- **每季度**: 审查文档内容准确性

### 依赖更新
```bash
# 更新 Docusaurus 核心包
npm update @docusaurus/core @docusaurus/preset-classic

# 更新所有依赖
npm update
```

### 内容同步
确保帮助中心文档与主应用程序功能保持同步：
- 新功能发布前更新相关文档
- 功能变更时同步更新文档
- 移除已废弃功能的文档

## 故障排除

### 常见问题

#### 构建失败
- **问题**: `npm run build` 失败
- **解决方案**: 
  1. 清理 node_modules: `rm -rf node_modules package-lock.json`
  2. 重新安装依赖: `npm install`
  3. 检查 Markdown 语法错误

#### 搜索不工作
- **问题**: Algolia 搜索无法返回结果
- **解决方案**:
  1. 验证 Algolia 凭据是否正确
  2. 检查索引是否已正确配置
  3. 重新运行搜索索引脚本

#### 样式异常
- **问题**: 页面样式显示异常
- **解决方案**:
  1. 清除浏览器缓存
  2. 检查 CSS 自定义文件是否有语法错误
  3. 验证主题配置是否正确

### 调试命令

#### 本地调试
```bash
# 启用详细日志
DEBUG=docusaurus:* npm start

# 检查链接
npm run docusaurus links
```

#### 远程调试
```bash
# 查看部署日志（Vercel）
vercel logs --prod

# 查看部署日志（Railway）
railway logs
```

## 安全考虑

### 内容安全
- 所有文档内容经过审核后才能发布
- 禁止在文档中包含敏感信息
- 定期扫描文档中的潜在安全问题

### 访问控制
- 帮助中心为公开访问，无需认证
- 敏感操作文档应放在内部 Wiki 而非公开帮助中心
- API 文档应包含适当的使用限制说明

## 成本优化

### CDN 缓存
- 配置长期缓存策略减少带宽消耗
- 使用 CDN 边缘缓存提高全球访问速度

### 构建优化
- 启用代码分割减少初始加载时间
- 压缩静态资源减少存储和传输成本

### 监控成本
- 合理设置监控频率避免过度采样
- 定期审查监控服务使用情况
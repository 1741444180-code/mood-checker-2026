# 心情打卡网站 - 部署配置文档

## 1. GitHub 仓库配置

### 1.1 创建仓库
- 在 GitHub 上创建新仓库 `mood-checker`
- 选择私有仓库（推荐）
- 不要初始化 README、.gitignore 或 LICENSE（我们已经有这些文件）

### 1.2 连接本地仓库
```bash
cd /Users/lijianquan/.openclaw/workspace/projects/mood-checker
git remote add origin https://github.com/YOUR_USERNAME/mood-checker.git
git push -u origin main
```

### 1.3 配置仓库 Secrets
在 GitHub 仓库 Settings > Secrets and variables > Actions 中添加以下 secrets：

| Secret Name | Value |
|-------------|-------|
| VERCEL_TOKEN | 从 Vercel Account Settings > Tokens 获取 |
| VERCEL_ORG_ID | 从 Vercel Project Settings 获取 |
| VERCEL_PROJECT_ID | 从 Vercel Project Settings 获取 |

## 2. Vercel 项目配置

### 2.1 创建 Vercel 项目
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New..." > "Project"
3. 导入 GitHub 仓库 `mood-checker`
4. 项目名称：`mood-checker`
5. Framework Preset: Next.js
6. Root Directory: `/` (留空)
7. Build and Output Settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm ci`

### 2.2 配置环境变量
在 Vercel Project Settings > Environment Variables 中添加：

| Key | Value | Environment |
|-----|-------|-------------|
| DATABASE_URL | PostgreSQL 连接字符串 | Production, Preview, Development |
| NEXTAUTH_SECRET | 随机生成的 32 字符密钥 | Production, Preview, Development |
| NEXTAUTH_URL | https://mood-checker.vercel.app | Production |
| NEXTAUTH_URL | https://[preview-url].vercel.app | Preview |
| SENTRY_DSN | Sentry DSN | Production, Preview |

### 2.3 配置数据库
使用 Vercel Postgres（推荐）或 Railway：

#### 方案 A: Vercel Postgres
1. 在 Vercel Dashboard 中，点击左侧菜单 "Storage"
2. 点击 "Create" > "Postgres"
3. Database Name: `mood-checker-prod`
4. Region: 选择离用户最近的区域
5. 复制连接字符串到 `DATABASE_URL` 环境变量

#### 方案 B: Railway
1. 访问 [Railway.app](https://railway.app)
2. 创建新项目
3. 添加 PostgreSQL 数据库服务
4. 复制连接字符串到 `DATABASE_URL` 环境变量

## 3. 数据库迁移

### 3.1 本地测试迁移
```bash
# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 执行迁移（使用本地数据库）
npx prisma migrate dev --name init
```

### 3.2 生产环境迁移
在 Vercel 部署后，通过 Vercel CLI 执行生产迁移：

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 执行生产迁移
vercel exec --prod -- npx prisma migrate deploy
```

## 4. CI/CD 验证

### 4.1 测试 CI 工作流
- 推送代码到 main 分支
- 检查 GitHub Actions 是否成功运行
- 验证 lint、test、build 步骤是否通过

### 4.2 测试 CD 工作流
- 确认 main 分支推送后自动部署到 Vercel production
- 检查 Vercel deployment logs

## 5. 监控配置

### 5.1 Sentry 配置
1. 创建 [Sentry](https://sentry.io) 项目
2. 获取 DSN 并配置到环境变量
3. 在 Next.js 应用中集成 Sentry

### 5.2 Vercel Analytics
- Vercel Analytics 自动启用
- 在 Vercel Dashboard > Analytics 中查看性能数据

## 6. 域名配置（可选）

### 6.1 自定义域名
1. 在 Vercel Project Settings > Domains 中添加自定义域名
2. Vercel 会自动配置 SSL 证书
3. 更新 DNS 记录指向 Vercel

## 7. 验收检查清单

- [ ] GitHub 仓库创建并推送代码
- [ ] Vercel 项目创建并配置
- [ ] 数据库创建并连接
- [ ] 环境变量正确配置
- [ ] CI/CD 工作流测试通过
- [ ] 数据库迁移成功执行
- [ ] 应用成功部署并可访问
- [ ] 监控系统正常工作

## 故障排除

### 常见问题

**Q: 数据库连接失败**
A: 检查 `DATABASE_URL` 环境变量是否正确，确保数据库服务正在运行

**Q: CI/CD 失败**
A: 检查 GitHub Actions secrets 是否正确配置，验证 Vercel token 权限

**Q: Prisma 迁移错误**
A: 确保本地和生产环境使用相同的 Prisma schema 版本

**Q: 部署后页面 404**
A: 检查 Next.js 配置和路由是否正确，验证构建是否成功
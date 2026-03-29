# 心情打卡网站 - 运维手册

## 1. 系统架构

### 1.1 技术栈
- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes + NextAuth.js
- **数据库**: PostgreSQL (Vercel Postgres 或 Railway)
- **ORM**: Prisma
- **部署**: Vercel
- **CI/CD**: GitHub Actions
- **监控**: Sentry + Vercel Analytics

### 1.2 架构图
```
用户浏览器 → Vercel CDN → Next.js 应用 → PostgreSQL 数据库
                              ↑
                        GitHub Actions (CI/CD)
```

## 2. 日常运维任务

### 2.1 监控检查
每日检查以下指标：
- **应用可用性**: Vercel Dashboard > Analytics
- **错误率**: Sentry Dashboard
- **性能指标**: 首屏加载时间 < 3秒，API 响应时间 < 500ms
- **数据库性能**: 查询时间 < 100ms

### 2.2 日志查看
- **Vercel Logs**: Vercel Dashboard > Functions > 查看函数日志
- **Sentry Errors**: Sentry Dashboard > Issues
- **数据库查询**: Prisma Query Log (开发环境)

### 2.3 备份策略
- **数据库备份**: Vercel Postgres 自动每日备份，保留 7 天
- **代码备份**: GitHub 自动版本控制
- **配置备份**: 环境变量和部署配置记录在 DEPLOYMENT.md

## 3. 故障处理流程

### 3.1 应用不可访问
**症状**: 用户无法访问网站，显示 500 错误或超时

**处理步骤**:
1. 检查 Vercel Dashboard > Deployments 确认最新部署状态
2. 查看 Vercel Logs 检查错误信息
3. 检查数据库连接是否正常
4. 如果是代码问题，回滚到上一个稳定版本
5. 如果是数据库问题，检查数据库服务状态

**命令**:
```bash
# 查看 Vercel 部署状态
vercel ls --prod

# 回滚到上一个部署
vercel rollback --prod
```

### 3.2 数据库连接失败
**症状**: 应用显示数据库连接错误，API 返回 500

**处理步骤**:
1. 检查 `DATABASE_URL` 环境变量是否正确
2. 验证数据库服务是否正常运行
3. 检查数据库连接数是否达到限制
4. 如果使用 Vercel Postgres，检查存储配额

**命令**:
```bash
# 测试数据库连接（本地）
npx prisma studio

# 执行数据库健康检查
vercel exec --prod -- npx prisma migrate status
```

### 3.3 性能问题
**症状**: 页面加载缓慢，API 响应时间长

**处理步骤**:
1. 检查 Vercel Analytics 识别慢页面
2. 使用 Sentry Performance 分析慢 API
3. 检查数据库查询是否缺少索引
4. 考虑添加缓存层（Redis）

**优化建议**:
- 为常用查询添加数据库索引
- 实现 API 响应缓存
- 优化图片加载（使用 next/image）
- 启用 Vercel Edge Functions

## 4. 扩展和升级

### 4.1 数据库扩展
当用户量增长时：
- 升级数据库实例规格
- 考虑读写分离
- 添加 Redis 缓存层

### 4.2 应用扩展
- 启用 Vercel Edge Functions 处理地理位置相关功能
- 考虑微服务架构拆分
- 添加 CDN 加速静态资源

### 4.3 安全升级
- 定期更新依赖 (`npm audit`)
- 启用双因素认证 for GitHub 和 Vercel
- 定期轮换密钥和令牌

## 5. 紧急联系人

| 角色 | 姓名 | 联系方式 | 负责范围 |
|------|------|----------|----------|
| 运维工程师 | 老张 | [联系方式] | 部署、监控、故障处理 |
| 后端开发 | 咪咪 | [联系方式] | API、数据库、业务逻辑 |
| 前端开发 | 小林 | [联系方式] | UI、用户体验、前端性能 |

## 6. 附录

### 6.1 有用的命令
```bash
# 本地开发
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm test

# 生成 Prisma Client
npx prisma generate

# 执行数据库迁移
npx prisma migrate deploy

# 启动 Prisma Studio（数据库 GUI）
npx prisma studio
```

### 6.2 环境变量说明
| 变量 | 说明 | 示例 |
|------|------|------|
| DATABASE_URL | PostgreSQL 连接字符串 | postgresql://user:pass@host:5432/db |
| NEXTAUTH_SECRET | NextAuth 加密密钥 | random32characterstring123456789 |
| NEXTAUTH_URL | 应用基础 URL | https://mood-checker.vercel.app |
| SENTRY_DSN | Sentry 错误监控 DSN | https://key@sentry.io/project |

### 6.3 性能基准
| 指标 | 目标值 | 当前值 |
|------|--------|--------|
| 首屏加载时间 | < 3 秒 | TBD |
| API 响应时间 | < 500ms | TBD |
| 数据库查询时间 | < 100ms | TBD |
| 并发用户支持 | ≥ 100 | TBD |
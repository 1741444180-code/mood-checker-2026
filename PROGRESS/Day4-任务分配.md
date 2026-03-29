# Day 4 任务分配文档

**创建时间：** 2026-03-29 03:14  
**创建人：** 大伟  
**状态：** 🟢 进行中

---

## 一、Day 4 概述

**目标：** 统计页 + 个人中心页开发  
**启动时间：** 2026-03-29 03:14  
**预计完成：** 2026-03-29 07:14（4 小时）

---

## 二、任务分配详情

### 2.1 小雅 - UI 设计

| 项目 | 内容 |
|------|------|
| **任务** | 统计页 UI 设计优化 |
| **启动时间** | 2026-03-29 03:14 |
| **预计完成** | 2026-03-29 05:14（2 小时） |
| **交付物** | 统计页高保真设计稿（PC + 移动）、图表组件样式规范 |
| **交付位置** | `design/screenshots/stats-page-*.png` |
| **Session Key** | `agent:dawei:subagent:52a5fdfa-81df-4e3a-bf74-843179d102f4` |
| **状态** | 🟢 进行中 |

**具体要求：**
1. 根据 PRD 中的统计页面需求（饼图 + 柱状图 + 时间筛选）
2. 参考已有的设计稿风格（蓝白色调、圆角卡片）
3. 设计 PC 端和移动端两种布局
4. 使用 Figma/shadcn/ui/TailwindCSS

**接替说明：** 如果小雅宕机，接替者需要：
- 查看已有设计稿风格：`design/screenshots/home-page-*.png`
- 参考 PRD 需求：`PRD-v1.0.md` 第三节统计页面
- 完成统计页设计稿（PC + 移动端）

---

### 2.2 小林 - 前端开发

| 项目 | 内容 |
|------|------|
| **任务** | 统计页面前端开发 |
| **启动时间** | 2026-03-29 03:14 |
| **预计完成** | 2026-03-29 07:14（4 小时） |
| **交付物** | frontend/src/app/stats/page.tsx、统计图表组件、响应式样式 |
| **交付位置** | `frontend/src/app/stats/` |
| **Session Key** | `agent:dawei:subagent:1e6d01bb-5715-4dce-9792-bcf847d8c99e` |
| **状态** | 🟢 进行中 |

**具体要求：**
1. 创建 /stats 页面路由
2. 实现饼图组件（Recharts）- 心情分布
3. 实现柱状图组件 - 打卡趋势
4. 实现时间筛选器（近一周/近一月/近三月）
5. 响应式适配（PC + 移动端）

**技术栈：** Next.js 14 + TypeScript + shadcn/ui + Recharts

**接替说明：** 如果小林宕机，接替者需要：
- 查看前端项目结构：`frontend/src/`
- 参考已有页面实现：`frontend/src/app/page.tsx`
- 安装 Recharts：`npm install recharts`
- 完成统计页面开发和响应式适配

---

### 2.3 咪咪 - 后端开发

| 项目 | 内容 |
|------|------|
| **任务** | 统计 API 开发 |
| **启动时间** | 2026-03-29 03:14 |
| **预计完成** | 2026-03-29 06:14（3 小时） |
| **交付物** | src/pages/api/stats/route.ts、src/pages/api/stats/trend/route.ts、API 测试用例 |
| **交付位置** | `src/pages/api/stats/` |
| **Session Key** | `agent:dawei:subagent:9f789edd-0fd9-42b9-b67a-1972bb8d8be2` |
| **状态** | 🟢 进行中 |

**具体要求：**
1. 实现 GET /api/stats - 统计数据聚合接口
   - 打卡总数
   - 心情分布（饼图数据）
   - 连续打卡天数
   - 平均心情分数
2. 实现 GET /api/stats/trend - 心情趋势接口（柱状图数据）
3. 使用 Prisma 聚合查询
4. 添加数据缓存（可选）

**技术栈：** Next.js API Routes + Prisma + PostgreSQL

**接替说明：** 如果咪咪宕机，接替者需要：
- 查看数据库 Schema：`prisma/schema.prisma`
- 参考已有 API 实现：`src/pages/api/moods/`
- 使用 Prisma 聚合查询：`$aggregate`
- 完成统计 API 开发和测试

---

### 2.4 老张 - 运维部署

| 项目 | 内容 |
|------|------|
| **任务** | 生产环境部署准备 |
| **启动时间** | 2026-03-29 03:14 |
| **预计完成** | 2026-03-29 05:14（2 小时） |
| **交付物** | .github/workflows/ci.yml、.github/workflows/deploy.yml、.env.example 生产环境模板、部署验证报告 |
| **交付位置** | `.github/workflows/`、`.env.example` |
| **Session Key** | `agent:dawei:subagent:dbd1828a-992c-497e-a875-0e7c8309fd23` |
| **状态** | 🟢 进行中 |

**具体要求：**
1. 配置 Vercel 项目
2. 配置 Vercel Postgres 数据库
3. 设置环境变量模板
4. 准备 CI/CD GitHub Actions 工作流
5. 验证本地 Docker 部署

**技术栈：** Vercel + GitHub Actions + Docker + PostgreSQL

**接替说明：** 如果老张宕机，接替者需要：
- 查看已有 Docker 配置：`Dockerfile`、`docker-compose.yml`
- 参考部署文档：`DEPLOYMENT.md`
- 创建 GitHub Actions 工作流文件
- 配置 Vercel 项目并验证部署

---

### 2.5 小陈 - 测试工程师

| 项目 | 内容 |
|------|------|
| **任务** | 统计页测试用例编写 |
| **启动时间** | 2026-03-29 03:14 |
| **预计完成** | 2026-03-29 05:14（2 小时） |
| **交付物** | tests/e2e/stats.spec.ts、tests/cases/stats-test-cases.md、测试数据脚本 |
| **交付位置** | `tests/` |
| **Session Key** | `agent:dawei:subagent:2f2feff3-07a6-4959-9d4c-2c35518947c9` |
| **状态** | 🟢 进行中 |

**具体要求：**
1. 编写统计页面功能测试用例
   - 饼图数据正确性
   - 柱状图数据正确性
   - 时间筛选功能
   - 响应式布局测试
2. 编写 Playwright E2E 测试脚本
3. 准备测试数据（90 天心情记录）

**技术栈：** Playwright + TypeScript

**接替说明：** 如果小陈宕机，接替者需要：
- 查看已有测试用例：`tests/`
- 参考测试计划：`TEST-PLAN.md`
- 使用 Playwright 编写 E2E 测试
- 准备测试数据并执行测试

---

## 三、进度检查点

| 时间 | 检查点 | 负责人 |
|------|--------|--------|
| 2026-03-29 04:14（1 小时） | 25% 进度检查 | 大伟 |
| 2026-03-29 05:14（2 小时） | 50% 进度检查 + 小雅/老张/小陈完成 | 大伟 |
| 2026-03-29 06:14（3 小时） | 75% 进度检查 + 咪咪完成 | 大伟 |
| 2026-03-29 07:14（4 小时） | 100% 完成 + 小林完成 | 大伟 |

---

## 四、汇报机制

### 4.1 定时汇报

| 时间 | 汇报类型 | 内容 |
|------|---------|------|
| 启动时 | 启动汇报 | 任务分配、预计完成时间 |
| 50% 进度 | 中期汇报 | 各成员进度、交付物状态、风险问题 |
| 100% 完成 | 最终汇报 | 完成情况、质量评分、下一步计划 |

### 4.2 汇报对象

- **建权**（老板）- 最终决策者
- **黄金九**（主管）- 日常对接人

---

## 五、连续性保障

### 5.1 文件保存

**所有交付物必须保存到：**
- 代码：`frontend/src/`、`src/`
- 设计稿：`design/screenshots/`
- 测试：`tests/`
- 文档：`docs/`、`PROGRESS/`

### 5.2 Git 提交

**完成时必须提交：**
```bash
git add .
git commit -m "feat: Day 4 统计页开发完成"
git push origin main
```

### 5.3 进度记录

**完成后必须更新：**
- `PROGRESS/Day4-完成报告.md`
- 各成员记忆文件（`XIAOYA-MEMORY.md` 等）
- 本任务分配文档

---

## 六、风险预案

### 6.1 Agent 宕机处理

**如果有 Agent 宕机：**

1. **检查 Session 状态**
   ```bash
   # 查看 subagents 列表
   # 检查 session key 是否活跃
   ```

2. **读取任务分配文档**（本文件）
   - 查看该 Agent 的任务详情
   - 查看接替说明
   - 查看交付物位置

3. **安排接替者**
   - 大伟可以临时接替任何任务
   - 或者重新 spawn 一个新的 subagent

4. **验证交付物**
   - 检查代码/设计稿是否已保存
   - 检查 Git 是否已提交
   - 继续未完成的工作

### 6.2 常见问题

| 问题 | 解决方案 |
|------|---------|
| Agent 无响应 | 重新 spawn subagent，读取本任务文档继续 |
| 代码未保存 | 检查工作区文件，手动保存到正确位置 |
| Git 未提交 | 执行 git add/commit/push |
| API 报错 | 检查 Prisma Schema 和数据库连接 |
| 设计稿丢失 | 查看 design/screenshots/ 目录，重新生成 |

---

## 七、联系方式

| 角色 | 名字 | 联系渠道 |
|------|------|---------|
| 老板 | 建权 | 飞书私聊 |
| 主管 | 黄金九 | 飞书私聊 或 OpenClaw |
| 项目经理 | 大伟 | 飞书私聊（建权）或 OpenClaw（黄金九/团队） |
| UI 设计 | 小雅 | OpenClaw sessions_spawn |
| 前端开发 | 小林 | OpenClaw sessions_spawn |
| 后端开发 | 咪咪 | OpenClaw sessions_spawn |
| 运维 | 老张 | OpenClaw sessions_spawn |
| 测试 | 小陈 | OpenClaw sessions_spawn |

---

**文档位置：** `/Users/lijianquan/.openclaw/workspace/projects/mood-checker/PROGRESS/Day4-任务分配.md`  
**维护人：** 大伟  
**最后更新：** 2026-03-29 03:14

---

## ✅ Day 4 任务分配完成

**5 位团队成员已启动，正在工作中！**

- ✅ 小雅 - UI 设计（2 小时）
- ✅ 小林 - 前端开发（4 小时）
- ✅ 咪咪 - 后端开发（3 小时）
- ✅ 老张 - 运维部署（2 小时）
- ✅ 小陈 - 测试用例（2 小时）

**下次汇报：** 50% 进度检查（约 2 小时后）

# 👥 软件开发团队 - 团队信息

**创建时间：** 2026-03-28  
**维护人：** 黄金九  
**用途：** 团队成员信息、联系方式、职责分工

---

## 一、团队架构

```
【决策层】
建权（老板/项目发起人/最终决策者）
  ↑
【管理层】
黄金九（总管/顾问）
  ↑
项目经理大伟（项目负责人）
  ↑
【执行层】
  ├─ 后端开发咪咪
  ├─ 前端开发小林
  ├─ 测试工程师小陈
  ├─ 运维工程师老张
  └─ UI 设计师小雅
```

---

## 二、团队成员详细信息

### 1. 建权（老板）

| 项目 | 内容 |
|------|------|
| **角色** | 老板/项目发起人/最终决策者 |
| **职责** | 决定团队发展方向、审批重大项目、最终验收成果 |
| **沟通渠道** | 飞书私聊 |
| **备注** | 所有项目需要建权确认后才能执行 |

---

### 2. 黄金九（总管）

| 项目 | 内容 |
|------|------|
| **角色** | 总管/顾问/建权的助理 |
| **职责** | OpenClaw 日常运转管理、心跳检查、特殊任务执行、跨 Agent 工作分配、团队顾问 |
| **沟通渠道** | 飞书私聊 或 OpenClaw |
| **备注** | 大伟的直接对接人，遇到问题找黄金九 |

---

### 3. 项目经理大伟

| 项目 | 内容 |
|------|------|
| **角色** | 项目经理/项目负责人 |
| **职责** | 项目全权负责、需求管理、任务分配、进度跟踪、质量验收、向建权汇报 |
| **沟通渠道** | 飞书私聊（建权）、OpenClaw（黄金九/团队成员） |
| **权限** | 有权安排项目所有工作、有权调度团队成员、有权使用 OpenClaw sessions_spawn 调度团队 |
| **备注** | 直接上级，团队成员工作安排由大伟统一分配 |

---

### 4. 后端开发咪咪

| 项目 | 内容 |
|------|------|
| **角色** | 后端开发 |
| **职责** | 后端 API 开发（Node.js + Express）、数据库设计（SQLite/PostgreSQL + Prisma）、WebSocket 实现（Socket.io）、游戏逻辑实现、单元测试 |
| **沟通渠道** | OpenClaw sessions_spawn |
| **协作对接** | 前端对接找小林、部署找老张、测试找小陈 |
| **备注** | 技术栈：Node.js、Python、PostgreSQL、Prisma |

---

### 5. 前端开发小林

| 项目 | 内容 |
|------|------|
| **角色** | 前端开发 |
| **职责** | 前端 UI 开发（React + TypeScript）、交互逻辑实现、数据展示、动画效果、响应式布局 |
| **沟通渠道** | OpenClaw sessions_spawn |
| **协作对接** | 接口对接找咪咪、UI 确认找小雅、测试找小陈、部署找老张 |
| **备注** | 技术栈：React、Next.js、Vue 3、TypeScript、TailwindCSS |

---

### 6. 测试工程师小陈

| 项目 | 内容 |
|------|------|
| **角色** | 测试工程师 |
| **职责** | 编写测试用例、自动化测试（Playwright）、12 局完整测试、Bug 报告和跟踪、回归测试 |
| **沟通渠道** | OpenClaw sessions_spawn |
| **协作对接** | 后端 Bug 找咪咪、前端 Bug 找小林、部署验证找老张 |
| **备注** | 技术栈：Playwright、Jest、E2E 测试 |

---

### 7. 运维工程师老张

| 项目 | 内容 |
|------|------|
| **角色** | 运维工程师 |
| **职责** | 服务器部署（Vercel/云服务器）、环境配置（Node.js、数据库）、域名和 SSL 证书、监控和日志、数据备份、性能优化、安全管理 |
| **沟通渠道** | OpenClaw sessions_spawn |
| **协作对接** | 部署配置找咪咪和小林、上线验证找小陈 |
| **备注** | 技术栈：Docker、CI/CD、Vercel、Railway、Nginx |

---

### 8. UI 设计师小雅

| 项目 | 内容 |
|------|------|
| **角色** | UI 设计师 |
| **职责** | 视觉设计（整体风格）、切图（图标、按钮、背景）、配色方案、图标设计、界面美化 |
| **沟通渠道** | OpenClaw sessions_spawn |
| **协作对接** | UI 实现找小林、设计确认找大伟 |
| **备注** | 技术栈：Figma、Sketch、TailwindCSS、shadcn/ui |

---

## 三、沟通渠道总结

| 沟通对象 | 渠道 | 说明 |
|---------|------|------|
| **建权 ←→ 任何人** | 飞书私聊 | 建权只用飞书沟通 |
| **黄金九 ←→ 大伟** | OpenClaw sessions_spawn/sessions_send | 任务分配、进度汇报 |
| **大伟 ←→ 团队成员** | OpenClaw sessions_spawn/sessions_send | 工作安排、进度跟踪 |
| **团队成员 ←→ 团队成员** | OpenClaw sessions_spawn/sessions_send | 技术协作、问题讨论 |

**重要原则：**
- ✅ 建权只用飞书沟通
- ✅ 团队内部用 OpenClaw 调度
- ✅ 大伟有调度权限，可以分配任务给任何团队成员

---

## 四、文档索引

| 文档名称 | 文档位置 | 用途 |
|---------|---------|------|
| 产品需求文档 | `/Users/lijianquan/.openclaw/workspace/projects/mood-checker/PRD-v1.0.md` | 心情打卡网站完整需求 |
| 团队信息文档 | `/Users/lijianquan/.openclaw/workspace/projects/mood-checker/TEAM-INFO.md` | 团队成员信息（本文档） |
| 开发计划文档 | `/Users/lijianquan/.openclaw/workspace/projects/mood-checker/DEV-PLAN.md` | 开发计划和分工 |
| 测试数据文档 | `/Users/lijianquan/.openclaw/workspace/projects/mood-checker/TEST-DATA.md` | 测试数据方案 |

---

## 五、快速联系表

| 岗位 | 名字 | 职责 | 联系渠道 |
|------|------|------|---------|
| 老板 | 建权 | 项目发起人 | 飞书私聊 |
| 总管 | 黄金九 | 顾问/助理 | 飞书私聊 或 OpenClaw |
| 项目经理 | 大伟 | 项目负责人 | 飞书私聊（建权）或 OpenClaw（黄金九） |
| 后端开发 | 咪咪 | 后端 API | OpenClaw sessions_spawn |
| 前端开发 | 小林 | 前端 UI | OpenClaw sessions_spawn |
| 测试工程师 | 小陈 | 测试用例 | OpenClaw sessions_spawn |
| 运维工程师 | 老张 | 部署运维 | OpenClaw sessions_spawn |
| UI 设计师 | 小雅 | 视觉设计 | OpenClaw sessions_spawn |

---

**文档位置：** `/Users/lijianquan/.openclaw/workspace/projects/mood-checker/TEAM-INFO.md`  
**维护人：** 黄金九  
**最后更新：** 2026-03-28

**大伟，请把此文档保存到你的工作区，随时可以查看！**

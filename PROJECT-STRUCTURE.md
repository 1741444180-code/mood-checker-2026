# 心情打卡网站 - 项目结构文档

## 项目概述

心情打卡网站是一个帮助用户记录每日心情、追踪情绪变化、提供数据统计的 Web 应用。采用 Next.js 14 + React + TypeScript 技术栈，具有响应式设计，支持 PC 端和手机端。

## 目录结构

```
mood-checker/
├── src/                       # 源代码目录
│   ├── app/                  # Next.js App Router 页面
│   │   ├── (auth)/           # 认证相关页面
│   │   │   ├── login/        # 登录页面
│   │   │   └── register/     # 注册页面
│   │   ├── (main)/           # 主要应用页面
│   │   │   ├── dashboard/    # 仪表板页面（心情打卡）
│   │   │   ├── calendar/     # 心情日历页面
│   │   │   ├── stats/        # 数据统计页面
│   │   │   ├── profile/      # 个人中心页面
│   │   │   └── layout.tsx    # 主布局
│   │   ├── api/              # API 路由
│   │   │   └── [...]/        # API 端点
│   │   ├── layout.tsx        # 根布局
│   │   └── page.tsx          # 首页
│   ├── components/            # React 组件
│   │   ├── ui/               # 基础 UI 组件 (shadcn/ui)
│   │   ├── mood/             # 心情相关组件
│   │   │   └── mood-selector.tsx  # 心情选择器
│   │   ├── calendar/         # 日历相关组件
│   │   └── stats/            # 统计相关组件
│   ├── lib/                 # 工具函数和通用库
│   │   ├── utils.ts         # 通用工具函数
│   │   └── api.ts           # API 请求函数
│   ├── hooks/               # 自定义 React Hooks
│   ├── types/               # TypeScript 类型定义
│   ├── styles/              # 全局样式
│   └── assets/              # 静态资源
├── public/                  # 静态资源目录
├── package.json            # 项目依赖和脚本
├── tsconfig.json           # TypeScript 配置
├── tailwind.config.ts      # Tailwind CSS 配置
├── postcss.config.js       # PostCSS 配置
└── components.json         # shadcn/ui 配置
```

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 14.x | 框架 |
| React | 18.x | UI 库 |
| TypeScript | 5.x | 类型系统 |
| Tailwind CSS | 3.x | 样式 |
| shadcn/ui | latest | 组件库 |
| Recharts | 2.x | 图表 |
| Zustand | latest | 状态管理 |
| Lucide React | latest | 图标库 |

## 页面路由

| 页面 | 路由 | 优先级 | 状态 |
|------|------|--------|------|
| 首页 | / | P0 | ✅ 已创建 |
| 登录页 | /login | P0 | ✅ 已创建 |
| 注册页 | /register | P0 | ✅ 已创建 |
| 仪表板 | /dashboard | P0 | ✅ 已创建 |
| 心情日历 | /calendar | P0 | ⚪ 未开始 |
| 数据统计 | /stats | P1 | ⚪ 未开始 |
| 个人中心 | /profile | P1 | ⚪ 未开始 |

## 组件结构

### UI 组件 (components/ui/)
- button.tsx - 按钮组件
- card.tsx - 卡片组件
- input.tsx - 输入框组件
- label.tsx - 标签组件
- textarea.tsx - 文本域组件
- theme-toggle.tsx - 主题切换组件
- navbar.tsx - 导航栏组件

### 心情组件 (components/mood/)
- mood-selector.tsx - 心情选择器组件，允许用户选择心情、添加备注和标签

## API 接口规划

| API | 方法 | 路径 | 说明 |
|-----|------|------|------|
| 用户注册 | POST | /api/auth/register | 创建用户 |
| 用户登录 | POST | /api/auth/login | 获取 Token |
| 用户登出 | POST | /api/auth/logout | 清除 Token |
| 获取用户 | GET | /api/auth/me | 当前用户信息 |
| 创建打卡 | POST | /api/moods | 提交心情记录 |
| 查询打卡 | GET | /api/moods | 获取心情列表 |
| 获取统计 | GET | /api/stats | 统计数据 |

## 状态管理

使用 Zustand 进行全局状态管理，主要管理：
- 用户认证状态
- 当前心情数据
- 日历数据显示
- 统计数据

## 样式规范

- 使用 Tailwind CSS 进行样式设计
- 遵循响应式设计原则
- 支持亮色/暗色主题切换
- 组件具有良好的可访问性

## 开发规范

- 使用 TypeScript，避免 any 类型
- 组件需要添加适当的注释
- 关键逻辑需要单元测试
- 遵循 Next.js App Router 最佳实践
# 项目结构文档

## 项目概述
心情打卡网站前端项目，基于 Next.js 14 构建，采用 App Router 模式。

## 项目结构

```
frontend/
├── public/                    # 静态资源
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/                  # 应用页面路由
│   │   ├── favicon.ico
│   │   ├── globals.css       # 全局样式
│   │   ├── layout.tsx        # 根布局
│   │   └── page.tsx          # 首页
│   └── components/           # 组件
│       └── ui/               # UI 组件 (shadcn/ui)
│           ├── button.tsx
│           ├── card.tsx
│           ├── dialog.tsx
│           ├── dropdown-menu.tsx
│           ├── input.tsx
│           ├── label.tsx
│           ├── select.tsx
│           └── textarea.tsx
├── lib/
│   └── utils.ts              # 工具函数
├── components.json           # shadcn/ui 配置
├── next.config.ts            # Next.js 配置
├── postcss.config.mjs        # PostCSS 配置
├── tailwind.config.ts        # Tailwind CSS 配置
├── tsconfig.json             # TypeScript 配置
├── package.json
└── README.md
```

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui
- **状态管理**: Zustand
- **图表**: Recharts

## 已安装依赖

### 主要依赖
- next: 16.2.1
- react: 19.2.4
- react-dom: 19.2.4
- zustand: 状态管理
- recharts: 图表库

### 开发依赖
- @tailwindcss/postcss
- @types/node
- @types/react
- @types/react-dom
- eslint
- eslint-config-next
- tailwindcss
- typescript

### UI 组件
- shadcn/ui 组件集合 (button, card, dialog, dropdown-menu, input, label, select, textarea)
# 心情打卡网站 - 前端

这是一个用于记录每日心情的Web应用程序，帮助用户追踪情绪变化并进行分析。

## 项目概述

心情打卡网站允许用户每天记录自己的心情状态，并通过图表展示情绪趋势，帮助用户更好地了解自己的情绪模式。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui
- **状态管理**: Zustand
- **图表**: Recharts

## 功能特性

- 用户友好的界面设计
- 响应式布局，适配各种设备
- 情绪记录功能
- 数据可视化图表
- 历史记录查看

## 项目结构

请参阅 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) 文件了解详细的项目结构。

## 组件

- **Header**: 包含导航菜单的页面头部
- **Footer**: 包含网站信息和链接的页面底部
- **UI 组件**: 使用 shadcn/ui 提供的一系列可复用组件

## 开发

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 运行生产服务器

```bash
npm start
```

### 代码检查

```bash
npm run lint
```

## 依赖项

- next: 16.2.1
- react: 19.2.4
- react-dom: 19.2.4
- typescript: ^5
- tailwindcss: ^4
- zustand: 状态管理
- recharts: 图表库
- lucide-react: 图标库
- shadcn/ui: UI 组件库
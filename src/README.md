# 心情打卡网站

一个帮助用户记录每日心情、追踪情绪变化、提供数据统计的 Web 应用。

## 项目特性

- 记录每日心情（开心、平静、焦虑、伤心、愤怒等）
- 心情日历视图，可视化情绪变化
- 数据统计和趋势分析
- 响应式设计，支持多设备访问
- 用户友好的界面设计

## 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **组件库**: shadcn/ui
- **状态管理**: Zustand
- **图表库**: Recharts
- **图标**: Lucide React

## 项目结构

```
src/
├── app/                  # Next.js 页面路由
├── components/          # React 组件
│   ├── ui/             # 基础 UI 组件
│   └── mood/           # 心情相关组件
├── lib/               # 工具函数
├── hooks/             # 自定义 Hooks
└── types/             # 类型定义
```

## 快速开始

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 在浏览器中打开 http://localhost:3000

## 开发指南

### 添加新页面

1. 在 `src/app/` 目录下创建新页面文件夹
2. 添加 `page.tsx` 文件
3. 在导航栏中添加相应链接

### 添加新组件

1. 在 `src/components/` 目录下创建相应子目录
2. 创建组件文件
3. 在需要的地方导入使用

## API 接口

| 接口 | 方法 | 描述 |
|------|------|------|
| /api/auth/register | POST | 用户注册 |
| /api/auth/login | POST | 用户登录 |
| /api/moods | POST | 创建心情记录 |
| /api/moods | GET | 获取心情记录 |
| /api/stats | GET | 获取统计数据 |

## 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 许可证

MIT
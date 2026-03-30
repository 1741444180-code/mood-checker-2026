# 🎱 心情打卡网站 - 项目结构说明

**版本：** v1.0  
**日期：** 2026-03-28  
**作者：** 程序猿阿码  
**项目：** 心情打卡网站

---

## 1. 项目目录结构

```
/Users/lijianquan/.openclaw/workspace/projects/mood-checker/
├── prisma/                     # Prisma 数据库配置
│   └── schema.prisma           # Prisma 数据库模式定义
├── docs/                       # 文档目录
│   ├── database-design.md      # 数据库设计文档
│   └── api-documentation.md    # API 接口文档
├── config/                     # 配置文件
│   └── database.env            # 数据库配置文件
├── scripts/                    # 脚本目录
│   └── init-db.sql             # 数据库初始化脚本
├── src/                        # 源代码目录
│   ├── pages/                  # Next.js 页面
│   ├── components/             # React 组件
│   ├── lib/                    # 工具库
│   ├── services/               # 服务层
│   ├── middleware/             # 中间件
│   └── styles/                 # 样式文件
├── public/                     # 静态资源
├── tests/                      # 测试文件
├── .env                        # 环境变量配置
├── package.json                # 项目依赖配置
├── next.config.js              # Next.js 配置
└── README.md                   # 项目说明
```

---

## 2. 核心文件说明

### 2.1 数据库相关
- `prisma/schema.prisma`: 定义数据库模型和关系
- `docs/database-design.md`: 详细的数据库设计文档
- `config/database.env`: 数据库连接配置
- `scripts/init-db.sql`: 数据库初始化脚本

### 2.2 API 接口文档
- `docs/api-documentation.md`: 完整的 API 接口文档

### 2.3 源代码结构
- `src/pages/api/`: Next.js API 路由，包含所有后端接口
- `src/services/`: 业务逻辑服务层
- `src/lib/`: 工具函数和通用库

---

## 3. 数据库表设计概览

根据 `prisma/schema.prisma` 文件，项目包含以下 5 张核心表：

### 3.1 users (用户表)
- 存储用户基本信息（用户名、邮箱、密码等）
- 是其他表的关联基础

### 3.2 mood_records (心情记录表)
- 存储用户的心情打卡记录
- 与用户表关联，支持按日期查询

### 3.3 mood_types (心情类型表)
- 存储心情类型（系统默认和用户自定义）
- 支持扩展自定义心情类型

### 3.4 user_settings (用户设置表)
- 存储用户的个性化设置
- 与用户表一对一关系

### 3.5 comments (评论表)
- 存储心情记录的评论
- 支持用户和游客评论

---

## 4. 技术栈说明

### 4.1 前端技术
- **框架：** Next.js 14
- **UI库：** Tailwind CSS + shadcn/ui
- **状态管理：** Zustand/Jotai

### 4.2 后端技术
- **运行时：** Node.js
- **框架：** Next.js API Routes
- **认证：** NextAuth.js
- **数据库：** PostgreSQL
- **ORM：** Prisma

### 4.3 数据库设计原则
- 使用关系型数据库确保数据一致性
- 合理的索引设计提升查询性能
- 外键约束保证数据完整性
- 适当的数据类型选择节省存储空间

---

## 5. 开发规范

### 5.1 代码规范
- 使用 TypeScript 编写类型安全的代码
- 遵循 ESLint 和 Prettier 代码规范
- 使用 Zod 进行运行时数据验证

### 5.2 API 设计规范
- 遵循 RESTful API 设计原则
- 统一的错误处理和响应格式
- 适当的认证和授权机制

### 5.3 数据库操作规范
- 使用 Prisma ORM 进行数据库操作
- 防止 SQL 注入攻击
- 合理使用事务确保数据一致性

---

## 6. 部署说明

### 6.1 环境要求
- Node.js 18+
- PostgreSQL 12+
- Git

### 6.2 部署步骤
1. 克隆代码仓库
2. 安装依赖：`npm install`
3. 配置环境变量：`.env`
4. 数据库迁移：`npx prisma migrate deploy`
5. 构建项目：`npm run build`
6. 启动服务：`npm start`

---

**文档维护：** 本文档随项目结构变化而更新
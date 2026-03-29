# 心情打卡网站

## 项目概述

心情打卡网站是一个帮助用户记录和追踪日常心情的应用。用户可以每天记录自己的心情状态、添加备注和标签，系统会提供数据分析和可视化图表帮助用户更好地了解自己的情绪变化。

## 功能特性

### 基础功能
- 每日心情打卡
- 心情类型选择（开心、平静、低落、生气、焦虑、疲惫、兴奋）
- 心情备注和标签
- 心情历史记录查看
- 数据统计和分析

### 新增功能 - 自定义心情
- **自定义心情创建**：用户可以上传 1-9 张图片作为自定义心情
- **个性化心情库**：每个用户拥有独立的自定义心情收藏
- **灵活使用**：可以在心情记录中选择自定义心情
- **4×2 布局**：PC端和手机端均采用4×2布局（7种标准心情 + 1个自定义按钮）

## 技术栈

- **前端**: Next.js 14+, React, TypeScript
- **后端**: Next.js API Routes
- **数据库**: PostgreSQL with Prisma ORM
- **云存储**: AWS S3 (或其他兼容S3的对象存储)
- **认证**: NextAuth.js

## 数据库模型

### 用户表 (User)
- id, username, email, password, avatar, createdAt, lastLogin, timezone

### 心情记录表 (MoodRecord)
- id, userId, date, moodLevel, moodType, customMoodId, note, tags, createdAt, updatedAt

### 心情类型表 (MoodType)
- id, userId, name, color, icon, sortOrder, isSystem, createdAt

### 自定义心情表 (CustomMood)
- id, userId, name, imageUrls, isSystem, createdAt, updatedAt

### 用户设置表 (UserSettings)
- id, userId, reminderTime, reminderEnabled, weeklyReport, publicProfile, theme, createdAt, updatedAt

## API 接口

### 心情相关
- `GET /api/moods` - 获取心情记录
- `POST /api/moods` - 创建心情记录（支持 customMoodId）
- `GET /api/moods/history` - 获取心情历史

### 自定义心情相关
- `GET /api/custom-moods` - 获取用户自定义心情列表
- `POST /api/custom-moods` - 创建自定义心情
- `PUT /api/custom-moods?id={id}` - 更新自定义心情
- `DELETE /api/custom-moods?id={id}` - 删除自定义心情
- `POST /api/custom-moods/create-with-images` - 上传图片并创建自定义心情

### 图片上传
- `POST /api/upload/image` - 上传图片到云存储

## 环境配置

复制 `.env.example` 文件为 `.env.local` 并填入相应配置：

```bash
# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/mood_checker"

# 认证
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# S3 存储
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
S3_BUCKET_NAME="your-bucket-name"
```

## 本地开发

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 构建生产版本
npm run build
npm start
```

## 部署

项目支持部署到 Vercel 或其他支持 Node.js 的平台。

## 贡献

欢迎提交 issue 和 pull request 来改进这个项目。

## 许可证

MIT

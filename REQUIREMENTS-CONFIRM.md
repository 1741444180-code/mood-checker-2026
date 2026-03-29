# 🎱 心情打卡网站 - 需求确认文档

**版本：** v1.0  
**日期：** 2026-03-28  
**状态：** 待建权确认  
**负责人：** 建权  
**项目经理：** 大伟  
**技术负责人：** 黄金九

---

## 一、需求确认

### 1.1 项目概述

**项目名称：** 心情打卡网站  
**项目类型：** Web 应用（响应式设计，支持 PC 端和手机端）  
**项目目标：** 帮助用户记录每日心情、追踪情绪变化、提供数据统计  
**开发周期：** 15 天（2026-03-28 至 2026-04-11）  
**上线时间：** 2026-04-11

### 1.2 核心功能（P0 - MVP 必备）

#### 1.2.1 用户注册/登录

**功能描述：**
- 用户可以通过手机号或邮箱注册账户
- 已注册用户可以登录
- 用户信息包括：用户名、邮箱、头像、创建时间

**用户流程：**
```
未注册用户 → 点击注册 → 输入手机号/邮箱 → 设置密码 → 注册成功 → 自动登录
已注册用户 → 点击登录 → 输入账号密码 → 登录成功 → 跳转首页
```

**技术实现：**
- 前端：Next.js 14 + shadcn/ui 表单组件
- 后端：NextAuth.js 认证系统
- 数据库：users 表

---

#### 1.2.2 今日打卡

**功能描述：**
- 用户每日可以选择一种心情进行打卡
- 提供 5 种基础心情（开心、平静、焦虑、伤心、愤怒）
- 每种心情有对应的表情包和颜色
- 用户可以添加备注（可选）
- 用户可以选择标签（工作、生活、健康）
- 每天只能打卡一次

**用户流程：**
```
用户进入首页 → 查看今日是否已打卡
  ├─ 已打卡 → 显示今日心情和备注
  └─ 未打卡 → 选择心情表情包 → 输入备注（可选） → 选择标签（可选） → 提交打卡 → 显示成功提示
```

**心情类型定义：**

| ID | 心情 | 颜色 | 图标 | 权重 |
|----|------|------|------|------|
| 1 | 😄 开心 | #FFD700 金黄 | 😄 | 25% |
| 2 | 😊 平静 | #90EE90 浅绿 | 😊 | 30% |
| 3 | 😔 低落 | #87CEEB 天蓝 | 😔 | 15% |
| 4 | 😠 生气 | #FF6B6B 红色 | 😠 | 10% |
| 5 | 😰 焦虑 | #DDA0DD 紫红 | 😰 | 10% |
| 6 | 😴 疲惫 | #D3D3D3 灰色 | 😴 | 7% |
| 7 | 🤩 兴奋 | #FF69B4 粉红 | 🤩 | 3% |

**技术实现：**
- 前端：心情选择器组件、备注输入框、标签选择器
- 后端：心情记录 API（POST /api/moods）
- 数据库：mood_records 表

---

#### 1.2.3 心情日历

**功能描述：**
- 用户可以查看自己的心情历史记录
- 日历视图展示，每天用对应心情颜色渲染
- 未打卡的日期显示灰色
- 点击日期可以查看当天心情详情
- 可以切换月份查看
- 显示当月打卡率（已打卡天数/当月天数）

**用户流程：**
```
用户点击"心情日历"Tab → 显示当前月份日历
  ├─ 点击上月 → 显示上个月日历
  ├─ 点击下月 → 显示下个月日历
  └─ 点击某天 → 弹出详情弹窗（心情、备注、标签）
```

**技术实现：**
- 前端：日历组件、心情颜色渲染、详情弹窗
- 后端：心情记录查询 API（GET /api/moods?month=2026-03）
- 数据库：mood_records 表查询

---

#### 1.2.4 响应式设计

**功能描述：**
- 适配 PC 端（1920x1080）、平板端（768x1024）、手机端（375x667）
- 自动识别设备类型，切换布局
- 触摸友好（手机端按钮高度≥44px）
- 首屏加载时间<3 秒

**技术实现：**
- 前端：Tailwind CSS 响应式布局、媒体查询
- 部署：Vercel 自动 CDN 加速

---

### 1.3 重要功能（P1 - 首版上线）

#### 1.3.1 自定义心情

**功能描述：**
- 用户可以添加自定义心情名称
- 用户可以选择或上传心情图标
- 用户可以选择心情颜色
- 用户可以编辑/删除自定义心情
- 自定义心情可以排序

**用户流程：**
```
用户点击"添加自定义心情" → 输入心情名称 → 选择颜色 → 选择/上传图标 → 保存
```

**技术实现：**
- 前端：自定义心情表单、图标上传组件
- 后端：心情类型 API（POST/PUT/DELETE /api/mood-types）
- 数据库：mood_types 表

---

#### 1.3.2 数据统计

**功能描述：**
- 显示个人打卡次数统计
- 显示心情分布饼图（各种心情占比）
- 用户可以选择统计时间范围（7 天/30 天/90 天）
- 显示连续打卡天数
- 可以导出心情数据为 Excel

**用户流程：**
```
用户点击"数据统计"Tab → 显示统计图表
  ├─ 选择 7 天 → 显示 7 天统计
  ├─ 选择 30 天 → 显示 30 天统计
  ├─ 选择 90 天 → 显示 90 天统计
  └─ 点击导出 → 下载 Excel 文件
```

**技术实现：**
- 前端：Recharts 图表库、Excel 导出功能
- 后端：统计 API（GET /api/stats?range=30）
- 数据库：mood_records 表聚合查询

---

#### 1.3.3 评论功能

**功能描述：**
- 用户可以对他人打卡发表评论
- 游客也可以评论（需审核后可见）
- 评论按时间顺序显示
- 用户可以删除自己的评论
- 评论需要基础审核（敏感词过滤）

**用户流程：**
```
用户查看他人打卡 → 输入评论内容 → 提交评论
  ├─ 已登录用户 → 评论直接显示
  └─ 游客 → 评论显示"待审核"，管理员审核后显示
```

**技术实现：**
- 前端：评论输入框、评论列表组件
- 后端：评论 API（POST/DELETE /api/comments）
- 数据库：comments 表

---

### 1.4 拓展功能（P2 - 迭代版本）

#### 1.4.1 心情趋势图

**功能描述：**
- 显示心情变化趋势折线图（7/30/90 天）
- 每天心情转换为分数（1-5 分）
- 显示周期内平均心情分数

**技术实现：**
- 前端：Recharts 折线图
- 后端：心情分数转换、趋势数据 API

---

#### 1.4.2 打卡排行榜

**功能描述：**
- 显示打卡次数最多的用户（活跃榜）
- 显示平均心情分数最高的用户（开心榜）
- 用户可以选择周榜/月榜
- 用户可以设置是否参与排行榜（隐私保护）

**技术实现：**
- 前端：排行榜组件
- 后端：排行榜 API（GET /api/rankings?type=active&range=week）
- 数据库：users 表 + mood_records 表聚合查询

---

#### 1.4.3 隐私设置

**功能描述：**
- 用户可以设置打卡公开或仅自己可见
- 用户可以设置仅好友可见
- 用户可以导出个人所有数据（JSON 格式）

**技术实现：**
- 前端：隐私设置表单
- 后端：用户设置 API（PUT /api/user/settings）
- 数据库：user_settings 表

---

## 二、数据库设计

### 2.1 数据库表结构

#### 2.1.1 用户表（users）

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,                          -- 用户 ID（自增）
  username VARCHAR(50) UNIQUE NOT NULL,           -- 用户名（唯一）
  email VARCHAR(100) UNIQUE NOT NULL,             -- 邮箱（唯一）
  password_hash VARCHAR(255) NOT NULL,            -- 密码哈希（bcrypt 加密）
  avatar VARCHAR(255),                            -- 头像 URL
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
  last_login TIMESTAMP,                           -- 最后登录时间
  timezone VARCHAR(50) DEFAULT 'UTC'              -- 时区
);

-- 索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**字段说明：**
- `id`: 用户 ID，主键，自增
- `username`: 用户名，唯一，用于登录和显示
- `email`: 邮箱，唯一，用于登录和通知
- `password_hash`: 密码哈希，使用 bcrypt 加密（salt≥10）
- `avatar`: 头像 URL，可选
- `created_at`: 用户创建时间，自动填充
- `last_login`: 最后登录时间，登录时更新
- `timezone`: 用户时区，默认 UTC

---

#### 2.1.2 心情记录表（mood_records）

```sql
CREATE TABLE mood_records (
  id SERIAL PRIMARY KEY,                          -- 记录 ID（自增）
  user_id INTEGER REFERENCES users(id),           -- 用户 ID（外键）
  date DATE NOT NULL,                             -- 打卡日期
  mood_level INTEGER CHECK (mood_level >= 1 AND mood_level <= 5), -- 心情分数（1-5）
  mood_type VARCHAR(50) NOT NULL,                 -- 心情类型（happy/calm/sad/angry/anxious）
  note TEXT,                                      -- 备注
  tags VARCHAR(100),                              -- 标签（逗号分隔：工作，生活，健康）
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 更新时间
  UNIQUE(user_id, date)                           -- 唯一约束（每天只能打卡一次）
);

-- 索引
CREATE INDEX idx_mood_records_user_id ON mood_records(user_id);
CREATE INDEX idx_mood_records_date ON mood_records(date);
CREATE INDEX idx_mood_records_user_date ON mood_records(user_id, date);
CREATE INDEX idx_mood_records_mood_type ON mood_records(mood_type);
```

**字段说明：**
- `id`: 记录 ID，主键，自增
- `user_id`: 用户 ID，外键，关联 users 表
- `date`: 打卡日期，格式 YYYY-MM-DD
- `mood_level`: 心情分数，1-5 分（1=最差，5=最好）
- `mood_type`: 心情类型，枚举值（happy/calm/sad/angry/anxious/excited/tired）
- `note`: 备注，可选，最多 500 字
- `tags`: 标签，可选，逗号分隔（工作，生活，健康）
- `created_at`: 记录创建时间，自动填充
- `updated_at`: 记录更新时间，更新时自动填充
- `UNIQUE(user_id, date)`: 唯一约束，每天只能打卡一次

---

#### 2.1.3 心情类型表（mood_types）

```sql
CREATE TABLE mood_types (
  id SERIAL PRIMARY KEY,                          -- 心情类型 ID（自增）
  user_id INTEGER REFERENCES users(id),           -- 用户 ID（外键，NULL 表示系统默认）
  name VARCHAR(50) NOT NULL,                      -- 心情名称（开心/平静/...）
  color VARCHAR(7) NOT NULL,                      -- 心情颜色（#FFD700）
  icon VARCHAR(50) NOT NULL,                      -- 心情图标（😄/😊/...）
  sort_order INTEGER DEFAULT 0,                   -- 排序顺序
  is_system BOOLEAN DEFAULT false,                -- 是否系统默认
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 创建时间
);

-- 索引
CREATE INDEX idx_mood_types_user_id ON mood_types(user_id);
CREATE INDEX idx_mood_types_is_system ON mood_types(is_system);
```

**字段说明：**
- `id`: 心情类型 ID，主键，自增
- `user_id`: 用户 ID，外键，关联 users 表（NULL 表示系统默认心情类型）
- `name`: 心情名称，如"开心"、"平静"
- `color`: 心情颜色，16 进制颜色代码（如#FFD700）
- `icon`: 心情图标，emoji 或图标名称
- `sort_order`: 排序顺序，数字越小越靠前
- `is_system`: 是否系统默认心情类型，系统默认不可删除
- `created_at`: 心情类型创建时间，自动填充

**系统默认心情类型（is_system=true）：**

| id | name | color | icon | sort_order |
|----|------|-------|------|------------|
| 1 | 开心 | #FFD700 | 😄 | 1 |
| 2 | 平静 | #90EE90 | 😊 | 2 |
| 3 | 低落 | #87CEEB | 😔 | 3 |
| 4 | 生气 | #FF6B6B | 😠 | 4 |
| 5 | 焦虑 | #DDA0DD | 😰 | 5 |
| 6 | 疲惫 | #D3D3D3 | 😴 | 6 |
| 7 | 兴奋 | #FF69B4 | 🤩 | 7 |

---

#### 2.1.4 用户设置表（user_settings）

```sql
CREATE TABLE user_settings (
  id SERIAL PRIMARY KEY,                          -- 设置 ID（自增）
  user_id INTEGER REFERENCES users(id) UNIQUE,    -- 用户 ID（外键，唯一）
  reminder_time TIME,                             -- 提醒时间
  reminder_enabled BOOLEAN DEFAULT false,         -- 是否启用提醒
  weekly_report BOOLEAN DEFAULT false,            -- 是否启用周报
  public_profile BOOLEAN DEFAULT false,           -- 是否公开个人主页
  theme VARCHAR(50) DEFAULT 'light',              -- 主题（light/dark）
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 更新时间
);

-- 索引
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
```

**字段说明：**
- `id`: 设置 ID，主键，自增
- `user_id`: 用户 ID，外键，关联 users 表，唯一（每个用户只有一条设置记录）
- `reminder_time`: 提醒时间，格式 HH:MM:SS
- `reminder_enabled`: 是否启用打卡提醒，默认 false
- `weekly_report`: 是否启用周报，默认 false
- `public_profile`: 是否公开个人主页，默认 false
- `theme`: 主题，light（浅色）或 dark（深色），默认 light
- `created_at`: 设置创建时间，自动填充
- `updated_at`: 设置更新时间，更新时自动填充

---

#### 2.1.5 评论表（comments）

```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,                          -- 评论 ID（自增）
  mood_record_id INTEGER REFERENCES mood_records(id), -- 心情记录 ID（外键）
  user_id INTEGER REFERENCES users(id),           -- 用户 ID（外键，NULL 表示游客）
  content TEXT NOT NULL,                          -- 评论内容
  status VARCHAR(20) DEFAULT 'pending',           -- 评论状态（pending/approved/rejected）
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 更新时间
);

-- 索引
CREATE INDEX idx_comments_mood_record_id ON comments(mood_record_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created_at ON comments(created_at);
```

**字段说明：**
- `id`: 评论 ID，主键，自增
- `mood_record_id`: 心情记录 ID，外键，关联 mood_records 表
- `user_id`: 用户 ID，外键，关联 users 表（NULL 表示游客评论）
- `content`: 评论内容，最多 1000 字
- `status`: 评论状态，枚举值（pending=待审核，approved=已通过，rejected=已拒绝）
- `created_at`: 评论创建时间，自动填充
- `updated_at`: 评论更新时间，更新时自动填充

---

### 2.2 数据库关系图

```
users (用户表)
  ├─ mood_records (心情记录表) - 一对多
  ├─ mood_types (心情类型表) - 一对多（自定义心情类型）
  ├─ user_settings (用户设置表) - 一对一
  └─ comments (评论表) - 一对多

mood_records (心情记录表)
  ├─ users (用户表) - 多对一
  └─ comments (评论表) - 一对多

mood_types (心情类型表)
  └─ users (用户表) - 多对一

comments (评论表)
  ├─ mood_records (心情记录表) - 多对一
  └─ users (用户表) - 多对一
```

---

## 三、业务逻辑链

### 3.1 用户注册/登录逻辑

```
用户注册流程：
1. 用户输入手机号/邮箱 + 密码
2. 前端验证（格式检查、密码强度）
3. 后端验证（账号是否已存在）
4. 密码加密（bcrypt，salt≥10）
5. 创建用户记录（users 表）
6. 生成 JWT Token
7. 返回 Token 和用户信息
8. 前端存储 Token，跳转首页

用户登录流程：
1. 用户输入账号 + 密码
2. 前端验证（格式检查）
3. 后端验证（账号是否存在、密码是否正确）
4. 生成 JWT Token
5. 更新最后登录时间（users 表）
6. 返回 Token 和用户信息
7. 前端存储 Token，跳转首页
```

---

### 3.2 心情打卡逻辑

```
心情打卡流程：
1. 用户进入首页
2. 检查今日是否已打卡（查询 mood_records 表，user_id + date）
   ├─ 已打卡 → 显示今日心情和备注，不可重复打卡
   └─ 未打卡 → 显示心情选择器
3. 用户选择心情表情包
4. 用户输入备注（可选）
5. 用户选择标签（可选）
6. 前端验证（心情类型必选）
7. 后端验证（今日是否已打卡）
8. 创建心情记录（mood_records 表）
9. 返回打卡成功
10. 前端显示成功提示，更新界面
```

---

### 3.3 心情日历逻辑

```
心情日历流程：
1. 用户点击"心情日历"Tab
2. 前端请求当月心情记录（GET /api/moods?month=2026-03）
3. 后端查询 mood_records 表（user_id + date 范围）
4. 返回心情记录列表
5. 前端渲染日历
   ├─ 已打卡日期 → 用心情颜色渲染
   ├─ 未打卡日期 → 灰色显示
   └─ 今日 → 特殊标记（蓝色圆圈）
6. 用户点击某天
7. 前端弹出详情弹窗（心情、备注、标签）
8. 用户切换月份
9. 重复步骤 2-7
```

---

### 3.4 数据统计逻辑

```
数据统计流程：
1. 用户点击"数据统计"Tab
2. 前端请求统计数据（GET /api/stats?range=30）
3. 后端查询 mood_records 表
   ├─ 打卡次数统计：COUNT(*)
   ├─ 心情分布：GROUP BY mood_type
   ├─ 连续打卡天数：计算最大连续日期
   └─ 平均心情分数：AVG(mood_level)
4. 返回统计数据
5. 前端渲染图表
   ├─ 心情分布饼图（Recharts PieChart）
   ├─ 打卡次数统计卡片
   └─ 连续打卡天数卡片
6. 用户切换时间范围（7 天/30 天/90 天）
7. 重复步骤 2-6
```

---

## 四、API 接口设计

### 4.1 用户认证

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | /api/auth/register | 用户注册 | ❌ |
| POST | /api/auth/login | 用户登录 | ❌ |
| POST | /api/auth/logout | 用户登出 | ✅ |
| GET | /api/auth/me | 获取当前用户 | ✅ |

---

### 4.2 心情记录

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | /api/moods | 创建心情记录 | ✅ |
| GET | /api/moods | 查询心情记录 | ✅ |
| GET | /api/moods/:id | 获取心情记录详情 | ✅ |
| PUT | /api/moods/:id | 更新心情记录 | ✅ |
| DELETE | /api/moods/:id | 删除心情记录 | ✅ |

---

### 4.3 心情类型

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/mood-types | 查询心情类型 | ❌ |
| POST | /api/mood-types | 创建心情类型 | ✅ |
| PUT | /api/mood-types/:id | 更新心情类型 | ✅ |
| DELETE | /api/mood-types/:id | 删除心情类型 | ✅ |

---

### 4.4 统计

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/stats | 获取统计数据 | ✅ |
| GET | /api/stats/trend | 获取心情趋势数据 | ✅ |
| GET | /api/stats/rankings | 获取排行榜数据 | ✅ |

---

### 4.5 评论

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/comments | 查询评论列表 | ❌ |
| POST | /api/comments | 创建评论 | ❌ |
| DELETE | /api/comments/:id | 删除评论 | ✅ |
| PUT | /api/comments/:id/approve | 审核评论 | ✅（管理员） |

---

## 五、验收标准

### 5.1 功能验收

- [ ] 用户可以注册/登录
- [ ] 用户可以每日打卡（选择心情、输入备注、选择标签）
- [ ] 用户每天只能打卡一次
- [ ] 用户可以查看心情日历（月视图、点击详情）
- [ ] 用户可以查看心情日历（切换月份）
- [ ] 用户可以查看心情日历（显示打卡率）
- [ ] 网站适配 PC 端、平板端、手机端
- [ ] 首屏加载时间<3 秒

---

### 5.2 性能验收

| 指标 | 目标值 | 测试方法 |
|------|--------|---------|
| 首屏加载时间 | <3 秒 | Lighthouse Performance |
| 页面交互响应 | <100ms | Chrome DevTools |
| API 响应时间 | <500ms | Postman 测试 |
| 数据库查询 | <100ms | 数据库慢查询日志 |
| 并发支持 | ≥100 并发用户 | JMeter 压力测试 |

---

### 5.3 安全验收

| 指标 | 要求 | 测试方法 |
|------|------|---------|
| 密码加密 | bcrypt 加密，salt≥10 | 检查数据库密码格式 |
| SQL 注入防护 | 使用 ORM 参数化查询 | 代码审查 + 渗透测试 |
| XSS 防护 | 前端输入过滤，后端输出转义 | 代码审查 + 渗透测试 |
| CSRF 防护 | 使用 CSRF Token | 代码审查 |
| HTTPS | 全站 HTTPS | 浏览器检查 |

---

### 5.4 代码质量验收

| 指标 | 目标值 | 测试方法 |
|------|--------|---------|
| 单元测试覆盖率 | ≥80% | Jest 测试报告 |
| E2E 测试覆盖率 | ≥60% | Playwright 测试报告 |
| 代码规范 | ESLint 无错误 | ESLint 检查 |
| TypeScript 类型 | 无 any 类型 | TypeScript 检查 |

---

## 六、待确认事项

### 6.1 方案选择

- [ ] 简约版（2-3 周）vs 完整版（4-6 周）
- [ ] 技术栈：方案 A（Next.js）vs 方案 B（Vue 3）

### 6.2 预算范围

- [ ] 内部团队开发
- [ ] 外包开发（预算范围？）

### 6.3 期望上线时间

- [ ] 快速上线（2-3 周）
- [ ] 功能完整（4-6 周）

---

**文档位置：** `/Users/lijianquan/.openclaw/workspace/projects/mood-checker/REQUIREMENTS-CONFIRM.md`  
**维护人：** 黄金九  
**最后更新：** 2026-03-28

**请建权确认以上需求、数据库设计、业务逻辑链、API 接口、验收标准！**

**确认后，我立即安排大伟启动团队开始开发！** 🎱

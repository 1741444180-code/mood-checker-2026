# 🎱 心情打卡网站 - 数据库设计文档

**版本：** v1.0  
**日期：** 2026-03-28  
**作者：** 程序猿阿码  
**项目：** 心情打卡网站

---

## 1. 数据库概览

### 1.1 技术栈
- **数据库：** PostgreSQL
- **ORM：** Prisma
- **连接池：** 默认配置

### 1.2 表结构总览
| 表名 | 中文名 | 记录数预估 | 主要用途 |
|------|--------|------------|----------|
| users | 用户表 | 万级 | 存储用户基本信息 |
| mood_records | 心情记录表 | 百万级 | 存储用户心情打卡记录 |
| mood_types | 心情类型表 | 十万级 | 存储心情类型（系统/自定义） |
| user_settings | 用户设置表 | 万级 | 存储用户个性化设置 |
| comments | 评论表 | 十万级 | 存储心情记录的评论 |

---

## 2. 详细表结构

### 2.1 users（用户表）

**用途：** 存储平台用户的基本信息

| 字段名 | 类型 | 长度 | 约束 | 默认值 | 注释 |
|--------|------|------|------|--------|------|
| id | SERIAL | - | PRIMARY KEY, AUTO_INCREMENT | - | 用户ID，主键，自增 |
| username | VARCHAR | 50 | UNIQUE, NOT NULL | - | 用户名，唯一，用于登录和显示 |
| email | VARCHAR | 100 | UNIQUE, NOT NULL | - | 邮箱，唯一，用于登录和通知 |
| password | VARCHAR | 255 | NOT NULL | - | 密码哈希，使用bcrypt加密 |
| avatar | VARCHAR | 255 | 可选 | NULL | 头像URL |
| createdAt | TIMESTAMP | - | NOT NULL | now() | 用户创建时间 |
| lastLogin | TIMESTAMP | - | 可选 | NULL | 最后登录时间 |
| timezone | VARCHAR | 50 | NOT NULL | 'UTC' | 用户时区 |

**索引：**
- `idx_users_username`: username 单列索引
- `idx_users_email`: email 单列索引
- `idx_users_created_at`: created_at 单列索引

**关系：**
- 一对多：mood_records（心情记录）
- 一对多：mood_types（自定义心情类型）
- 一对一：user_settings（用户设置）
- 一对多：comments（评论）

---

### 2.2 mood_records（心情记录表）

**用途：** 存储用户的心情打卡记录

| 字段名 | 类型 | 长度 | 约束 | 默认值 | 注释 |
|--------|------|------|------|--------|------|
| id | SERIAL | - | PRIMARY KEY, AUTO_INCREMENT | - | 记录ID，主键，自增 |
| userId | INTEGER | - | FOREIGN KEY(users.id), NOT NULL | - | 用户ID，外键，关联users表 |
| date | DATE | - | NOT NULL | - | 打卡日期，格式YYYY-MM-DD |
| moodLevel | SMALLINT | - | CHECK(1-5), NOT NULL | - | 心情分数，1-5分（1=最差，5=最好） |
| moodType | VARCHAR | 50 | NOT NULL | - | 心情类型（happy/calm/sad/angry/anxious等） |
| note | TEXT | - | 可选 | NULL | 备注，可选，最多500字 |
| tags | VARCHAR | 100 | 可选 | NULL | 标签，可选，逗号分隔（工作，生活，健康） |
| createdAt | TIMESTAMP | - | NOT NULL | now() | 记录创建时间 |
| updatedAt | TIMESTAMP | - | NOT NULL | now() | 记录更新时间 |

**约束：**
- `UNIQUE(userId, date)`：唯一约束，每天只能打卡一次

**索引：**
- `idx_mood_records_user_id`: userId 单列索引
- `idx_mood_records_date`: date 单列索引
- `idx_mood_records_user_date`: (userId, date) 复合索引
- `idx_mood_records_mood_type`: moodType 单列索引

**关系：**
- 多对一：users（用户）
- 一对多：comments（评论）

---

### 2.3 mood_types（心情类型表）

**用途：** 存储心情类型（系统默认和用户自定义）

| 字段名 | 类型 | 长度 | 约束 | 默认值 | 注释 |
|--------|------|------|------|--------|------|
| id | SERIAL | - | PRIMARY KEY, AUTO_INCREMENT | - | 心情类型ID，主键，自增 |
| userId | INTEGER | - | FOREIGN KEY(users.id) | NULL | 用户ID，外键，关联users表（NULL表示系统默认） |
| name | VARCHAR | 50 | NOT NULL | - | 心情名称，如"开心"、"平静" |
| color | VARCHAR | 7 | NOT NULL | - | 心情颜色，16进制颜色代码（如#FFD700） |
| icon | VARCHAR | 50 | NOT NULL | - | 心情图标，emoji或图标名称 |
| sortOrder | INTEGER | - | - | 0 | 排序顺序，数字越小越靠前 |
| isSystem | BOOLEAN | - | - | false | 是否系统默认心情类型，系统默认不可删除 |
| createdAt | TIMESTAMP | - | NOT NULL | now() | 心情类型创建时间 |

**索引：**
- `idx_mood_types_user_id`: userId 单列索引
- `idx_mood_types_is_system`: isSystem 单列索引

**关系：**
- 多对一：users（用户，可选）

**系统默认心情类型（isSystem=true）：**

| id | name | color | icon | sortOrder |
|----|------|-------|------|-----------|
| 1 | 开心 | #FFD700 | 😄 | 1 |
| 2 | 平静 | #90EE90 | 😊 | 2 |
| 3 | 低落 | #87CEEB | 😔 | 3 |
| 4 | 生气 | #FF6B6B | 😠 | 4 |
| 5 | 焦虑 | #DDA0DD | 😰 | 5 |
| 6 | 疲惫 | #D3D3D3 | 😴 | 6 |
| 7 | 兴奋 | #FF69B4 | 🤩 | 7 |

---

### 2.4 user_settings（用户设置表）

**用途：** 存储用户的个性化设置

| 字段名 | 类型 | 长度 | 约束 | 默认值 | 注释 |
|--------|------|------|------|--------|------|
| id | SERIAL | - | PRIMARY KEY, AUTO_INCREMENT | - | 设置ID，主键，自增 |
| userId | INTEGER | - | FOREIGN KEY(users.id), UNIQUE, NOT NULL | - | 用户ID，外键，关联users表，唯一 |
| reminderTime | TIME | - | 可选 | NULL | 提醒时间，格式HH:MM:SS |
| reminderEnabled | BOOLEAN | - | - | false | 是否启用打卡提醒 |
| weeklyReport | BOOLEAN | - | - | false | 是否启用周报 |
| publicProfile | BOOLEAN | - | - | false | 是否公开个人主页 |
| theme | VARCHAR | 50 | NOT NULL | 'light' | 主题（light/dark） |
| createdAt | TIMESTAMP | - | NOT NULL | now() | 设置创建时间 |
| updatedAt | TIMESTAMP | - | NOT NULL | now() | 设置更新时间 |

**索引：**
- `idx_user_settings_user_id`: userId 单列索引

**关系：**
- 一对一：users（用户）

---

### 2.5 comments（评论表）

**用途：** 存储心情记录的评论

| 字段名 | 类型 | 长度 | 约束 | 默认值 | 注释 |
|--------|------|------|------|--------|------|
| id | SERIAL | - | PRIMARY KEY, AUTO_INCREMENT | - | 评论ID，主键，自增 |
| moodRecordId | INTEGER | - | FOREIGN KEY(mood_records.id), NOT NULL | - | 心情记录ID，外键，关联mood_records表 |
| userId | INTEGER | - | FOREIGN KEY(users.id) | NULL | 用户ID，外键，关联users表（NULL表示游客） |
| content | TEXT | - | NOT NULL | - | 评论内容，最多1000字 |
| status | VARCHAR | 20 | - | 'pending' | 评论状态（pending/approved/rejected） |
| createdAt | TIMESTAMP | - | NOT NULL | now() | 评论创建时间 |
| updatedAt | TIMESTAMP | - | NOT NULL | now() | 评论更新时间 |

**索引：**
- `idx_comments_mood_record_id`: moodRecordId 单列索引
- `idx_comments_user_id`: userId 单列索引
- `idx_comments_status`: status 单列索引
- `idx_comments_created_at`: createdAt 单列索引

**关系：**
- 多对一：mood_records（心情记录）
- 多对一：users（用户，可选）

---

## 3. 数据库关系图

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

## 4. 性能优化策略

### 4.1 索引策略
1. **高频查询字段：** 在经常用于WHERE条件的字段上建立索引
2. **复合索引：** 在多字段组合查询时使用复合索引
3. **覆盖索引：** 确保SELECT字段包含在索引中以避免回表

### 4.2 查询优化
1. **分页查询：** 对大量数据查询使用LIMIT和OFFSET
2. **懒加载：** 对关联表使用懒加载或预加载策略
3. **缓存策略：** 对频繁访问但不常变更的数据使用Redis缓存

### 4.3 分区策略
1. **按时间分区：** mood_records表按日期分区，提高查询效率
2. **按用户分区：** 在大数据量时考虑按用户ID进行水平分片

---

## 5. 安全考虑

### 5.1 数据安全
1. **密码加密：** 用户密码使用bcrypt加密（salt≥10）
2. **输入验证：** 所有输入数据进行长度和格式校验
3. **SQL注入防护：** 使用Prisma ORM的参数化查询

### 5.2 访问控制
1. **权限控制：** 实施细粒度的访问控制策略
2. **审计日志：** 记录关键操作的日志
3. **备份策略：** 定期进行数据库备份

---

## 6. 初始化数据

### 6.1 系统心情类型
在应用首次部署时，需要初始化7种系统默认心情类型：

```sql
INSERT INTO mood_types (name, color, icon, sort_order, is_system, created_at) VALUES
('开心', '#FFD700', '😄', 1, true, NOW()),
('平静', '#90EE90', '😊', 2, true, NOW()),
('低落', '#87CEEB', '😔', 3, true, NOW()),
('生气', '#FF6B6B', '😠', 4, true, NOW()),
('焦虑', '#DDA0DD', '😰', 5, true, NOW()),
('疲惫', '#D3D3D3', '😴', 6, true, NOW()),
('兴奋', '#FF69B4', '🤩', 7, true, NOW());
```

---

## 7. 数据库配置

### 7.1 连接配置
```env
DATABASE_URL="postgresql://username:password@localhost:5432/mood_checker?schema=public"
```

### 7.2 连接池配置
- 最小连接数：5
- 最大连接数：20
- 连接超时：30秒
- 查询超时：10秒

---

**文档维护：** 本文档随数据库结构变化而更新
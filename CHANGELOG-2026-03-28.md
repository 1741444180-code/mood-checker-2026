# 📝 心情打卡网站 - 变更日志

**日期：** 2026-03-28  
**版本：** v1.1  
**变更类型：** 需求变更

---

## 一、变更概述

**变更内容：** 心情选择器布局调整 + 自定义心情功能

**影响范围：** UI 设计、前端开发、后端开发、测试用例

---

## 二、详细变更

### 2.1 心情选择器布局调整

**原设计：**
- PC 端：心情选择器 4 列布局（7 种心情）
- 手机端：心情选择器 2 列布局（7 种心情）

**新设计：**
- PC 端：心情选择器 4×2 布局（7 种心情 +1 个自定义加号）
  - 第一排：4 个心情（😄开心 😊平静 😔低落 😠生气）
  - 第二排：3 个心情（😰焦虑 😴疲惫 🤩兴奋）+ 1 个加号（➕ 自定义）
- 手机端：心情选择器 4×2 布局（7 种心情 +1 个自定义加号）
  - 第一排：4 个心情（😄开心 😊平静 😔低落 😠生气）
  - 第二排：3 个心情（😰焦虑 😴疲惫 🤩兴奋）+ 1 个加号（➕ 自定义）

### 2.2 自定义心情功能

**新增功能：**
- 点击加号（➕）打开自定义弹窗
- 支持上传 1-9 张图片
- 支持选择自定义表情/图片
- 自定义心情保存到用户心情库

**技术实现：**
- 前端：图片上传组件（最多 9 张）
- 后端：自定义心情 API（POST /api/custom-moods）
- 数据库：custom_moods 表（新增）

---

## 三、数据库变更

### 3.1 新增表：custom_moods

```sql
CREATE TABLE custom_moods (
  id SERIAL PRIMARY KEY,                          -- 自定义心情 ID（自增）
  user_id INTEGER REFERENCES users(id),           -- 用户 ID（外键）
  name VARCHAR(50) NOT NULL,                      -- 自定义心情名称
  image_urls TEXT[] NOT NULL,                     -- 图片 URL 数组（1-9 张）
  is_system BOOLEAN DEFAULT false,                -- 是否系统默认
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 更新时间
);

-- 索引
CREATE INDEX idx_custom_moods_user_id ON custom_moods(user_id);
CREATE INDEX idx_custom_moods_is_system ON custom_moods(is_system);
```

### 3.2 修改 mood_records 表

**原设计：**
- mood_type VARCHAR(50) -- 心情类型（happy/calm/sad/angry/anxious）

**新设计：**
- mood_type VARCHAR(50) -- 心情类型（happy/calm/sad/angry/anxious/custom）
- custom_mood_id INTEGER REFERENCES custom_moods(id) -- 自定义心情 ID（可选）

---

## 四、API 接口变更

### 4.1 新增 API 接口

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | /api/custom-moods | 创建自定义心情 | ✅ |
| GET | /api/custom-moods | 获取用户自定义心情列表 | ✅ |
| PUT | /api/custom-moods/:id | 更新自定义心情 | ✅ |
| DELETE | /api/custom-moods/:id | 删除自定义心情 | ✅ |

### 4.2 修改心情记录 API

**原设计：**
- POST /api/moods
  - 请求体：{ mood_type: string, note?: string, tags?: string[] }

**新设计：**
- POST /api/moods
  - 请求体：{ mood_type: string, note?: string, tags?: string[], custom_mood_id?: number }

---

## 五、影响岗位及调整要求

### 5.1 UI 设计师（小雅）

**调整内容：**
- ✅ 修改首页设计稿（PC 端 + 手机端）
- ✅ 设计自定义弹窗（上传 1-9 张图片）
- ✅ 生成新的截图
- ✅ 更新设计文档

**完成时间：** 2026-03-28 15:00

---

### 5.2 前端开发（小林）

**调整内容：**
- ✅ 修改心情选择器布局（4×2 布局）
- ✅ 实现自定义弹窗组件
- ✅ 实现图片上传功能（最多 9 张）
- ✅ 调用自定义心情 API

**完成时间：** Day 2-3（2026-03-29 至 2026-03-30）

---

### 5.3 后端开发（咪咪）

**调整内容：**
- ✅ 创建 custom_moods 表
- ✅ 实现自定义心情 API（CRUD）
- ✅ 修改心情记录 API（支持 custom_mood_id）
- ✅ 图片上传处理（存储到云存储）

**完成时间：** Day 2-3（2026-03-29 至 2026-03-30）

---

### 5.4 测试工程师（小陈）

**调整内容：**
- ✅ 更新测试用例（增加自定义心情测试）
- ✅ 测试图片上传功能（1-9 张）
- ✅ 测试自定义心情 CRUD
- ✅ 测试心情选择器布局（PC 端 + 手机端）

**完成时间：** Day 11-12（2026-04-07 至 2026-04-08）

---

### 5.5 运维工程师（老张）

**调整内容：**
- ✅ 配置云存储（图片上传）
- ✅ 配置数据库迁移脚本
- ✅ 更新部署文档

**完成时间：** Day 2（2026-03-29）

---

## 六、变更确认

**变更提出人：** 建权  
**变更时间：** 2026-03-28 14:21  
**变更影响：** 中等（影响 UI、前端、后端、测试）  
**变更状态：** 🟡 进行中

---

## 七、团队成员确认

| 成员 | 岗位 | 确认状态 | 确认时间 |
|------|------|---------|---------|
| 小雅 | UI 设计师 | ⏳ 待确认 | - |
| 小林 | 前端开发 | ⏳ 待确认 | - |
| 咪咪 | 后端开发 | ⏳ 待确认 | - |
| 老张 | 运维工程师 | ⏳ 待确认 | - |
| 小陈 | 测试工程师 | ⏳ 待确认 | - |

---

**文档位置：** `/Users/lijianquan/.openclaw/workspace/projects/mood-checker/CHANGELOG-2026-03-28.md`  
**维护人：** 黄金九  
**最后更新：** 2026-03-28 14:21

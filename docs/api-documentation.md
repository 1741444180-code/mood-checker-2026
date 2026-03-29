# 🎱 心情打卡网站 - API 接口文档

**版本：** v1.0  
**日期：** 2026-03-28  
**作者：** 程序猿阿码  
**项目：** 心情打卡网站

---

## 1. 接口概述

### 1.1 基础信息
- **协议：** HTTPS
- **域名：** `https://api.mood-checker.com`
- **版本：** v1
- **Content-Type：** `application/json`
- **字符编码：** UTF-8

### 1.2 认证方式
- **JWT Token：** 所有需要认证的接口需要在Header中携带Authorization字段
- **格式：** `Bearer <token>`

### 1.3 错误码规范
| 错误码 | HTTP状态码 | 描述 |
|--------|------------|------|
| 200 | 200 | 成功 |
| 400 | 400 | 请求参数错误 |
| 401 | 401 | 未授权/认证失败 |
| 403 | 403 | 权限不足 |
| 404 | 404 | 资源不存在 |
| 422 | 422 | 请求参数验证失败 |
| 429 | 429 | 请求频率超限 |
| 500 | 500 | 服务器内部错误 |

### 1.4 通用响应格式
```typescript
interface SuccessResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

interface ErrorResponse {
  code: number;
  message: string;
  error?: string;
  timestamp: string;
}
```

---

## 2. 用户认证模块

### 2.1 用户注册
- **接口路径：** `POST /api/auth/register`
- **认证：** ❌ 不需要认证
- **功能：** 新用户注册

**请求参数：**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**参数验证：**
- `username`: 必填，长度3-50，字母数字下划线
- `email`: 必填，有效邮箱格式
- `password`: 必填，长度8-100，包含大小写字母和数字

**响应示例：**
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "avatar": null,
      "createdAt": "2026-03-28T10:00:00Z"
    }
  },
  "timestamp": "2026-03-28T10:00:00Z"
}
```

**错误响应：**
- `400`: 用户名或邮箱已存在
- `422`: 参数验证失败

---

### 2.2 用户登录
- **接口路径：** `POST /api/auth/login`
- **认证：** ❌ 不需要认证
- **功能：** 用户登录

**请求参数：**
```json
{
  "email": "string",
  "password": "string"
}
```

**参数验证：**
- `email`: 必填，有效邮箱格式
- `password`: 必填

**响应示例：**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "avatar": null,
      "lastLogin": "2026-03-28T10:00:00Z",
      "createdAt": "2026-03-27T10:00:00Z"
    }
  },
  "timestamp": "2026-03-28T10:00:00Z"
}
```

**错误响应：**
- `400`: 用户名或密码错误
- `422`: 参数验证失败

---

### 2.3 用户登出
- **接口路径：** `POST /api/auth/logout`
- **认证：** ✅ 需要认证
- **功能：** 用户登出

**请求头：**
```
Authorization: Bearer <token>
```

**响应示例：**
```json
{
  "code": 200,
  "message": "登出成功",
  "data": {
    "success": true
  },
  "timestamp": "2026-03-28T10:00:00Z"
}
```

---

### 2.4 获取当前用户信息
- **接口路径：** `GET /api/auth/me`
- **认证：** ✅ 需要认证
- **功能：** 获取当前登录用户信息

**请求头：**
```
Authorization: Bearer <token>
```

**响应示例：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "avatar": null,
    "lastLogin": "2026-03-28T09:00:00Z",
    "createdAt": "2026-03-27T10:00:00Z",
    "timezone": "UTC"
  },
  "timestamp": "2026-03-28T10:00:00Z"
}
```

**错误响应：**
- `401`: Token无效或过期

---

## 3. 心情记录模块

### 3.1 创建心情记录
- **接口路径：** `POST /api/moods`
- **认证：** ✅ 需要认证
- **功能：** 创建心情记录

**请求头：**
```
Authorization: Bearer <token>
```

**请求参数：**
```json
{
  "date": "string",
  "moodType": "string",
  "moodLevel": "number",
  "note": "string",
  "tags": "string"
}
```

**参数验证：**
- `date`: 必填，格式YYYY-MM-DD
- `moodType`: 必填，长度1-50
- `moodLevel`: 必填，1-5之间的整数
- `note`: 可选，最大500字符
- `tags`: 可选，逗号分隔的标签，最大100字符

**响应示例：**
```json
{
  "code": 200,
  "message": "心情记录创建成功",
  "data": {
    "id": 123,
    "userId": 1,
    "date": "2026-03-28",
    "moodType": "开心",
    "moodLevel": 5,
    "note": "今天天气很好",
    "tags": "工作,生活",
    "createdAt": "2026-03-28T10:00:00Z",
    "updatedAt": "2026-03-28T10:00:00Z"
  },
  "timestamp": "2026-03-28T10:00:00Z"
}
```

**错误响应：**
- `400`: 今天已打卡
- `422`: 参数验证失败

---

### 3.2 查询心情记录
- **接口路径：** `GET /api/moods`
- **认证：** ✅ 需要认证
- **功能：** 查询心情记录列表

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
- `month`: 可选，格式YYYY-MM，如"2026-03"
- `startDate`: 可选，开始日期，格式YYYY-MM-DD
- `endDate`: 可选，结束日期，格式YYYY-MM-DD
- `limit`: 可选，每页数量，默认20，最大100
- `page`: 可选，页码，默认1

**响应示例：**
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "records": [
      {
        "id": 123,
        "userId": 1,
        "date": "2026-03-28",
        "moodType": "开心",
        "moodLevel": 5,
        "note": "今天天气很好",
        "tags": "工作,生活",
        "createdAt": "2026-03-28T10:00:00Z",
        "updatedAt": "2026-03-28T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  },
  "timestamp": "2026-03-28T10:00:00Z"
}
```

---

### 3.3 获取心情记录详情
- **接口路径：** `GET /api/moods/{id}`
- **认证：** ✅ 需要认证
- **功能：** 获取指定心情记录详情

**路径参数：**
- `id`: 心情记录ID

**请求头：**
```
Authorization: Bearer <token>
```

**响应示例：**
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "id": 123,
    "userId": 1,
    "date": "2026-03-28",
    "moodType": "开心",
    "moodLevel": 5,
    "note": "今天天气很好",
    "tags": "工作,生活",
    "createdAt": "2026-03-28T10:00:00Z",
    "updatedAt": "2026-03-28T10:00:00Z"
  },
  "timestamp": "2026-03-28T10:00:00Z"
}
```

**错误响应：**
- `404`: 心情记录不存在

---

### 3.4 更新心情记录
- **接口路径：** `PUT /api/moods/{id}`
- **认证：** ✅ 需要认证
- **功能：** 更新心情记录

**路径参数：**
- `id`: 心情记录ID

**请求头：**
```
Authorization: Bearer <token>
```

**请求参数：**
```json
{
  "moodType": "string",
  "moodLevel": "number",
  "note": "string",
  "tags": "string"
}
```

**参数验证：**
- `moodType`: 可选，长度1-50
- `moodLevel`: 可选，1-5之间的整数
- `note`: 可选，最大500字符
- `tags`: 可选，逗号分隔的标签，最大100字符

**响应示例：**
```json
{
  "code": 200,
  "message": "心情记录更新成功",
  "data": {
    "id": 123,
    "userId": 1,
    "date": "2026-03-28",
    "moodType": "平静",
    "moodLevel": 4,
    "note": "今天比较平静",
    "tags": "生活",
    "createdAt": "2026-03-28T10:00:00Z",
    "updatedAt": "2026-03-28T11:00:00Z"
  },
  "timestamp": "2026-03-28T11:00:00Z"
}
```

**错误响应：**
- `404`: 心情记录不存在

---

### 3.5 删除心情记录
- **接口路径：** `DELETE /api/moods/{id}`
- **认证：** ✅ 需要认证
- **功能：** 删除心情记录

**路径参数：**
- `id`: 心情记录ID

**请求头：**
```
Authorization: Bearer <token>
```

**响应示例：**
```json
{
  "code": 200,
  "message": "心情记录删除成功",
  "data": {
    "success": true
  },
  "timestamp": "2026-03-28T10:00:00Z"
}
```

**错误响应：**
- `404`: 心情记录不存在

---

## 4. 心情类型模块

### 4.1 查询心情类型
- **接口路径：** `GET /api/mood-types`
- **认证：** ❌ 不需要认证
- **功能：** 查询心情类型列表

**查询参数：**
- `userId`: 可选，用户ID，查询特定用户的心情类型
- `isSystem`: 可选，布尔值，true查询系统默认，false查询用户自定义
- `limit`: 可选，每页数量，默认20，最大100
- `page`: 可选，页码，默认1

**响应示例：**
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "types": [
      {
        "id": 1,
        "userId": null,
        "name": "开心",
        "color": "#FFD700",
        "icon": "😄",
        "sortOrder": 1,
        "isSystem": true,
        "createdAt": "2026-03-28T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  },
  "timestamp": "2026-03-28T10:00:00Z"
}
```

---

### 4.2 创建心情类型
- **接口路径：** `POST /api/mood-types`
- **认证：** ✅ 需要认证
- **功能：** 创建自定义心情类型

**请求头：**
```
Authorization: Bearer <token>
```

**请求参数：**
```json
{
  "name": "string",
  "color": "string",
  "icon": "string",
  "sortOrder": "number"
}
```

**参数验证：**
- `name`: 必填，长度1-50
- `color`: 必填，有效的16进制颜色代码
- `icon`: 必填，长度1-50
- `sortOrder`: 可选，整数，默认0

**响应示例：**
```json
{
  "code": 200,
  "message": "心情类型创建成功",
  "data": {
    "id": 100,
    "userId": 1,
    "name": "快乐",
    "color": "#FF69B4",
    "icon": "🤩",
    "sortOrder": 10,
    "isSystem": false,
    "createdAt": "2026-03-28T10:00:00Z"
  },
  "timestamp": "2026-03-28T10:00:00Z"
}
```

**错误响应：**
- `422`: 参数验证失败

---

### 4.3 更新心情类型
- **接口路径：** `PUT /api/mood-types/{id}`
- **认证：** ✅ 需要认证
- **功能：** 更新心情类型

**路径参数：**
- `id`: 心情类型ID

**请求头：**
```
Authorization: Bearer <token>
```

**请求参数：**
```json
{
  "name": "string",
  "color": "string",
  "icon": "string",
  "sortOrder": "number"
}
```

**参数验证：**
- `name`: 可选，长度1-50
- `color`: 可选，有效的16进制颜色代码
- `icon`: 可选，长度1-50
- `sortOrder`: 可选，整数

**响应示例：**
```json
{
  "code": 200,
  "message": "心情类型更新成功",
  "data": {
    "id": 100,
    "userId": 1,
    "name": "超级开心",
    "color": "#FF69B4",
    "icon": "🤩",
    "sortOrder": 5,
    "isSystem": false,
    "createdAt": "2026-03-28T10:00:00Z",
    "updatedAt": "2026-03-28T11:00:00Z"
  },
  "timestamp": "2026-03-28T11:00:00Z"
}
```

**错误响应：**
- `404`: 心情类型不存在
- `403`: 不能修改系统默认心情类型

---

### 4.4 删除心情类型
- **接口路径：** `DELETE /api/mood-types/{id}`
- **认证：** ✅ 需要认证
- **功能：** 删除心情类型

**路径参数：**
- `id`: 心情类型ID

**请求头：**
```
Authorization: Bearer <token>
```

**响应示例：**
```json
{
  "code": 200,
  "message": "心情类型删除成功",
  "data": {
    "success": true
  },
  "timestamp": "2026-03-28T10:00:00Z"
}
```

**错误响应：**
- `404`: 心情类型不存在
- `403`: 不能删除系统默认心情类型

---

## 5. 统计模块

### 5.1 获取统计数据
- **接口路径：** `GET /api/stats`
- **认证：** ✅ 需要认证
- **功能：** 获取用户统计数据

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
- `range`: 可选，统计范围，值为7, 30, 90，默认30

**响应示例：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "totalCount": 25,
    "moodDistribution": {
      "开心": 40,
      "平静": 25,
      "低落": 15,
      "生气": 10,
      "焦虑": 10
    },
    "continuousDays": 7,
    "averageScore": 3.8,
    "range": 30
  },
  "timestamp": "2026-03-28T10:00:00Z"
}
```

---

### 5.2 获取心情趋势数据
- **接口路径：** `GET /api/stats/trend`
- **认证：** ✅ 需要认证
- **功能：** 获取心情趋势数据

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
- `range`: 可选，统计范围，值为7, 30, 90，默认30

**响应示例：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "trendData": [
      {
        "date": "2026-03-22",
        "moodLevel": 3.2
      },
      {
        "date": "2026-03-23",
        "moodLevel": 4.1
      }
    ],
    "range": 30
  },
  "timestamp": "2026-03-28T10:00:00Z"
}
```

---

### 5.3 获取排行榜数据
- **接口路径：** `GET /api/stats/rankings`
- **认证：** ❌ 不需要认证
- **功能：** 获取排行榜数据

**查询参数：**
- `type`: 必选，排行榜类型，值为active, happy
- `range`: 可选，统计范围，值为week, month，默认month

**响应示例：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "rankings": [
      {
        "userId": 1,
        "username": "john_doe",
        "value": 15,
        "rank": 1
      }
    ],
    "type": "active",
    "range": "week"
  },
  "timestamp": "2026-03-28T10:00:00Z"
}
```

---

## 6. 评论模块

### 6.1 查询评论列表
- **接口路径：** `GET /api/comments`
- **认证：** ❌ 不需要认证
- **功能：** 查询评论列表

**查询参数：**
- `moodRecordId`: 必选，心情记录ID
- `status`: 可选，评论状态，值为pending, approved, rejected，默认approved
- `limit`: 可选，每页数量，默认20，最大100
- `page`: 可选，页码，默认1

**响应示例：**
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "comments": [
      {
        "id": 1,
        "moodRecordId": 123,
        "userId": 2,
        "username": "jane_smith",
        "content": "希望你天天开心",
        "status": "approved",
        "createdAt": "2026-03-28T10:00:00Z",
        "updatedAt": "2026-03-28T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  },
  "timestamp": "2026-03-28T10:00:00Z"
}
```

---

### 6.2 创建评论
- **接口路径：** `POST /api/comments`
- **认证：** ❌ 不需要认证
- **功能：** 创建评论

**请求参数：**
```json
{
  "moodRecordId": "number",
  "content": "string"
}
```

**参数验证：**
- `moodRecordId`: 必填，心情记录ID
- `content`: 必填，评论内容，1-1000字符

**请求头（可选）：**
```
Authorization: Bearer <token>  // 如果是登录用户
```

**响应示例：**
```json
{
  "code": 200,
  "message": "评论创建成功",
  "data": {
    "id": 1,
    "moodRecordId": 123,
    "userId": 2,
    "content": "希望你天天开心",
    "status": "pending",  // 游客评论需要审核
    "createdAt": "2026-03-28T10:00:00Z",
    "updatedAt": "2026-03-28T10:00:00Z"
  },
  "timestamp": "2026-03-28T10:00:00Z"
}
```

**错误响应：**
- `422`: 参数验证失败

---

### 6.3 删除评论
- **接口路径：** `DELETE /api/comments/{id}`
- **认证：** ✅ 需要认证
- **功能：** 删除评论

**路径参数：**
- `id`: 评论ID

**请求头：**
```
Authorization: Bearer <token>
```

**响应示例：**
```json
{
  "code": 200,
  "message": "评论删除成功",
  "data": {
    "success": true
  },
  "timestamp": "2026-03-28T10:00:00Z"
}
```

**错误响应：**
- `404`: 评论不存在
- `403`: 无权限删除该评论

---

## 7. 用户设置模块

### 7.1 获取用户设置
- **接口路径：** `GET /api/user/settings`
- **认证：** ✅ 需要认证
- **功能：** 获取当前用户的设置

**请求头：**
```
Authorization: Bearer <token>
```

**响应示例：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "userId": 1,
    "reminderTime": "09:00:00",
    "reminderEnabled": true,
    "weeklyReport": false,
    "publicProfile": false,
    "theme": "light",
    "createdAt": "2026-03-28T10:00:00Z",
    "updatedAt": "2026-03-28T10:00:00Z"
  },
  "timestamp": "2026-03-28T10:00:00Z"
}
```

---

### 7.2 更新用户设置
- **接口路径：** `PUT /api/user/settings`
- **认证：** ✅ 需要认证
- **功能：** 更新当前用户的设置

**请求头：**
```
Authorization: Bearer <token>
```

**请求参数：**
```json
{
  "reminderTime": "string",
  "reminderEnabled": "boolean",
  "weeklyReport": "boolean",
  "publicProfile": "boolean",
  "theme": "string"
}
```

**参数验证：**
- `reminderTime`: 可选，时间格式HH:MM:SS
- `reminderEnabled`: 可选，布尔值
- `weeklyReport`: 可选，布尔值
- `publicProfile`: 可选，布尔值
- `theme`: 可选，值为light, dark

**响应示例：**
```json
{
  "code": 200,
  "message": "设置更新成功",
  "data": {
    "id": 1,
    "userId": 1,
    "reminderTime": "09:00:00",
    "reminderEnabled": true,
    "weeklyReport": false,
    "publicProfile": false,
    "theme": "dark",
    "createdAt": "2026-03-28T10:00:00Z",
    "updatedAt": "2026-03-28T11:00:00Z"
  },
  "timestamp": "2026-03-28T11:00:00Z"
}
```

---

## 8. 数据验证规则

### 8.1 用户相关
- 用户名：3-50字符，字母数字下划线
- 邮箱：标准邮箱格式
- 密码：8-100字符，包含大小写字母和数字

### 8.2 心情记录相关
- 日期：YYYY-MM-DD格式
- 心情等级：1-5整数
- 备注：最大500字符
- 标签：逗号分隔，最大100字符

### 8.3 心情类型相关
- 名称：1-50字符
- 颜色：标准16进制颜色代码（#XXXXXX）
- 图标：1-50字符

### 8.4 评论相关
- 内容：1-1000字符

---

## 9. 性能指标

### 9.1 响应时间
- 简单查询：≤100ms
- 复杂查询：≤500ms
- 统计查询：≤1000ms

### 9.2 并发能力
- 支持100并发用户
- 99%请求响应时间<2s

---

**文档维护：** 本文档随API变更而更新
# 自定义心情功能 API 文档

## 概述

新增了自定义心情功能，允许用户上传 1-9 张图片作为自定义心情选项。

## 数据库变更

### 新增表：custom_moods
```sql
CREATE TABLE "CustomMood" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "imageUrls" TEXT[],
    "isSystem" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomMood_pkey" PRIMARY KEY ("id")
);
```

### 修改表：mood_records
在 MoodRecord 表中增加了 `customMoodId` 字段：
- customMoodId INTEGER (可选，关联到 CustomMood 表)

## API 端点

### 1. 图片上传
**POST** `/api/upload/image`

上传图片到云存储。

#### Headers
- `Authorization: Bearer {token}`
- `x-user-id: {userId}`

#### Form Data
- `images` (File[]): 最多 9 张图片

#### Response
```json
{
  "message": "Images uploaded successfully",
  "urls": ["https://...", "..."],
  "count": 3
}
```

### 2. 创建自定义心情
**POST** `/api/custom-moods`

创建一个新的自定义心情记录。

#### Headers
- `Authorization: Bearer {token}`

#### Request Body
```json
{
  "userId": 1,
  "name": "我的自定义心情",
  "imageUrls": ["https://...", "..."]
}
```

#### Response
```json
{
  "id": 1,
  "userId": 1,
  "name": "我的自定义心情",
  "imageUrls": ["https://...", "..."],
  "isSystem": false,
  "createdAt": "2026-03-28T14:30:00.000Z",
  "updatedAt": "2026-03-28T14:30:00.000Z"
}
```

### 3. 获取自定义心情列表
**GET** `/api/custom-moods?userId={userId}`

获取指定用户的自定义心情列表。

#### Headers
- `Authorization: Bearer {token}`

#### Query Parameters
- `userId` (required): 用户 ID

#### Response
```json
[
  {
    "id": 1,
    "userId": 1,
    "name": "我的自定义心情",
    "imageUrls": ["https://...", "..."],
    "isSystem": false,
    "createdAt": "2026-03-28T14:30:00.000Z",
    "updatedAt": "2026-03-28T14:30:00.000Z"
  }
]
```

### 4. 获取特定自定义心情
**GET** `/api/custom-moods/{id}`

获取特定的自定义心情记录。

#### Headers
- `Authorization: Bearer {token}`

#### Response
```json
{
  "id": 1,
  "userId": 1,
  "name": "我的自定义心情",
  "imageUrls": ["https://...", "..."],
  "isSystem": false,
  "createdAt": "2026-03-28T14:30:00.000Z",
  "updatedAt": "2026-03-28T14:30:00.000Z"
}
```

### 5. 更新自定义心情
**PUT** `/api/custom-moods?id={id}`

更新自定义心情记录。

#### Headers
- `Authorization: Bearer {token}`

#### Request Body
```json
{
  "name": "更新后的心情名称",
  "imageUrls": ["https://...", "..."]
}
```

#### Response
```json
{
  "id": 1,
  "userId": 1,
  "name": "更新后的心情名称",
  "imageUrls": ["https://...", "..."],
  "isSystem": false,
  "createdAt": "2026-03-28T14:30:00.000Z",
  "updatedAt": "2026-03-28T15:00:00.000Z"
}
```

### 6. 删除自定义心情
**DELETE** `/api/custom-moods?id={id}`

删除自定义心情记录。

#### Headers
- `Authorization: Bearer {token}`

#### Response
```json
{
  "message": "Custom mood deleted successfully"
}
```

### 7. 创建自定义心情（带图片上传）
**POST** `/api/custom-moods/create-with-images`

一步完成图片上传和自定义心情创建。

#### Headers
- `Authorization: Bearer {token}`
- `x-user-id: {userId}`

#### Form Data
- `name` (string): 心情名称
- `images` (File[]): 最多 9 张图片

#### Response
```json
{
  "message": "Custom mood created successfully",
  "customMood": {
    "id": 1,
    "userId": 1,
    "name": "我的自定义心情",
    "imageUrls": ["https://...", "..."],
    "isSystem": false,
    "createdAt": "2026-03-28T14:30:00.000Z",
    "updatedAt": "2026-03-28T14:30:00.000Z"
  }
}
```

### 8. 修改心情记录 API
**POST** `/api/moods`

现在支持 `customMoodId` 参数。

#### Request Body
```json
{
  "userId": 1,
  "date": "2026-03-28",
  "moodType": "custom",
  "customMoodId": 1,
  "note": "今天很开心",
  "tags": ["快乐", "美好"]
}
```

## 使用示例

### 前端集成示例
```javascript
// 上传图片并创建自定义心情
const createCustomMood = async (name, images) => {
  const formData = new FormData();
  formData.append('name', name);
  images.forEach((image, index) => {
    formData.append('images', image);
  });

  const response = await fetch('/api/custom-moods/create-with-images', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-user-id': userId,
    },
    body: formData,
  });

  return response.json();
};

// 记录带有自定义心情的心情
const recordMood = async (date, customMoodId) => {
  const response = await fetch('/api/moods', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId: 1,
      date: date,
      moodType: 'custom',
      customMoodId: customMoodId,
      note: '今天用了自定义心情',
    }),
  });

  return response.json();
};
```
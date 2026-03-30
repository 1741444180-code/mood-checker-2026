# Google Calendar API 同步配置指南

本文档详细说明如何配置和使用 Google Calendar API 进行日历同步。

## 1. 环境准备

### 1.1 创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google Calendar API:
   - 在左侧导航栏点击 "API 和服务" > "库"
   - 搜索 "Google Calendar API"
   - 点击并启用 API

### 1.2 创建凭据

#### 1.2.1 服务账户 (推荐用于服务器端应用)

1. 在 Google Cloud Console 中，进入 "API 和服务" > "凭据"
2. 点击 "创建凭据" > "服务账户"
3. 填写服务账户详情并创建
4. 下载 JSON 密钥文件并保存为 `google-calendar-credentials.json`
5. 将服务账户邮箱添加到需要访问的日历中，并授予适当权限

#### 1.2.2 OAuth 2.0 客户端 ID (用于需要用户授权的应用)

1. 在凭据页面，点击 "创建凭据" > "OAuth 客户端 ID"
2. 选择应用类型 (Web 应用、桌面应用等)
3. 配置授权重定向 URI
4. 下载客户端配置 JSON 文件

### 1.3 设置环境变量

```bash
# 服务账户方式
export GOOGLE_CALENDAR_CREDENTIALS_PATH=./google-calendar-credentials.json
export GOOGLE_CALENDAR_ID=primary  # 或特定日历ID

# OAuth 方式
export GOOGLE_CLIENT_ID=your-client-id
export GOOGLE_CLIENT_SECRET=your-client-secret
export GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

## 2. 安装依赖

```bash
npm install googleapis
```

## 3. 日历同步实现

### 3.1 服务账户实现示例

```typescript
// src/lib/calendar-sync-service-account.ts
import { google } from 'googleapis';
import path from 'path';

// 初始化 Google Calendar 客户端
const credentialsPath = process.env.GOOGLE_CALENDAR_CREDENTIALS_PATH || './google-calendar-credentials.json';
const credentials = require(path.resolve(credentialsPath));

const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/calendar']
});

const calendar = google.calendar({ version: 'v3', auth });

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';

/**
 * 获取日历事件
 */
export const getCalendarEvents = async (timeMin?: string, timeMax?: string) => {
  try {
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: timeMin || new Date().toISOString(),
      timeMax: timeMax,
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime'
    });
    
    return response.data.items || [];
  } catch (error) {
    console.error('获取日历事件失败:', error);
    throw error;
  }
};

/**
 * 创建日历事件
 */
export const createCalendarEvent = async (event: any) => {
  try {
    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event
    });
    
    return response.data;
  } catch (error) {
    console.error('创建日历事件失败:', error);
    throw error;
  }
};

/**
 * 更新日历事件
 */
export const updateCalendarEvent = async (eventId: string, event: any) => {
  try {
    const response = await calendar.events.update({
      calendarId: CALENDAR_ID,
      eventId: eventId,
      requestBody: event
    });
    
    return response.data;
  } catch (error) {
    console.error('更新日历事件失败:', error);
    throw error;
  }
};

/**
 * 删除日历事件
 */
export const deleteCalendarEvent = async (eventId: string) => {
  try {
    await calendar.events.delete({
      calendarId: CALENDAR_ID,
      eventId: eventId
    });
  } catch (error) {
    console.error('删除日历事件失败:', error);
    throw error;
  }
};

/**
 * 同步日历事件
 * 根据业务逻辑实现具体的同步逻辑
 */
export const syncCalendarEvents = async () => {
  try {
    console.log('开始同步日历事件');
    
    // 示例：获取未来7天的事件
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const events = await getCalendarEvents(
      now.toISOString(),
      sevenDaysLater.toISOString()
    );
    
    console.log(`同步了 ${events.length} 个日历事件`);
    
    // 这里可以添加与本地数据库或其他系统的同步逻辑
    
    return events;
  } catch (error) {
    console.error('日历同步失败:', error);
    throw error;
  }
};
```

### 3.2 OAuth 实现示例

```typescript
// src/lib/calendar-sync-oauth.ts
import { google } from 'googleapis';
import fs from 'fs';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';

/**
 * 获取 OAuth2 客户端
 */
const getOAuth2Client = () => {
  const credentials = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: [process.env.GOOGLE_REDIRECT_URI]
  };
  
  const { client_secret, client_id, redirect_uris } = credentials;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  
  return oAuth2Client;
};

/**
 * 获取访问令牌
 */
const getAccessToken = async () => {
  const oAuth2Client = getOAuth2Client();
  
  // 如果已有令牌文件，直接使用
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  }
  
  // 否则需要进行 OAuth 流程
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  
  console.log('请访问以下URL进行授权:', authUrl);
  // 这里需要实现回调处理逻辑来获取授权码
  
  throw new Error('需要先完成 OAuth 授权流程');
};

/**
 * 获取日历客户端
 */
export const getCalendarClient = async () => {
  const auth = await getAccessToken();
  return google.calendar({ version: 'v3', auth });
};

// 其他函数类似服务账户实现...
```

## 4. 使用示例

### 4.1 基本用法

```typescript
import { 
  getCalendarEvents, 
  createCalendarEvent, 
  syncCalendarEvents 
} from './calendar-sync';

// 获取未来30天的事件
const thirtyDaysLater = new Date();
thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

const events = await getCalendarEvents(
  new Date().toISOString(),
  thirtyDaysLater.toISOString()
);

// 创建新事件
const newEvent = {
  summary: '团队会议',
  description: '每周团队同步会议',
  start: {
    dateTime: '2026-04-01T10:00:00+08:00',
    timeZone: 'Asia/Shanghai'
  },
  end: {
    dateTime: '2026-04-01T11:00:00+08:00',
    timeZone: 'Asia/Shanghai'
  },
  attendees: [
    { email: 'user1@example.com' },
    { email: 'user2@example.com' }
  ]
};

const createdEvent = await createCalendarEvent(newEvent);
console.log('创建的事件ID:', createdEvent.id);
```

### 4.2 与定时任务集成

```typescript
// 在 cron-jobs.ts 中使用
import cron from 'node-cron';
import { syncCalendarEvents } from './calendar-sync';

// 每小时同步一次日历
cron.schedule('0 * * * *', async () => {
  await syncCalendarEvents();
});
```

## 5. 事件数据结构

Google Calendar API 使用以下主要字段:

```typescript
interface CalendarEvent {
  id?: string;           // 事件唯一ID
  summary: string;       // 事件标题
  description?: string;  // 事件描述
  location?: string;     // 事件地点
  start: {
    dateTime: string;    // ISO 8601 格式日期时间
    timeZone?: string;   // 时区，如 'Asia/Shanghai'
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: 'email' | 'popup';
      minutes: number;
    }>;
  };
  colorId?: string;      // 事件颜色
  status?: 'confirmed' | 'tentative' | 'cancelled';
}
```

## 6. 故障排除

### 6.1 常见问题

1. **403 Forbidden**: 服务账户没有访问日历的权限
2. **404 Not Found**: 日历ID不存在或拼写错误
3. **Invalid Grant**: OAuth 令牌已过期

### 6.2 调试技巧

1. 启用详细日志:
   ```typescript
   const calendar = google.calendar({
     version: 'v3',
     auth,
     // 启用调试
     params: { debug: true }
   });
   ```

2. 使用 Google API Explorer 测试请求

## 7. 安全最佳实践

1. **限制服务账户权限**到最小必要范围
2. **不要在代码中硬编码凭据**
3. **使用环境变量或密钥管理服务**
4. **定期轮换凭据**
5. **实施适当的错误处理和重试逻辑**

## 8. 配额和限制

- **免费配额**: 每个项目每天 1,000,000 次请求
- **速率限制**: 每秒 10 次请求 (可调整)
- **事件大小限制**: 单个事件最大 1MB

## 9. 参考资源

- [Google Calendar API 文档](https://developers.google.com/calendar/api)
- [Google APIs Node.js Client](https://github.com/googleapis/google-api-nodejs-client)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
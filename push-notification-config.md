# 推送通知服务配置指南

本文档详细说明如何配置和使用推送通知服务，支持 Firebase Cloud Messaging (FCM) 和 OneSignal 两种方案。

## 1. 环境准备

### 1.1 Firebase 配置

#### 1.1.1 创建 Firebase 项目
1. 访问 [Firebase 控制台](https://console.firebase.google.com/)
2. 创建新项目或选择现有项目
3. 在项目设置中启用 Cloud Messaging API

#### 1.1.2 获取配置凭证
1. 在项目设置 > 服务账户中下载私钥 JSON 文件
2. 将私钥文件保存为 `firebase-service-account.json`
3. 设置环境变量：
   ```bash
   export FIREBASE_PROJECT_ID=your-project-id
   export FIREBASE_PRIVATE_KEY_PATH=./firebase-service-account.json
   ```

### 1.2 OneSignal 配置

#### 1.2.1 创建 OneSignal 账户
1. 访问 [OneSignal](https://onesignal.com/) 并注册账户
2. 创建新应用
3. 获取 App ID 和 REST API Key

#### 1.2.2 设置环境变量
```bash
export ONESIGNAL_APP_ID=your-app-id
export ONESIGNAL_API_KEY=your-api-key
```

## 2. 安装依赖

```bash
# Firebase 方案
npm install firebase-admin

# OneSignal 方案
npm install onesignal-node
```

## 3. 推送通知实现

### 3.1 Firebase 实现示例

```typescript
// src/lib/push-notifications-firebase.ts
import admin from 'firebase-admin';
import path from 'path';

// 初始化 Firebase Admin SDK
const serviceAccountPath = process.env.FIREBASE_PRIVATE_KEY_PATH || './firebase-service-account.json';
const serviceAccount = require(path.resolve(serviceAccountPath));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID
});

interface PushNotification {
  title: string;
  body: string;
  topic?: string;
  token?: string;
  data?: Record<string, string>;
}

export const sendPushNotification = async (notification: PushNotification): Promise<void> => {
  try {
    let message;
    
    if (notification.topic) {
      // 发送到主题
      message = {
        notification: {
          title: notification.title,
          body: notification.body
        },
        data: notification.data || {},
        topic: notification.topic
      };
    } else if (notification.token) {
      // 发送到特定设备
      message = {
        notification: {
          title: notification.title,
          body: notification.body
        },
        data: notification.data || {},
        token: notification.token
      };
    } else {
      throw new Error('必须指定 topic 或 token');
    }
    
    const response = await admin.messaging().send(message);
    console.log('成功发送推送通知:', response);
  } catch (error) {
    console.error('发送推送通知失败:', error);
    throw error;
  }
};
```

### 3.2 OneSignal 实现示例

```typescript
// src/lib/push-notifications-onesignal.ts
import OneSignal from 'onesignal-node';

const client = new OneSignal.Client({
  app: {
    appAuthKey: process.env.ONESIGNAL_API_KEY,
    appId: process.env.ONESIGNAL_APP_ID
  }
});

interface PushNotification {
  title: string;
  body: string;
  included_segments?: string[];
  include_player_ids?: string[];
  data?: Record<string, any>;
}

export const sendPushNotification = async (notification: PushNotification): Promise<void> => {
  try {
    const message = {
      contents: { en: notification.body },
      headings: { en: notification.title },
      included_segments: notification.included_segments || ['All'],
      include_player_ids: notification.include_player_ids,
      data: notification.data || {}
    };
    
    const response = await client.createNotification(message);
    console.log('成功发送推送通知:', response.body.id);
  } catch (error) {
    console.error('发送推送通知失败:', error);
    throw error;
  }
};
```

## 4. 使用示例

### 4.1 基本用法

```typescript
import { sendPushNotification } from './push-notifications';

// 发送到所有订阅了"daily-reminders"主题的用户
await sendPushNotification({
  title: '每日提醒',
  body: '记得完成今天的任务！',
  topic: 'daily-reminders'
});

// 发送到特定设备
await sendPushNotification({
  title: '重要通知',
  body: '您有一个新的重要消息',
  token: 'device-token-here'
});
```

### 4.2 与定时任务集成

```typescript
// 在 cron-jobs.ts 中使用
import cron from 'node-cron';
import { sendPushNotification } from './push-notifications';

// 每天早上9点发送提醒
cron.schedule('0 9 * * *', async () => {
  await sendPushNotification({
    title: '每日提醒',
    body: '新的一天开始了！',
    topic: 'daily-reminders'
  });
});
```

## 5. 客户端集成

### 5.1 Web 应用 (Firebase)

```javascript
// 在客户端初始化 Firebase
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 获取设备令牌
async function requestPermission() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const token = await getToken(messaging, { 
      vapidKey: 'your-vapid-key' 
    });
    console.log('FCM Token:', token);
    // 将 token 发送到服务器存储
  }
}

// 处理前台消息
onMessage(messaging, (payload) => {
  console.log('收到前台消息:', payload);
  // 显示通知
});
```

### 5.2 移动应用 (OneSignal)

参考 OneSignal 官方文档集成 iOS/Android SDK。

## 6. 故障排除

### 6.1 常见问题

1. **权限错误**: 确保服务账户有正确的权限
2. **无效令牌**: 设备令牌可能已过期，需要重新获取
3. **配额限制**: Firebase 免费计划有每日发送限制

### 6.2 调试技巧

1. 启用详细日志:
   ```typescript
   admin.initializeApp({
     // ...其他配置
     serviceAccountId: 'your-service-account@project.iam.gserviceaccount.com'
   });
   
   // 添加日志中间件
   admin.firestore().settings({ ignoreUndefinedProperties: true });
   ```

2. 使用 Firebase 控制台的测试功能验证配置

## 7. 安全最佳实践

1. **不要在客户端暴露 API 密钥**
2. **使用环境变量存储敏感信息**
3. **定期轮换密钥**
4. **实施适当的访问控制**

## 8. 参考资源

- [Firebase Cloud Messaging 文档](https://firebase.google.com/docs/cloud-messaging)
- [OneSignal API 文档](https://documentation.onesignal.com/reference)
- [node-cron 文档](https://github.com/node-cron/node-cron)
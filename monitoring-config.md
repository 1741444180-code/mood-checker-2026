# 监控系统配置文档

## 概述
本文档详细说明了心情打卡网站的监控系统配置，包括Sentry和LogRocket的集成方案。

## Sentry 配置

### 前端集成
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
});
```

### 后端集成
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

// Express middleware
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
```

### 环境变量
- `NEXT_PUBLIC_SENTRY_DSN`: 前端Sentry DSN
- `SENTRY_DSN`: 后端Sentry DSN
- `SENTRY_AUTH_TOKEN`: Sentry CLI认证令牌（用于CI/CD）

## LogRocket 配置

### 前端集成
```javascript
import LogRocket from 'logrocket';

if (process.env.NODE_ENV === 'production') {
  LogRocket.init('your-app-id');
  
  // 识别用户（可选）
  LogRocket.identify(userId, {
    name: userName,
    email: userEmail,
  });
  
  // 记录Redux状态（如果使用）
  LogRocket.reduxMiddleware();
}
```

### 环境变量
- `NEXT_PUBLIC_LOGROCKET_ID`: LogRocket应用ID

## 监控指标

### 关键性能指标 (KPI)
- 页面加载时间 (< 2s)
- API响应时间 (< 500ms)
- 错误率 (< 1%)
- 用户会话时长
- 转化率（打卡完成率）

### 自定义事件跟踪
- 用户登录/注册
- 心情打卡提交
- 页面导航
- 表单验证错误
- API调用失败

## 数据保留策略
- Sentry事件数据：30天
- LogRocket会话记录：14天
- 性能指标数据：90天

## 权限管理
- 开发团队：只读权限
- 运维团队：读写权限
- 管理员：完全访问权限

## 故障排除
### 常见问题
1. **监控数据未上报**
   - 检查环境变量是否正确配置
   - 验证网络连接和CSP策略
   - 确认SDK版本兼容性

2. **采样率过高/过低**
   - 根据业务需求调整`tracesSampleRate`
   - 生产环境建议设置为0.1-0.3

3. **敏感信息泄露**
   - 启用Sentry的PII过滤
   - 配置LogRocket的文本遮蔽规则
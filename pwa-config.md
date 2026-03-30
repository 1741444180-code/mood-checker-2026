# PWA (Progressive Web App) 配置文档

## 1. Service Worker 配置

### 1.1 文件位置
- **Service Worker 文件**: `frontend/public/sw.js`
- **注册文件**: 需要在主HTML文件中注册Service Worker

### 1.2 Service Worker 功能概述
- **缓存管理**: 自动缓存关键资源，实现离线访问
- **网络请求拦截**: 智能处理网络请求，优先使用缓存
- **版本控制**: 自动清理旧版本缓存，确保用户获取最新内容
- **离线支持**: 在网络不可用时提供基本功能

### 1.3 缓存策略

#### 安装阶段 (Install Event)
- 缓存应用核心资源（App Shell）
- 包括：`/`, `/index.html`, `/styles/main.css`, `/scripts/main.js`, `/manifest.json`

#### 激活阶段 (Activate Event)
- 清理旧版本缓存
- 立即接管所有客户端页面

#### 获取阶段 (Fetch Event)
- **API 请求**: 使用网络优先策略（Network-first）
  - 首先尝试从网络获取数据
  - 网络失败时回退到缓存
  - 成功响应会被缓存以备离线使用
  
- **静态资源**: 使用缓存优先策略（Cache-first）
  - 首先检查缓存中是否有资源
  - 缓存命中则直接返回
  - 缓存未命中则从网络获取并缓存

### 1.4 缓存命名规范
- 缓存名称: `mood-tracker-v1`
- 版本号便于更新和清理

## 2. HTTPS 配置

### 2.1 SSL 证书配置
SSL证书已配置在项目根目录的 `ssl/` 文件夹中：

```bash
ssl/
├── certificate.crt    # SSL证书文件
├── private.key        # 私钥文件
└── README.md          # 证书配置说明
```

### 2.2 Nginx HTTPS 配置
HTTPS配置位于 `nginx/` 目录中，包含以下关键配置：

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL证书配置
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    
    # SSL安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # HSTS配置
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # 其他安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy no-referrer-when-downgrade;
    
    # 静态文件服务
    location / {
        root /path/to/frontend/public;
        try_files $uri $uri/ /index.html;
    }
}

# HTTP重定向到HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 2.3 本地开发HTTPS配置
对于本地开发环境，可以使用自签名证书：

```bash
# 生成自签名证书（仅用于开发）
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/private.key -out ssl/certificate.crt \
  -subj "/C=CN/ST=Beijing/L=Beijing/O=Dev/CN=localhost"
```

## 3. PWA 清单文件 (manifest.json)

需要在 `frontend/public/` 目录下创建 `manifest.json` 文件：

```json
{
  "name": "心情打卡网站",
  "short_name": "MoodTracker",
  "description": "记录每日心情的应用",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 4. Service Worker 注册

在主HTML文件的 `<head>` 或 `<body>` 底部添加以下代码：

```html
<script>
// 检查浏览器是否支持Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
</script>
```

## 5. 缓存更新策略

### 5.1 手动更新
可以通过发送消息强制Service Worker更新：

```javascript
// 在应用中触发更新
if (navigator.serviceWorker.controller) {
  navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
}
```

### 5.2 自动更新检测
可以在应用启动时检查是否有新的Service Worker版本：

```javascript
navigator.serviceWorker.getRegistration().then((registration) => {
  if (registration && registration.waiting) {
    // 有新版本等待激活
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
});
```

## 6. 调试和监控

### 6.1 Chrome DevTools
- Application > Service Workers: 查看Service Worker状态
- Application > Cache Storage: 查看缓存内容
- Network: 监控网络请求和缓存命中情况

### 6.2 日志监控
Service Worker中的console.log会在浏览器控制台显示，便于调试。

## 7. 最佳实践

1. **渐进式增强**: 确保应用在不支持Service Worker的浏览器中仍能正常工作
2. **缓存大小限制**: 注意浏览器对缓存存储空间的限制（通常50-250MB）
3. **版本管理**: 更新缓存名称以确保用户获取最新资源
4. **错误处理**: 妥善处理网络错误和缓存失败的情况
5. **性能监控**: 监控PWA加载性能和用户体验指标

## 8. 安全注意事项

1. **HTTPS强制**: Service Worker只能在HTTPS环境下工作（localhost除外）
2. **CORS处理**: 跨域资源需要正确配置CORS头
3. **敏感数据**: 避免在缓存中存储敏感用户数据
4. **证书管理**: 定期更新SSL证书，避免过期

---
**最后更新**: 2026-03-29  
**维护者**: 老张 (运维工程师)
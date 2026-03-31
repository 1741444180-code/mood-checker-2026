# 性能优化指南

## 概述
本文档提供了心情打卡网站的全面性能优化策略，涵盖前端、后端和基础设施层面。

## 前端优化

### 1. 代码分割与懒加载
```javascript
// 动态导入非关键组件
const LazyComponent = dynamic(() => import('../components/LazyComponent'), {
  loading: () => <SkeletonLoader />,
  ssr: false,
});

// 路由级代码分割（Next.js自动处理）
```

### 2. 图像优化
- 使用现代格式（WebP/AVIF）
- 实现响应式图像
- 添加懒加载属性
- 预加载关键图像

```jsx
<Image
  src="/mood-icon.png"
  alt="Mood Icon"
  width={64}
  height={64}
  loading="lazy"
  placeholder="blur"
/>
```

### 3. 缓存策略
- **静态资源**: `Cache-Control: public, max-age=31536000`
- **API响应**: 
  - GET请求: `Cache-Control: public, max-age=60`
  - POST/PUT/DELETE: `Cache-Control: no-cache`
- **Service Worker**: 实现离线缓存策略

### 4. 关键渲染路径优化
- 内联关键CSS
- 异步加载非关键JavaScript
- 减少DOM深度和复杂度
- 使用CSS containment

### 5. Bundle优化
- 分析bundle大小：`next build --profile`
- 移除未使用代码（Tree Shaking）
- 使用轻量级替代库
- 代码压缩和minification

## 后端优化

### 1. 数据库优化
- **索引策略**:
  ```sql
  -- 用户心情记录查询优化
  CREATE INDEX idx_mood_logs_user_date ON mood_logs(user_id, created_at);
  
  -- 心情类型统计优化
  CREATE INDEX idx_mood_logs_type ON mood_logs(mood_type);
  ```

- **查询优化**:
  - 避免N+1查询问题
  - 使用分页限制结果集
  - 批量操作代替循环单条操作

### 2. API优化
- 实现GraphQL或RESTful最佳实践
- 启用Gzip/Brotli压缩
- 设置适当的HTTP状态码
- 实现速率限制防止滥用

### 3. 缓存层
- **Redis缓存策略**:
  - 用户会话: TTL 24小时
  - 热门心情数据: TTL 1小时
  - 配置数据: TTL 24小时或手动失效

- **缓存穿透防护**:
  - 空值缓存
  - 布隆过滤器

### 4. 异步处理
- 将非关键操作移至后台队列
- 使用消息队列处理邮件通知
- 批量处理分析数据

## 基础设施优化

### 1. CDN配置
- 静态资源通过CDN分发
- 启用HTTP/2或HTTP/3
- 配置边缘缓存规则
- 启用Brotli压缩

### 2. 服务器配置
- **Node.js优化**:
  - 启用集群模式
  - 调整内存限制
  - 监控堆内存使用

- **数据库连接池**:
  ```javascript
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20, // 最大连接数
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  ```

### 3. 监控与告警
- 设置性能基线
- 监控关键指标
- 自动扩展策略
- 定期性能测试

## 性能测试

### 1. 工具推荐
- **Lighthouse**: 综合性能评分
- **WebPageTest**: 多地点测试
- **k6**: 负载测试
- **Chrome DevTools**: 详细分析

### 2. 测试场景
- 首屏加载时间
- 交互响应时间
- 并发用户负载
- 移动端性能

### 3. 性能预算
| 指标 | 目标 | 警告阈值 |
|------|------|----------|
| FCP | < 1s | > 1.8s |
| LCP | < 2s | > 2.5s |
| TTI | < 3s | > 5s |
| CLS | < 0.1 | > 0.25 |
| Bundle大小 | < 200KB | > 300KB |

## 持续优化流程

### 1. 监控驱动优化
- 每周审查性能指标
- A/B测试优化方案
- 用户反馈收集

### 2. 自动化检查
- PR中集成Lighthouse检查
- Bundle大小监控
- 回归测试

### 3. 文档更新
- 记录优化措施和效果
- 更新性能基线
- 分享最佳实践
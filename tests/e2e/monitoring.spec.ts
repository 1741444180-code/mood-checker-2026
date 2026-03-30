import { test, expect } from '@playwright/test';

// 监控 E2E 测试
test.describe('Monitoring Tests', () => {
  // 错误日志监控测试
  test('错误日志记录测试', async ({ page }) => {
    // 模拟一个 JavaScript 错误
    await page.route('**/api/error', route => {
      route.fulfill({
        status: 500,
        body: 'Internal Server Error'
      });
    });

    await page.goto('/');
    
    // 触发可能导致错误的操作
    await page.evaluate(() => {
      fetch('/api/error').catch(e => console.error('Error caught:', e));
    });

    // 验证错误被正确记录到监控系统
    await expect(page.locator('[data-testid="error-logged"]')).toBeVisible({ timeout: 10000 });
  });

  // 页面性能监控测试
  test('页面加载性能指标记录', async ({ page }) => {
    // 监听性能指标
    const performanceMetrics = [];
    page.on('console', message => {
      if (message.text().includes('PERFORMANCE_METRIC')) {
        performanceMetrics.push(message.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 验证性能指标被记录
    expect(performanceMetrics.length).toBeGreaterThan(0);
    expect(performanceMetrics.some(m => m.includes('loadTime'))).toBeTruthy();
  });

  // API 调用监控测试
  test('API 调用监控', async ({ page, request }) => {
    // 监听 API 调用
    const apiCalls = [];
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        apiCalls.push({
          url: request.url(),
          method: request.method()
        });
      }
    });

    await page.goto('/mood');
    await page.waitForLoadState('networkidle');

    // 验证 API 调用被监控
    expect(apiCalls.length).toBeGreaterThan(0);
    expect(apiCalls.some(call => call.url.includes('/api/moods'))).toBeTruthy();
  });

  // 用户行为监控测试
  test('用户行为追踪监控', async ({ page }) => {
    const userActions = [];
    page.on('console', message => {
      if (message.text().includes('USER_ACTION')) {
        userActions.push(message.text());
      }
    });

    await page.goto('/');
    await page.click('text=心情打卡');
    await page.click('text=心情统计');
    
    // 验证用户行为被记录
    expect(userActions.length).toBeGreaterThanOrEqual(2);
  });

  // 异常检测监控测试
  test('异常检测监控', async ({ page }) => {
    // 模拟异常情况
    await page.addInitScript(() => {
      window.onerror = (msg, url, line, col, error) => {
        console.log(`EXCEPTION_LOGGED: ${msg} at ${line}:${col}`);
      };
    });

    await page.goto('/');
    await page.evaluate(() => {
      throw new Error('Test exception for monitoring');
    });

    await expect(page.locator('[data-testid="exception-reported"]')).toBeVisible({ timeout: 10000 });
  });

  // 资源加载监控测试
  test('前端资源加载监控', async ({ page }) => {
    const resourceLoads = [];
    page.on('response', response => {
      if (response.status() >= 400) {
        resourceLoads.push({
          url: response.url(),
          status: response.status()
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 验证没有资源加载失败
    const failedResources = resourceLoads.filter(r => r.status >= 400);
    expect(failedResources.length).toBe(0);
  });

  // 响应时间监控测试
  test('响应时间监控', async ({ page }) => {
    const responseTimes = [];
    page.on('requestfinished', response => {
      const startTime = response.request().timing().startTime;
      const endTime = Date.now(); // 近似计算
      responseTimes.push(endTime - startTime);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 验证平均响应时间在合理范围内
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    expect(avgResponseTime).toBeLessThan(5000); // 平均响应时间小于 5 秒
  });

  // 服务器健康状态监控测试
  test('服务器健康状态检查', async ({ page, request }) => {
    const response = await request.get('/health');
    
    expect(response.status()).toBe(200);
    const healthData = await response.json();
    expect(healthData.status).toBe('healthy');
    expect(healthData.timestamp).toBeDefined();
  });

  // 数据库连接监控测试
  test('数据库连接监控', async ({ page, request }) => {
    const response = await request.get('/api/db-status');
    
    expect(response.status()).toBe(200);
    const dbStatus = await response.json();
    expect(dbStatus.connected).toBeTruthy();
    expect(dbStatus.pingTime).toBeLessThan(1000);
  });

  // 告警阈值测试
  test('告警阈值触发监控', async ({ page }) => {
    // 模拟超过阈值的情况
    await page.addInitScript(() => {
      // 模拟长时间运行的任务
      setTimeout(() => {
        console.log('ALERT_TRIGGERED: High response time detected');
      }, 6000);
    });

    await page.goto('/');
    await page.waitForTimeout(7000);

    // 验证告警被触发
    await expect(page.locator('[data-testid="high-response-alert"]')).toBeVisible({ timeout: 10000 });
  });
});
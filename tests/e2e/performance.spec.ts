import { test, expect } from '@playwright/test';

// 性能 E2E 测试
test.describe('Performance Tests', () => {
  // 页面加载性能测试
  test('首页加载时间测试', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // 验证页面加载时间不超过 3 秒
    expect(loadTime).toBeLessThan(3000);
    
    // 验证关键元素加载
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="mood-entry-form"]')).toBeVisible();
  });

  test('心情打卡页面加载性能', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/mood');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2500);
    await expect(page.locator('[data-testid="mood-calendar"]')).toBeVisible();
  });

  test('心情统计页面加载性能', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/stats');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
    await expect(page.locator('[data-testid="mood-chart"]')).toBeVisible();
  });

  // 表单提交响应时间测试
  test('心情打卡表单提交响应时间', async ({ page }) => {
    await page.goto('/mood');
    
    const startTime = Date.now();
    await page.locator('[data-testid="mood-rating"]').nth(0).click(); // 选择心情
    await page.locator('[data-testid="submit-btn"]').click(); // 提交
    
    // 等待成功反馈出现
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible({ timeout: 5000 });
    const responseTime = Date.now() - startTime;
    
    expect(responseTime).toBeLessThan(5000); // 响应时间不超过 5 秒
  });

  // 数据加载性能测试
  test('历史数据加载性能', async ({ page }) => {
    await page.goto('/history');
    
    const startTime = Date.now();
    await page.waitForSelector('[data-testid="history-list"]');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(4000);
  });

  // 图表渲染性能测试
  test('图表渲染性能', async ({ page }) => {
    await page.goto('/stats');
    
    const startTime = Date.now();
    await expect(page.locator('[data-testid="mood-chart"]')).toBeVisible({ timeout: 10000 });
    const renderTime = Date.now() - startTime;
    
    expect(renderTime).toBeLessThan(8000);
  });

  // API 请求性能测试
  test('API 请求响应时间', async ({ page, request }) => {
    const startTime = Date.now();
    const response = await request.get('/api/moods');
    const apiTime = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    expect(apiTime).toBeLessThan(2000);
  });

  // 用户认证性能测试
  test('用户登录性能', async ({ page }) => {
    await page.goto('/login');
    
    const startTime = Date.now();
    await page.locator('#username').fill('testuser');
    await page.locator('#password').fill('password');
    await page.locator('[data-testid="login-btn"]').click();
    
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible({ timeout: 10000 });
    const loginTime = Date.now() - startTime;
    
    expect(loginTime).toBeLessThan(6000);
  });

  // 页面切换性能测试
  test('页面间导航性能', async ({ page }) => {
    await page.goto('/');
    
    const startTime = Date.now();
    await page.click('text=心情统计');
    await expect(page.locator('[data-testid="mood-chart"]')).toBeVisible({ timeout: 5000 });
    const navTime = Date.now() - startTime;
    
    expect(navTime).toBeLessThan(3000);
  });

  // 批量数据操作性能
  test('批量心情数据加载性能', async ({ page }) => {
    await page.goto('/history');
    
    // 模拟大量数据加载
    const startTime = Date.now();
    await page.evaluate(() => {
      // 模拟加载更多数据
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    await expect(page.locator('[data-testid="more-data-loaded"]')).toBeVisible({ timeout: 8000 });
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(8000);
  });
});
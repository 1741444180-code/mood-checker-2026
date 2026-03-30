import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('性能：首页加载时间', async ({ page }) => {
  const startTime = Date.now();
  await page.goto(BASE_URL);
  const loadTime = Date.now() - startTime;
  console.log(`首页加载时间：${loadTime}ms`);
  expect(loadTime).toBeLessThan(3000); // 小于 3 秒
  console.log('✅ 首页加载时间测试通过');
});

test('性能：登录页加载时间', async ({ page }) => {
  const startTime = Date.now();
  await page.goto(`${BASE_URL}/auth/login`);
  const loadTime = Date.now() - startTime;
  console.log(`登录页加载时间：${loadTime}ms`);
  expect(loadTime).toBeLessThan(3000);
  console.log('✅ 登录页加载时间测试通过');
});

test('性能：统计页加载时间', async ({ page }) => {
  const startTime = Date.now();
  await page.goto(`${BASE_URL}/stats`);
  const loadTime = Date.now() - startTime;
  console.log(`统计页加载时间：${loadTime}ms`);
  expect(loadTime).toBeLessThan(3000);
  console.log('✅ 统计页加载时间测试通过');
});

test('性能：API 响应时间', async ({ request }) => {
  const startTime = Date.now();
  const response = await request.get(`${BASE_URL}/api/moods?userId=1`);
  const responseTime = Date.now() - startTime;
  console.log(`API 响应时间：${responseTime}ms`);
  expect(responseTime).toBeLessThan(1000); // 小于 1 秒
  expect(response.ok()).toBeTruthy();
  console.log('✅ API 响应时间测试通过');
});

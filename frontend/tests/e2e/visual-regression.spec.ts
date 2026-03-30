import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('视觉回归：首页截图', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.waitForTimeout(2000);
  await expect(page).toHaveScreenshot('homepage.png');
  console.log('✅ 首页截图完成');
});

test('视觉回归：登录页截图', async ({ page }) => {
  await page.goto(`${BASE_URL}/auth/login`);
  await page.waitForTimeout(2000);
  await expect(page).toHaveScreenshot('login-page.png');
  console.log('✅ 登录页截图完成');
});

test('视觉回归：注册页截图', async ({ page }) => {
  await page.goto(`${BASE_URL}/auth/register`);
  await page.waitForTimeout(2000);
  await expect(page).toHaveScreenshot('register-page.png');
  console.log('✅ 注册页截图完成');
});

test('视觉回归：统计页截图', async ({ page }) => {
  await page.goto(`${BASE_URL}/stats`);
  await page.waitForTimeout(2000);
  await expect(page).toHaveScreenshot('stats-page.png');
  console.log('✅ 统计页截图完成');
});

test('视觉回归：日历页截图', async ({ page }) => {
  await page.goto(`${BASE_URL}/calendar`);
  await page.waitForTimeout(2000);
  await expect(page).toHaveScreenshot('calendar-page.png');
  console.log('✅ 日历页截图完成');
});

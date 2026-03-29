import { test, expect } from '@playwright/test';

test.describe('心情打卡网站 - 核心功能E2E测试', () => {
  test('用户注册和登录流程测试', async ({ page }) => {
    // 访问注册页面
    await page.goto('/register');
    
    // 填写注册信息
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test123456!');
    await page.click('button[type="submit"]');
    
    // 验证注册成功并自动登录
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=今日打卡')).toBeVisible();
    
    // 退出登录
    await page.click('text=退出登录');
    await expect(page.locator('text=登录')).toBeVisible();
  });

  test('心情打卡功能测试（预设心情）', async ({ page }) => {
    // 先登录
    await page.goto('/login');
    await page.fill('input[name="identifier"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test123456!');
    await page.click('button[type="submit"]');
    
    // 等待跳转到首页
    await expect(page).toHaveURL('/');
    
    // 进行心情打卡
    await page.click('text=😄 开心');
    await page.fill('textarea[name="note"]', '今天心情不错！');
    await page.click('text=生活');
    await page.click('button:text("提交打卡")');
    
    // 验证打卡成功
    await expect(page.locator('text=打卡成功')).toBeVisible();
  });

  test('心情打卡功能测试（自定义心情）', async ({ page }) => {
    // 先登录
    await page.goto('/login');
    await page.fill('input[name="identifier"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test123456!');
    await page.click('button[type="submit"]');
    
    // 等待跳转到首页
    await expect(page).toHaveURL('/');
    
    // 点击自定义心情按钮
    await page.click('text=➕');
    
    // 验证弹窗出现
    await expect(page.locator('.custom-mood-modal')).toBeVisible();
    
    // 在实际测试中，这里会进行自定义心情的创建和使用
    // 由于当前主要是测试布局和功能，这里只是验证流程
    await page.click('button:text("取消")'); // 关闭弹窗
    
    // 验证弹窗关闭
    await expect(page.locator('.custom-mood-modal')).not.toBeVisible();
  });

  test('心情选择器布局测试（4×2布局）', async ({ page }) => {
    // 登录
    await page.goto('/login');
    await page.fill('input[name="identifier"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test123456!');
    await page.click('button[type="submit"]');
    
    // 等待跳转到首页
    await expect(page).toHaveURL('/');
    
    // 验证心情选择器4×2布局
    const moodSelector = page.locator('.mood-selector');
    await expect(moodSelector).toBeVisible();
    
    // 检查前7个预设心情按钮是否可见
    const predefinedMoods = ['😄', '😊', '😔', '😠', '😰', '😴', '🤩'];
    for (let i = 0; i < predefinedMoods.length; i++) {
      await expect(page.locator(`text=${predefinedMoods[i]}`)).toBeVisible();
    }
    
    // 检查自定义心情加号按钮是否存在
    await expect(page.locator('text=➕')).toBeVisible();
    
    // 验证布局总数（7个预设心情 + 1个自定义按钮 = 8个按钮）
    const moodButtons = page.locator('.mood-option');
    await expect(moodButtons).toHaveCount(8);
  });

  test('心情日历功能测试', async ({ page }) => {
    // 登录
    await page.goto('/login');
    await page.fill('input[name="identifier"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test123456!');
    await page.click('button[type="submit"]');
    
    // 进入日历页面
    await page.goto('/calendar');
    
    // 验证日历页面加载
    await expect(page.locator('text=心情日历')).toBeVisible();
    await expect(page.locator('.mood-calendar')).toBeVisible();
    
    // 验证当月打卡率显示
    await expect(page.locator('text=打卡率')).toBeVisible();
  });
});
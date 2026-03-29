import { test, expect } from '@playwright/test';

test.describe('个人中心页面测试', () => {
  test.beforeEach(async ({ page }) => {
    // 在每个测试前登录并导航到个人中心页面
    await page.goto('/login');
    
    // 模拟登录过程（使用测试账户）
    await page.locator('[data-testid="username"]').fill('testuser');
    await page.locator('[data-testid="password"]').fill('testpass');
    await page.locator('button[type="submit"]').click();
    
    // 等待登录完成并跳转到个人中心
    await page.waitForURL('/profile');
  });

  test('用户信息展示验证', async ({ page }) => {
    // 验证用户头像是否显示
    const avatar = page.locator('[data-testid="user-avatar"]');
    await expect(avatar).toBeVisible();
    
    // 验证用户名是否正确显示
    const usernameElement = page.locator('[data-testid="username-display"]');
    await expect(usernameElement).toContainText('testuser');
    
    // 验证用户邮箱是否正确显示
    const emailElement = page.locator('[data-testid="email-display"]');
    await expect(emailElement).toContainText('@example.com');
    
    // 验证其他用户信息字段
    const userInfoFields = ['昵称', '性别', '生日', '简介'];
    for (const field of userInfoFields) {
      const fieldElement = page.locator(`[data-testid="${field.toLowerCase()}-display"]`);
      await expect(fieldElement).toBeVisible();
    }
  });

  test('打卡统计数据显示验证', async ({ page }) => {
    // 验证连续打卡天数是否显示
    const consecutiveDaysElement = page.locator('[data-testid="consecutive-days"]');
    await expect(consecutiveDaysElement).toBeVisible();
    await expect(consecutiveDaysElement).not.toHaveText('0');
    
    // 验证总打卡次数是否显示
    const totalCheckinsElement = page.locator('[data-testid="total-checkins"]');
    await expect(totalCheckinsElement).toBeVisible();
    await expect(totalCheckinsElement).not.toHaveText('0');
    
    // 验证打卡历史图表是否显示
    const chartElement = page.locator('[data-testid="checkin-chart"]');
    await expect(chartElement).toBeVisible();
    
    // 验证打卡统计详情
    const statsElements = [
      '[data-testid="monthly-stats"]',
      '[data-testid="weekly-stats"]',
      '[data-testid="yearly-stats"]'
    ];
    
    for (const selector of statsElements) {
      const element = page.locator(selector);
      await expect(element).toBeVisible();
    }
  });

  test('响应式布局测试 - 桌面视图', async ({ page }) => {
    // 设置桌面分辨率
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // 验证各元素在桌面视图下的布局
    const profileContainer = page.locator('[data-testid="profile-container"]');
    await expect(profileContainer).toBeVisible();
    
    // 验证用户信息区域布局
    const userInfoSection = page.locator('[data-testid="user-info-section"]');
    await expect(userInfoSection).toBeVisible();
    
    // 验证统计信息区域布局
    const statsSection = page.locator('[data-testid="stats-section"]');
    await expect(statsSection).toBeVisible();
    
    // 验证所有按钮都可见且可点击
    const buttons = [
      '[data-testid="edit-profile-btn"]',
      '[data-testid="settings-btn"]',
      '[data-testid="logout-btn"]'
    ];
    
    for (const button of buttons) {
      const btnElement = page.locator(button);
      await expect(btnElement).toBeVisible();
      await expect(btnElement).toBeEnabled();
    }
  });

  test('响应式布局测试 - 平板视图', async ({ page }) => {
    // 设置平板分辨率
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // 验证各元素在平板视图下的布局
    const profileContainer = page.locator('[data-testid="profile-container"]');
    await expect(profileContainer).toBeVisible();
    
    // 验证用户信息区域适配
    const userInfoSection = page.locator('[data-testid="user-info-section"]');
    await expect(userInfoSection).toBeVisible();
    
    // 验证统计信息区域适配
    const statsSection = page.locator('[data-testid="stats-section"]');
    await expect(statsSection).toBeVisible();
    
    // 验证导航栏适配
    const navBar = page.locator('[data-testid="nav-bar"]');
    await expect(navBar).toBeVisible();
  });

  test('响应式布局测试 - 移动视图', async ({ page }) => {
    // 设置移动设备分辨率
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 验证各元素在移动视图下的布局
    const profileContainer = page.locator('[data-testid="profile-container"]');
    await expect(profileContainer).toBeVisible();
    
    // 验证用户信息区域适配移动端
    const userInfoSection = page.locator('[data-testid="user-info-section"]');
    await expect(userInfoSection).toBeVisible();
    
    // 验证统计信息区域适配移动端
    const statsSection = page.locator('[data-testid="stats-section"]');
    await expect(statsSection).toBeVisible();
    
    // 验证移动端菜单按钮显示
    const menuButton = page.locator('[data-testid="mobile-menu-btn"]');
    await expect(menuButton).toBeVisible();
  });

  test('个人中心页面加载性能测试', async ({ page }) => {
    const startTime = Date.now();
    
    // 导航到个人中心页面
    await page.goto('/profile');
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // 验证页面加载时间不超过3秒
    expect(loadTime).toBeLessThan(3000);
    
    // 验证关键元素在时间内加载
    await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('[data-testid="consecutive-days"]')).toBeVisible({ timeout: 2000 });
  });

  test('个人中心页面错误处理测试', async ({ page }) => {
    // 模拟网络延迟
    await page.route('**/api/profile*', route => {
      return route.fulfill({
        status: 200,
        body: JSON.stringify({
          user: {
            username: 'testuser',
            email: 'test@example.com',
            avatar: '/images/default-avatar.png',
            nickname: 'Test User',
            consecutive_days: 15,
            total_checkins: 42
          },
          stats: {
            monthly: 12,
            weekly: 3,
            yearly: 156
          }
        })
      });
    });
    
    await page.goto('/profile');
    
    // 验证即使在模拟延迟情况下，页面仍能正确显示数据
    await expect(page.locator('[data-testid="username-display"]')).toContainText('testuser');
    await expect(page.locator('[data-testid="consecutive-days"]')).toContainText('15');
  });
});
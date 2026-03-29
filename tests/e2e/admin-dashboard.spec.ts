import { test, expect } from '@playwright/test';

// 后台管理 E2E 测试
test.describe('Admin Dashboard Tests', () => {
  // 在所有测试之前登录
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'admin');
    await page.fill('[data-testid="password"]', 'admin123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/admin');
  });

  // 测试管理员登录功能
  test('should login successfully as admin', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
    await expect(page.locator('.user-profile')).toContainText('Admin User');
  });

  // 测试后台仪表盘页面加载
  test('should display dashboard overview correctly', async ({ page }) => {
    await expect(page.locator('[data-testid="dashboard-stats"]')).toBeVisible();
    
    // 检查统计数据是否正确显示
    const statsCards = page.locator('.stats-card');
    await expect(statsCards).toHaveCount(4);
    
    // 检查各个统计数据是否存在
    await expect(page.locator('[data-testid="total-users"]')).toBeVisible();
    await expect(page.locator('[data-testid="active-users"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-orders"]')).toBeVisible();
    await expect(page.locator('[data-testid="revenue"]')).toBeVisible();
  });

  // 测试导航菜单功能
  test('should navigate between admin sections', async ({ page }) => {
    // 测试用户管理页面
    await page.click('[data-testid="nav-users"]');
    await expect(page).toHaveURL(/\/admin\/users/);
    await expect(page.locator('h2')).toContainText('User Management');

    // 测试订单管理页面
    await page.click('[data-testid="nav-orders"]');
    await expect(page).toHaveURL(/\/admin\/orders/);
    await expect(page.locator('h2')).toContainText('Order Management');

    // 测试产品管理页面
    await page.click('[data-testid="nav-products"]');
    await expect(page).toHaveURL(/\/admin\/products/);
    await expect(page.locator('h2')).toContainText('Product Management');
  });

  // 测试响应式布局 - 桌面端
  test('should display properly on desktop resolution', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
    
    const sidebar = page.locator('[data-testid="sidebar"]');
    const mainContent = page.locator('[data-testid="main-content"]');
    
    await expect(sidebar).toBeVisible();
    await expect(mainContent).toBeVisible();
  });

  // 测试响应式布局 - 平板端
  test('should display properly on tablet resolution', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // 在平板模式下，侧边栏可能变为汉堡菜单
    const menuButton = page.locator('[data-testid="mobile-menu-toggle"]');
    if (await menuButton.count() > 0) {
      await expect(menuButton).toBeVisible();
    }
    
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
  });

  // 测试响应式布局 - 手机端
  test('should display properly on mobile resolution', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    
    // 在手机模式下，侧边栏应该隐藏或变为汉堡菜单
    const menuButton = page.locator('[data-testid="mobile-menu-toggle"]');
    if (await menuButton.count() > 0) {
      await expect(menuButton).toBeVisible();
    }
    
    // 内容区域应该适应移动屏幕
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
  });

  // 测试管理员登出功能
  test('should logout successfully', async ({ page }) => {
    await page.click('[data-testid="logout-button"]');
    await page.waitForURL('/login');
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  });
});
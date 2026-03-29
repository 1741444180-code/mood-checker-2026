import { test, expect } from '@playwright/test';

// 后台管理端到端测试
test.describe('后台管理测试', () => {
  let adminPage;
  
  // 管理员登录测试
  test.describe('管理员登录测试', () => {
    test('成功登录后台管理系统', async ({ page }) => {
      // 访问登录页面
      await page.goto('/admin/login');
      
      // 输入管理员凭据
      await page.fill('#username', 'admin');
      await page.fill('#password', 'admin123');
      await page.click('button[type="submit"]');
      
      // 验证登录成功
      await expect(page.locator('.dashboard')).toBeVisible();
      await expect(page.locator('text=欢迎回来，管理员')).toBeVisible();
    });
    
    test('使用错误凭据登录失败', async ({ page }) => {
      // 访问登录页面
      await page.goto('/admin/login');
      
      // 输入错误的管理员凭据
      await page.fill('#username', 'invalid_user');
      await page.fill('#password', 'wrong_password');
      await page.click('button[type="submit"]');
      
      // 验证登录失败提示
      await expect(page.locator('text=用户名或密码错误')).toBeVisible();
    });
    
    test('登录表单验证', async ({ page }) => {
      // 访问登录页面
      await page.goto('/admin/login');
      
      // 不输入凭据直接提交
      await page.click('button[type="submit"]');
      
      // 验证必填字段提示
      await expect(page.locator('text=请输入用户名')).toBeVisible();
      await expect(page.locator('text=请输入密码')).toBeVisible();
    });
  });
  
  // 用户管理功能测试
  test.describe('用户管理功能测试', () => {
    test.beforeEach(async ({ page }) => {
      // 登录管理员账户
      await page.goto('/admin/login');
      await page.fill('#username', 'admin');
      await page.fill('#password', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForURL('/admin/dashboard');
    });
    
    test('查看用户列表', async ({ page }) => {
      // 导航到用户管理页面
      await page.click('text=用户管理');
      await page.waitForURL('/admin/users');
      
      // 验证用户列表加载
      await expect(page.locator('.user-list')).toBeVisible();
      const userRows = await page.locator('.user-row').count();
      expect(userRows).toBeGreaterThan(0);
    });
    
    test('搜索用户', async ({ page }) => {
      // 导航到用户管理页面
      await page.click('text=用户管理');
      await page.waitForURL('/admin/users');
      
      // 在搜索框中输入用户名
      await page.fill('#user-search', 'testuser');
      await page.click('button.search-btn');
      
      // 验证搜索结果
      await expect(page.locator('.user-row')).toHaveCount(1);
      await expect(page.locator('.user-row .username').first()).toContainText('testuser');
    });
    
    test('编辑用户信息', async ({ page }) => {
      // 导航到用户管理页面
      await page.click('text=用户管理');
      await page.waitForURL('/admin/users');
      
      // 点击编辑按钮
      await page.locator('.edit-user-btn').first().click();
      
      // 修改用户信息
      await page.fill('#user-email', 'updated@example.com');
      await page.click('button.save-btn');
      
      // 验证保存成功
      await expect(page.locator('text=用户信息更新成功')).toBeVisible();
    });
    
    test('删除用户', async ({ page }) => {
      // 导航到用户管理页面
      await page.click('text=用户管理');
      await page.waitForURL('/admin/users');
      
      // 获取当前用户数量
      const initialCount = await page.locator('.user-row').count();
      
      // 点击删除按钮
      await page.locator('.delete-user-btn').first().click();
      await page.locator('button:has-text("确认")').click();
      
      // 验证删除成功
      const updatedCount = await page.locator('.user-row').count();
      expect(updatedCount).toBe(initialCount - 1);
    });
  });
  
  // 内容审核功能测试
  test.describe('内容审核功能测试', () => {
    test.beforeEach(async ({ page }) => {
      // 登录管理员账户
      await page.goto('/admin/login');
      await page.fill('#username', 'admin');
      await page.fill('#password', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForURL('/admin/dashboard');
    });
    
    test('查看待审核内容', async ({ page }) => {
      // 导航到内容审核页面
      await page.click('text=内容审核');
      await page.waitForURL('/admin/content-review');
      
      // 验证待审核内容列表加载
      await expect(page.locator('.pending-content')).toBeVisible();
      const pendingItems = await page.locator('.content-item').count();
      expect(pendingItems).toBeGreaterThan(0);
    });
    
    test('通过内容审核', async ({ page }) => {
      // 导航到内容审核页面
      await page.click('text=内容审核');
      await page.waitForURL('/admin/content-review');
      
      // 选择第一个待审核内容并点击通过
      await page.locator('.approve-btn').first().click();
      await page.locator('button:has-text("确认通过")').click();
      
      // 验证审核通过成功
      await expect(page.locator('text=内容已通过审核')).toBeVisible();
    });
    
    test('拒绝内容审核', async ({ page }) => {
      // 导航到内容审核页面
      await page.click('text=内容审核');
      await page.waitForURL('/admin/content-review');
      
      // 选择第一个待审核内容并点击拒绝
      await page.locator('.reject-btn').first().click();
      await page.locator('button:has-text("确认拒绝")').click();
      
      // 验证审核拒绝成功
      await expect(page.locator('text=内容已被拒绝')).toBeVisible();
    });
    
    test('批量审核内容', async ({ page }) => {
      // 导航到内容审核页面
      await page.click('text=内容审核');
      await page.waitForURL('/admin/content-review');
      
      // 选择多个内容项
      await page.locator('.content-checkbox').first().click();
      await page.locator('.content-checkbox').nth(1).click();
      
      // 批量通过
      await page.click('button.batch-approve');
      await page.locator('button:has-text("确认")').click();
      
      // 验证批量操作成功
      await expect(page.locator('text=批量审核操作完成')).toBeVisible();
    });
  });
  
  // 权限控制测试
  test.describe('权限控制测试', () => {
    test.beforeEach(async ({ page }) => {
      // 登录管理员账户
      await page.goto('/admin/login');
      await page.fill('#username', 'admin');
      await page.fill('#password', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForURL('/admin/dashboard');
    });
    
    test('管理员访问所有功能模块', async ({ page }) => {
      // 验证管理员可以访问所有菜单项
      await expect(page.locator('text=用户管理')).toBeVisible();
      await expect(page.locator('text=内容审核')).toBeVisible();
      await expect(page.locator('text=系统设置')).toBeVisible();
      await expect(page.locator('text=数据统计')).toBeVisible();
    });
    
    test('普通用户无法访问管理员功能', async ({ page }) => {
      // 登录普通用户账户
      await page.goto('/admin/login');
      await page.fill('#username', 'normal_user');
      await page.fill('#password', 'user_pass');
      await page.click('button[type="submit"]');
      await page.waitForURL('/admin/dashboard');
      
      // 验证某些管理员功能不可见
      await expect(page.locator('text=系统设置')).not.toBeVisible();
    });
    
    test('权限分配功能', async ({ page }) => {
      // 导航到权限管理页面
      await page.click('text=权限管理');
      await page.waitForURL('/admin/permissions');
      
      // 修改用户权限
      await page.locator('input.permission-checkbox[data-user-id="123"]').click();
      await page.click('button.save-permissions');
      
      // 验证权限更新成功
      await expect(page.locator('text=权限已更新')).toBeVisible();
    });
  });
  
  // 数据统计准确性测试
  test.describe('数据统计准确性测试', () => {
    test.beforeEach(async ({ page }) => {
      // 登录管理员账户
      await page.goto('/admin/login');
      await page.fill('#username', 'admin');
      await page.fill('#password', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForURL('/admin/dashboard');
    });
    
    test('验证用户总数统计', async ({ page }) => {
      // 导航到数据统计页面
      await page.click('text=数据统计');
      await page.waitForURL('/admin/statistics');
      
      // 获取仪表板上的用户总数
      const dashboardUserCount = await page.locator('#total-users').textContent();
      
      // 导航到用户管理页面验证实际用户数
      await page.click('text=用户管理');
      await page.waitForURL('/admin/users');
      const actualUserCount = await page.locator('.user-row').count();
      
      // 验证统计数字一致
      expect(parseInt(dashboardUserCount)).toBe(actualUserCount);
    });
    
    test('验证内容审核统计数据', async ({ page }) => {
      // 导航到数据统计页面
      await page.click('text=数据统计');
      await page.waitForURL('/admin/statistics');
      
      // 获取待审核内容数
      const pendingCountElement = page.locator('#pending-content-count');
      await expect(pendingCountElement).toBeVisible();
      const pendingCount = await pendingCountElement.textContent();
      
      // 导航到内容审核页面验证实际待审核数
      await page.click('text=内容审核');
      await page.waitForURL('/admin/content-review');
      const actualPendingCount = await page.locator('.pending-content .content-item').count();
      
      // 验证统计数字一致
      expect(parseInt(pendingCount)).toBe(actualPendingCount);
    });
    
    test('验证日活跃用户统计', async ({ page }) => {
      // 导航到数据统计页面
      await page.click('text=数据统计');
      await page.waitForURL('/admin/statistics');
      
      // 验证今日活跃用户数显示
      const todayActiveUsers = await page.locator('#today-active-users').textContent();
      expect(parseInt(todayActiveUsers)).toBeGreaterThanOrEqual(0);
    });
    
    test('验证统计图表加载', async ({ page }) => {
      // 导航到数据统计页面
      await page.click('text=数据统计');
      await page.waitForURL('/admin/statistics');
      
      // 验证各种统计图表加载
      await expect(page.locator('.user-growth-chart')).toBeVisible();
      await expect(page.locator('.content-stats-chart')).toBeVisible();
      await expect(page.locator('.revenue-chart')).toBeVisible();
    });
  });
});
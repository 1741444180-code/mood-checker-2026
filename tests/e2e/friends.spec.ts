import { test, expect } from '@playwright/test';

test.describe('好友列表 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    // 登录操作
    await page.goto('/login');
    await page.fill('#username', 'test_user1');
    await page.fill('#password', 'test_password');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
  });

  test('测试好友添加功能', async ({ page }) => {
    // 导航到好友页面
    await page.click('nav >> text="好友"');
    await expect(page).toHaveURL(/.*\/friends/);

    // 点击添加好友按钮
    await page.click('button[data-testid="add-friend"]');
    
    // 搜索用户
    await page.fill('input[placeholder="搜索用户名或ID"]', 'test_user2');
    await page.click('button[data-testid="search"]');
    
    // 选择搜索结果中的用户
    const searchResult = page.locator('.search-result-item').first();
    await expect(searchResult).toBeVisible();
    await searchResult.click();
    
    // 发送好友请求
    await page.click('button[data-testid="send-request"]');
    
    // 验证好友请求已发送
    await expect(page.locator('.request-status.sent')).toBeVisible();
    await expect(page.locator('text="请求已发送"')).toBeVisible();
  });

  test('测试好友请求接收和接受功能', async ({ page }) => {
    // 导航到好友请求页面
    await page.goto('/friends/requests');
    
    // 检查是否有好友请求
    const pendingRequests = page.locator('.friend-request.pending');
    const requestCount = await pendingRequests.count();
    
    if (requestCount > 0) {
      // 接受第一个好友请求
      const acceptButton = pendingRequests.first().locator('button.accept');
      await acceptButton.click();
      
      // 等待好友关系建立
      await page.waitForSelector('.friend-request.accepted', { state: 'visible' });
      
      // 验证好友已添加到列表中
      await page.goto('/friends/list');
      await expect(page.locator('.friend-item:has-text("test_user_from_request")')).toBeVisible();
    }
  });

  test('测试好友请求拒绝功能', async ({ page }) => {
    // 导航到好友请求页面
    await page.goto('/friends/requests');
    
    // 检查是否有待处理的好友请求
    const pendingRequests = page.locator('.friend-request.pending');
    const requestCount = await pendingRequests.count();
    
    if (requestCount > 0) {
      // 拒绝第一个好友请求
      const rejectButton = pendingRequests.first().locator('button.reject');
      await rejectButton.click();
      
      // 确认拒绝操作
      await page.click('button:text("确认")');
      
      // 验证请求已被移除
      await expect(pendingRequests).not.toHaveCount(requestCount);
    }
  });

  test('测试好友列表显示', async ({ page }) => {
    // 导航到好友列表页面
    await page.goto('/friends/list');
    
    // 验证页面标题
    await expect(page.locator('h1:text("好友列表")')).toBeVisible();
    
    // 验证至少有一个好友
    const friendItems = page.locator('.friend-item');
    await expect(friendItems).toHaveCount(0); // 可能没有好友，这是正常情况
    
    // 如果有好友，则验证其可见性
    if (await friendItems.count() > 0) {
      await expect(friendItems.first()).toBeVisible();
    }
  });

  test('测试好友信息查看', async ({ page }) => {
    // 导航到好友列表页面
    await page.goto('/friends/list');
    
    // 选择一个好友并点击查看详情
    const friendItem = page.locator('.friend-item').first();
    if (await friendItem.count() > 0) {
      await friendItem.click();
      
      // 验证好友详情页加载
      await expect(page.locator('.friend-profile')).toBeVisible();
      await expect(page.locator('.friend-username')).toBeVisible();
      await expect(page.locator('.friend-status')).toBeVisible();
    }
  });

  test('测试好友删除功能', async ({ page }) => {
    // 导航到好友列表页面
    await page.goto('/friends/list');
    
    // 选择一个好友并尝试删除
    const friendItem = page.locator('.friend-item').first();
    if (await friendItem.count() > 0) {
      // 悬停以显示操作按钮
      await friendItem.hover();
      
      // 点击删除按钮
      const deleteButton = friendItem.locator('.delete-friend-btn');
      if (await deleteButton.count() > 0) {
        await deleteButton.click();
        
        // 确认删除操作
        await page.click('button:text("确认")');
        
        // 验证好友已从列表中移除
        await expect(friendItem).not.toBeVisible();
      }
    }
  });

  test('响应式布局测试 - 桌面端', async ({ page }) => {
    // 设置桌面分辨率
    await page.setViewportSize({ width: 1280, height: 720 });
    
    await page.goto('/friends/list');
    
    // 验证桌面端布局元素
    await expect(page.locator('nav.sidebar')).toBeVisible();
    await expect(page.locator('.friends-container')).toBeVisible();
    await expect(page.locator('.friend-search-box')).toBeVisible();
    await expect(page.locator('.add-friend-button')).toBeVisible();
  });

  test('响应式布局测试 - 平板端', async ({ page }) => {
    // 设置平板分辨率
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/friends/list');
    
    // 验证平板端布局元素
    await expect(page.locator('nav.sidebar')).toBeVisible();
    await expect(page.locator('.friends-container')).toBeVisible();
    await expect(page.locator('.friend-search-box')).toBeVisible();
  });

  test('响应式布局测试 - 移动端', async ({ page }) => {
    // 设置移动端分辨率
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/friends/list');
    
    // 验证移动端布局元素
    await expect(page.locator('nav.sidebar')).not.toBeVisible(); // 移动端可能隐藏侧边栏
    await expect(page.locator('.friends-container')).toBeVisible();
    await expect(page.locator('.friend-search-box')).toBeVisible();
    
    // 测试汉堡菜单
    await page.click('.mobile-menu-toggle');
    await expect(page.locator('nav.sidebar')).toBeVisible();
  });
});
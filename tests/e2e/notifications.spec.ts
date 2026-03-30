import { test, expect } from '@playwright/test';

test.describe('通知页面 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    // 假设用户已经登录，跳转到通知页面
    await page.goto('/notifications');
  });

  test('通知页面基本功能测试', async ({ page }) => {
    // 测试通知页面是否正确加载
    await expect(page).toHaveTitle(/通知/);
    await expect(page.locator('h1')).toContainText('通知中心');
    
    // 检查通知列表是否存在
    const notificationList = page.locator('[data-testid="notification-list"]');
    await expect(notificationList).toBeVisible();
  });

  test('未读/已读标记功能测试', async ({ page }) => {
    // 创建一些测试通知
    const unreadNotifications = page.locator('.notification.unread');
    const readNotifications = page.locator('.notification.read');
    
    // 检查初始状态 - 应该有一些未读通知
    await expect(unreadNotifications).toHaveCount(3); // 假设有3个未读通知
    
    // 点击第一个未读通知，将其标记为已读
    const firstUnreadNotification = unreadNotifications.first();
    await firstUnreadNotification.click();
    
    // 验证点击后未读通知数量减少
    await expect(unreadNotifications).toHaveCount(2);
    await expect(readNotifications).toHaveCount(1);
    
    // 测试标记所有为已读功能
    const markAllAsReadButton = page.locator('button[data-action="mark-all-read"]');
    await markAllAsReadButton.click();
    
    // 验证所有通知都变为已读
    await expect(unreadNotifications).toHaveCount(0);
    await expect(readNotifications).toHaveCount(3);
  });

  test('WebSocket 实时推送测试', async ({ page }) => {
    // 模拟WebSocket连接
    await page.addInitScript(() => {
      // 模拟WebSocket连接
      Object.defineProperty(window, 'WebSocket', {
        writable: true,
        value: class MockWebSocket {
          constructor(url) {
            this.url = url;
            this.readyState = WebSocket.OPEN;
          }
          
          send(data) {
            console.log('Mock WebSocket send:', data);
          }
          
          close() {
            console.log('Mock WebSocket closed');
          }
        }
      });
    });
    
    // 检查WebSocket连接状态
    const wsStatus = page.locator('#websocket-status');
    await expect(wsStatus).toContainText('已连接');
    
    // 模拟接收新通知
    await page.evaluate(() => {
      // 触发一个模拟的通知事件
      window.dispatchEvent(new CustomEvent('mockNotification', {
        detail: {
          id: 'mock-notification-1',
          title: '模拟实时通知',
          content: '这是一条通过WebSocket接收到的实时通知',
          timestamp: new Date().toISOString(),
          isUnread: true
        }
      }));
    });
    
    // 验证实时通知是否显示
    const mockNotification = page.locator('[data-notification-id="mock-notification-1"]');
    await expect(mockNotification).toBeVisible();
    await expect(mockNotification).toContainText('模拟实时通知');
  });

  test('响应式布局测试 - 桌面端', async ({ page }) => {
    // 设置桌面端视口
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // 检查桌面端布局元素
    const header = page.locator('header');
    const sidebar = page.locator('aside');
    const mainContent = page.locator('main');
    
    await expect(header).toBeVisible();
    await expect(sidebar).toBeVisible();
    await expect(mainContent).toBeVisible();
    
    // 验证布局方向
    const layoutClass = await mainContent.getAttribute('class');
    expect(layoutClass).not.toContain('mobile-layout');
  });

  test('响应式布局测试 - 移动端', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 检查移动端布局
    const mobileMenuButton = page.locator('button[data-mobile-menu]');
    await expect(mobileMenuButton).toBeVisible();
    
    // 检查侧边栏是否隐藏或转换为汉堡菜单
    const sidebar = page.locator('aside');
    const mobileSidebar = page.locator('[data-mobile-sidebar]');
    
    // 在移动端，原侧边栏可能不可见，但有移动版替代
    if (await sidebar.isVisible()) {
      expect(await sidebar.boundingBox()).toBeFalsy();
    }
    
    // 检查通知列表在移动端是否适配
    const notificationList = page.locator('[data-testid="notification-list"]');
    await expect(notificationList).toBeVisible();
    
    // 验证移动端特定样式
    const layoutClass = await notificationList.getAttribute('class');
    expect(layoutClass).toContain('mobile-layout') || expect(layoutClass).toContain('responsive');
  });

  test('通知过滤功能测试', async ({ page }) => {
    // 测试通知类型过滤
    const allFilter = page.locator('button[data-filter="all"]');
    const unreadFilter = page.locator('button[data-filter="unread"]');
    const readFilter = page.locator('button[data-filter="read"]');
    
    await allFilter.click();
    // 验证显示所有通知
    const allNotifications = page.locator('.notification');
    await expect(allNotifications).toHaveCount(5); // 假设有5个总通知
    
    await unreadFilter.click();
    // 验证只显示未读通知
    const unreadNotifications = page.locator('.notification.unread');
    await expect(unreadNotifications).toHaveCount(2);
    
    await readFilter.click();
    // 验证只显示已读通知
    const readNotifications = page.locator('.notification.read');
    await expect(readNotifications).toHaveCount(3);
  });

  test('通知删除功能测试', async ({ page }) => {
    // 获取初始通知数量
    const initialCount = await page.locator('.notification').count();
    
    // 找到第一个通知的删除按钮并点击
    const firstNotification = page.locator('.notification').first();
    const deleteButton = firstNotification.locator('button[data-action="delete"]');
    await deleteButton.click();
    
    // 确认删除操作（如果有确认对话框）
    const confirmDialog = page.locator('[data-testid="confirm-dialog"]');
    if (await confirmDialog.isVisible()) {
      const confirmButton = confirmDialog.locator('button[type="confirm"]');
      await confirmButton.click();
    }
    
    // 验证通知数量减少
    await expect(page.locator('.notification')).toHaveCount(initialCount - 1);
  });

  test('通知分页功能测试', async ({ page }) => {
    // 假设有多个页面的通知
    const nextPageButton = page.locator('button[data-pagination="next"]');
    const prevPageButton = page.locator('button[data-pagination="prev"]');
    const pageNumberIndicator = page.locator('[data-testid="page-number"]');
    
    // 检查当前页码
    await expect(pageNumberIndicator).toContainText('1');
    
    // 点击下一页
    if (await nextPageButton.isEnabled()) {
      await nextPageButton.click();
      await expect(pageNumberIndicator).toContainText('2');
    }
    
    // 点击上一页
    if (await prevPageButton.isEnabled()) {
      await prevPageButton.click();
      await expect(pageNumberIndicator).toContainText('1');
    }
  });
});
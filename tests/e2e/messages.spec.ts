import { test, expect } from '@playwright/test';

test.describe('消息中心 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    // 登录操作 - 假设已有登录页面
    await page.goto('/login');
    await page.fill('#username', 'test_user1');
    await page.fill('#password', 'test_password');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
  });

  test('测试消息发送功能', async ({ page }) => {
    // 导航到消息中心
    await page.click('nav >> text="消息"');
    await expect(page).toHaveURL(/.*\/messages/);

    // 点击发送新消息按钮
    await page.click('button[data-testid="send-new-message"]');
    
    // 选择收件人
    await page.fill('input[placeholder="搜索联系人"]', 'test_user2');
    await page.click('text="test_user2"');
    
    // 输入消息内容
    await page.fill('textarea[data-testid="message-input"]', '这是一条测试消息');
    
    // 发送消息
    await page.click('button[data-testid="send-message"]');
    
    // 验证消息是否成功发送
    await expect(page.locator('.message-item').last()).toContainText('这是一条测试消息');
    await expect(page.locator('.message-status.sent')).toBeVisible();
  });

  test('测试消息接收功能', async ({ page }) => {
    // 导航到消息中心
    await page.goto('/messages');
    
    // 检查是否有未读消息
    const unreadMessages = page.locator('.unread-indicator');
    await expect(unreadMessages).toHaveCount(0); // 或者根据实际情况调整
    
    // 如果有消息，验证消息内容
    const messages = page.locator('.message-item');
    await expect(messages).toHaveCount(0); // 或者根据实际情况调整
    
    // 模拟收到新消息后检查
    // 这里可能需要模拟服务器推送或者刷新页面
    await page.reload();
    // 重新检查消息数量
  });

  test('测试消息已读功能', async ({ page }) => {
    // 导航到消息中心
    await page.goto('/messages');
    
    // 获取一个未读消息
    const unreadMessage = page.locator('.message-item.unread').first();
    if (await unreadMessage.count() > 0) {
      await unreadMessage.click();
      
      // 等待消息状态变为已读
      await page.waitForSelector('.message-item.read', { state: 'visible' });
      
      // 验证消息标记为已读
      await expect(unreadMessage).not.toHaveClass(/unread/);
    }
  });

  test('测试消息删除功能', async ({ page }) => {
    // 导航到消息中心
    await page.goto('/messages');
    
    // 获取一条消息
    const messageItem = page.locator('.message-item').first();
    if (await messageItem.count() > 0) {
      // 点击删除按钮
      await messageItem.hover();
      await page.click('.delete-button');
      
      // 确认删除
      await page.click('button:text("确认")');
      
      // 验证消息已被删除
      await expect(messageItem).not.toBeVisible();
    }
  });

  test('响应式布局测试 - 桌面端', async ({ page }) => {
    // 设置桌面分辨率
    await page.setViewportSize({ width: 1280, height: 720 });
    
    await page.goto('/messages');
    
    // 验证桌面端布局元素
    await expect(page.locator('nav.sidebar')).toBeVisible();
    await expect(page.locator('.message-list')).toBeVisible();
    await expect(page.locator('.message-compose')).toBeVisible();
  });

  test('响应式布局测试 - 平板端', async ({ page }) => {
    // 设置平板分辨率
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/messages');
    
    // 验证平板端布局元素
    await expect(page.locator('nav.sidebar')).toBeVisible();
    await expect(page.locator('.message-list')).toBeVisible();
    await expect(page.locator('.message-compose')).toBeVisible();
  });

  test('响应式布局测试 - 移动端', async ({ page }) => {
    // 设置移动端分辨率
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/messages');
    
    // 验证移动端布局元素
    await expect(page.locator('nav.sidebar')).not.toBeVisible(); // 移动端可能隐藏侧边栏
    await expect(page.locator('.message-list')).toBeVisible();
    await expect(page.locator('.message-compose')).toBeVisible();
    
    // 测试汉堡菜单
    await page.click('.mobile-menu-toggle');
    await expect(page.locator('nav.sidebar')).toBeVisible();
  });
});
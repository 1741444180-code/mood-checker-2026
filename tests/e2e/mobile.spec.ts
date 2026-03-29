import { test, expect } from '@playwright/test';

// 移动端E2E测试 - 鱼虾蟹游戏
test.describe('移动端测试 - 鱼虾蟹游戏', () => {
  // 模拟不同移动设备进行测试
  const devices = [
    { name: 'iPhone 12', viewport: { width: 390, height: 844 } },
    { name: 'Pixel 5', viewport: { width: 393, height: 851 } },
    { name: 'iPad Mini', viewport: { width: 768, height: 1024 } }
  ];

  for (const device of devices) {
    test.describe(`测试设备: ${device.name}`, () => {
      test.use({ viewport: device.viewport });

      test('页面加载和响应式布局', async ({ page }) => {
        await page.goto('/');
        
        // 检查页面是否正确加载
        await expect(page).toHaveTitle(/鱼虾蟹游戏/);
        
        // 检查关键元素是否可见
        await expect(page.locator('.game-board')).toBeVisible();
        await expect(page.locator('.betting-area')).toBeVisible();
        await expect(page.locator('.dice-container')).toBeVisible();
        
        // 检查移动端特定元素
        await expect(page.locator('.mobile-menu')).toBeVisible();
        await expect(page.locator('.hamburger-icon')).toBeVisible();
        
        // 验证响应式布局
        const gameBoard = await page.locator('.game-board');
        const gameBoardBox = await gameBoard.boundingBox();
        expect(gameBoardBox?.width).toBeLessThan(800); // 在移动设备上应该较窄
      });

      test('触摸操作测试', async ({ page }) => {
        await page.goto('/');
        
        // 测试下注按钮点击
        const betButtons = page.locator('.bet-btn');
        await expect(betButtons).toHaveCount(6); // 鱼虾蟹蛤 crab prawn fish
        
        // 点击第一个下注按钮
        await page.locator('.bet-btn').first().click();
        await expect(page.locator('.current-bet')).toContainText('已选择');
        
        // 测试滑动操作（如果有的话）
        const gameArea = page.locator('.game-container');
        await gameArea.tap(); // 模拟轻触
      });

      test('移动端导航测试', async ({ page }) => {
        await page.goto('/');
        
        // 打开移动端菜单
        await page.locator('.hamburger-icon').click();
        await expect(page.locator('.mobile-menu')).toBeVisible();
        
        // 点击菜单项
        await page.locator('.menu-item').first().click();
        await expect(page.locator('.mobile-menu')).not.toBeVisible();
      });

      test('横屏竖屏切换测试', async ({ page }) => {
        // 初始竖屏测试
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto('/');
        
        // 检查竖屏布局
        const betArea = page.locator('.betting-area');
        await expect(betArea).toBeVisible();
        
        // 切换到横屏
        await page.setViewportSize({ width: 844, height: 390 });
        
        // 检查横屏布局是否调整
        await page.reload();
        await expect(page.locator('.game-board')).toBeVisible();
      });

      test('移动端性能测试', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/');
        
        // 等待页面完全加载
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;
        
        // 移动端页面加载时间应该在合理范围内
        expect(loadTime).toBeLessThan(5000); // 小于5秒
        
        // 测试动画流畅度
        const frameStart = Date.now();
        await page.locator('.dice-container').click();
        const frameTime = Date.now() - frameStart;
        
        // 点击响应时间应该很快
        expect(frameTime).toBeLessThan(100);
      });
    });
  }

  // 特定移动设备交互测试
  test.describe('移动端特定交互测试', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('手势操作测试', async ({ page }) => {
      await page.goto('/');
      
      // 测试长按操作
      await page.locator('.bet-btn').nth(0).longPress();
      
      // 测试双击操作
      await page.locator('.dice-container').dblClick();
    });

    test('移动端表单测试', async ({ page }) => {
      await page.goto('/settings');
      
      // 测试移动端表单输入
      const usernameInput = page.locator('#username');
      await usernameInput.fill('mobile_user');
      await expect(usernameInput).toHaveValue('mobile_user');
      
      // 测试移动端选择器
      const themeSelector = page.locator('#theme-select');
      await themeSelector.selectOption('dark');
      await expect(themeSelector).toHaveValue('dark');
    });
  });
});
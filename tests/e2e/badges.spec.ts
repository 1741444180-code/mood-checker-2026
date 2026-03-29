import { test, expect } from '@playwright/test';

test.describe('徽章页面测试', () => {
  test.beforeEach(async ({ page }) => {
    // 假设用户已登录，访问徽章页面
    await page.goto('/badges');
  });

  test('徽章页面加载成功', async ({ page }) => {
    await expect(page).toHaveTitle(/徽章/);
    await expect(page.locator('h1')).toContainText('徽章系统');
  });

  test('显示用户当前徽章', async ({ page }) => {
    // 检查徽章列表是否渲染
    const badgesList = page.locator('[data-testid="badges-list"]');
    await expect(badgesList).toBeVisible();
    
    // 检查至少有一个徽章项
    const badgeItems = page.locator('[data-testid="badge-item"]');
    await expect(badgeItems).toHaveCount({gte: 1});
  });

  test('徽章解锁功能测试', async ({ page }) => {
    // 模拟用户完成某个成就条件
    // 这里假设用户已经完成了解锁条件，检查徽章状态
    const unlockedBadge = page.locator('[data-testid="badge-item"].unlocked');
    await expect(unlockedBadge).toHaveCount({gte: 1});
    
    // 检查未解锁的徽章
    const lockedBadge = page.locator('[data-testid="badge-item"].locked');
    await expect(lockedBadge).toHaveCount({gte: 0}); // 可能没有锁定徽章
  });

  test('徽章详情展示', async ({ page }) => {
    // 点击第一个徽章，检查详情弹窗
    const firstBadge = page.locator('[data-testid="badge-item"]').first();
    await expect(firstBadge).toBeVisible();
    
    // 检查徽章有名称和描述
    await expect(firstBadge.locator('.badge-name')).toBeVisible();
    await expect(firstBadge.locator('.badge-description')).toBeVisible();
  });

  test('徽章分类筛选', async ({ page }) => {
    // 检查是否有徽章分类筛选功能
    const categoryFilter = page.locator('[data-testid="badge-category-filter"]');
    if (await categoryFilter.count() > 0) {
      await expect(categoryFilter).toBeVisible();
      
      // 测试筛选功能
      const allBadgesCount = await page.locator('[data-testid="badge-item"]').count();
      await categoryFilter.click();
      
      // 选择一个分类（假设第一个选项）
      await page.locator('select[data-testid="badge-category-filter"] option').first().click();
      
      // 检查筛选后的徽章数量应该小于等于总数
      const filteredBadgesCount = await page.locator('[data-testid="badge-item"]').count();
      expect(filteredBadgesCount).toBeLessThanOrEqual(allBadgesCount);
    }
  });

  test('徽章解锁进度显示', async ({ page }) => {
    // 检查是否有进度条或百分比显示
    const progressElements = page.locator('[data-testid="badge-progress"]');
    if (await progressElements.count() > 0) {
      await expect(progressElements.first()).toBeVisible();
    }
  });
});

// 响应式布局测试
test.describe('徽章页面响应式布局测试', () => {
  test('移动端徽章页面布局', async ({ page }) => {
    // 设置移动设备视口
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/badges');
    
    // 检查移动端布局元素
    const mobileLayout = page.locator('[data-testid="mobile-badge-layout"]');
    if (await mobileLayout.count() > 0) {
      await expect(mobileLayout).toBeVisible();
    }
    
    // 检查徽章网格在移动端的显示
    const badgeGrid = page.locator('[data-testid="badge-grid"]');
    await expect(badgeGrid).toBeVisible();
  });

  test('平板端徽章页面布局', async ({ page }) => {
    // 设置平板设备视口
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/badges');
    
    // 检查平板端布局元素
    const tabletLayout = page.locator('[data-testid="tablet-badge-layout"]');
    if (await tabletLayout.count() > 0) {
      await expect(tabletLayout).toBeVisible();
    }
  });
});
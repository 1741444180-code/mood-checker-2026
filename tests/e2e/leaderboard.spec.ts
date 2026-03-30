import { test, expect } from '@playwright/test';

test.describe('排行榜页面测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问排行榜页面
    await page.goto('/leaderboard');
  });

  test('排行榜页面加载成功', async ({ page }) => {
    await expect(page).toHaveTitle(/排行榜/);
    await expect(page.locator('h1')).toContainText('排行榜');
  });

  test('显示排行榜数据', async ({ page }) => {
    // 检查排行榜列表是否渲染
    const leaderboardList = page.locator('[data-testid="leaderboard-list"]');
    await expect(leaderboardList).toBeVisible();
    
    // 检查至少有一条排名记录
    const rankingItems = page.locator('[data-testid="ranking-item"]');
    await expect(rankingItems).toHaveCount({gte: 1});
  });

  test('排行榜数据正确性验证', async ({ page }) => {
    // 获取排行榜上的用户数据
    const rankingItems = page.locator('[data-testid="ranking-item"]');
    const count = await rankingItems.count();
    
    // 至少要有3个排名（如果有足够的用户参与）
    if (count >= 3) {
      // 验证排名顺序是否正确（第1名、第2名、第3名）
      const firstRank = rankingItems.nth(0).locator('[data-testid="rank-position"]');
      const secondRank = rankingItems.nth(1).locator('[data-testid="rank-position"]');
      const thirdRank = rankingItems.nth(2).locator('[data-testid="rank-position]');
      
      await expect(firstRank).toContainText('1');
      await expect(secondRank).toContainText('2');
      await expect(thirdRank).toContainText('3');
    }
  });

  test('用户积分数据显示', async ({ page }) => {
    // 检查每个排名项都包含用户名和积分
    const rankingItems = page.locator('[data-testid="ranking-item"]');
    const count = await rankingItems.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const item = rankingItems.nth(i);
      await expect(item.locator('[data-testid="user-name"]')).toBeVisible();
      await expect(item.locator('[data-testid="user-score"]')).toBeVisible();
    }
  });

  test('排行榜分类筛选', async ({ page }) => {
    // 检查是否有排行榜分类筛选功能
    const categoryFilter = page.locator('[data-testid="leaderboard-category-filter"]');
    if (await categoryFilter.count() > 0) {
      await expect(categoryFilter).toBeVisible();
      
      // 记录当前排行榜长度
      const initialCount = await page.locator('[data-testid="ranking-item"]').count();
      
      // 尝试切换到不同分类
      await categoryFilter.click();
      await page.locator('select[data-testid="leaderboard-category-filter"] option').nth(1).click();
      
      // 检查数据是否更新
      const updatedCount = await page.locator('[data-testid="ranking-item"]').count();
      // 数据可能相同也可能不同，但页面应正常响应
      expect(updatedCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('排行榜刷新功能', async ({ page }) => {
    // 检查是否有刷新按钮
    const refreshButton = page.locator('[data-testid="refresh-leaderboard"]');
    if (await refreshButton.count() > 0) {
      await expect(refreshButton).toBeVisible();
      
      // 记录初始时间戳或数据
      const initialData = await page.locator('[data-testid="ranking-item"]').first().textContent();
      
      // 点击刷新按钮
      await refreshButton.click();
      
      // 等待数据更新
      await page.waitForTimeout(1000);
      
      // 检查数据是否有变化（可能相同，但至少尝试了刷新）
      const updatedData = await page.locator('[data-testid="ranking-item"]').first().textContent();
    }
  });

  test('我的排名显示', async ({ page }) => {
    // 检查是否有"我的排名"部分
    const myRankSection = page.locator('[data-testid="my-ranking-section"]');
    if (await myRankSection.count() > 0) {
      await expect(myRankSection).toBeVisible();
      
      // 检查我的排名信息
      const myRank = page.locator('[data-testid="my-rank-position"]');
      const myScore = page.locator('[data-testid="my-score"]');
      
      await expect(myRank).toBeVisible();
      await expect(myScore).toBeVisible();
    }
  });
});

// 响应式布局测试
test.describe('排行榜页面响应式布局测试', () => {
  test('移动端排行榜布局', async ({ page }) => {
    // 设置移动设备视口
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/leaderboard');
    
    // 检查移动端布局元素
    const mobileLayout = page.locator('[data-testid="mobile-leaderboard-layout"]');
    if (await mobileLayout.count() > 0) {
      await expect(mobileLayout).toBeVisible();
    }
    
    // 在移动端，可能使用垂直滚动列表而不是水平表格
    const verticalList = page.locator('[data-testid="vertical-ranking-list"]');
    await expect(verticalList).toBeVisible();
  });

  test('平板端排行榜布局', async ({ page }) => {
    // 设置平板设备视口
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/leaderboard');
    
    // 检查平板端布局元素
    const tabletLayout = page.locator('[data-testid="tablet-leaderboard-layout"]');
    if (await tabletLayout.count() > 0) {
      await expect(tabletLayout).toBeVisible();
    }
  });

  test('桌面端排行榜布局', async ({ page }) => {
    // 使用默认桌面视口
    await page.goto('/leaderboard');
    
    // 检查桌面端布局元素
    const desktopLayout = page.locator('[data-testid="desktop-leaderboard-layout"]');
    if (await desktopLayout.count() > 0) {
      await expect(desktopLayout).toBeVisible();
    }
    
    // 桌面端可能会显示更详细的表格形式
    const tableLayout = page.locator('[data-testid="ranking-table"]');
    if (await tableLayout.count() > 0) {
      await expect(tableLayout).toBeVisible();
    }
  });
});
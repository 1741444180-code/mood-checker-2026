import { test, expect } from '@playwright/test';

test.describe('Admin Reports Dashboard Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 登录到管理后台
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    // 导航到报表页面
    await page.click('nav a[href="/admin/reports"]');
    await page.waitForLoadState('networkidle');
  });

  test('should display reports dashboard correctly', async ({ page }) => {
    // 检查报表页面标题
    await expect(page.locator('h1')).toHaveText('数据报表');
    
    // 检查关键元素存在
    await expect(page.locator('[data-testid="reports-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="chart-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="filters-panel"]')).toBeVisible();
  });

  test('should display charts with correct data', async ({ page }) => {
    // 等待图表渲染
    await page.waitForSelector('.chart-container');
    
    // 检查图表是否正确加载
    const chartElements = page.locator('.chart-element');
    await expect(chartElements).toHaveCount(4); // 假设有4个图表
    
    // 验证图表数据正确性
    const revenueChart = page.locator('[data-chart-type="revenue"]');
    await expect(revenueChart).toBeVisible();
    
    // 检查是否有数据点
    const dataPoints = revenueChart.locator('.data-point');
    await expect(dataPoints).toHaveCountGreaterThan(0);
  });

  test('should filter reports by date range', async ({ page }) => {
    // 测试日期范围筛选
    const startDateInput = page.locator('[data-testid="start-date"]');
    const endDateInput = page.locator('[data-testid="end-date"]');
    
    await startDateInput.fill('2026-01-01');
    await endDateInput.fill('2026-03-29');
    
    const applyButton = page.locator('button[data-testid="apply-filters"]');
    await applyButton.click();
    
    // 等待筛选结果加载
    await page.waitForLoadState('networkidle');
    
    // 验证筛选结果
    const filteredData = page.locator('[data-testid="report-data-row"]');
    await expect(filteredData).toHaveCountGreaterThan(0);
  });

  test('should export reports data', async ({ page }) => {
    // 测试导出功能
    const exportButton = page.locator('button[data-testid="export-btn"]');
    await expect(exportButton).toBeVisible();
    
    // 模拟导出操作
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    
    // 等待下载完成
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('reports');
  });

  test('should display summary statistics correctly', async ({ page }) => {
    // 验证汇总统计数据
    const summaryCards = page.locator('[data-testid="summary-card"]');
    await expect(summaryCards).toHaveCount(4);
    
    // 检查每个汇总卡片都有值
    for (let i = 0; i < 4; i++) {
      const cardValue = summaryCards.nth(i).locator('[data-testid="card-value"]');
      await expect(cardValue).not.toHaveText('');
      await expect(cardValue).not.toHaveText('0');
    }
  });

  test('should respond correctly to screen size changes', async ({ page }) => {
    // 测试响应式布局 - 桌面端
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('[data-testid="reports-container"]')).toBeVisible();
    
    // 测试响应式布局 - 平板端
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeVisible();
    await expect(page.locator('[data-testid="reports-container"]')).toBeVisible();
    
    // 测试响应式布局 - 移动端
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('[data-testid="mobile-filters"]')).toBeVisible();
    
    // 验证移动端特定元素
    const mobileChart = page.locator('[data-testid="mobile-chart"]');
    await expect(mobileChart).toBeVisible();
  });

  test('should update charts when filters change', async ({ page }) => {
    // 测试筛选条件变化时图表更新
    const categoryFilter = page.locator('[data-testid="category-filter"]');
    await categoryFilter.click();
    
    const categoryOption = page.locator('text=销售');
    await categoryOption.click();
    
    // 等待图表重新渲染
    await page.waitForTimeout(1000);
    
    // 验证图表已更新
    const updatedChart = page.locator('[data-chart-updated="true"]');
    await expect(updatedChart).toBeVisible();
  });
});
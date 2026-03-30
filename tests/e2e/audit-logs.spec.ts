import { test, expect } from '@playwright/test';

test.describe('Audit Logs Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 登录到管理后台
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    // 导航到审计日志页面
    await page.click('nav a[href="/admin/audit-logs"]');
    await page.waitForLoadState('networkidle');
  });

  test('should display audit logs page correctly', async ({ page }) => {
    // 检查审计日志页面标题
    await expect(page.locator('h1')).toHaveText('日志审计');
    
    // 检查关键元素存在
    await expect(page.locator('[data-testid="audit-logs-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="logs-table"]')).toBeVisible();
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="filter-panel"]')).toBeVisible();
  });

  test('should display audit logs with correct information', async ({ page }) => {
    // 等待日志加载
    await page.waitForSelector('[data-testid="log-entry"]');
    
    // 检查日志条目数量
    const logEntries = page.locator('[data-testid="log-entry"]');
    await expect(logEntries).toHaveCountGreaterThan(0);
    
    // 验证日志条目包含必要字段
    const firstEntry = logEntries.first();
    await expect(firstEntry.locator('[data-testid="log-timestamp"]')).toBeVisible();
    await expect(firstEntry.locator('[data-testid="log-user"]')).toBeVisible();
    await expect(firstEntry.locator('[data-testid="log-action"]')).toBeVisible();
    await expect(firstEntry.locator('[data-testid="log-ip"]')).toBeVisible();
    await expect(firstEntry.locator('[data-testid="log-status"]')).toBeVisible();
  });

  test('should search audit logs by keyword', async ({ page }) => {
    // 测试搜索功能
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('登录');
    
    const searchButton = page.locator('button[data-testid="search-btn"]');
    await searchButton.click();
    
    // 等待搜索结果加载
    await page.waitForLoadState('networkidle');
    
    // 验证搜索结果
    const searchResults = page.locator('[data-testid="log-entry"]');
    await expect(searchResults).toHaveCountGreaterThan(0);
    
    // 检查结果中是否包含搜索关键词
    const actionCells = page.locator('[data-testid="log-action"]');
    for (let i = 0; i < await actionCells.count(); i++) {
      const text = await actionCells.nth(i).textContent();
      expect(text?.toLowerCase()).toContain('登录');
    }
  });

  test('should filter audit logs by date range', async ({ page }) => {
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
    const filteredLogs = page.locator('[data-testid="log-entry"]');
    await expect(filteredLogs).toHaveCountGreaterThan(0);
  });

  test('should filter audit logs by user', async ({ page }) => {
    // 测试按用户筛选
    const userFilter = page.locator('[data-testid="user-filter"]');
    await userFilter.click();
    
    const userOption = page.locator('text=admin');
    await userOption.click();
    
    // 等待筛选结果加载
    await page.waitForLoadState('networkidle');
    
    // 验证筛选结果
    const userFilteredLogs = page.locator('[data-testid="log-entry"]');
    await expect(userFilteredLogs).toHaveCountGreaterThan(0);
    
    // 检查所有结果都是来自指定用户
    const userCells = page.locator('[data-testid="log-user"]');
    for (let i = 0; i < await userCells.count(); i++) {
      const text = await userCells.nth(i).textContent();
      expect(text).toBe('admin');
    }
  });

  test('should filter audit logs by action type', async ({ page }) => {
    // 测试按操作类型筛选
    const actionFilter = page.locator('[data-testid="action-filter"]');
    await actionFilter.click();
    
    const actionOption = page.locator('text=数据修改');
    await actionOption.click();
    
    // 等待筛选结果加载
    await page.waitForLoadState('networkidle');
    
    // 验证筛选结果
    const actionFilteredLogs = page.locator('[data-testid="log-entry"]');
    await expect(actionFilteredLogs).toHaveCountGreaterThan(0);
    
    // 检查所有结果都是指定操作类型
    const actionCells = page.locator('[data-testid="log-action"]');
    for (let i = 0; i < await actionCells.count(); i++) {
      const text = await actionCells.nth(i).textContent();
      expect(text).toContain('数据修改');
    }
  });

  test('should sort audit logs by timestamp', async ({ page }) => {
    // 测试按时间戳排序
    const sortButton = page.locator('[data-testid="sort-timestamp"]');
    await sortButton.click();
    
    // 等待排序完成
    await page.waitForLoadState('networkidle');
    
    // 获取时间戳并验证排序
    const timestamps = page.locator('[data-testid="log-timestamp"]');
    const count = await timestamps.count();
    
    for (let i = 0; i < count - 1; i++) {
      const currentText = await timestamps.nth(i).textContent();
      const nextText = await timestamps.nth(i + 1).textContent();
      
      // 比较时间戳（假设格式为 YYYY-MM-DD HH:mm:ss）
      expect(new Date(currentText!) >= new Date(nextText!)).toBeTruthy();
    }
  });

  test('should paginate through audit logs', async ({ page }) => {
    // 测试分页功能
    const nextPageButton = page.locator('[data-testid="next-page"]');
    if (await nextPageButton.isEnabled()) {
      await nextPageButton.click();
      
      // 等待下一页加载
      await page.waitForLoadState('networkidle');
      
      // 验证新页面内容
      const currentPageLogs = page.locator('[data-testid="log-entry"]');
      await expect(currentPageLogs).toHaveCountGreaterThan(0);
    }
  });

  test('should export audit logs', async ({ page }) => {
    // 测试导出功能
    const exportButton = page.locator('button[data-testid="export-btn"]');
    await expect(exportButton).toBeVisible();
    
    // 模拟导出操作
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    
    // 等待下载完成
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('audit-logs');
  });

  test('should respond correctly to screen size changes', async ({ page }) => {
    // 测试响应式布局 - 桌面端
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('[data-testid="audit-logs-container"]')).toBeVisible();
    
    // 测试响应式布局 - 平板端
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeVisible();
    await expect(page.locator('[data-testid="logs-table"]')).toBeVisible();
    
    // 测试响应式布局 - 移动端
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('[data-testid="mobile-filters"]')).toBeVisible();
    
    // 验证移动端特定元素
    const mobileTable = page.locator('[data-testid="mobile-log-view"]');
    await expect(mobileTable).toBeVisible();
  });

  test('should display detailed log information on click', async ({ page }) => {
    // 测试点击日志条目显示详细信息
    const firstLogEntry = page.locator('[data-testid="log-entry"]').first();
    await firstLogEntry.click();
    
    // 验证详细信息弹窗出现
    const detailModal = page.locator('[data-testid="log-detail-modal"]');
    await expect(detailModal).toBeVisible();
    
    // 验证详细信息包含预期字段
    await expect(detailModal.locator('[data-testid="detail-timestamp"]')).toBeVisible();
    await expect(detailModal.locator('[data-testid="detail-user"]')).toBeVisible();
    await expect(detailModal.locator('[data-testid="detail-action"]')).toBeVisible();
    await expect(detailModal.locator('[data-testid="detail-details"]')).toBeVisible();
    
    // 关闭弹窗
    const closeButton = detailModal.locator('button.close');
    await closeButton.click();
    await expect(detailModal).not.toBeVisible();
  });
});
import { test, expect } from '@playwright/test';

test.describe('Export Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the export page
    await page.goto('/export');
  });

  test('should display export page with required elements', async ({ page }) => {
    // Test that export page loads correctly
    await expect(page.locator('h1')).toContainText('Export Data');
    
    // Check for export format selection
    await expect(page.locator('#export-format')).toBeVisible();
    
    // Check for date range picker
    await expect(page.locator('#date-range-picker')).toBeVisible();
    
    // Check for export button
    await expect(page.locator('#export-btn')).toBeVisible();
  });

  test('should allow export format selection', async ({ page }) => {
    // Test different export formats
    const formatSelector = page.locator('#export-format');
    await expect(formatSelector).toBeVisible();
    
    // Test CSV format selection
    await formatSelector.selectOption('CSV');
    await expect(formatSelector).toHaveValue('CSV');
    
    // Test Excel format selection
    await formatSelector.selectOption('Excel');
    await expect(formatSelector).toHaveValue('Excel');
    
    // Test PDF format selection
    await formatSelector.selectOption('PDF');
    await expect(formatSelector).toHaveValue('PDF');
  });

  test('should allow date range selection', async ({ page }) => {
    // Test date range picker functionality
    const startDateInput = page.locator('#start-date');
    const endDateInput = page.locator('#end-date');
    
    await expect(startDateInput).toBeVisible();
    await expect(endDateInput).toBeVisible();
    
    // Fill start date
    await startDateInput.fill('2023-01-01');
    await expect(startDateInput).toHaveValue('2023-01-01');
    
    // Fill end date
    await endDateInput.fill('2023-12-31');
    await expect(endDateInput).toHaveValue('2023-12-31');
  });

  test('should trigger file download when export button is clicked', async ({ page }) => {
    // Mock file download behavior
    const downloadPromise = page.waitForEvent('download');
    
    // Select format
    await page.locator('#export-format').selectOption('CSV');
    
    // Set date range
    await page.locator('#start-date').fill('2023-01-01');
    await page.locator('#end-date').fill('2023-12-31');
    
    // Click export button
    await page.locator('#export-btn').click();
    
    // Wait for download to start
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.(csv|xlsx|pdf)$/);
  });

  test('should handle responsive layout properly', async ({ page }) => {
    // Test desktop layout
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('#export-format')).toBeVisible();
    await expect(page.locator('#date-range-picker')).toBeVisible();
    await expect(page.locator('#export-btn')).toBeVisible();

    // Test tablet layout
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('#export-format')).toBeVisible();
    await expect(page.locator('#date-range-picker')).toBeVisible();
    await expect(page.locator('#export-btn')).toBeVisible();

    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('#export-format')).toBeVisible();
    await expect(page.locator('#date-range-picker')).toBeVisible();
    await expect(page.locator('#export-btn')).toBeVisible();
  });

  test('should show validation errors for invalid date ranges', async ({ page }) => {
    // Fill end date before start date
    await page.locator('#start-date').fill('2023-12-31');
    await page.locator('#end-date').fill('2023-01-01');
    
    // Click export button
    await page.locator('#export-btn').click();
    
    // Check for validation error
    await expect(page.locator('.error-message')).toContainText('End date must be after start date');
  });

  test('should maintain selected options after page refresh', async ({ page }) => {
    // Select format
    await page.locator('#export-format').selectOption('Excel');
    
    // Set date range
    await page.locator('#start-date').fill('2023-06-01');
    await page.locator('#end-date').fill('2023-06-30');
    
    // Refresh page
    await page.reload();
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Check that selections are preserved
    await expect(page.locator('#export-format')).toHaveValue('Excel');
    await expect(page.locator('#start-date').first()).toHaveValue('2023-06-01');
    await expect(page.locator('#end-date').first()).toHaveValue('2023-06-30');
  });
});
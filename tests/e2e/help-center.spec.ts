import { test, expect } from '@playwright/test';

// Help Center E2E Tests
test.describe('Help Center Tests', () => {
  // Test Case: Access Help Center from homepage
  test('should navigate to help center from homepage', async ({ page }) => {
    await page.goto('/');
    const helpCenterLink = page.locator('text=帮助中心');
    await expect(helpCenterLink).toBeVisible();
    await helpCenterLink.click();
    await expect(page).toHaveURL(/.*\/help.*/);
    await expect(page.locator('h1')).toContainText('帮助中心');
  });

  // Test Case: Verify help center has categories
  test('should display help categories', async ({ page }) => {
    await page.goto('/help');
    const categoryList = page.locator('.help-category');
    await expect(categoryList).toBeVisible();
    const categoriesCount = await categoryList.count();
    expect(categoriesCount).toBeGreaterThan(0);
  });

  // Test Case: Navigate to specific help category
  test('should navigate to specific help category', async ({ page }) => {
    await page.goto('/help');
    const firstCategory = page.locator('.help-category').first();
    await expect(firstCategory).toBeVisible();
    await firstCategory.click();
    await expect(page).toHaveURL(/.*\/help\/category.*/);
  });

  // Test Case: View help article
  test('should display help article content', async ({ page }) => {
    await page.goto('/help');
    const articleLink = page.locator('.help-article-link').first();
    await expect(articleLink).toBeVisible();
    await articleLink.click();
    await expect(page.locator('.help-article-content')).toBeVisible();
  });

  // Test Case: Help center search functionality
  test('should search help articles', async ({ page }) => {
    await page.goto('/help');
    const searchInput = page.locator('#help-search-input');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('登录');
    await searchInput.press('Enter');
    await expect(page.locator('.search-results')).toBeVisible();
    const resultsCount = await page.locator('.search-result-item').count();
    expect(resultsCount).toBeGreaterThanOrEqual(0);
  });

  // Test Case: Help center breadcrumbs
  test('should display breadcrumbs correctly', async ({ page }) => {
    await page.goto('/help');
    const breadcrumbs = page.locator('.breadcrumb');
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs.locator('text=首页')).toBeVisible();
    await expect(breadcrumbs.locator('text=帮助中心')).toBeVisible();
  });

  // Test Case: Contact support link
  test('should have contact support link', async ({ page }) => {
    await page.goto('/help');
    const contactLink = page.locator('text=联系客服');
    await expect(contactLink).toBeVisible();
    await expect(contactLink).toHaveAttribute('href', '/support');
  });

  // Test Case: Help center footer links
  test('should have footer links in help center', async ({ page }) => {
    await page.goto('/help');
    const faqLink = page.locator('text=常见问题');
    const termsLink = page.locator('text=服务条款');
    const privacyLink = page.locator('text=隐私政策');
    
    await expect(faqLink).toBeVisible();
    await expect(termsLink).toBeVisible();
    await expect(privacyLink).toBeVisible();
  });

  // Test Case: Help article rating functionality
  test('should allow rating help articles', async ({ page }) => {
    await page.goto('/help');
    const articleLink = page.locator('.help-article-link').first();
    await expect(articleLink).toBeVisible();
    await articleLink.click();
    
    const ratingSection = page.locator('.article-rating');
    await expect(ratingSection).toBeVisible();
    
    const thumbsUpButton = ratingSection.locator('.thumb-up');
    const thumbsDownButton = ratingSection.locator('.thumb-down');
    
    await expect(thumbsUpButton).toBeVisible();
    await expect(thumbsDownButton).toBeVisible();
  });

  // Test Case: Help article sharing functionality
  test('should allow sharing help articles', async ({ page }) => {
    await page.goto('/help');
    const articleLink = page.locator('.help-article-link').first();
    await expect(articleLink).toBeVisible();
    await articleLink.click();
    
    const shareButtons = page.locator('.share-buttons');
    await expect(shareButtons).toBeVisible();
    const shareOptions = page.locator('.share-option');
    const shareOptionsCount = await shareOptions.count();
    expect(shareOptionsCount).toBeGreaterThanOrEqual(1);
  });
});
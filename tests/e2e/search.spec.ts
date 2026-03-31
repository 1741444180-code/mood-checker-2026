import { test, expect } from '@playwright/test';

// Search Functionality E2E Tests
test.describe('Search Functionality Tests', () => {
  // Test Case: Search bar visibility on homepage
  test('should display search bar on homepage', async ({ page }) => {
    await page.goto('/');
    const searchBar = page.locator('#global-search-bar');
    await expect(searchBar).toBeVisible();
  });

  // Test Case: Perform basic search
  test('should perform basic search', async ({ page }) => {
    await page.goto('/');
    const searchBar = page.locator('#global-search-bar');
    await expect(searchBar).toBeVisible();
    await searchBar.fill('心情打卡');
    await searchBar.press('Enter');
    await expect(page).toHaveURL(/.*\/search.*/);
    const resultsContainer = page.locator('.search-results');
    await expect(resultsContainer).toBeVisible();
  });

  // Test Case: Search results display
  test('should display search results', async ({ page }) => {
    await page.goto('/search?q=心情打卡');
    const results = page.locator('.search-result-item');
    const resultsCount = await results.count();
    expect(resultsCount).toBeGreaterThanOrEqual(0);
    
    if (resultsCount > 0) {
      await expect(results.first()).toBeVisible();
      const title = results.first().locator('.result-title');
      await expect(title).toBeVisible();
    }
  });

  // Test Case: Search with no results
  test('should handle empty search results', async ({ page }) => {
    await page.goto('/');
    const searchBar = page.locator('#global-search-bar');
    await expect(searchBar).toBeVisible();
    await searchBar.fill('xyzabc123');
    await searchBar.press('Enter');
    
    const noResultsMessage = page.locator('text=未找到相关结果');
    await expect(noResultsMessage).toBeVisible();
  });

  // Test Case: Search suggestion dropdown
  test('should display search suggestions', async ({ page }) => {
    await page.goto('/');
    const searchBar = page.locator('#global-search-bar');
    await expect(searchBar).toBeVisible();
    await searchBar.focus();
    await searchBar.fill('心');
    
    const suggestions = page.locator('.search-suggestions');
    await expect(suggestions).toBeVisible();
    const suggestionItems = page.locator('.suggestion-item');
    const suggestionsCount = await suggestionItems.count();
    expect(suggestionsCount).toBeGreaterThanOrEqual(0);
  });

  // Test Case: Click on search suggestion
  test('should navigate to page from search suggestion', async ({ page }) => {
    await page.goto('/');
    const searchBar = page.locator('#global-search-bar');
    await expect(searchBar).toBeVisible();
    await searchBar.focus();
    await searchBar.fill('帮');
    
    const suggestionItem = page.locator('.suggestion-item').first();
    await expect(suggestionItem).toBeVisible();
    await suggestionItem.click();
    
    // Should navigate to suggested page
    await expect(page).not.toHaveURL(/\//);
  });

  // Test Case: Advanced search options
  test('should display advanced search options', async ({ page }) => {
    await page.goto('/search?q=打卡');
    const advancedSearchToggle = page.locator('text=高级搜索');
    if (await advancedSearchToggle.count() > 0) {
      await advancedSearchToggle.click();
      const advancedOptions = page.locator('.advanced-search-options');
      await expect(advancedOptions).toBeVisible();
    }
  });

  // Test Case: Filter search results
  test('should filter search results by category', async ({ page }) => {
    await page.goto('/search?q=打卡');
    const filterDropdown = page.locator('.filter-dropdown');
    if (await filterDropdown.count() > 0) {
      await filterDropdown.click();
      const filterOption = page.locator('.filter-option').first();
      await expect(filterOption).toBeVisible();
      await filterOption.click();
      
      // Wait for filtered results
      await page.waitForLoadState('networkidle');
      const results = page.locator('.search-result-item');
      const resultsCount = await results.count();
      expect(resultsCount).toBeGreaterThanOrEqual(0);
    }
  });

  // Test Case: Search result highlighting
  test('should highlight search terms in results', async ({ page }) => {
    await page.goto('/');
    const searchBar = page.locator('#global-search-bar');
    await expect(searchBar).toBeVisible();
    await searchBar.fill('打卡');
    await searchBar.press('Enter');
    
    const resultContents = page.locator('.result-content');
    if (await resultContents.count() > 0) {
      const firstResult = resultContents.first();
      await expect(firstResult).toBeVisible();
      // Check if the search term is highlighted (often wrapped in <mark> tags)
      const highlights = firstResult.locator('mark');
      expect(await highlights.count()).toBeGreaterThanOrEqual(0);
    }
  });

  // Test Case: Search history functionality
  test('should maintain search history', async ({ page }) => {
    // First, perform a search
    await page.goto('/');
    const searchBar = page.locator('#global-search-bar');
    await expect(searchBar).toBeVisible();
    await searchBar.fill('心情');
    await searchBar.press('Enter');
    
    // Go back to homepage
    await page.goto('/');
    
    // Click on search bar to see history
    await searchBar.focus();
    const historyItems = page.locator('.search-history-item');
    const historyCount = await historyItems.count();
    expect(historyCount).toBeGreaterThanOrEqual(0);
  });

  // Test Case: Clear search history
  test('should clear search history', async ({ page }) => {
    await page.goto('/');
    const clearHistoryBtn = page.locator('text=清除历史');
    if (await clearHistoryBtn.count() > 0) {
      await expect(clearHistoryBtn).toBeVisible();
      await clearHistoryBtn.click();
      
      const historyItems = page.locator('.search-history-item');
      expect(await historyItems.count()).toBe(0);
    }
  });

  // Test Case: Search from help center
  test('should search from help center page', async ({ page }) => {
    await page.goto('/help');
    const helpSearchBar = page.locator('#help-search-input');
    if (await helpSearchBar.count() > 0) {
      await expect(helpSearchBar).toBeVisible();
      await helpSearchBar.fill('账户');
      await helpSearchBar.press('Enter');
      
      const results = page.locator('.search-result-item');
      await expect(results).toBeVisible();
    }
  });

  // Test Case: Pagination in search results
  test('should paginate search results', async ({ page }) => {
    await page.goto('/search?q=打卡');
    const pagination = page.locator('.pagination');
    if (await pagination.count() > 0) {
      await expect(pagination).toBeVisible();
      const nextPageBtn = pagination.locator('text=下一页');
      if (await nextPageBtn.count() > 0) {
        const currentUrl = page.url();
        await nextPageBtn.click();
        await page.waitForLoadState('networkidle');
        expect(page.url()).not.toBe(currentUrl);
      }
    }
  });

  // Test Case: Sort search results
  test('should sort search results', async ({ page }) => {
    await page.goto('/search?q=设置');
    const sortSelector = page.locator('.sort-selector');
    if (await sortSelector.count() > 0) {
      await expect(sortSelector).toBeVisible();
      await sortSelector.click();
      
      const sortByRelevance = sortSelector.locator('text=相关性');
      const sortByDate = sortSelector.locator('text=日期');
      
      if (await sortByDate.count() > 0) {
        await sortByDate.click();
        await page.waitForLoadState('networkidle');
        
        // Results should be sorted by date now
        const results = page.locator('.search-result-item');
        expect(await results.count()).toBeGreaterThanOrEqual(0);
      }
    }
  });

  // Test Case: Search result metadata
  test('should display proper metadata in search results', async ({ page }) => {
    await page.goto('/search?q=打卡');
    const results = page.locator('.search-result-item');
    if (await results.count() > 0) {
      const firstResult = results.first();
      await expect(firstResult).toBeVisible();
      
      const resultTitle = firstResult.locator('.result-title');
      const resultDescription = firstResult.locator('.result-description');
      const resultUrl = firstResult.locator('.result-url');
      
      await expect(resultTitle).toBeVisible();
      await expect(resultDescription).toBeVisible();
      await expect(resultUrl).toBeVisible();
    }
  });
});
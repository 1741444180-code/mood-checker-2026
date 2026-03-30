import { test, expect } from '@playwright/test';

test.describe('Privacy Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming user is logged in before accessing privacy settings
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'testuser');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('should navigate to privacy page and display correctly', async ({ page }) => {
    await page.click('[data-testid="privacy-link"]');
    await expect(page).toHaveURL(/.*\/privacy$/);
    await expect(page.locator('h1')).toContainText('Privacy Settings');
  });

  test('should allow user to adjust privacy settings', async ({ page }) => {
    await page.goto('/privacy');
    
    // Test visibility settings
    await page.click('[data-testid="profile-visibility-select"]');
    await page.click('text=Friends Only');
    await page.click('[data-testid="save-privacy-settings"]');
    
    await expect(page.locator('[data-testid="privacy-success-msg"]')).toBeVisible();
    
    // Test activity visibility
    await page.click('[data-testid="activity-visibility-select"]');
    await page.click('text=Private');
    await page.click('[data-testid="save-privacy-settings"]');
    
    await expect(page.locator('[data-testid="privacy-success-msg"]')).toBeVisible();
  });

  test('should allow user to manage data sharing preferences', async ({ page }) => {
    await page.goto('/privacy');
    
    // Toggle data sharing options
    await page.locator('[data-testid="share-data-with-partners"]').click();
    await page.locator('[data-testid="allow-analytics"]').click();
    
    await page.click('[data-testid="save-data-preferences"]');
    await expect(page.locator('[data-testid="data-prefs-success"]')).toBeVisible();
  });

  test('should handle account deletion process', async ({ page }) => {
    await page.goto('/privacy');
    
    // Scroll to account deletion section
    await page.locator('[data-testid="account-deletion-section"]').scrollIntoViewIfNeeded();
    
    // Click on account deletion
    await page.click('[data-testid="delete-account-btn"]');
    
    // Confirm deletion process
    await expect(page.locator('[data-testid="deletion-confirmation-modal"]')).toBeVisible();
    
    // Enter password to confirm
    await page.fill('[data-testid="confirm-password-input"]', 'password123');
    await page.click('[data-testid="final-delete-btn"]');
    
    // Should redirect to confirmation page or login page
    await expect(page).toHaveURL(/.*\/account-deleted|\/login/);
  });

  test('should handle account deactivation process', async ({ page }) => {
    await page.goto('/privacy');
    
    // Test account deactivation instead of deletion
    await page.click('[data-testid="deactivate-account-btn"]');
    await expect(page.locator('[data-testid="deactivation-modal"]')).toBeVisible();
    
    // Confirm deactivation
    await page.fill('[data-testid="deactivation-password"]', 'password123');
    await page.click('[data-testid="confirm-deactivation"]');
    
    await expect(page.locator('[data-testid="deactivation-success"]')).toBeVisible();
  });

  test('should maintain responsive layout on privacy page', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/privacy');
    
    // Verify mobile-specific elements
    await expect(page.locator('[data-testid="mobile-privacy-menu"]')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(page.locator('h1')).toContainText('Privacy Settings');
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.reload();
    await expect(page.locator('h1')).toContainText('Privacy Settings');
  });

  test('should validate privacy settings properly', async ({ page }) => {
    await page.goto('/privacy');
    
    // Attempt to set conflicting privacy settings
    await page.click('[data-testid="profile-visibility-select"]');
    await page.click('text=Public');
    
    // If there are restrictions, test that they are enforced
    // For example, if certain options aren't allowed with Public visibility
    await page.click('[data-testid="save-privacy-settings"]');
    
    // Verify settings were saved properly
    await page.reload();
    await expect(page.locator('[data-testid="profile-visibility-select"]')).toHaveText('Public');
  });
});
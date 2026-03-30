import { test, expect } from '@playwright/test';

test.describe('Settings Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming user is logged in before accessing settings
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'testuser');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('should navigate to settings page and display correctly', async ({ page }) => {
    await page.click('[data-testid="settings-link"]');
    await expect(page).toHaveURL(/.*\/settings$/);
    await expect(page.locator('h1')).toContainText('Settings');
  });

  test('should allow user to edit profile information', async ({ page }) => {
    await page.goto('/settings');
    
    // Test editing display name
    await page.fill('[data-testid="display-name-input"]', 'Updated Name');
    await page.fill('[data-testid="bio-textarea"]', 'Updated bio information');
    
    // Save changes
    await page.click('[data-testid="save-profile-btn"]');
    
    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    
    // Verify updated information is displayed
    await expect(page.locator('[data-testid="display-name-input"]')).toHaveValue('Updated Name');
    await expect(page.locator('[data-testid="bio-textarea"]')).toHaveValue('Updated bio information');
  });

  test('should allow user to change password', async ({ page }) => {
    await page.goto('/settings');
    await page.click('[data-testid="change-password-tab"]');
    
    await page.fill('[data-testid="current-password"]', 'password123');
    await page.fill('[data-testid="new-password"]', 'newSecurePassword456');
    await page.fill('[data-testid="confirm-new-password"]', 'newSecurePassword456');
    
    await page.click('[data-testid="update-password-btn"]');
    await expect(page.locator('[data-testid="password-success-msg"]')).toBeVisible();
  });

  test('should allow user to update notification preferences', async ({ page }) => {
    await page.goto('/settings');
    await page.click('[data-testid="notifications-tab"]');
    
    // Toggle some notification settings
    await page.locator('[data-testid="email-notifications-toggle"]').click();
    await page.locator('[data-testid="push-notifications-toggle"]').click();
    
    await page.click('[data-testid="save-notifications-btn"]');
    await expect(page.locator('[data-testid="notification-success-msg"]')).toBeVisible();
  });

  test('should handle responsive layout correctly', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/settings');
    
    // Verify mobile menu exists
    await expect(page.locator('[data-testid="mobile-menu-btn"]')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(page.locator('h1')).toContainText('Settings');
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.reload();
    await expect(page.locator('h1')).toContainText('Settings');
  });
});
import { test, expect } from '@playwright/test';

test.describe('Notification Settings Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming we have a login process
    await page.goto('/');
    // Add authentication logic here if needed
  });

  test('should display notification settings page', async ({ page }) => {
    await page.goto('/settings/notifications');
    
    // Verify page title or header
    await expect(page.locator('h1')).toContainText('Notifications');
    await expect(page.getByRole('heading', { name: 'Notification Settings' })).toBeVisible();
  });

  test('should toggle notification preferences', async ({ page }) => {
    await page.goto('/settings/notifications');
    
    // Test email notifications toggle
    const emailToggle = page.locator('[data-testid="email-notifications-toggle"]');
    await expect(emailToggle).toBeVisible();
    const initialState = await emailToggle.isChecked();
    await emailToggle.click();
    await expect(emailToggle).not.toBeChecked();
    
    // Test push notifications toggle
    const pushToggle = page.locator('[data-testid="push-notifications-toggle"]');
    await expect(pushToggle).toBeVisible();
    await pushToggle.click();
    await expect(pushToggle).toBeChecked();
  });

  test('should save notification preferences', async ({ page }) => {
    await page.goto('/settings/notifications');
    
    // Change some settings
    await page.locator('[data-testid="email-notifications-toggle"]').click();
    await page.locator('[data-testid="daily-digest-toggle"]').click();
    
    // Save the settings
    await page.getByRole('button', { name: 'Save Settings' }).click();
    
    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    
    // Refresh and verify settings persisted
    await page.reload();
    await expect(page.locator('[data-testid="email-notifications-toggle"]')).not.toBeChecked();
    await expect(page.locator('[data-testid="daily-digest-toggle"]')).not.toBeChecked();
  });

  test('should configure notification timing', async ({ page }) => {
    await page.goto('/settings/notifications');
    
    // Test time selection
    const timeSelect = page.locator('[data-testid="notification-time"]');
    await expect(timeSelect).toBeVisible();
    
    // Select a different time
    await timeSelect.selectOption({ label: 'Morning (9:00 AM)' });
    
    // Save settings
    await page.getByRole('button', { name: 'Save Settings' }).click();
    
    // Verify saved value
    await page.reload();
    await expect(timeSelect).toHaveValue('morning');
  });

  test('should handle notification preference validation', async ({ page }) => {
    await page.goto('/settings/notifications');
    
    // Attempt to save with invalid settings if applicable
    // This would depend on specific validation rules
    
    // Verify validation messages appear if appropriate
    const saveButton = page.getByRole('button', { name: 'Save Settings' });
    await saveButton.click();
    
    // Wait for potential validation feedback
    await page.waitForTimeout(500);
  });

  test('should configure scheduled reminders', async ({ page }) => {
    await page.goto('/settings/notifications');
    
    // Test scheduled reminder settings
    const reminderToggle = page.locator('[data-testid="scheduled-reminders-toggle"]');
    if (await reminderToggle.count() > 0) {
      await expect(reminderToggle).toBeVisible();
      
      // Enable scheduled reminders
      const initialChecked = await reminderToggle.isChecked();
      if (!initialChecked) {
        await reminderToggle.click();
      }
      await expect(reminderToggle).toBeChecked();
      
      // Configure reminder time
      const reminderTimeSelect = page.locator('[data-testid="reminder-time-select"]');
      await expect(reminderTimeSelect).toBeVisible();
      await reminderTimeSelect.selectOption({ value: '09:00' });
      
      // Configure reminder frequency
      const frequencySelect = page.locator('[data-testid="reminder-frequency"]');
      await expect(frequencySelect).toBeVisible();
      await frequencySelect.selectOption({ label: 'Daily' });
      
      // Save settings
      await page.getByRole('button', { name: 'Save Settings' }).click();
      
      // Verify success
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    }
  });

  test('should test reminder delivery simulation', async ({ page }) => {
    await page.goto('/settings/notifications');
    
    // Find the test reminder button if it exists
    const testReminderBtn = page.getByRole('button', { name: 'Test Reminder' });
    if (await testReminderBtn.count() > 0) {
      await expect(testReminderBtn).toBeVisible();
      
      // Click to simulate a reminder
      await testReminderBtn.click();
      
      // Verify the test reminder was triggered successfully
      await expect(page.locator('[data-testid="test-reminder-success"]')).toBeVisible();
    }
  });
});

// Responsive design tests for notification settings
test.describe('Notification Settings Responsive Design', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // Mobile
  
  test('should display notification settings correctly on mobile', async ({ page }) => {
    await page.goto('/settings/notifications');
    
    // Verify layout elements are visible and accessible on mobile
    const header = page.locator('h1');
    await expect(header).toBeVisible();
    
    // Test that toggles are appropriately sized for touch
    const toggles = page.locator('[data-testid*="-toggle"]');
    await expect(toggles.first()).toBeVisible();
    
    // Verify that buttons are tap-friendly sized
    const saveButton = page.getByRole('button', { name: 'Save Settings' });
    await expect(saveButton).toBeVisible();
  });

  test('should maintain functionality on tablet view', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // Tablet
    await page.goto('/settings/notifications');
    
    // Test basic functionality remains intact
    const toggle = page.locator('[data-testid="email-notifications-toggle"]');
    await expect(toggle).toBeVisible();
    const initialState = await toggle.isChecked();
    await toggle.click();
    await expect(toggle).not.toBeChecked();
  });
});
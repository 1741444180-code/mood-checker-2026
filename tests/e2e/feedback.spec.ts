import { test, expect } from '@playwright/test';

test.describe('Feedback Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should submit feedback successfully', async ({ page }) => {
    // Navigate to feedback page
    await page.getByRole('button', { name: 'Feedback' }).click();
    
    // Fill in feedback form
    await page.locator('#feedback-type').click();
    await page.getByRole('option', { name: 'Bug Report' }).click();
    
    await page.locator('#feedback-title').fill('Test Bug Report');
    await page.locator('#feedback-description').fill('This is a test bug report for verifying feedback functionality.');
    await page.locator('#feedback-email').fill('test@example.com');
    
    // Submit feedback
    await page.getByRole('button', { name: 'Submit Feedback' }).click();
    
    // Verify success message
    await expect(page.getByText('Feedback submitted successfully')).toBeVisible();
  });

  test('should validate feedback form', async ({ page }) => {
    // Navigate to feedback page
    await page.getByRole('button', { name: 'Feedback' }).click();
    
    // Try submitting empty form
    await page.getByRole('button', { name: 'Submit Feedback' }).click();
    
    // Verify validation messages
    await expect(page.locator('#feedback-title')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#feedback-description')).toHaveAttribute('aria-invalid', 'true');
  });

  test('should handle feedback with attachment', async ({ page }) => {
    // Navigate to feedback page
    await page.getByRole('button', { name: 'Feedback' }).click();
    
    // Fill in feedback form
    await page.locator('#feedback-type').click();
    await page.getByRole('option', { name: 'Feature Request' }).click();
    
    await page.locator('#feedback-title').fill('Test Feature Request');
    await page.locator('#feedback-description').fill('This is a test feature request with attachment.');
    await page.locator('#feedback-email').fill('test@example.com');
    
    // Upload screenshot
    const fileInput = page.locator('#feedback-attachment');
    await fileInput.setInputFiles('tests/fixtures/sample-screenshot.png');
    
    // Submit feedback
    await page.getByRole('button', { name: 'Submit Feedback' }).click();
    
    // Verify success message
    await expect(page.getByText('Feedback submitted successfully')).toBeVisible();
  });

  test('should display feedback submission history', async ({ page }) => {
    // Navigate to feedback page
    await page.getByRole('button', { name: 'Feedback' }).click();
    
    // Check if feedback history is displayed
    const historySection = page.locator('#feedback-history');
    await expect(historySection).toBeVisible();
    
    // Verify at least one feedback item exists
    const feedbackItems = page.locator('.feedback-item');
    await expect(feedbackItems.first()).toBeVisible();
  });
});
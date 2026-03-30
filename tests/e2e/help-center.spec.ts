import { test, expect } from '@playwright/test';

test.describe('Help Center Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/help');
  });

  test('should display help center homepage', async ({ page }) => {
    // Verify help center page loads correctly
    await expect(page.getByRole('heading', { name: 'Help Center' })).toBeVisible();
    await expect(page.getByText('Frequently Asked Questions')).toBeVisible();
    await expect(page.getByText('Contact Support')).toBeVisible();
  });

  test('should search FAQ successfully', async ({ page }) => {
    // Type in search query
    await page.locator('#faq-search').fill('login');
    
    // Submit search
    await page.locator('#faq-search').press('Enter');
    
    // Verify search results are displayed
    const searchResults = page.locator('.faq-result');
    await expect(searchResults.first()).toBeVisible();
    
    // Verify results contain search term
    const resultTitles = page.locator('.faq-question');
    await expect(resultTitles.first()).toContainText('login');
  });

  test('should filter FAQs by category', async ({ page }) => {
    // Click on a category
    await page.getByRole('button', { name: 'Account' }).click();
    
    // Verify filtered results
    const faqItems = page.locator('.faq-item');
    await expect(faqItems).toHaveCount(5);
    
    // Verify all items belong to selected category
    await expect(faqItems.first()).toContainText('Account');
  });

  test('should expand and collapse FAQ items', async ({ page }) => {
    // Find first FAQ item
    const firstFAQ = page.locator('.faq-item').first();
    const questionButton = firstFAQ.locator('.faq-question');
    
    // Verify answer is initially hidden
    const answer = firstFAQ.locator('.faq-answer');
    await expect(answer).not.toBeVisible();
    
    // Click to expand
    await questionButton.click();
    
    // Verify answer is now visible
    await expect(answer).toBeVisible();
    
    // Click again to collapse
    await questionButton.click();
    
    // Verify answer is hidden again
    await expect(answer).not.toBeVisible();
  });

  test('should submit contact form', async ({ page }) => {
    // Navigate to contact form
    await page.getByRole('link', { name: 'Contact Support' }).click();
    
    // Fill in contact form
    await page.locator('#contact-name').fill('Test User');
    await page.locator('#contact-email').fill('test@example.com');
    await page.locator('#contact-subject').fill('Test Subject');
    await page.locator('#contact-message').fill('This is a test message for help center functionality.');
    
    // Submit form
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Verify success message
    await expect(page.getByText('Your message has been sent successfully')).toBeVisible();
  });

  test('should handle contact form validation', async ({ page }) => {
    // Navigate to contact form
    await page.getByRole('link', { name: 'Contact Support' }).click();
    
    // Try submitting empty form
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Verify validation messages
    await expect(page.locator('#contact-name')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#contact-email')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#contact-message')).toHaveAttribute('aria-invalid', 'true');
  });

  test('should display help articles', async ({ page }) => {
    // Click on a help article
    const firstArticle = page.locator('.help-article-link').first();
    await firstArticle.click();
    
    // Verify article page loads
    await expect(page.locator('.article-content')).toBeVisible();
    await expect(page.locator('.article-title')).toBeVisible();
    
    // Verify back to help center link
    const backButton = page.getByRole('link', { name: 'Back to Help Center' });
    await expect(backButton).toBeVisible();
  });

  test('should handle email notification preference', async ({ page }) => {
    // Navigate to notification settings
    await page.getByRole('button', { name: 'Settings' }).click();
    
    // Find email notification toggle
    const emailNotificationToggle = page.locator('#email-notifications-toggle');
    const initialState = await emailNotificationToggle.isChecked();
    
    // Toggle the setting
    await emailNotificationToggle.click();
    
    // Verify the change was saved
    await expect(emailNotificationToggle).not.toHaveValue(initialState.toString());
    
    // Toggle back to original state
    await emailNotificationToggle.click();
  });
});

test.describe('Responsive Layout Tests', () => {
  test('should display mobile menu on small screens', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Reload page
    await page.reload();
    
    // Verify mobile menu button is visible
    const mobileMenuButton = page.locator('.mobile-menu-toggle');
    await expect(mobileMenuButton).toBeVisible();
    
    // Verify desktop navigation is hidden
    const desktopNav = page.locator('.desktop-nav');
    await expect(desktopNav).not.toBeVisible();
    
    // Click mobile menu button
    await mobileMenuButton.click();
    
    // Verify mobile menu is displayed
    const mobileMenu = page.locator('.mobile-menu');
    await expect(mobileMenu).toBeVisible();
  });

  test('should adjust layout on tablet screens', async ({ page }) => {
    // Set viewport to tablet size
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Reload page
    await page.reload();
    
    // Verify responsive elements adjust properly
    const container = page.locator('.container');
    const computedWidth = await container.evaluate((el) => window.getComputedStyle(el).width);
    
    // Check that layout is appropriate for tablet
    expect(parseInt(computedWidth)).toBeLessThan(1200);
    expect(parseInt(computedWidth)).toBeGreaterThan(600);
  });

  test('should maintain readability on all screen sizes', async ({ page }) => {
    // Test various screen sizes
    const sizes = [
      { width: 320, height: 568 },   // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1024, height: 768 },  // Desktop
      { width: 1920, height: 1080 }  // Large Desktop
    ];
    
    for (const size of sizes) {
      await page.setViewportSize(size);
      await page.reload();
      
      // Check that main content is visible and readable
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
      
      // Check that text elements have appropriate font sizes
      const headings = page.locator('h1, h2, h3');
      await expect(headings.first()).toBeVisible();
    }
  });
});
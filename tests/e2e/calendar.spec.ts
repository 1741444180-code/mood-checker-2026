import { test, expect } from '@playwright/test';

test.describe('Calendar Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Add authentication logic here if needed
  });

  test('should display calendar view', async ({ page }) => {
    await page.goto('/calendar');
    
    // Verify calendar is displayed
    await expect(page.locator('[data-testid="calendar-view"]')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Calendar' })).toBeVisible();
    
    // Check for month/year navigation controls
    await expect(page.locator('[data-testid="calendar-prev-month"]')).toBeVisible();
    await expect(page.locator('[data-testid="calendar-next-month"]')).toBeVisible();
    await expect(page.locator('[data-testid="current-month-display"]')).toBeVisible();
  });

  test('should navigate between months', async ({ page }) => {
    await page.goto('/calendar');
    
    // Get current month
    const currentMonth = await page.locator('[data-testid="current-month-display"]').textContent();
    
    // Navigate to next month
    await page.locator('[data-testid="calendar-next-month"]').click();
    await page.waitForTimeout(300); // Allow transition
    
    const nextMonth = await page.locator('[data-testid="current-month-display"]').textContent();
    expect(currentMonth).not.toEqual(nextMonth);
    
    // Navigate back to previous month
    await page.locator('[data-testid="calendar-prev-month"]').click();
    await page.waitForTimeout(300);
    
    const prevMonth = await page.locator('[data-testid="current-month-display"]').textContent();
    expect(prevMonth).toEqual(currentMonth);
  });

  test('should display events on calendar', async ({ page }) => {
    await page.goto('/calendar');
    
    // Look for event markers on the calendar
    const events = page.locator('[data-testid="calendar-event-marker"]');
    await expect(events.first()).toBeVisible();
    
    // Click on an event to view details
    await events.first().click();
    
    // Verify event details modal/popover appears
    await expect(page.locator('[data-testid="event-details-modal"]')).toBeVisible();
  });

  test('should create new event', async ({ page }) => {
    await page.goto('/calendar');
    
    // Find and click the create event button
    const createEventBtn = page.getByRole('button', { name: 'Create Event' });
    await expect(createEventBtn).toBeVisible();
    await createEventBtn.click();
    
    // Fill in event details
    await page.locator('[data-testid="event-title-input"]').fill('Test Event');
    await page.locator('[data-testid="event-date-input"]').click();
    
    // Select a date
    const todayDate = new Date();
    const day = todayDate.getDate();
    await page.locator(`[data-date="${day}"]`).click();
    
    // Set time
    await page.locator('[data-testid="event-start-time"]').fill('10:00');
    await page.locator('[data-testid="event-end-time"]').fill('11:00');
    
    // Save event
    await page.getByRole('button', { name: 'Save Event' }).click();
    
    // Verify event was created
    await expect(page.locator('[data-testid="event-success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="calendar-event-marker"]').filter({ hasText: 'Test Event' })).toBeVisible();
  });

  test('should edit existing event', async ({ page }) => {
    await page.goto('/calendar');
    
    // Find an existing event
    const eventMarker = page.locator('[data-testid="calendar-event-marker"]').first();
    await expect(eventMarker).toBeVisible();
    
    // Click to open event details
    await eventMarker.click();
    
    // Click edit button
    await page.getByRole('button', { name: 'Edit' }).click();
    
    // Modify event title
    await page.locator('[data-testid="event-title-input"]').fill('Updated Test Event');
    
    // Save changes
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    // Verify update was successful
    await expect(page.locator('[data-testid="event-success-message"]')).toBeVisible();
  });

  test('should delete event', async ({ page }) => {
    await page.goto('/calendar');
    
    // Find an existing event
    const eventMarker = page.locator('[data-testid="calendar-event-marker"]').first();
    await expect(eventMarker).toBeVisible();
    
    // Click to open event details
    await eventMarker.click();
    
    // Click delete button
    await page.getByRole('button', { name: 'Delete' }).click();
    
    // Confirm deletion if there's a confirmation dialog
    const confirmDialog = page.locator('[data-testid="confirm-dialog"]');
    if (await confirmDialog.isVisible()) {
      await page.getByRole('button', { name: 'Confirm' }).click();
    }
    
    // Verify event was deleted
    await expect(page.locator('[data-testid="event-delete-success"]')).toBeVisible();
  });

  test('should switch between calendar views', async ({ page }) => {
    await page.goto('/calendar');
    
    // Test month view
    await page.getByRole('button', { name: 'Month' }).click();
    await expect(page.locator('[data-testid="calendar-month-view"]')).toBeVisible();
    
    // Test week view
    await page.getByRole('button', { name: 'Week' }).click();
    await expect(page.locator('[data-testid="calendar-week-view"]')).toBeVisible();
    
    // Test day view
    await page.getByRole('button', { name: 'Day' }).click();
    await expect(page.locator('[data-testid="calendar-day-view"]')).toBeVisible();
  });

  test('should display correct events for selected date', async ({ page }) => {
    await page.goto('/calendar');
    
    // Switch to day view
    await page.getByRole('button', { name: 'Day' }).click();
    
    // Select a specific date
    const dateCell = page.locator('[data-testid="calendar-cell"]').first();
    await dateCell.click();
    
    // Verify events for that day are displayed
    await expect(page.locator('[data-testid="day-events-list"]')).toBeVisible();
  });
});

// Responsive design tests for calendar
test.describe('Calendar Responsive Design', () => {
  test.describe('Mobile View', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should display calendar correctly on mobile', async ({ page }) => {
      await page.goto('/calendar');
      
      // On mobile, ensure day view is prioritized or simplified
      await expect(page.locator('[data-testid="mobile-calendar-view"]')).toBeVisible();
      
      // Verify navigation elements are accessible
      await expect(page.locator('[data-testid="calendar-nav-mobile"]')).toBeVisible();
      
      // Test swipe gestures if implemented
      const calendarView = page.locator('[data-testid="calendar-container"]');
      await expect(calendarView).toBeVisible();
    });

    test('should create event on mobile', async ({ page }) => {
      await page.goto('/calendar');
      
      // Test event creation flow on mobile
      const addEventBtn = page.locator('[data-testid="add-event-mobile"]');
      await expect(addEventBtn).toBeVisible();
      await addEventBtn.click();
      
      // Fill form on mobile interface
      await page.locator('[data-testid="event-title-input"]').fill('Mobile Test Event');
      await page.getByRole('button', { name: 'Save' }).click();
      
      // Verify success
      await expect(page.locator('[data-testid="event-success-message"]')).toBeVisible();
    });
  });

  test.describe('Tablet View', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test('should adapt calendar layout for tablet', async ({ page }) => {
      await page.goto('/calendar');
      
      // Verify responsive layout
      await expect(page.locator('[data-testid="tablet-calendar-layout"]')).toBeVisible();
      
      // Test that all core functionality works
      await expect(page.locator('[data-testid="calendar-prev-month"]')).toBeVisible();
      await expect(page.locator('[data-testid="calendar-next-month"]')).toBeVisible();
    });
  });
});
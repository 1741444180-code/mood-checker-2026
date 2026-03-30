import { test, expect } from '@playwright/test';

/**
 * Day1-13 Regression Test Suite
 * This test suite covers all major functionality developed in Days 1-13
 */

// Define common selectors and constants
const SELECTORS = {
  // Navigation
  NAV_HOME: 'nav a[href="/"]',
  NAV_PROFILE: 'nav a[href="/profile"]',
  NAV_CALENDAR: 'nav a[href="/calendar"]',
  NAV_BADGES: 'nav a[href="/badges"]',
  NAV_LEADERBOARD: 'nav a[href="/leaderboard"]',
  NAV_ADMIN: 'nav a[href="/admin"]',
  NAV_NOTIFICATIONS: 'nav a[href="/notifications"]',
  
  // Authentication
  LOGIN_USERNAME: '[data-testid="username"]',
  LOGIN_PASSWORD: '[data-testid="password"]',
  LOGIN_SUBMIT: 'button[type="submit"]',
  LOGOUT_BUTTON: '[data-testid="logout-btn"]',
  
  // Profile
  PROFILE_AVATAR: '[data-testid="user-avatar"]',
  PROFILE_USERNAME: '[data-testid="username-display"]',
  CONSECUTIVE_DAYS: '[data-testid="consecutive-days"]',
  TOTAL_CHECKINS: '[data-testid="total-checkins"]',
  
  // Calendar
  CALENDAR_VIEW: '[data-testid="calendar-view"]',
  CURRENT_MONTH: '[data-testid="current-month-display"]',
  
  // Badges
  BADGE_LIST: '[data-testid="badge-list"]',
  USER_BADGES: '[data-testid="user-badge"]',
  
  // Leaderboard
  LEADERBOARD_TABLE: '[data-testid="leaderboard-table"]',
  USER_RANK: '[data-testid="user-rank"]',
  
  // Notifications
  NOTIFICATION_ITEM: '[data-testid="notification-item"]',
  UNREAD_INDICATOR: '[data-testid="unread-indicator"]',
  
  // Admin
  ADMIN_DASHBOARD: '.dashboard',
  USER_MANAGEMENT: 'text=用户管理',
  CONTENT_REVIEW: 'text=内容审核',
};

// Common test data
const TEST_USER = {
  username: 'testuser',
  password: 'testpass',
  email: 'test@example.com'
};

const ADMIN_USER = {
  username: 'admin',
  password: 'admin123'
};

test.describe('Day1-13 Regression Tests', () => {
  // Test Case: Basic Navigation and Routing
  test('Navigation between all main pages', async ({ page }) => {
    // Start from home page
    await page.goto('/');
    await expect(page).toHaveTitle(/Fish Shrimp Crab/);
    
    // Navigate to profile
    await page.locator(SELECTORS.NAV_PROFILE).click();
    await expect(page).toHaveURL(/\/profile/);
    await expect(page.locator(SELECTORS.PROFILE_AVATAR)).toBeVisible();
    
    // Navigate to calendar
    await page.locator(SELECTORS.NAV_CALENDAR).click();
    await expect(page).toHaveURL(/\/calendar/);
    await expect(page.locator(SELECTORS.CALENDAR_VIEW)).toBeVisible();
    
    // Navigate to badges
    await page.locator(SELECTORS.NAV_BADGES).click();
    await expect(page).toHaveURL(/\/badges/);
    await expect(page.locator(SELECTORS.BADGE_LIST)).toBeVisible();
    
    // Navigate to leaderboard
    await page.locator(SELECTORS.NAV_LEADERBOARD).click();
    await expect(page).toHaveURL(/\/leaderboard/);
    await expect(page.locator(SELECTORS.LEADERBOARD_TABLE)).toBeVisible();
  });

  // Test Case: User Authentication Flow
  test('User login and logout functionality', async ({ page }) => {
    // Go to login page
    await page.goto('/login');
    
    // Fill credentials
    await page.locator(SELECTORS.LOGIN_USERNAME).fill(TEST_USER.username);
    await page.locator(SELECTORS.LOGIN_PASSWORD).fill(TEST_USER.password);
    await page.locator(SELECTORS.LOGIN_SUBMIT).click();
    
    // Verify successful login
    await expect(page.locator(SELECTORS.PROFILE_AVATAR)).toBeVisible();
    await expect(page.locator(SELECTORS.PROFILE_USERNAME)).toContainText(TEST_USER.username);
    
    // Log out
    await page.locator(SELECTORS.LOGOUT_BUTTON).click();
    
    // Verify logout
    await expect(page.locator(SELECTORS.LOGIN_USERNAME)).toBeVisible();
  });

  // Test Case: Profile Page Functionality
  test('Profile page displays user information and statistics', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.locator(SELECTORS.LOGIN_USERNAME).fill(TEST_USER.username);
    await page.locator(SELECTORS.LOGIN_PASSWORD).fill(TEST_USER.password);
    await page.locator(SELECTORS.LOGIN_SUBMIT).click();
    
    // Navigate to profile
    await page.goto('/profile');
    
    // Verify user information is displayed
    await expect(page.locator(SELECTORS.PROFILE_AVATAR)).toBeVisible();
    await expect(page.locator(SELECTORS.PROFILE_USERNAME)).toContainText(TEST_USER.username);
    
    // Verify statistics are displayed
    await expect(page.locator(SELECTORS.CONSECUTIVE_DAYS)).toBeVisible();
    await expect(page.locator(SELECTORS.TOTAL_CHECKINS)).toBeVisible();
    
    // Verify chart elements
    const chartElement = page.locator('[data-testid="checkin-chart"]');
    await expect(chartElement).toBeVisible();
  });

  // Test Case: Calendar Functionality
  test('Calendar displays and allows navigation', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.locator(SELECTORS.LOGIN_USERNAME).fill(TEST_USER.username);
    await page.locator(SELECTORS.LOGIN_PASSWORD).fill(TEST_USER.password);
    await page.locator(SELECTORS.LOGIN_SUBMIT).click();
    
    // Navigate to calendar
    await page.goto('/calendar');
    
    // Verify calendar is displayed
    await expect(page.locator(SELECTORS.CALENDAR_VIEW)).toBeVisible();
    
    // Verify current month is displayed
    await expect(page.locator(SELECTORS.CURRENT_MONTH)).toBeVisible();
    
    // Test month navigation
    const originalMonth = await page.locator(SELECTORS.CURRENT_MONTH).textContent();
    
    // Navigate to next month
    await page.locator('[data-testid="calendar-next-month"]').click();
    await page.waitForTimeout(300);
    
    const nextMonth = await page.locator(SELECTORS.CURRENT_MONTH).textContent();
    expect(originalMonth).not.toEqual(nextMonth);
    
    // Navigate back
    await page.locator('[data-testid="calendar-prev-month"]').click();
    await page.waitForTimeout(300);
    
    const prevMonth = await page.locator(SELECTORS.CURRENT_MONTH).textContent();
    expect(prevMonth).toEqual(originalMonth);
  });

  // Test Case: Badges Functionality
  test('Badges page displays user badges and progress', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.locator(SELECTORS.LOGIN_USERNAME).fill(TEST_USER.username);
    await page.locator(SELECTORS.LOGIN_PASSWORD).fill(TEST_USER.password);
    await page.locator(SELECTORS.LOGIN_SUBMIT).click();
    
    // Navigate to badges
    await page.goto('/badges');
    
    // Verify badge list is displayed
    await expect(page.locator(SELECTORS.BADGE_LIST)).toBeVisible();
    
    // Verify user badges are shown
    const userBadges = page.locator(SELECTORS.USER_BADGES);
    await expect(userBadges).toHaveCountGreaterThan(0);
    
    // Verify badge details are visible
    const firstBadge = userBadges.first();
    await expect(firstBadge).toBeVisible();
  });

  // Test Case: Leaderboard Functionality
  test('Leaderboard displays rankings correctly', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.locator(SELECTORS.LOGIN_USERNAME).fill(TEST_USER.username);
    await page.locator(SELECTORS.LOGIN_PASSWORD).fill(TEST_USER.password);
    await page.locator(SELECTORS.LOGIN_SUBMIT).click();
    
    // Navigate to leaderboard
    await page.goto('/leaderboard');
    
    // Verify leaderboard table is displayed
    await expect(page.locator(SELECTORS.LEADERBOARD_TABLE)).toBeVisible();
    
    // Verify user rank is displayed
    await expect(page.locator(SELECTORS.USER_RANK)).toBeVisible();
    
    // Verify multiple ranking entries exist
    const rankRows = page.locator('.rank-entry');
    await expect(rankRows).toHaveCountGreaterThan(1);
  });

  // Test Case: Notifications Functionality
  test('Notifications page displays and manages notifications', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.locator(SELECTORS.LOGIN_USERNAME).fill(TEST_USER.username);
    await page.locator(SELECTORS.LOGIN_PASSWORD).fill(TEST_USER.password);
    await page.locator(SELECTORS.LOGIN_SUBMIT).click();
    
    // Navigate to notifications
    await page.goto('/notifications');
    
    // Verify notifications are displayed
    const notificationItems = page.locator(SELECTORS.NOTIFICATION_ITEM);
    await expect(notificationItems).toHaveCountGreaterThan(0);
    
    // Verify unread indicators
    const unreadIndicators = page.locator(SELECTORS.UNREAD_INDICATOR);
    await expect(unreadIndicators).toBeVisible();
  });

  // Test Case: Admin Dashboard Access (if user has admin privileges)
  test('Admin dashboard access and basic functionality', async ({ page }) => {
    // Login with admin credentials
    await page.goto('/admin/login');
    await page.fill('#username', ADMIN_USER.username);
    await page.fill('#password', ADMIN_USER.password);
    await page.click('button[type="submit"]');
    
    // Verify admin dashboard loads
    await expect(page.locator(SELECTORS.ADMIN_DASHBOARD)).toBeVisible();
    await expect(page.locator('text=欢迎回来，管理员')).toBeVisible();
    
    // Test user management access
    await page.locator(SELECTORS.USER_MANAGEMENT).click();
    await expect(page.locator('.user-list')).toBeVisible();
    
    // Test content review access
    await page.goto('/admin/dashboard'); // Return to dashboard
    await page.locator(SELECTORS.CONTENT_REVIEW).click();
    await expect(page.locator('.pending-content')).toBeVisible();
  });

  // Test Case: Responsive Design - Desktop
  test('Responsive design - Desktop view', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Login
    await page.goto('/login');
    await page.locator(SELECTORS.LOGIN_USERNAME).fill(TEST_USER.username);
    await page.locator(SELECTORS.LOGIN_PASSWORD).fill(TEST_USER.password);
    await page.locator(SELECTORS.LOGIN_SUBMIT).click();
    
    // Test profile page on desktop
    await page.goto('/profile');
    const profileContainer = page.locator('[data-testid="profile-container"]');
    await expect(profileContainer).toBeVisible();
    
    // Test navigation remains functional
    await page.locator(SELECTORS.NAV_CALENDAR).click();
    await expect(page.locator(SELECTORS.CALENDAR_VIEW)).toBeVisible();
  });

  // Test Case: Responsive Design - Tablet
  test('Responsive design - Tablet view', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Login
    await page.goto('/login');
    await page.locator(SELECTORS.LOGIN_USERNAME).fill(TEST_USER.username);
    await page.locator(SELECTORS.LOGIN_PASSWORD).fill(TEST_USER.password);
    await page.locator(SELECTORS.LOGIN_SUBMIT).click();
    
    // Test profile page on tablet
    await page.goto('/profile');
    const profileContainer = page.locator('[data-testid="profile-container"]');
    await expect(profileContainer).toBeVisible();
    
    // Verify tablet-specific layout elements
    const navBar = page.locator('[data-testid="nav-bar"]');
    await expect(navBar).toBeVisible();
  });

  // Test Case: Responsive Design - Mobile
  test('Responsive design - Mobile view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Login
    await page.goto('/login');
    await page.locator(SELECTORS.LOGIN_USERNAME).fill(TEST_USER.username);
    await page.locator(SELECTORS.LOGIN_PASSWORD).fill(TEST_USER.password);
    await page.locator(SELECTORS.LOGIN_SUBMIT).click();
    
    // Test profile page on mobile
    await page.goto('/profile');
    const profileContainer = page.locator('[data-testid="profile-container"]');
    await expect(profileContainer).toBeVisible();
    
    // Verify mobile menu is available
    const mobileMenu = page.locator('[data-testid="mobile-menu-btn"]');
    await expect(mobileMenu).toBeVisible();
    
    // Test navigation in mobile view
    await mobileMenu.click();
    await expect(page.locator(SELECTORS.NAV_PROFILE)).toBeVisible();
  });

  // Test Case: Form Validation
  test('Form validation on login page', async ({ page }) => {
    await page.goto('/login');
    
    // Submit empty form
    await page.locator(SELECTORS.LOGIN_SUBMIT).click();
    
    // Verify validation messages appear
    const validationMessages = page.locator('text=请输入');
    await expect(validationMessages).toHaveCountGreaterThan(0);
  });

  // Test Case: Error Handling
  test('Error handling for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Enter invalid credentials
    await page.locator(SELECTORS.LOGIN_USERNAME).fill('invalid_user');
    await page.locator(SELECTORS.LOGIN_PASSWORD).fill('invalid_password');
    await page.locator(SELECTORS.LOGIN_SUBMIT).click();
    
    // Verify error message is displayed
    const errorMessage = page.locator('text=用户名或密码错误');
    await expect(errorMessage).toBeVisible();
  });

  // Test Case: Performance - Page Load Times
  test('Performance - Profile page loads within acceptable time', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.locator(SELECTORS.LOGIN_USERNAME).fill(TEST_USER.username);
    await page.locator(SELECTORS.LOGIN_PASSWORD).fill(TEST_USER.password);
    await page.locator(SELECTORS.LOGIN_SUBMIT).click();
    
    const startTime = Date.now();
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Verify page loads within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Verify critical elements load quickly
    await expect(page.locator(SELECTORS.PROFILE_AVATAR)).toBeVisible({ timeout: 2000 });
    await expect(page.locator(SELECTORS.CONSECUTIVE_DAYS)).toBeVisible({ timeout: 2000 });
  });
});

// Additional regression tests for specific features
test.describe('Feature-Specific Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure user is logged in before each test
    await page.goto('/login');
    await page.locator(SELECTORS.LOGIN_USERNAME).fill(TEST_USER.username);
    await page.locator(SELECTORS.LOGIN_PASSWORD).fill(TEST_USER.password);
    await page.locator(SELECTORS.LOGIN_SUBMIT).click();
    await page.waitForURL('/profile'); // Wait for redirect to profile
  });

  // Test badge unlocking functionality
  test('Badge unlocking functionality', async ({ page }) => {
    await page.goto('/badges');
    
    // Verify badge progress tracking
    const progressBars = page.locator('[data-testid="badge-progress"]');
    await expect(progressBars).toHaveCountGreaterThan(0);
    
    // Verify locked/unlocked badge states
    const unlockedBadges = page.locator('[data-testid="unlocked-badge"]');
    const lockedBadges = page.locator('[data-testid="locked-badge"]');
    
    // At least some badges should be in either state
    const unlockedCount = await unlockedBadges.count();
    const lockedCount = await lockedBadges.count();
    
    expect(unlockedCount + lockedCount).toBeGreaterThan(0);
  });

  // Test leaderboard filtering
  test('Leaderboard filtering functionality', async ({ page }) => {
    await page.goto('/leaderboard');
    
    // Verify default sorting
    await expect(page.locator(SELECTORS.LEADERBOARD_TABLE)).toBeVisible();
    
    // Test category filtering if available
    const categoryFilters = page.locator('[data-testid="category-filter"]');
    if (await categoryFilters.count() > 0) {
      await categoryFilters.first().click();
      // Verify table updates after filtering
      await expect(page.locator(SELECTORS.LEADERBOARD_TABLE)).toBeVisible();
    }
  });

  // Test calendar event creation
  test('Calendar event creation functionality', async ({ page }) => {
    await page.goto('/calendar');
    
    // Attempt to create a test event
    const createEventBtn = page.getByRole('button', { name: 'Create Event' });
    if (await createEventBtn.count() > 0) {
      await createEventBtn.click();
      
      // Fill in event details
      await page.locator('[data-testid="event-title-input"]').fill('Regression Test Event');
      await page.locator('[data-testid="event-date-input"]').click();
      
      // Select a date
      const todayDate = new Date();
      const day = todayDate.getDate();
      await page.locator(`[data-date="${day}"]`).click();
      
      // Save event
      await page.getByRole('button', { name: 'Save Event' }).click();
      
      // Verify event was created
      await expect(page.locator('[data-testid="event-success-message"]')).toBeVisible();
    }
  });

  // Test notification marking as read
  test('Notification marking as read functionality', async ({ page }) => {
    await page.goto('/notifications');
    
    // Find an unread notification
    const unreadNotifications = page.locator(`${SELECTORS.NOTIFICATION_ITEM}[data-unread="true"]`);
    if (await unreadNotifications.count() > 0) {
      const firstUnread = unreadNotifications.first();
      await firstUnread.click();
      
      // Mark as read (if there's a specific button)
      const markAsReadBtn = page.locator('[data-testid="mark-as-read"]');
      if (await markAsReadBtn.count() > 0) {
        await markAsReadBtn.first().click();
        
        // Verify notification is now marked as read
        await expect(firstUnread).not.toHaveAttribute('data-unread', 'true');
      }
    }
  });
});
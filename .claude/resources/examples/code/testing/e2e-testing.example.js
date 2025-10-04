/**
 * End-to-End Testing Examples
 *
 * Comprehensive examples for testing complete user workflows
 * using Playwright for browser automation
 *
 * Features:
 * - Page Object Model pattern
 * - User workflow testing
 * - Cross-browser testing
 * - Mobile responsive testing
 * - Accessibility testing
 * - Visual regression testing
 */

const { test, expect } = require('@playwright/test');

// Page Object Model implementation
class RegistrationPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.confirmPasswordInput = page.locator('[data-testid="confirm-password-input"]');
    this.nameInput = page.locator('[data-testid="name-input"]');
    this.registerButton = page.locator('[data-testid="register-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.termsCheckbox = page.locator('[data-testid="terms-checkbox"]');
    this.newsletterCheckbox = page.locator('[data-testid="newsletter-checkbox"]');
  }

  async goto() {
    await this.page.goto('/register');
    await expect(this.page).toHaveTitle(/Register/);
  }

  async fillRegistrationForm(userData) {
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);

    if (userData.confirmPassword) {
      await this.confirmPasswordInput.fill(userData.confirmPassword);
    }

    await this.nameInput.fill(userData.name);

    if (userData.acceptTerms) {
      await this.termsCheckbox.check();
    }

    if (userData.subscribeNewsletter) {
      await this.newsletterCheckbox.check();
    }
  }

  async submitForm() {
    await this.registerButton.click();
  }

  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible' });
    return await this.errorMessage.textContent();
  }

  async getSuccessMessage() {
    await this.successMessage.waitFor({ state: 'visible' });
    return await this.successMessage.textContent();
  }

  async waitForRedirect(expectedUrl) {
    await this.page.waitForURL(expectedUrl);
  }
}

class LoginPage {
  constructor(page) {
    this.page = page;

    this.emailInput = page.locator('[data-testid="login-email"]');
    this.passwordInput = page.locator('[data-testid="login-password"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.forgotPasswordLink = page.locator('[data-testid="forgot-password-link"]');
    this.errorMessage = page.locator('[data-testid="login-error"]');
    this.rememberMeCheckbox = page.locator('[data-testid="remember-me"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email, password, rememberMe = false) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    if (rememberMe) {
      await this.rememberMeCheckbox.check();
    }

    await this.loginButton.click();
  }

  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible' });
    return await this.errorMessage.textContent();
  }
}

class DashboardPage {
  constructor(page) {
    this.page = page;

    this.welcomeMessage = page.locator('[data-testid="welcome-message"]');
    this.profileMenu = page.locator('[data-testid="profile-menu"]');
    this.profileSettings = page.locator('[data-testid="profile-settings"]');
    this.logoutButton = page.locator('[data-testid="logout-button"]');
    this.userAvatar = page.locator('[data-testid="user-avatar"]');
    this.notificationBell = page.locator('[data-testid="notification-bell"]');
    this.sidebarToggle = page.locator('[data-testid="sidebar-toggle"]');
  }

  async getWelcomeMessage() {
    await this.welcomeMessage.waitFor({ state: 'visible' });
    return await this.welcomeMessage.textContent();
  }

  async openProfileMenu() {
    await this.profileMenu.click();
    await this.profileSettings.waitFor({ state: 'visible' });
  }

  async logout() {
    await this.openProfileMenu();
    await this.logoutButton.click();
  }

  async isUserLoggedIn() {
    return await this.userAvatar.isVisible();
  }

  async getNotificationCount() {
    const badge = this.notificationBell.locator('.notification-badge');
    if (await badge.isVisible()) {
      return await badge.textContent();
    }
    return '0';
  }
}

// E2E Test Suites
test.describe('User Registration Flow', () => {
  let registrationPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    dashboardPage = new DashboardPage(page);
    await registrationPage.goto();
  });

  test('should allow user to register and access dashboard', async ({ page }) => {
    // Arrange
    const userData = {
      email: `test+${Date.now()}@example.com`,
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
      name: 'Test User',
      acceptTerms: true,
      subscribeNewsletter: false
    };

    // Act - Fill and submit registration form
    await registrationPage.fillRegistrationForm(userData);
    await registrationPage.submitForm();

    // Assert - User is redirected to dashboard
    await registrationPage.waitForRedirect('/dashboard');

    const welcomeMessage = await dashboardPage.getWelcomeMessage();
    expect(welcomeMessage).toContain(userData.name);

    // Verify user can access protected features
    await dashboardPage.openProfileMenu();
    await expect(dashboardPage.profileSettings).toBeVisible();
  });

  test('should show error for invalid email', async ({ page }) => {
    // Arrange
    const userData = {
      email: 'invalid-email',
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
      name: 'Test User',
      acceptTerms: true
    };

    // Act
    await registrationPage.fillRegistrationForm(userData);
    await registrationPage.submitForm();

    // Assert
    const errorMessage = await registrationPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid email format');
  });

  test('should show error for password mismatch', async ({ page }) => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      password: 'SecurePassword123!',
      confirmPassword: 'DifferentPassword456!',
      name: 'Test User',
      acceptTerms: true
    };

    // Act
    await registrationPage.fillRegistrationForm(userData);
    await registrationPage.submitForm();

    // Assert
    const errorMessage = await registrationPage.getErrorMessage();
    expect(errorMessage).toContain('Passwords do not match');
  });

  test('should require terms acceptance', async ({ page }) => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
      name: 'Test User',
      acceptTerms: false
    };

    // Act
    await registrationPage.fillRegistrationForm(userData);
    await registrationPage.submitForm();

    // Assert
    const errorMessage = await registrationPage.getErrorMessage();
    expect(errorMessage).toContain('You must accept the terms');
  });
});

test.describe('User Login Flow', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    // Create test user (assuming registration works)
    await page.goto('/register');
    const registrationPage = new RegistrationPage(page);
    await registrationPage.fillRegistrationForm({
      email: 'logintest@example.com',
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
      name: 'Login Test User',
      acceptTerms: true
    });
    await registrationPage.submitForm();

    // Logout to prepare for login test
    await dashboardPage.logout();
  });

  test('should authenticate user with valid credentials', async ({ page }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.login('logintest@example.com', 'TestPassword123!');

    // Assert
    await page.waitForURL('/dashboard');
    expect(await dashboardPage.isUserLoggedIn()).toBe(true);

    const welcomeMessage = await dashboardPage.getWelcomeMessage();
    expect(welcomeMessage).toContain('Login Test User');
  });

  test('should reject invalid credentials', async ({ page }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.login('logintest@example.com', 'WrongPassword');

    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid credentials');
  });

  test('should remember user when remember me is checked', async ({ page, context }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.login('logintest@example.com', 'TestPassword123!', true);
    await page.waitForURL('/dashboard');

    // Close and reopen browser
    await page.close();
    const newPage = await context.newPage();
    await newPage.goto('/dashboard');

    // Assert - User should still be logged in
    const newDashboardPage = new DashboardPage(newPage);
    expect(await newDashboardPage.isUserLoggedIn()).toBe(true);
  });
});

test.describe('Protected Routes', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Act
    await page.goto('/dashboard');

    // Assert
    await page.waitForURL('/login');
    expect(page.url()).toContain('/login');
  });

  test('should allow access after authentication', async ({ page }) => {
    // Arrange - Login first
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('logintest@example.com', 'TestPassword123!');

    // Act
    await page.goto('/profile');

    // Assert
    expect(page.url()).toContain('/profile');
    const profileHeader = page.locator('h1');
    await expect(profileHeader).toContainText('Profile');
  });
});

// Cross-browser testing
test.describe('Cross-Browser Compatibility', () => {
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(`should work in ${browserName}`, async ({ page }) => {
      test.skip(browserName !== test.info().project.name,
        `Test only for ${browserName}`);

      const registrationPage = new RegistrationPage(page);
      await registrationPage.goto();

      // Basic functionality test
      await registrationPage.emailInput.fill('browser-test@example.com');
      await expect(registrationPage.emailInput).toHaveValue('browser-test@example.com');
    });
  });
});

// Mobile responsive testing
test.describe('Mobile Responsive', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('should display mobile navigation', async ({ page }) => {
    // Arrange
    const dashboardPage = new DashboardPage(page);
    await page.goto('/dashboard');

    // Act & Assert
    await expect(dashboardPage.sidebarToggle).toBeVisible();

    // Test mobile menu functionality
    await dashboardPage.sidebarToggle.click();
    await expect(page.locator('[data-testid="mobile-sidebar"]')).toBeVisible();
  });

  test('should have touch-friendly buttons', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.goto();

    // Assert button size is touch-friendly (minimum 44px)
    const buttonBox = await registrationPage.registerButton.boundingBox();
    expect(buttonBox.height).toBeGreaterThanOrEqual(44);
  });
});

// Accessibility testing
test.describe('Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.goto();

    // Check for ARIA labels
    await expect(registrationPage.emailInput).toHaveAttribute('aria-label');
    await expect(registrationPage.passwordInput).toHaveAttribute('aria-label');
    await expect(registrationPage.registerButton).toHaveAttribute('aria-label');
  });

  test('should be keyboard navigable', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.goto();

    // Navigate using Tab key
    await page.keyboard.press('Tab');
    await expect(registrationPage.emailInput).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(registrationPage.passwordInput).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(registrationPage.confirmPasswordInput).toBeFocused();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
  });
});

// Visual regression testing
test.describe('Visual Regression', () => {
  test('registration page should look correct', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.goto();

    // Take screenshot and compare
    await expect(page).toHaveScreenshot('registration-page.png');
  });

  test('dashboard should look correct after login', async ({ page }) => {
    // Login first
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('test@example.com', 'TestPassword123!');

    // Take screenshot
    await expect(page).toHaveScreenshot('dashboard-page.png');
  });

  test('error states should display correctly', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.goto();

    // Trigger error state
    await registrationPage.submitForm();
    await registrationPage.errorMessage.waitFor({ state: 'visible' });

    // Take screenshot
    await expect(page).toHaveScreenshot('registration-error-state.png');
  });
});

// Performance testing
test.describe('Performance', () => {
  test('page should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds
  });

  test('should handle large datasets', async ({ page }) => {
    // Navigate to page with large dataset
    await page.goto('/users?limit=1000');

    // Wait for content to load
    await page.waitForSelector('[data-testid="user-list"]');

    // Check that pagination or virtual scrolling is working
    const visibleItems = await page.locator('[data-testid="user-item"]').count();
    expect(visibleItems).toBeGreaterThan(0);
    expect(visibleItems).toBeLessThanOrEqual(50); // Should not render all 1000 items
  });
});

// Test data cleanup
test.afterEach(async ({ page }) => {
  // Clean up test data
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

module.exports = {
  RegistrationPage,
  LoginPage,
  DashboardPage
};
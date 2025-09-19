// Example: End-to-End Testing with Playwright

// user-registration-e2e.test.js
describe('User Registration Flow', () => {
  let page;

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('/register');
  });

  afterEach(async () => {
    await page.close();
  });

  it('should allow user to register and access dashboard', async () => {
    // Arrange
    const userData = {
      email: 'newuser@example.com',
      password: 'SecurePassword123!',
      name: 'New User'
    };

    // Act - Fill registration form
    await page.fill('[data-testid="email-input"]', userData.email);
    await page.fill('[data-testid="password-input"]', userData.password);
    await page.fill('[data-testid="name-input"]', userData.name);
    await page.click('[data-testid="register-button"]');

    // Assert - User is redirected to dashboard
    await page.waitForURL('/dashboard');
    const welcomeMessage = await page.textContent('[data-testid="welcome-message"]');
    expect(welcomeMessage).toContain(userData.name);

    // Verify user can access protected features
    await page.click('[data-testid="profile-menu"]');
    await expect(page.locator('[data-testid="profile-settings"]')).toBeVisible();
  });
});
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

/**
 * Page Object for Login functionality
 */
export class LoginPage extends BasePage {
  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-testid="username-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin() {
    logStep('Navigating to login page');
    await this.goto('/login');
  }

  /**
   * Perform login with credentials
   * @param username - User's username or email
   * @param password - User's password
   */
  async login(username: string, password: string) {
    logStep(`Logging in with username: ${username}`);
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if login was successful
   */
  async isLoginSuccessful(): Promise<boolean> {
    logStep('Verifying login success');
    // Wait for navigation away from login page or check for user menu
    try {
      await this.page.waitForURL('**/dashboard', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get error message if login fails
   */
  async getErrorMessage(): Promise<string | null> {
    return await this.getText(this.errorMessage);
  }
}

import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

export class LoginPage extends BasePage {
  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error-message"]');
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    logStep('Navigating to login page');
    await this.goto('/login');
  }

  /**
   * Login with credentials
   */
  async login(username: string, password: string): Promise<void> {
    logStep(`Logging in with username: ${username}`);
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.waitForNavigation(async () => {
      await this.click(this.loginButton);
    });
  }

  /**
   * Check if login was successful
   */
  async isLoginSuccessful(): Promise<boolean> {
    logStep('Verifying login success');
    return await this.isVisible('[data-test="user-profile"]');
  }
}

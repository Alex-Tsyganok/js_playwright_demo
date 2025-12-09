import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep, logInfo } from '../../utils/logger';

// Login Page object for reusable login interactions
update export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private usernameInput = '[data-test="username"]';
  private passwordInput = '[data-test="password"]';
  private loginButton = '[data-test="login-button"]';

  async goto(): Promise<void> {
    logStep('Navigating to login page');
    await this.goto('/login');
  }

  async login(username: string, password: string): Promise<void> {
    logInfo('Filling login credentials');
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    logStep('Clicking login button');
    await this.waitForNavigation( async () => {
      await this.click(this.loginButton);
    } );
  }
}

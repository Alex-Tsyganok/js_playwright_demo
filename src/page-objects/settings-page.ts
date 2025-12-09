import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class SettingsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToAuthentication(): Promise<void> {
    await this.click('[data-test="settings"]');
    await this.click('[data-test="authentication"]');
  }

  async getTrustStatusIndicator(): Promise<string | null> {
    await this.waitForElement('[data-test="trust-status"]');
    return this.getText('[data-test="trust-status"]');
  }
}

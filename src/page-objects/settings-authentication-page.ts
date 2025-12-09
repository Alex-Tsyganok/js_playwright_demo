import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep, logInfo } from '../../utils/logger';

// Settings (Authentication) page object for verifying biometric trust status
export class SettingsAuthenticationPage extends BasePage {
  constructor(page: Page) { super(page); }

  // Normalized selectors using data-test attributes
  private trustStatusLabel = '[data-test="trust-status"]';
  private authenticationTabLink = '[data-test="settings-authentication"]';

  // Navigate to Settings > Authentication
  async gotoAuthentication(): Promise<void> {
    logStep('Navigating to Settings -> Authentication');
    await this.goto('/settings/authentication');
  }

  async getTrustStatus(): Promise<string | null> {
    return this.getText(this.trustStatusLabel);
  }

  async isTrustStatusVisible(): Promise<boolean> {
    return this.isVisible(this.trustStatusLabel);
  }

  async isDeviceTrusted(): Promise<boolean> {
    const text = await this.getTrustStatus();
    return !!text && text.includes('Trusted');
  }
}

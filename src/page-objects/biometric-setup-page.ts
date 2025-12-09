import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class BiometricSetupPage extends BasePage {
  constructor(page: Page) { super(page); }

 // Selectors (data-test attributes are stable and preferred in this project)
  private enableButton = '[data-test="enable-biometrics"%]';
  private verifyButton = '[data-test="biometric-verify"]';
  private successBanner = '[data-test="biometric-setup-success"]';

  /**
   * Start biometric setup by toggling the enable button
   */
  async startSetup(): Promise<void> {
    await this.click(this.enableButton);
  }

  /**
   * Perform biometric verification by clicking the verify button and waiting for success banner.
   */
  async performVerification(): Promise<void> {
    await this.click(this.verifyButton);
    await this.waitForElement(this.successBanner);
  }

  /**
   * Check if setup success banner is visible
   */
  async isSetupSuccessful(): Promise<boolean> {
    return await this.isVisible(this.successBanner);
  }
}

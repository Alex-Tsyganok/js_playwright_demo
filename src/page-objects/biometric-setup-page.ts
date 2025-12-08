import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

export class BiometricSetupPage extends BasePage {
  // Locators
  private readonly enableBiometricsButton: Locator;
  private readonly biometricPrompt: Locator;
  private readonly verifyBiometricButton: Locator;
  private readonly setupCompleteMessage: Locator;
  private readonly skipButton: Locator;

  constructor(page: Page) {
    super(page);
    this.enableBiometricsButton = page.locator('[data-test="enable-biometrics-button"]');
    this.biometricPrompt = page.locator('[data-test="biometric-prompt"]');
    this.verifyBiometricButton = page.locator('[data-test="verify-biometric-button"]');
    this.setupCompleteMessage = page.locator('[data-test="setup-complete-message"]');
    this.skipButton = page.locator('[data-test="skip-biometric-button"]');
  }

  /**
   * Navigate to biometric setup flow
   */
  async navigateToBiometricSetup(): Promise<void> {
    logStep('Navigating to biometric setup');
    await this.goto('/settings/authentication');
    await this.waitForElement(this.enableBiometricsButton);
  }

  /**
   * Enable biometric authentication
   */
  async enableBiometrics(): Promise<void> {
    logStep('Enabling biometric authentication');
    await this.click(this.enableBiometricsButton);
    await this.waitForElement(this.biometricPrompt);
  }

  /**
   * Complete biometric verification
   */
  async completeBiometricVerification(): Promise<void> {
    logStep('Completing biometric verification');
    await this.click(this.verifyBiometricButton);
    await this.waitForElement(this.setupCompleteMessage, 10000);
  }

  /**
   * Check if biometric setup is complete
   */
  async isBiometricSetupComplete(): Promise<boolean> {
    logStep('Checking if biometric setup is complete');
    return await this.isVisible(this.setupCompleteMessage);
  }

  /**
   * Get setup completion message
   */
  async getSetupCompletionMessage(): Promise<string | null> {
    logStep('Getting setup completion message');
    return await this.getText(this.setupCompleteMessage);
  }
}

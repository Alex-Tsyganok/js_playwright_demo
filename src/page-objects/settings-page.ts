import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class SettingsPage extends BasePage {
  constructor(page: Page) { super(page); }

  async navigateToBiometricSetup(): Promise<void> {
    await this.goto('/settings/authentication');
  }

  async isBiometricSetupScreenAccessible(): Promise<boolean> {
    return this.isVisible('[data-test=biometric-setup]');
  }

  async completeBiometricSetupAndVerification(): Promise<void> {
    if (await this.isVisible('[data-test=enable-biometrics]')) {
      await this.click('[data-test=enable-biometrics]');
    }
    if (await this.isVisible('[data-test=verify-biometrics]')) {
      await this.click('[data-test=verify-biometrics]');
    }
    await this.waitForElement('[data-test=biometric-verified]', 15000);
  }

  async isBiometricVerificationSuccessful(): Promise<boolean> {
    return this.isVisible('[data-test=biometric-verified]');
  }

  async navigateToAuthenticationSettings(): Promise<void> {
    await this.goto('/settings/authentication');
    await this.waitForElement('[data-test=authentication-settings]');
  }

  async isAuthenticationSettingsDisplayed(): Promise<boolean> {
    return this.isVisible('[data-test=authentication-settings]');
  }

  async areAuthenticationOptionsVisible(): Promise<boolean> {
    return this.isVisible('[data-test^=auth-option-]');
  }

  async isDeviceTrustStatusIndicatorVisible(): Promise<boolean> {
    return this.isVisible('[data-test=device-trust-status]');
  }

  async isDeviceMarkedAsTrusted(): Promise<boolean> {
    if (await this.isVisible('[data-test=device-trusted-badge]')) {
      return true;
    }
    const text = await this.getText('[data-test=device-trust-status]');
    return (text || '').toLowerCase().includes('trusted');
  }

  async verifyTrustStatusReflectsDeviceAccount(username: string): Promise<boolean> {
    const text = await this.getText('[data-test=device-account-info]');
    return (text || '').includes(username);
  }

  async verifyTrustStatusConsistencyAcrossPlatforms(): Promise<boolean> {
    const iosVisible = await this.isVisible('[data-test=ios-only-trust-indicator]');
    const androidVisible = await this.isVisible('[data-test=android-only-trust-indicator]');
    return !iosVisible && !androidVisible;
  }

  async getDeviceTrustStatus(): Promise<string | null> {
    return this.getText('[data-test=device-trust-status]');
  }

  async getDeviceAccountInfo(): Promise<string | null> {
    return this.getText('[data-test=device-account-info]');
  }

  async captureDeviceTrustStatusScreenshot(name: string): Promise<void> {
    await this.takeScreenshot(name);
  }
}

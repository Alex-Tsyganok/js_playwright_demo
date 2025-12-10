import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Fill login credentials
   */
  async fillCredentials(username: string, password: string): Promise<void> {
    await this.fill('[data-test="username"]', username);
    await this.fill('[data-test="password"]', password);
  }

  /**
   * Click login button and wait for navigation
   */
  async clickLoginButton(): Promise<void> {
    await this.waitForNavigation(async () => {
      await this.click('[data-test="login-button"]');
    });
  }

  /**
   * Check if biometric login option is available
   */
  async isBiometricLoginOptionAvailable(): Promise<boolean> {
    return await this.isVisible('[data-test="biometric-login-option"]');
  }

  /**
   * Use biometric authentication for login
   */
  async useBiometricAuthentication(): Promise<void> {
    logStep('Attempting to log in using biometric authentication');
    await this.click('[data-test="biometric-login-option"]');
    // Simulate biometric authentication success
    // In a real test, we would need to mock the biometric API
    await this.page.evaluate(() => {
      // Simulate successful biometric authentication
      // This is a placeholder for actual biometric API mocking
      window.dispatchEvent(new CustomEvent('biometricAuthSuccess'));
    });
    // Wait for navigation after successful biometric authentication
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if user is logged in
   */
  async isUserLoggedIn(): Promise<boolean> {
    return await this.isVisible('[data-test="user-profile"]');
  }

  /**
   * Check if SMS code input is requested
   */
  async isSMSCodeRequested(): Promise<boolean> {
    return await this.isVisible('[data-test="sms-code-input"]');
  }

  /**
   * Check if password input is requested
   */
  async isPasswordRequested(): Promise<boolean> {
    return await this.isVisible('[data-test="password"]');
  }

  /**
   * Check if biometric re-enrollment message is shown
   */
  async isBiometricReenrollmentMessageShown(): Promise<boolean> {
    return await this.isVisible('[data-test="biometric-reenrollment-message"]');
  }
}

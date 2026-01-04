import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

export class SettingsAuthenticationPage extends BasePage {
  // Locators
  private readonly settingsMenu: Locator;
  private readonly authenticationMenuItem: Locator;
  private readonly deviceTrustStatusIndicator: Locator;
  private readonly deviceTrustStatusLabel: Locator;
  private readonly trustedDeviceIcon: Locator;
  private readonly deviceNameLabel: Locator;
  private readonly accountLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.settingsMenu = page.locator('[data-test="settings-menu"]');
    this.authenticationMenuItem = page.locator('[data-test="authentication-menu-item"]');
    this.deviceTrustStatusIndicator = page.locator('[data-test="device-trust-status"]');
    this.deviceTrustStatusLabel = page.locator('[data-test="device-trust-label"]');
    this.trustedDeviceIcon = page.locator('[data-test="trusted-device-icon"]');
    this.deviceNameLabel = page.locator('[data-test="device-name"]');
    this.accountLabel = page.locator('[data-test="account-name"]');
  }

  /**
   * Navigate to Settings > Authentication
   */
  async navigateToAuthentication(): Promise<void> {
    logStep('Navigating to Settings > Authentication');
    await this.click(this.settingsMenu);
    await this.click(this.authenticationMenuItem);
    await this.waitForElement(this.deviceTrustStatusIndicator);
  }

  /**
   * Check if device trust status is visible
   */
  async isDeviceTrustStatusVisible(): Promise<boolean> {
    logStep('Checking if device trust status is visible');
    return await this.isVisible(this.deviceTrustStatusIndicator);
  }

  /**
   * Get device trust status text
   */
  async getDeviceTrustStatus(): Promise<string | null> {
    logStep('Getting device trust status');
    return await this.getText(this.deviceTrustStatusLabel);
  }

  /**
   * Check if device is marked as trusted
   */
  async isDeviceTrusted(): Promise<boolean> {
    logStep('Checking if device is marked as trusted');
    const statusText = await this.getDeviceTrustStatus();
    return statusText?.toLowerCase().includes('trusted') || false;
  }

  /**
   * Check if trusted device icon is visible
   */
  async isTrustedDeviceIconVisible(): Promise<boolean> {
    logStep('Checking if trusted device icon is visible');
    return await this.isVisible(this.trustedDeviceIcon);
  }

  /**
   * Get device name
   */
  async getDeviceName(): Promise<string | null> {
    logStep('Getting device name');
    return await this.getText(this.deviceNameLabel);
  }

  /**
   * Get account name
   */
  async getAccountName(): Promise<string | null> {
    logStep('Getting account name');
    return await this.getText(this.accountLabel);
  }

  /**
   * Verify trust status accuracy for device/account combination
   */
  async verifyTrustStatusAccuracy(expectedDevice: string, expectedAccount: string): Promise<boolean> {
    logStep('Verifying trust status accuracy');
    const deviceName = await this.getDeviceName();
    const accountName = await this.getAccountName();
    const isTrusted = await this.isDeviceTrusted();
    
    return (
      deviceName?.includes(expectedDevice) &&
      accountName?.includes(expectedAccount) &&
      isTrusted
    );
  }
}

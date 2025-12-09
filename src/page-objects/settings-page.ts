import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

/**
 * Page Object for Settings page
 * Provides methods to navigate to various settings sections
 */
export class SettingsPage extends BasePage {
  private readonly notificationsLink = '[data-test="settings-notifications"]';
  private readonly settingsHeader = '[data-test="settings-header"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to Settings page
   */
  async gotoSettings(): Promise<void> {
    logStep('Navigating to Settings page');
    await this.goto('/settings');
    await this.waitForElement(this.settingsHeader);
  }

  /**
   * Navigate to Notifications settings
   */
  async gotoNotificationsSettings(): Promise<void> {
    logStep('Navigating to Notifications settings');
    await this.click(this.notificationsLink);
  }

  /**
   * Verify Settings page is loaded
   */
  async isSettingsPageLoaded(): Promise<boolean> {
    return await this.isVisible(this.settingsHeader);
  }
}

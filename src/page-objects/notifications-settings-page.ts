import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

/**
 * Page Object for Notifications Settings page
 * Provides methods to interact with push notification settings
 */
export class NotificationsSettingsPage extends BasePage {
  private readonly notificationsToggle = '[data-test="notifications-toggle"]';
  private readonly notificationsStatus = '[data-test="notifications-status"]';
  private readonly notificationsHeader = '[data-test="notifications-header"]';
  private readonly systemPermissionDialog = '[data-test="system-permission-dialog"]';
  private readonly allowButton = '[data-test="allow-button"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Get the notifications toggle locator
   */
  private getToggleLocator(): Locator {
    return this.page.locator(this.notificationsToggle);
  }

  /**
   * Get the notifications status locator
   */
  private getStatusLocator(): Locator {
    return this.page.locator(this.notificationsStatus);
  }

  /**
   * Navigate to Notifications Settings page
   */
  async gotoNotificationsSettings(): Promise<void> {
    logStep('Navigating to Notifications Settings page');
    await this.goto('/settings/notifications');
    await this.waitForElement(this.notificationsHeader);
  }

  /**
   * Enable push notifications by toggling the switch
   */
  async enablePushNotifications(): Promise<void> {
    logStep('Enabling push notifications');
    const toggle = this.getToggleLocator();

    // Check if already enabled
    const isEnabled = await this.isNotificationsEnabled();
    if (!isEnabled) {
      await toggle.click();
      // Wait for toggle to update
      await this.page.waitForTimeout(500);
    } else {
      logStep('Push notifications are already enabled');
    }
  }

  /**
   * Disable push notifications by toggling the switch
   */
  async disablePushNotifications(): Promise<void> {
    logStep('Disabling push notifications');
    const toggle = this.getToggleLocator();

    // Check if already disabled
    const isEnabled = await this.isNotificationsEnabled();
    if (isEnabled) {
      await toggle.click();
      // Wait for toggle to update
      await this.page.waitForTimeout(500);
    } else {
      logStep('Push notifications are already disabled');
    }
  }

  /**
   * Check if push notifications are enabled
   * @returns true if enabled, false otherwise
   */
  async isNotificationsEnabled(): Promise<boolean> {
    logStep('Checking notifications status');
    const toggle = this.getToggleLocator();
    const isChecked = await toggle.isChecked();
    return isChecked;
  }

  /**
   * Get the displayed notifications status text
   * @returns Status text (e.g., "ON" or "OFF")
   */
  async getNotificationsStatusText(): Promise<string | null> {
    logStep('Getting notifications status text');
    const statusLocator = this.getStatusLocator();
    return await statusLocator.textContent();
  }

  /**
   * Handle system-level permission prompt by clicking "Allow"
   * This method waits for the dialog to appear and clicks the allow button
   */
  async allowSystemPermission(): Promise<void> {
    logStep('Handling system-level permission prompt');
    try {
      // Wait for permission dialog to appear (timeout 5s)
      await this.page.locator(this.systemPermissionDialog).waitFor({
        state: 'visible',
        timeout: 5000,
      });

      // Click allow button
      await this.page.locator(this.allowButton).click();
      logStep('System permission allowed');
    } catch (error) {
      logStep('No system permission dialog appeared or already granted');
    }
  }

  /**
   * Verify Notifications Settings page is loaded
   */
  async isNotificationsSettingsPageLoaded(): Promise<boolean> {
    return await this.isVisible(this.notificationsHeader);
  }
}

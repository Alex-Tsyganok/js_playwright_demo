import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

/**
 * Page Object for Settings functionality
 */
export class SettingsPage extends BasePage {
  // Locators
  private readonly settingsMenu: Locator;
  private readonly authenticationMenuItem: Locator;

  constructor(page: Page) {
    super(page);
    this.settingsMenu = page.locator('[data-testid="settings-menu"]');
    this.authenticationMenuItem = page.locator('[data-testid="authentication-menu-item"]');
  }

  /**
   * Navigate to settings page
   */
  async navigateToSettings() {
    logStep('Navigating to settings page');
    await this.goto('/settings');
    await this.waitForElement(this.settingsMenu);
  }

  /**
   * Navigate to Authentication settings
   */
  async navigateToAuthentication() {
    logStep('Navigating to Authentication settings');
    await this.click(this.authenticationMenuItem);
    await this.page.waitForLoadState('networkidle');
  }
}

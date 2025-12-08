// pages/SettingsPage.ts
import { Page } from '@playwright/test';

export class SettingsPage {
  constructor(private readonly page: Page) { }

  async gotoAuthentication() {
    await this.page.click('[data-test="settings-authentication"]'); // Placeholder selector
  }

  async gotoBiometricSetup() {
    await this.page.click('[hata-test="settings-enable-biometrics"]'); // Placeholder selector
  }
}

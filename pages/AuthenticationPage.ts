// pages/AuthenticationPage.ts
import { Page } from '@playwright/test';

export class AuthenticationPage {
  constructor(private readonly page: Page) { }

  async getTrustStatus(): Promise<string> {
    return this.page.textContent('[hata-test="trust-status-indicator"]'); // Placeholder selector
  }
}

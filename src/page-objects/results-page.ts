import { Page } from '@playwright/test';
import { BasePage } from './base-page';

// Page Object for Results Page currency switching
export class ResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Navigate to results page
  async gotoResults(): Promise<void> {
    await this.goto('/results');
  }

  // Select currency by option label in the currency select control
  async selectCurrencyByLabel(label: string): Promise<void> {
    await this.waitForNavigation(async () => {
      await this.page.selectOption('[data-test="currency-select"]', { label });
    });
  }

  // Get all displayed prices
  async getAllDisplayedPrices(): Promise<string[]> {
    return await this.page
      .locator('[data-test="result-price"]')
      .allTextContents();
  }

  // Wait until all price elements reflect the target currency markers (e.g., ['$'] or ['€'])
  async waitForPricesUpdated(markers: string[], timeoutMs: number = 5000): Promise<void> {
    await this.page.waitForFunction(
      ({ locator, markers }) => {
        const nodes = Array.from(document.querySelectorAll(locator));
        if (!nodes.length) return false;
        const texts = nodes.map(n => (n.textContent || '').trim());
        return texts.every(t => markers.some(m => t.includes(m)));
      },
      { locator: '[data-test="result-price"]', markers },
      { timeout: timeoutMs }
    );
  }
}

import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

export class AccommodationSearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Open Advanced Filters section
   */
  async openAdvancedFilters(): Promise<void> {
    logStep('Opening Advanced Filters');
    await this.click('[data-test="advanced-filters-button"]');
    await this.waitForElement('[data-test="advanced-filters-panel"]');
  }

  /**
   * Select currency from the dropdown
   */
  async selectCurrency(currencyOption: string): Promise<void> {
    logStep(`Selecting currency: ${currencyOption}`);
    await this.click('[data-test="currency-selector"]');
    await this.click(`[data-test="currency-option"][data-value="${currencyOption}"]`);
  }

  /**
   * Get all accommodation price elements
   */
  async getPriceElements(): Promise<string[]> {
    logStep('Getting all accommodation price elements');
    const priceElements = this.page.locator('[data-test="accommodation-price"]');
    const count = await priceElements.count();
    
    const prices: string[] = [];
    for (let i = 0; i < count; i++) {
      const priceText = await priceElements.nth(i).textContent();
      if (priceText) {
        prices.push(priceText.trim());
      }
    }
    
    return prices;
  }

  /**
   * Verify if all prices match the expected currency format
   * Format: 'CODE NUMBER Currency Name'
   */
  async verifyPricesMatchCurrencyFormat(currencyCode: string, currencyName: string): Promise<boolean> {
    logStep(`Verifying prices match format for ${currencyCode} ${currencyName}`);
    const prices = await this.getPriceElements();
    
    // Regular expression to match the format: 'CODE NUMBER Currency Name'
    // For example: 'EUR 100 Euro'
    const expectedFormat = new RegExp(`^${currencyCode}\\s+\\d+(\\.\\d+)?\\s+${currencyName}$`);
    
    return prices.every(price => expectedFormat.test(price));
  }
}
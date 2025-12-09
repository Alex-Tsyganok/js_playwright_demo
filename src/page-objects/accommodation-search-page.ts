import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

type Currency = string;

export class AccommodationSearchPage extends BasePage {
  private advancedFiltersButton = '[data-test="advanced-filters-button"]';
  private currencySelector = '[data-test="currency-selector"]';
  private currencyOption = (currency: Currency) => `[data-test="currency-option-${currency.toLowerCase()}"]`;
  private accommodationPrices = '[data-test="accommodation-price"]';
  private errorMessage = '[data-test="currency-error-message"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Perform an accommodation search
   */
  async performSearch(): Promise<void> {
    logStep('Performing accommodation search');
    // Navigate to the search page - assuming it's at /search
    await this.goto('/search');
    
    // In a real implementation, we would fill in search criteria and submit the search
    // For this test, we're focusing on the currency conversion error handling
  }

  /**
   * Open advanced filters
   */
  async openAdvancedFilters(): Promise<void> {
    logStep('Opening advanced filters');
    await this.click(this.advancedFiltersButton);
    // Wait for filters to be visible
    await this.waitForElement(this.currencySelector);
  }

  /**
   * Select a currency from the dropdown
   */
  async selectCurrency(currency: Currency): Promise<void> {
    logStep(`Selecting currency: ${currency}`);
    await this.click(this.currencySelector);
    await this.click(this.currencyOption(currency));
  }

  /**
   * Get all accommodation prices from the results page
   */
  async getAccommodationPrices(): Promise<string[]> {
    logStep('Getting accommodation prices');
    const priceElements = this.page.locator(this.accommodationPrices);
    const count = await priceElements.count();
    const prices = [];
    
    for (let i = 0; i < count; i++) {
      const priceText = await priceElements.nth(i).textContent();
      if (priceText) {
        prices.push(priceText);
      }
    }
    
    return prices;
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    logStep('Checking if error message is displayed');
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Get the error message text
   */
  async getErrorMessageText(): Promise<string | null> {
    logStep('Getting error message text');
    return await this.getText(this.errorMessage);
  }
}

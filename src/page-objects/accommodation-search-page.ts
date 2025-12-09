import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

export class AccommodationSearchPage extends BasePage {
  // Locators
  private readonly advancedFiltersButton = '[data-test="advanced-filters-button"]';
  private readonly currencySelector = '[data-test="currency-selector"]';
  private readonly currencyOptions = '[data-test="currency-option"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to accommodation search page
   */
  async navigateToAccommodationSearch(): Promise<void> {
    logStep('Navigating to accommodation search page');
    await this.goto('/accommodation/search');
  }

  /**
   * Open advanced filters section
   */
  async openAdvancedFilters(): Promise<void> {
    logStep('Opening advanced filters section');
    await this.click(this.advancedFiltersButton);
    // Wait for filters to be visible
    await this.waitForElement(this.currencySelector);
  }

  /**
   * Get all available currency options
   * @returns Array of currency options in format "CODE NUMBER Currency Name"
   */
  async getAvailableCurrencies(): Promise<string[]> {
    logStep('Getting available currencies');
    const currencyElements = this.page.locator(this.currencyOptions);
    const count = await currencyElements.count();
    
    const currencies: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await currencyElements.nth(i).textContent();
      if (text) {
        currencies.push(text.trim());
      }
    }
    
    return currencies;
  }
}

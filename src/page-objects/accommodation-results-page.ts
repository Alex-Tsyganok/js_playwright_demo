import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { AdvancedFiltersComponent } from './components/advanced-filters-component';
import { logStep } from '../utils/logger';

/**
 * Page object for the accommodation search results page
 */
export class AccommodationResultsPage extends BasePage {
  // Locators
  private readonly accommodationPrices: Locator;
  private readonly advancedFiltersButton: Locator;

  // Components
  private advancedFilters: AdvancedFiltersComponent;

  constructor(page: Page) {
    super(page);
    this.accommodationPrices = this.page.locator('[data-test="accommodation-price"]');
    this.advancedFiltersButton = this.page.locator('[data-test="advanced-filters-button"]');
    this.advancedFilters = new AdvancedFiltersComponent(page);
  }

  /**
   * Open the advanced filters panel
   */
  async openAdvancedFilters(): Promise<void> {
    logStep('Opening advanced filters');
    await this.click(this.advancedFiltersButton);
    await this.advancedFilters.waitForVisible();
  }

  /**
   * Get the advanced filters component
   */
  getAdvancedFilters(): AdvancedFiltersComponent {
    return this.advancedFilters;
  }

  /**
   * Get all accommodation prices from the results page
   */
  async getAccommodationPrices(): Promise<string[]> {
    logStep('Getting all accommodation prices');
    const count = await this.accommodationPrices.count();
    const prices: string[] = [];

    for (let i = 0; i < count; i++) {
      const priceText = await this.accommodationPrices.nth(i).textContent();
      if (priceText) {
        prices.push(priceText.trim());
      }
    }

    return prices;
  }

  /**
   * Check if all prices have the expected currency format
   * @param currencyCode The expected currency code (e.g., EUR)
   * @param currencyNumber The expected currency number (e.g., 978)
   * @param currencyName The expected currency name (e.g., Euro)
   */
  async verifyPricesHaveCurrencyFormat(
    currencyCode: string,
    currencyNumber: string,
    currencyName: string
  ): Promise<boolean> {
    logStep(`Verifying prices have currency format: ${currencyCode} ${currencyNumber} ${currencyName}`);
    const prices = await this.getAccommodationPrices();
    const expectedFormat = `${currencyCode} ${currencyNumber} ${currencyName}`;

    // Check if all prices contain the expected format
    return prices.every(price => price.includes(expectedFormat));
  }
}

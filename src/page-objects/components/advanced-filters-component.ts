import { Page, Locator } from '@playwright/test';
import { logStep } from '../../utils/logger';

/**
 * Component for the Advanced Filters panel
 */
export class AdvancedFiltersComponent {
  // Locators
  private readonly container: Locator;
  private readonly currencySelector: Locator;
  private readonly applyFiltersButton: Locator;

  constructor(private page: Page) {
    this.container = this.page.locator('[data-test="advanced-filters-container"]');
    this.currencySelector = this.page.locator('[data-test="currency-selector"]');
    this.applyFiltersButton = this.page.locator('[data-test="apply-filters-button"]');
  }

  /**
   * Wait for the advanced filters panel to be visible
   */
  async waitForVisible(): Promise<void> {
    await this.container.waitFor({ state: 'visible' });
  }

  /**
   * Select a currency from the currency selector
   * @param currencyText The currency text to select (e.g., 'EUR 978 Euro')
   */
  async selectCurrency(partialCurrencyText: string): Promise<void> {
    logStep(`Selecting currency with text: ${partialCurrencyText}`);
    await this.currencySelector.click();
    
    // Wait for the dropdown to appear and select the currency option
    const currencyOption = this.page.locator(`text=${partialCurrencyText}`);
    await currencyOption.waitFor({ state: 'visible' });
    await currencyOption.click();
  }

  /**
   * Apply the selected filters
   */
  async applyFilters(): Promise<void> {
    logStep('Applying filters');
    await this.applyFiltersButton.click();
    // Wait for the page to load after applying filters
    await this.page.waitForLoadState('networkidle');
  }
}

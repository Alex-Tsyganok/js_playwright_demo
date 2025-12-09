import { test, expect } from '../../../src/fixtures/test-fixtures';
import { AccommodationResultsPage } from '../../../src/page-objects/accommodation-results-page';
import { logInfo } from '../../../src/utils/logger';

/**
 * Test for EPMCDMETST-23201
 * [TC1-01] Accommodation prices update to selected currency with correct format on results page
 */
test.describe('Accommodation Currency Filter', () => {
  let accommodationResultsPage: AccommodationResultsPage;

  /**
   * Preconditions:
   * - User has performed an accommodation search with valid criteria
   * - Currency conversion rates are available and up to date
   */
  test.beforeEach(async ({ page }) => {
    // Initialize the page object
    accommodationResultsPage = new AccommodationResultsPage(page);
    
    // Navigate to the accommodation results page
    // Assuming there is a pre-existing path with search results
    await accommodationResultsPage.goto('/accommodation-search-results');
  });

  /**
   * Test Case: EPMCDMETST-23201
   * [TC1-01] Accommodation prices update to selected currency with correct format on results page
   */
  test('should update accommodation prices to selected currency with correct format', async () => {
    logInfo('Starting test for currency filter and price format');

    // Step 1: Open Advanced Filters
    await accommodationResultsPage.openAdvancedFilters();
    const advancedFilters = accommodationResultsPage.getAdvancedFilters();

    // Step 2: Select a currency from the allowed list (e.g., EUR 978 Euro)
    await advancedFilters.selectCurrency('EUR 978 Euro');

    // Step 3: Apply the filter and view the results page
    await advancedFilters.applyFilters();

    // Verify that all accommodation prices on the results page are displayed in the selected currency
    // using the exact 'CODE NUMBER Currency Name' format (e.g., 'EUR 978 Euro').
    const allPricesHaveCorrectFormat = await accommodationResultsPage.verifyPricesHaveCurrencyFormat('EUR', '978', 'Euro');
    expect(allPricesHaveCorrectFormat).toBeTruthy();

    // Additional verification: Get actual prices and log them for debugging
    const prices = await accommodationResultsPage.getAccommodationPrices();
    logInfo(`Found ${prices.length} prices on the page`);
    expect(prices.length).toBeGreaterThan(0); // Ensure there are prices on the page
  });
});

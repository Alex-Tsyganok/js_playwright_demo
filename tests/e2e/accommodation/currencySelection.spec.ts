import { test, expect } from '../../../src/fixtures/test-fixtures';
import { AccommodationSearchResultsPage } from '../../../src/page-objects/accommodation-search-results-page';
import { logInfo } from '../../../src/utils/logger';

// Test case EPMCDMETST-24204: Verify accommodation prices update to selected currency in exact format
test.describe('Accommodation Search Results Currency Selection', () => {
  let accommodationSearchResultsPage: AccommodationSearchResultsPage;

  test.beforeEach(async ({ page }) => {
    accommodationSearchResultsPage = new AccommodationSearchResultsPage(page);
    
    // Navigate to accommodation search results page
    // Assuming there's a route for search results with pre-populated search
    await accommodationSearchResultsPage.goto('/accommodation/search-results');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('[EPMCDMETST-24204] Verify accommodation prices update to selected currency in exact format', async () => {
    logInfo('Starting test for currency selection and price format verification');

    // Step 1: Open Advanced Filters
    await accommodationSearchResultsPage.openAdvancedFilters();

    // Step 2: Select a supported currency (e.g., EUR 978 Euro)
    const currencyCode = 'EUR';
    const currencyName = 'Euro';
    await accommodationSearchResultsPage.selectCurrency(`${currencyCode} 978 ${currencyName}`);

    // Step 3: Observe the accommodation prices on the results page
    // Verify that all prices are displayed in the selected currency format
    const pricesMatchFormat = await accommodationSearchResultsPage.verifyPricesMatchCurrencyFormat(currencyCode, currencyName);
    expect(pricesMatchFormat).toBeTruthy();

    // Additional verification: Get actual prices and log them for debugging
    const prices = await accommodationSearchResultsPage.getPriceElements();
    logInfo(`Found ${prices.length} price elements with the following values:`);
    prices.forEach((price, index) => {
      logInfo(`Price ${index + 1}: ${price}`);
    });

    // Verify we have at least one price element
    expect(prices.length).toBeGreaterThan(0);
  });
});
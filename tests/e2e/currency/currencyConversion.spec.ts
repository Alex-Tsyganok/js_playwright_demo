/**
 * Test case: EPMCDMETST23205 - [TC14:01] Handle conversion service errors gracefully without displaying incorrect prices
 * 
 * Preconditions:
 * - Currency conversion service is unavailable or returns an error
 * 
 * Steps:
 * 1. Perform an accommodation search
 * 2. Open Advanced Filters
 * 3. Select a supported currency
 * 4. Observe the accommodation prices on the results page
 * 
 * Expected Result:
 * - No incorrect prices are displayed and the system does not crash; an appropriate error message or fallback is shown to the user.
 */

import { test, expect } from '../../../src/fixtures/test-fixtures';
import { AccommodationSearchPage } from '../../../src/page-objects/accommodation-search-page';
import { logInfo } from '../../../src/utils/logger';

test.describe('Currency Conversion Error Handling', () => {
  let accommodationSearchPage: AccommodationSearchPage;

  test.beforeEach(async ({ page }) => {
    accommodationSearchPage = new AccommodationSearchPage(page);
    // Mock the currency conversion service to simulate an error
    // In a real test, we would intercept the API call and return an error
    await page.route('**/currency-conversion**', route => {
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Currency conversion service unavailable' }) });
    });
  });

  test('[EPMCDMETST-23205] Handle conversion service errors gracefully without displaying incorrect prices', async () => {
    logInfo('Starting currency conversion error handling test');

    // Step 1: Perform an accommodation search
    await accommodationSearchPage.performSearch();

    // Step 2: Open Advanced Filters
    await accommodationSearchPage.openAdvancedFilters();

    // Step 3: Select a supported currency
    await accommodationSearchPage.selectCurrency('EUR');

    // Step 4: Observe the accommodation prices on the results page
    // Verify that an error message is displayed
    const isErrorDisplayed = await accommodationSearchPage.isErrorMessageDisplayed();
    expect(isErrorDisplayed).toBeTruthy();

    // Verify the error message content
    const errorMessage = await accommodationSearchPage.getErrorMessageText();
    expect(errorMessage).toContain('currency');

    // Verify that no incorrect prices are displayed
    const prices = await accommodationSearchPage.getAccommodationPrices();

    // Check that either:
    // 1. No prices are displayed in the requested currency (EUR)
    // 2. Or prices are displayed in the default currency (assuming USD)
    for (const price of prices) {
      // Check that no price contains the EUR symbol (€) or code (EUR)
      expect(price).not.toContain('€');
      expect(price).not.toContain('EUR');
    }

    // Take a screenshot for error reporting
    await accommodationSearchPage.takeScreenshot('currency-conversion-error');
  });
});

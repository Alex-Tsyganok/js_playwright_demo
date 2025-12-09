import { test, expect } from '../../../src/fixtures/test-fixtures';
import { AccommodationSearchPage } from '../../../src/page-objects/accommodation-search-page';
import { logInfo } from '../../../src/utils/logger';
import { commonHooks } from '../../../src/fixtures/test-fixtures';

test.describe('Accommodation Search Filters', () => {
  let accommodationSearchPage: AccommodationSearchPage;

  test.beforeEach(async ({ page }) => {
    // Apply common hooks
    await commonHooks.beforeEach({ page });

    // Initialize page object
    accommodationSearchPage = new AccommodationSearchPage(page);

    // Navigate to accommodation search page
    await accommodationSearchPage.navigateToAccommodationSearch();
  });

  /**
   * Test Case: EPMCDMETST-24203
   * [TC3-01] Verify filter list contains only the supported currencies in the exact format
   */
  test('should display supported currencies in correct format', async () => {
    logInfo('Starting test to verify currency filter options');

    // Step 1: Open the Advanced Filters section
    await accommodationSearchPage.openAdvancedFilters();

    // Step 2 & 3: Locate currency selection control and review available currencies
    const availableCurrencies = await accommodationSearchPage.getAvailableCurrencies();

    // Expected currencies as specified in the test case
    const expectedCurrencies = [
      'USD 840 United States dollar',
      'EUR 978 Euro', 
      'JPY 392 Japanese yen', 
      'GBP 826 Pound sterling', 
      'CHF 756 Swiss franc', 
      'CAD 124 Canadian dollar', 
      'AUD 36 Australian dollar', 
      'CNY 156 Renminbi'
    ];

    // Verify that the number of currencies matches exactly
    expect(availableCurrencies.length).toBe(expectedCurrencies.length);

    // Verify that all expected currencies are present in the correct format
    for (const expectedCurrency of expectedCurrencies) {
      expect(availableCurrencies).toContain(expectedCurrency);
    }

    // Verify that no unexpected currencies are present
    for (const actualCurrency of availableCurrencies) {
      expect(expectedCurrencies).toContain(actualCurrency);
    }
  });
});

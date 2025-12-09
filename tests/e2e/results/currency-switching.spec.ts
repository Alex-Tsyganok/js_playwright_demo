import { test, expect } from '../../../src/fixtures/test-fixtures';
import { ResultsPage } from '../../../src/page-objects/results-page';
import { logInfo } from '../../../src/utils/logger';

// Jira: EPMCDMETST-23209
// [TC11-01] Verify switching between two supported currencies updates all prices consistently

test.describe('Currency switching on Results page', () => {
  let resultsPage: ResultsPage;

  test.beforeEach(async ({ page }) => {
    resultsPage = new ResultsPage(page);
    await resultsPage.gotoResults();
  });

  test('EPMCDMETST-23209 Verify switching between USD and EUR updates all prices consistently', async () => {
    logInfo('Selecting USD currency');
    await resultsPage.selectCurrencyByLabel('USD 840 United States dollar');
    await resultsPage.waitForPricesUpdated(['$', 'USD']);

    const usdPrices = await resultsPage.getAllDisplayedPrices();
    expect(usdPrices.length).toBeGreaterThan(0);
    usdPrices.forEach(p => {
      expect(p.includes('$') || p.includes('USD')).toBeTruthy();
      expect(p.includes('€') || p.includes('EUR')).toBeFalsy();
    });

    logInfo('Switching to EUR currency');
    await resultsPage.selectCurrencyByLabel('EUR 978 Euro');
    await resultsPage.waitForPricesUpdated(['€', 'EUR']);

    const eurPrices = await resultsPage.getAllDisplayedPrices();
    expect(eurPrices.length).toBeGreaterThan(0);
    eurPrices.forEach(p => {
      expect(p.includes('€') || p.includes('EUR')).toBeTruthy();
      expect(p.includes('$') || p.includes('USD')).toBeFalsy();
    });

    logInfo('Switching back to USD currency');
    await resultsPage.selectCurrencyByLabel('USD 840 United States dollar');
    await resultsPage.waitForPricesUpdated(['$', 'USD']);

    const usdPricesAgain = await resultsPage.getAllDisplayedPrices();
    expect(usdPricesAgain.length).toBeGreaterThan(0);
    usdPricesAgain.forEach(p => {
      expect(p.includes('$') || p.includes('USD')).toBeTruthy();
      expect(p.includes('€') || p.includes('EUR')).toBeFalsy();
    });
  });
});

import { test, expect } from '../../../src/fixtures/test-fixtures';
import { LoginPage } from '../../../src/page-objects/login-page';
import { logInfo } from '../../../src/utils/logger';

/**
 * Test case: EPMCDMETST-24373
 * [TC-2] Biometric login persists after OS update with no device or security changes
 */
test.describe('Biometric Authentication', () => {
  let loginPage: LoginPage;

  // Preconditions are assumed to be met:
  // - User has a registered account with biometric login enabled
  // - User's device has enrolled biometric data (e.g., fingerprint or FaceID)
  // - Device security settings (e.g., passcode) are enabled and unchanged
  // - No changes have been made to biometric configuration or device security
  // - A new version of the device operating system is available for update

  test.beforeEach(async ({ page: browserPage }) => {
    loginPage = new LoginPage(browserPage);
    await loginPage.goto('/login');
  });

  test('biometric login persists after OS update with no device or security changes', async ({ page }) => {
    // Step 1: Ensure the current version of the app is installed and user is logged in
    logInfo('Step 1: Ensuring user is logged in before OS utpdate');
    await loginPage.fillCredentials(process.env.TEST_USERNAME || 'test-user', process.env.TEST_PASSWORD || 'test-password');
    await loginPage.clickLoginButton();
    const isLoggedInBeforeUpdate = await loginPage.isUserLoggedIn();
    expect(isLoggedInBeforeUpdate).toBeTruthy('User should be logged in before OS update');

    // Step 2: Update the device operating system to the latest available version
    logInfo('Step 2: Simulating OS update');
    // Simulate OS update by refreshing the page and clearing cookies
    await page.context().clearCookies();

    // Step 3: Restart the device after OS update completes
    logInfo('Step 3: Simulating device restart');
    // Simulate device restart by navigating to a blank page and then back
    await page.goto('about:blank');

    // Step 4: Open the application
    logInfo('Step 4: Opening the application after OS update');
    await loginPage.goto('/login');

    // Check if biometric login option is available
    const isBiometricOptionAvailable = await loginPage.isBiometricLoginOptionAvailable();
    expect(isBiometricOptionAvailable).toBeTruthy('Biometric login option should be available after OS update');

    // Step 5: Attempt to log in using biometric authentication on the login screen
    logInfo('Step 5: Attempting to log in using biometric authentication');
    await loginPage.useBiometricAuthentication();

    // Verify that user is logged in successfully
    const isLoggedInAfterUpdate = await loginPage.isUserLoggedIn();
    expect(isLoggedInAfterUpdate).toBeTruthy('User should be logged in after biometric authentication');

    // Verify that user is not prompted to re-enroll biometrics
    const isReenrollmentMessageShown = await loginPage.isBiometricReenrollmentMessageShown();
    expect(isReenrollmentMessageShown).toBeFalsy('User should not be prompted to re-enroll biometrics');

    // Verify that user is not prompted for SMS code
    const isSMSCodeRequested = await loginPage.isSMSCodeRequested();
    expect(isSMSCodeRequested).toBeFalsy('User should not be prompted for SMS code');

    // Verify that user is not prompted for password
    const isPasswordRequested = await loginPage.isPasswordRequested();
    expect(isPasswordRequested).toBeFalsy('User should not be prompted for password');
  });
});

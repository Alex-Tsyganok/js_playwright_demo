import { test, expect } from '../../src/fixtures/test-fixtures';
import { BasePage } from '../../src/page-objects/base-page';
import { SettingsPage } from '../../src/page-objects/settings-page';
import { logInfo, logStep } from '../../src/utils/logger';

/**
 * Test Suite: Biometric Device Trust Verification
 *
 * Jira Test Case: EPMCDMETST-23094
 * Title: Verify device is marked as trusted and trust status is visible in app settings
 * after successful biometric setup and verification
 *
 * Requirement: Persistent Biometric Session Management – Acceptance Criteria 1
 *
 * Test Type: UI (Mobile Functional)
 * Platforms: iOS, Android
 *
 * Description:
 * This test verifies that after a user successfully completes biometric setup and verification,
 * the device is marked as trusted and the trust status is visible and accurate in the app's
 * authentication settings. The test ensures consistency across iOS and Android platforms.
 */

// Jira: EPMCDMETST-23094
test.describe('Biometric Device Trust Verification - EPMCDMETST-23094', () => {
  let basePage: BasePage;
  let settingsPage: SettingsPage;
  let testUsername: string;

  /**
   * Setup: Initialize page objects and prepare test environment
   *
   * Preconditions:
   * - User has installed the app on a supported device (iOS or Android)
   * - User account exists and is accessible
   * - Device supports biometric authentication (e.g., fingerprint, face recognition)
   * - App is at a version supporting biometric session management
   */
  test.beforeEach(async ({ page }) => {
    logInfo('=== Test Setup: EPMCDMETST-23094 ===');
    logInfo('Initializing page objects for biometric device trust verification');
    basePage = new BasePage(page);
    settingsPage = new SettingsPage(page);

    // Get test credentials from environment
    testUsername = process.env.TEST_USERNAME || 'test-user';
    const testPassword = process.env.TEST_PASSWORD || 'test-password';
    logInfo(`Test user: ${testUsername}`);

    // Navigate to login page
    await basePage.goto('/login');

    // Perform login to satisfy precondition: user account exists and is accessible
    logStep('Step 1: Launch the app and log in with a valid user account');
    await basePage.fill('[data-test="username"]', testUsername);
    await basePage.fill('[data-test="password"]', testPassword);
    await basePage.waitForNavigation(async () => {
      await basePage.click('[data-test="login-button"]');
    });

    // Verify successful login - main/home screen is accessible
    const dashboardTitle = await basePage.getText('h1');
    expect(dashboardTitle).toContain('Dashboard');
    const isProfileVisible = await basePage.isVisible('[data-test="user-profile"]');
    expect(isProfileVisible).toBeTruthy();

    logInfo('✓ Expected Result: App launches and user successfully authenticates; main/home screen is accessible');
    logInfo('=== Test Setup Complete ===
');
  });

  /**
   * Teardown: Cleanup and capture final state
   */
  test.afterEach(async ({ page }, testInfo) => {
    logInfo('=== Test Teardown ===');

    // Capture screenshot on failure for debugging
    if (testInfo.status !== 'passed') {
      await settingsPage.captureDeviceTrustStatusScreenshot(
        `failure-${testInfo.title.replace(/\s+/g, '-')}-${Date.now()}`
      );
      logInfo('Screenshot captured for failed test');
    }

    logInfo('=== Test Teardown Complete ===
');
  });

  /**
   * Test Case: EPMCDMETST-23094
   *
   * Verify device is marked as trusted and trust status is visible in app settings
   * after successful biometric setup and verification
   *
   * Acceptance Criteria:
   * 1. Given biometric setup and verification are successful, when the user navigates to
   *    Settings > Authentication, then the device trust status indicator is visible and
   *    shows the device is marked as trusted for the current device/account.
   *
   * 2. Given the device is marked as trusted, when the user views the trust status indicator,
   *    then it accurately reflects the current device/account combination.
   *
   * 3. Given the trust status indicator is displayed, when the app runs on iOS or Android,
   *    then the indicator is consistent across platforms.
   */
  test('should mark device as trusted and display trust status after successful biometric setup and verification', async () => {
    logInfo('=== Starting Test: EPMCDMETST-23094 ===');
    logInfo('Test: Verify device trust status after biometric setup and verification
');

    // ========================================================================
    // Step 2: Navigate to the biometric setup flow
    // Path: Settings > Authentication > Enable Biometrics
    // ========================================================================
    logStep('Step 2: Navigate to the biometric setup flow (Settings > Authentication > Enable Biometrics)');
    await settingsPage.navigateToBiometricSetup();

    // Verify biometric setup screen is accessible and prompts user to enable biometrics
    const isBiometricSetupAccessible = await settingsPage.isBiometricSetupScreenAccessible();
    expect(isBiometricSetupAccessible).toBeTruthy();
    logInfo('✓ Expected Result: Biometric setup screen is accessible and prompts the user to enable biometrics
');

    // ========================================================================
    // Step 3: Complete biometric setup and perform biometric verification
    // ========================================================================
    logStep('Step 3: Complete biometric setup and perform biometric verification as prompted by the app');
    await settingsPage.completeBiometricSetupAndVerification();

    // Verify biometric setup and verification completed successfully
    const isVerificationSuccessful = await settingsPage.isBiometricVerificationSuccessful();
    expect(isVerificationSuccessful).toBeTruthy();
    logInfo('✓ Expected Result: Biometric setup and verification complete successfully; device is marked as trusted for the logged-in user account
');

    // ========================================================================
    // Step 4: Navigate to Settings > Authentication
    // ========================================================================
    logStep('Step 4: After successful verification, navigate to Settings > Authentication');
    await settingsPage.navigateToAuthenticationSettings();

    // Verify Settings > Authentication screen opens and displays authentication-related options
    const isAuthSettingsDisplayed = await settingsPage.isAuthenticationSettingsDisplayed();
    expect(isAuthSettingsDisplayed).toBeTruthy();
    const areAuthOptionsVisible = await settingsPage.areAuthenticationOptionsVisible();
    expect(areAuthOptionsVisible).toBeTruthy();
    logInfo('✓ Expected Result: Settings > Authentication screen opens and displays authentication-related options
');

    // ========================================================================
    // Step 5: Observe the device trust status indicator
    // ========================================================================
    logStep('Step 5: Observe the device trust status indicator');

    // Acceptance Criterion 1: Device trust status indicator is visible
    const isTrustStatusIndicatorVisible = await settingsPage.isDeviceTrustStatusIndicatorVisible();
    expect(isTrustStatusIndicatorVisible).toBeTruthy();
    logInfo('✓ Acceptance Criterion 1: Device trust status indicator is visible');

    // Acceptance Criterion 1: Device is marked as trusted
    const isDeviceTrusted = await settingsPage.isDeviceMarkedAsTrusted();
    expect(isDeviceTrusted).toBeTruthy();
    logInfo('✓ Acceptance Criterion 1: Device is marked as trusted for the current device/account');

    // Acceptance Criterion 2: Trust status accurately reflects current device/account combination
    const trustStatusReflectsAccount = await settingsPage.verifyTrustStatusReflectsDeviceAccount(testUsername);
    expect(trustStatusReflectsAccount).toBeTruthy();
    logInfo(`✓ Acceptance Criterion 2: Trust status accurately reflects device/account combination for user: ${testUsername}`);

    // Acceptance Criterion 3: Trust status indicator is consistent across platforms
    const isPlatformConsistent = await settingsPage.verifyTrustStatusConsistencyAcrossPlatforms();
    expect(isPlatformConsistent).toBeTruthy();
    logInfo('✓ Acceptance Criterion 3: Trust status indicator is consistent across platforms (iOS and Android)');

    // Get and log the actual trust status for verification
    const trustStatus = await settingsPage.getDeviceTrustStatus();
    logInfo(`Device Trust Status: ${trustStatus}`);
    const deviceAccountInfo = await settingsPage.getDeviceAccountInfo();
    logInfo(`Device/Account Info: ${deviceAccountInfo}`);

    logInfo('
✓ Expected Result: Trust status indicator is visible in Settings > Authentication and accurately reflects the current device/account combination; displayed consistently across supported platforms (iOS and Android)');

    // Capture screenshot for documentation
    await settingsPage.captureDeviceTrustStatusScreenshot(`device-trust-status-verified-${Date.now()}`);

    logInfo('
=== Test Completed Successfully: EPMCDMETST-23094 ===');
  });

  /**
   * Additional Test: Verify trust status persists after app restart
   *
   * This test ensures that the device trust status remains persistent
   * across app sessions, which is a key requirement for biometric session management.
   */
  test('should persist device trust status after app restart', async ({ page }) => {
    logInfo('=== Starting Additional Test: Device Trust Persistence ===');
    logInfo('Test: Verify trust status persists after app restart
');

    // Complete biometric setup (reusing steps from main test)
    logStep('Setting up biometric authentication');
    await settingsPage.navigateToBiometricSetup();
    await settingsPage.completeBiometricSetupAndVerification();
    const isVerificationSuccessful = await settingsPage.isBiometricVerificationSuccessful();
    expect(isVerificationSuccessful).toBeTruthy();
    logInfo('✓ Biometric setup completed');

    // Verify initial trust status
    await settingsPage.navigateToAuthenticationSettings();
    const initialTrustStatus = await settingsPage.isDeviceMarkedAsTrusted();
    expect(initialTrustStatus).toBeTruthy();
    logInfo('✓ Initial trust status verified');

    // Simulate app restart by navigating away and back
    logStep('Simulating app restart');
    await basePage.goto('/');
    await page.reload();
    // Wait for page to stabilize after reload
    await page.waitForLoadState('networkidle');
    logInfo('✓ App restarted (simulated)');

    // Navigate back to authentication settings
    logStep('Verifying trust status after restart');
    await settingsPage.navigateToAuthenticationSettings();

    // Verify trust status persists
    const persistedTrustStatus = await settingsPage.isDeviceMarkedAsTrusted();
    expect(persistedTrustStatus).toBeTruthy();
    const trustStatusReflectsAccount = await settingsPage.verifyTrustStatusReflectsDeviceAccount(testUsername);
    expect(trustStatusReflectsAccount).toBeTruthy();

    logInfo('✓ Trust status persisted after app restart');
    logInfo('✓ Trust status still reflects correct device/account combination');

    logInfo('
=== Additional Test Completed Successfully ===');
  });
});

// tests/e2e/biometricTrustStatus.spec.ts

/**
 * Jira: EPMCDMETST22778
 * Title: Verify device is marked as trusted and trust status is visible in app settings after successful biometric setup and verification
 * Requirement Trace: Persistent Biometric Session Management – Acceptance Criteria 1
 */

import { test, expect } from '@playwright/test';
import { SettingsPage } from '../../pages/SettingsPage';
import { BiometricSetupPage } from '../../pages/BiometricSetupPage';
import { AuthenticationPage } from '../../pages/AuthenticationPage';

test.describe('EPMCDMETST-22778: Biometric trust status after setup and verification', () { 
  // Step 1: Launch the app and log in with a valid user account.
  await page.goto('app://login'); // Placeholder for app launch
  await page.fill('[data-test="login-username"]', 'testuser'); // Placeholder
  await page.fill('[data-test="login-password"]', 'password123'); // Placeholder
  await page.click('[data-test="login-submit"]');

  // Step 2: Navigate to the biometric setup flow (Settings > Authentication > Enable Biometrics)
  const settingsPage = new SettingsPage(page);
  await settingsPage.gotoAuthentication();
  await settingsPage.gotoBiometricSetup();

  // Step 3: Complete biometric setup and perform verification
  const biometricSetupPage = new BiometricSetupPage(page);
  await biometricSetupPage.enableBiometrics();
  await biometricSetupPage.performBiometricVerification();

  // Step 4: After successful verification, navigate to Settings > Authentication
  await settingsPage.gotoAuthentication();

  // Step 5: Observe the device trust status indicator
  const authenticationPage = new AuthenticationPage(page);
  const trustStatus = await authenticationPage.getTrustStatus();

  // Expected results
  expect(trustStatus).toContain('Trusted'); // Placeholder: Adjust to match actual UI text
});

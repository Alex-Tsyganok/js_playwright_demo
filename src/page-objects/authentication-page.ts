import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

/**
 * Page Object for Authentication and Biometric settings
 */
export class AuthenticationPage extends BasePage {
  // Locators
  private readonly enableBiometricsButton: Locator;
  private readonly biometricSetupModal: Locator;
  private readonly completeBiometricSetupButton: Locator;
  private readonly biometricVerificationPrompt: Locator;
  private readonly confirmBiometricButton: Locator;
  private readonly deviceTrustStatusIndicator: Locator;
  private readonly trustStatusLabel: Locator;
  private readonly trustedDeviceIcon: Locator;

  constructor(page: Page) {
    super(page);
    this.enableBiometricsButton = page.locator('[data-testid="enable-biometrics-button"]');
    this.biometricSetupModal = page.locator('[data-testid="biometric-setup-modal"]');
    this.completeBiometricSetupButton = page.locator('[data-testid="complete-biometric-setup"]');
    this.biometricVerificationPrompt = page.locator('[data-testid="biometric-verification-prompt"]');
    this.confirmBiometricButton = page.locator('[data-testid="confirm-biometric-button"]');
    this.deviceTrustStatusIndicator = page.locator('[data-testid="device-trust-status"]');
    this.trustStatusLabel = page.locator('[data-testid="trust-status-label"]');
    this.trustedDeviceIcon = page.locator('[data-testid="trusted-device-icon"]');
  }

  /**
   * Navigate to Authentication page
   */
  async navigateToAuthentication() {
    logStep('Navigating to Authentication page');
    await this.goto('/settings/authentication');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Start biometric setup flow
   */
  async startBiometricSetup() {
    logStep('Starting biometric setup');
    await this.click(this.enableBiometricsButton);
    await this.waitForElement(this.biometricSetupModal);
  }

  /**
   * Complete biometric setup
   */
  async completeBiometricSetup() {
    logStep('Completing biometric setup');
    await this.click(this.completeBiometricSetupButton);
    await this.waitForElement(this.biometricVerificationPrompt);
  }

  /**
   * Perform biometric verification
   * Note: In real scenario, this would trigger device biometric prompt
   * For testing, we simulate the confirmation
   */
  async performBiometricVerification() {
    logStep('Performing biometric verification');
    await this.click(this.confirmBiometricButton);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if device trust status indicator is visible
   */
  async isTrustStatusVisible(): Promise<boolean> {
    logStep('Checking if trust status is visible');
    return await this.isVisible(this.deviceTrustStatusIndicator);
  }

  /**
   * Get trust status text
   */
  async getTrustStatusText(): Promise<string | null> {
    logStep('Getting trust status text');
    return await this.getText(this.trustStatusLabel);
  }

  /**
   * Check if device is marked as trusted
   */
  async isDeviceMarkedAsTrusted(): Promise<boolean> {
    logStep('Checking if device is marked as trusted');
    const statusText = await this.getTrustStatusText();
    const iconVisible = await this.isVisible(this.trustedDeviceIcon);
    
    return (
      iconVisible &&
      statusText !== null &&
      (statusText.toLowerCase().includes('trusted') || 
       statusText.toLowerCase().includes('verified'))
    );
  }

  /**
   * Verify trust status is accurate for current device/account
   */
  async verifyTrustStatusAccuracy(): Promise<boolean> {
    logStep('Verifying trust status accuracy');
    const isTrusted = await this.isDeviceMarkedAsTrusted();
    const isVisible = await this.isTrustStatusVisible();
    
    return isTrusted && isVisible;
  }
}

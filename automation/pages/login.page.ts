import { expect, type Locator, type Page } from '@playwright/test';

import { routes } from '../config/constants';
import { env } from '../config/env';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    super(page, routes.login);
    this.emailInput = page.getByTestId('login-email');
    this.passwordInput = page.getByTestId('login-password');
    this.submitButton = page.getByTestId('login-submit');
    this.registerLink = page.getByRole('link', { name: 'Crear cuenta' });
  }

  async waitUntilLoaded(): Promise<void> {
    await this.waitForUrl();
    await this.expectHeading(/Iniciar sesi[oó]n/i, 20000);
    await expect(this.emailInput).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.passwordInput.press('Enter');
  }

  async loginAsDemoUser(): Promise<void> {
    await this.login(env.demoUserEmail, env.demoUserPassword);
  }
}

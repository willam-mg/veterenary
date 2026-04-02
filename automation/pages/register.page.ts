import { expect, type Locator, type Page } from '@playwright/test';

import { routes } from '../config/constants';
import { clickReliably } from '../utils/interactions';
import { BasePage } from './base.page';

export type RegisterUserInput = {
  name: string;
  email: string;
  phone?: string;
  role?: 'admin' | 'receptionist' | 'veterinarian';
  password: string;
  passwordConfirmation?: string;
};

export class RegisterPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly roleSelect: Locator;
  readonly passwordInput: Locator;
  readonly passwordConfirmationInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page, routes.register);
    this.nameInput = page.getByTestId('register-name');
    this.emailInput = page.getByTestId('register-email');
    this.phoneInput = page.locator('input[formcontrolname="phone"]');
    this.roleSelect = page.locator('select[formcontrolname="role"]');
    this.passwordInput = page.getByTestId('register-password');
    this.passwordConfirmationInput = page.locator('input[formcontrolname="password_confirmation"]');
    this.submitButton = page.getByTestId('register-submit');
  }

  async waitUntilLoaded(): Promise<void> {
    await this.waitForUrl();
    await this.expectHeading(/Registro/i);
    await expect(this.nameInput).toBeVisible();
  }

  async register(user: RegisterUserInput): Promise<void> {
    await this.nameInput.fill(user.name);
    await this.emailInput.fill(user.email);
    await this.phoneInput.fill(user.phone ?? '');
    await this.roleSelect.selectOption(user.role ?? 'admin');
    await this.passwordInput.fill(user.password);
    await this.passwordConfirmationInput.fill(user.passwordConfirmation ?? user.password);
    await clickReliably(this.submitButton);
  }
}

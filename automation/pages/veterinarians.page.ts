import { expect, type Locator, type Page } from '@playwright/test';

import { routes } from '../config/constants';
import { BasePage } from './base.page';

export type VeterinarianFormInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  licenseNumber: string;
  specialty?: string;
  photoPath?: string;
};

export class VeterinariansPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly licenseNumberInput: Locator;
  readonly specialtyInput: Locator;
  readonly photoInput: Locator;
  readonly submitButton: Locator;
  readonly searchInput: Locator;
  readonly table: Locator;

  constructor(page: Page) {
    super(page, routes.veterinarians);
    this.firstNameInput = page.locator('input[formcontrolname="first_name"]');
    this.lastNameInput = page.locator('input[formcontrolname="last_name"]');
    this.emailInput = page.locator('input[formcontrolname="email"]');
    this.phoneInput = page.locator('input[formcontrolname="phone"]');
    this.licenseNumberInput = page.locator('input[formcontrolname="license_number"]');
    this.specialtyInput = page.locator('input[formcontrolname="specialty"]');
    this.photoInput = page.locator('input[type="file"]').first();
    this.submitButton = page.getByRole('button', { name: /Crear veterinario|Actualizar veterinario|Guardando/i });
    this.searchInput = page.getByPlaceholder('Buscar veterinario');
    this.table = page.locator('table').filter({
      has: page.getByRole('columnheader', { name: 'Veterinario' }),
    });
  }

  async waitUntilLoaded(): Promise<void> {
    await this.waitForUrl();
    await this.expectHeading(/^Veterinarios$/i);
    await expect(this.firstNameInput).toBeVisible();
  }

  async createVeterinarian(input: VeterinarianFormInput): Promise<void> {
    await this.firstNameInput.fill(input.firstName);
    await this.lastNameInput.fill(input.lastName);
    await this.emailInput.fill(input.email);
    await this.phoneInput.fill(input.phone ?? '');
    await this.licenseNumberInput.fill(input.licenseNumber);
    await this.specialtyInput.fill(input.specialty ?? '');

    if (input.photoPath) {
      await this.photoInput.setInputFiles(input.photoPath);
    }

    await this.submitButton.click();
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
  }

  rowByVeterinarianName(fullName: string): Locator {
    return this.table.locator('tbody tr').filter({ has: this.page.getByText(fullName, { exact: false }) });
  }
}

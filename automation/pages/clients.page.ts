import { expect, type Locator, type Page } from '@playwright/test';

import { routes } from '../config/constants';
import { BasePage } from './base.page';

export type ClientFormInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber: string;
  address?: string;
  notes?: string;
  photoPath?: string;
};

export class ClientsPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly documentInput: Locator;
  readonly addressInput: Locator;
  readonly notesInput: Locator;
  readonly photoInput: Locator;
  readonly submitButton: Locator;
  readonly searchInput: Locator;
  readonly table: Locator;

  constructor(page: Page) {
    super(page, routes.clients);
    this.firstNameInput = page.getByTestId('client-first-name');
    this.lastNameInput = page.getByTestId('client-last-name');
    this.emailInput = page.getByTestId('client-email');
    this.phoneInput = page.getByTestId('client-phone');
    this.documentInput = page.getByTestId('client-document');
    this.addressInput = page.locator('input[formcontrolname="address"]');
    this.notesInput = page.locator('textarea[formcontrolname="notes"]');
    this.photoInput = page.locator('input[type="file"]').first();
    this.submitButton = page.getByTestId('client-submit');
    this.searchInput = page.getByPlaceholder('Buscar por nombre, teléfono o documento');
    this.table = page.locator('table').filter({
      has: page.getByRole('columnheader', { name: 'Cliente' }),
    });
  }

  async waitUntilLoaded(): Promise<void> {
    await this.waitForUrl();
    await this.expectHeading(/^Clientes$/i);
    await expect(this.firstNameInput).toBeVisible();
  }

  async createClient(input: ClientFormInput): Promise<void> {
    await this.firstNameInput.fill(input.firstName);
    await this.lastNameInput.fill(input.lastName);
    await this.emailInput.fill(input.email);
    await this.phoneInput.fill(input.phone);
    await this.documentInput.fill(input.documentNumber);
    await this.addressInput.fill(input.address ?? '');
    await this.notesInput.fill(input.notes ?? '');

    if (input.photoPath) {
      await this.photoInput.setInputFiles(input.photoPath);
    }

    await this.submitButton.click();
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
  }

  rowByClientName(fullName: string): Locator {
    return this.table.locator('tbody tr').filter({ has: this.page.getByText(fullName, { exact: false }) });
  }
}

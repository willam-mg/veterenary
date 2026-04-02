import { expect, type Locator, type Page } from '@playwright/test';

import { routes, uiText } from '../config/constants';
import { clickReliably } from '../utils/interactions';
import { BasePage } from './base.page';
import { EntitySelectorModalComponent } from './components/entity-selector-modal.component';

export type PetFormInput = {
  clientName?: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed?: string;
  sex?: 'male' | 'female' | 'unknown';
  birthDate?: string;
  weight?: string;
  color?: string;
  microchipNumber?: string;
  allergies?: string;
  notes?: string;
  photoPath?: string;
};

export class PetsPage extends BasePage {
  readonly clientSelector: EntitySelectorModalComponent;
  readonly selectedClientPill: Locator;
  readonly selectClientButton: Locator;
  readonly nameInput: Locator;
  readonly speciesSelect: Locator;
  readonly breedInput: Locator;
  readonly sexSelect: Locator;
  readonly birthDateInput: Locator;
  readonly weightInput: Locator;
  readonly colorInput: Locator;
  readonly microchipInput: Locator;
  readonly allergiesInput: Locator;
  readonly notesInput: Locator;
  readonly photoInput: Locator;
  readonly submitButton: Locator;
  readonly searchInput: Locator;
  readonly table: Locator;

  constructor(page: Page) {
    super(page, routes.pets);
    this.clientSelector = new EntitySelectorModalComponent(page, 'Seleccionar cliente');
    this.selectedClientPill = page.locator('.selector-pill').filter({ hasText: uiText.noSelectedClient }).first();
    this.selectClientButton = page.getByRole('button', { name: 'Seleccionar cliente' });
    this.nameInput = page.getByTestId('pet-name');
    this.speciesSelect = page.locator('select[formcontrolname="species"]');
    this.breedInput = page.locator('input[formcontrolname="breed"]');
    this.sexSelect = page.locator('select[formcontrolname="sex"]');
    this.birthDateInput = page.locator('input[formcontrolname="birth_date"]');
    this.weightInput = page.locator('input[formcontrolname="weight"]');
    this.colorInput = page.locator('input[formcontrolname="color"]');
    this.microchipInput = page.locator('input[formcontrolname="microchip_number"]');
    this.allergiesInput = page.locator('textarea[formcontrolname="allergies"]');
    this.notesInput = page.locator('textarea[formcontrolname="notes"]');
    this.photoInput = page.locator('input[type="file"]').first();
    this.submitButton = page.getByTestId('pet-submit');
    this.searchInput = page.getByPlaceholder('Buscar por mascota, raza, microchip o cliente');
    this.table = page.locator('table').filter({
      has: page.getByRole('columnheader', { name: 'Mascota' }),
    });
  }

  async waitUntilLoaded(): Promise<void> {
    await this.waitForUrl();
    await this.expectHeading(/^Mascotas$/i);
    await expect(this.nameInput).toBeVisible();
  }

  async openClientSelector(): Promise<void> {
    await clickReliably(this.selectClientButton);
    await this.clientSelector.expectOpen();
  }

  async selectClient(clientName?: string): Promise<void> {
    await this.openClientSelector();

    if (clientName) {
      await this.clientSelector.search(clientName);
      await this.clientSelector.selectByText(clientName);
      return;
    }

    await this.clientSelector.selectFirst();
  }

  async createPet(input: PetFormInput): Promise<void> {
    await this.selectClient(input.clientName);
    await this.nameInput.fill(input.name);
    await this.speciesSelect.selectOption(input.species);
    await this.breedInput.fill(input.breed ?? '');
    await this.sexSelect.selectOption(input.sex ?? 'unknown');
    await this.birthDateInput.fill(input.birthDate ?? '');
    await this.weightInput.fill(input.weight ?? '');
    await this.colorInput.fill(input.color ?? '');
    await this.microchipInput.fill(input.microchipNumber ?? '');
    await this.allergiesInput.fill(input.allergies ?? '');
    await this.notesInput.fill(input.notes ?? '');

    if (input.photoPath) {
      await this.photoInput.setInputFiles(input.photoPath);
    }

    await clickReliably(this.submitButton);
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
  }

  rowByPetName(name: string): Locator {
    return this.table.locator('tbody tr').filter({ has: this.page.getByText(name, { exact: false }) });
  }
}

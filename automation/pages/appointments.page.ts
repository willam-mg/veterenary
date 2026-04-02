import { expect, type Locator, type Page } from '@playwright/test';

import { routes, type AppointmentStatus } from '../config/constants';
import { BasePage } from './base.page';
import { EntitySelectorModalComponent } from './components/entity-selector-modal.component';

export type AppointmentFormInput = {
  petName?: string;
  veterinarianName?: string;
  scheduledAt: string;
  status?: AppointmentStatus;
  reason: string;
  serviceNames?: string[];
  notes?: string;
};

export class AppointmentsPage extends BasePage {
  readonly petSelector: EntitySelectorModalComponent;
  readonly veterinarianSelector: EntitySelectorModalComponent;
  readonly selectPetButton: Locator;
  readonly selectVeterinarianButton: Locator;
  readonly scheduledAtInput: Locator;
  readonly statusSelect: Locator;
  readonly reasonInput: Locator;
  readonly notesInput: Locator;
  readonly submitButton: Locator;
  readonly searchInput: Locator;
  readonly table: Locator;
  readonly rows: Locator;
  readonly loadingState: Locator;

  constructor(page: Page) {
    super(page, routes.appointments);
    this.petSelector = new EntitySelectorModalComponent(page, 'Seleccionar mascota');
    this.veterinarianSelector = new EntitySelectorModalComponent(page, 'Seleccionar veterinario');
    this.selectPetButton = page.getByRole('button', { name: 'Seleccionar mascota' });
    this.selectVeterinarianButton = page.getByRole('button', { name: 'Seleccionar veterinario' });
    this.scheduledAtInput = page.getByTestId('appointment-date');
    this.statusSelect = page.locator('select[formcontrolname="status"]');
    this.reasonInput = page.getByTestId('appointment-reason');
    this.notesInput = page.locator('textarea[formcontrolname="notes"]');
    this.submitButton = page.getByTestId('appointment-submit');
    this.searchInput = page.getByPlaceholder('Buscar citas');
    this.table = page.locator('table').filter({
      has: page.getByRole('columnheader', { name: 'Mascota' }),
    });
    this.rows = this.table.locator('tbody tr');
    this.loadingState = page.getByText('Cargando agenda...');
  }

  async waitUntilLoaded(): Promise<void> {
    await this.waitForUrl();
    await this.expectHeading(/^Citas$/i);
    await expect(this.scheduledAtInput).toBeVisible();
    await this.waitUntilTableReady();
  }

  async selectPet(petName?: string): Promise<void> {
    await this.selectPetButton.click();
    await this.petSelector.expectOpen();

    if (petName) {
      await this.petSelector.search(petName);
      await this.petSelector.selectByText(petName);
      return;
    }

    await this.petSelector.selectFirst();
  }

  async selectVeterinarian(veterinarianName?: string): Promise<void> {
    await this.selectVeterinarianButton.click();
    await this.veterinarianSelector.expectOpen();

    if (veterinarianName) {
      await this.veterinarianSelector.search(veterinarianName);
      await this.veterinarianSelector.selectByText(veterinarianName);
      return;
    }

    await this.veterinarianSelector.selectFirst();
  }

  async toggleService(serviceName: string, checked = true): Promise<void> {
    const checkboxLabel = this.page.locator('.checkbox-item').filter({
      has: this.page.getByText(serviceName, { exact: false }),
    });
    const checkbox = checkboxLabel.locator('input[type="checkbox"]');
    checked ? await checkbox.check() : await checkbox.uncheck();
  }

  async createAppointment(input: AppointmentFormInput): Promise<void> {
    await this.selectPet(input.petName);
    await this.selectVeterinarian(input.veterinarianName);
    await this.scheduledAtInput.fill(input.scheduledAt);
    await this.statusSelect.selectOption(input.status ?? 'scheduled');
    await this.reasonInput.fill(input.reason);

    for (const serviceName of input.serviceNames ?? []) {
      await this.toggleService(serviceName);
    }

    await this.notesInput.fill(input.notes ?? '');
    await this.submitButton.click();
  }

  async search(term: string): Promise<void> {
    const encodedTerm = encodeURIComponent(term);
    await Promise.all([
      this.page.waitForResponse(
        (response) =>
          response.request().method() === 'GET' &&
          response.url().includes('/appointments') &&
          response.url().includes(`search=${encodedTerm}`)
      ),
      this.searchInput.fill(term),
    ]);
    await this.waitUntilTableReady();
  }

  async waitUntilTableReady(): Promise<void> {
    await this.loadingState.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => undefined);
  }

  rowByAppointmentText(text: string): Locator {
    return this.rows.filter({ has: this.page.getByText(text, { exact: false }) });
  }
}

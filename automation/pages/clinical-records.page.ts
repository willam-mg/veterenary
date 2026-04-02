import { expect, type Locator, type Page } from '@playwright/test';

import { routes } from '../config/constants';
import { BasePage } from './base.page';
import { EntitySelectorModalComponent } from './components/entity-selector-modal.component';

export type ClinicalRecordFormInput = {
  petName?: string;
  veterinarianName?: string;
  appointmentLabel?: string;
  recordDate: string;
  diagnosis: string;
  treatment?: string;
  observations?: string;
  weight?: string;
  attachmentPath?: string;
};

export class ClinicalRecordsPage extends BasePage {
  readonly petSelector: EntitySelectorModalComponent;
  readonly veterinarianSelector: EntitySelectorModalComponent;
  readonly selectPetButton: Locator;
  readonly selectVeterinarianButton: Locator;
  readonly appointmentSelect: Locator;
  readonly recordDateInput: Locator;
  readonly diagnosisInput: Locator;
  readonly treatmentInput: Locator;
  readonly observationsInput: Locator;
  readonly weightInput: Locator;
  readonly attachmentInput: Locator;
  readonly submitButton: Locator;
  readonly searchInput: Locator;
  readonly table: Locator;
  readonly rows: Locator;
  readonly loadingState: Locator;

  constructor(page: Page) {
    super(page, routes.clinicalRecords);
    this.petSelector = new EntitySelectorModalComponent(page, 'Seleccionar mascota');
    this.veterinarianSelector = new EntitySelectorModalComponent(page, 'Seleccionar veterinario');
    this.selectPetButton = page.getByRole('button', { name: 'Seleccionar mascota' });
    this.selectVeterinarianButton = page.getByRole('button', { name: 'Seleccionar veterinario' });
    this.appointmentSelect = page.locator('select[formcontrolname="appointment_id"]');
    this.recordDateInput = page.getByTestId('record-date');
    this.diagnosisInput = page.getByTestId('record-diagnosis');
    this.treatmentInput = page.locator('textarea[formcontrolname="treatment"]');
    this.observationsInput = page.locator('textarea[formcontrolname="observations"]');
    this.weightInput = page.locator('input[formcontrolname="weight"]');
    this.attachmentInput = page.locator('input[type="file"]').first();
    this.submitButton = page.getByTestId('record-submit');
    this.searchInput = page.getByPlaceholder('Buscar historiales');
    this.table = page.locator('table').filter({
      has: page.getByRole('columnheader', { name: 'Diagnóstico' }),
    });
    this.rows = this.table.locator('tbody tr');
    this.loadingState = page.getByText('Cargando historiales...');
  }

  async waitUntilLoaded(): Promise<void> {
    await this.waitForUrl();
    await this.expectHeading(/Historial cl[ií]nico/i);
    await expect(this.recordDateInput).toBeVisible();
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

  async selectAppointment(label?: string): Promise<void> {
    if (!label) {
      return;
    }

    await this.appointmentSelect.selectOption({ label });
  }

  async createRecord(input: ClinicalRecordFormInput): Promise<void> {
    await this.selectPet(input.petName);
    await this.selectVeterinarian(input.veterinarianName);
    await this.selectAppointment(input.appointmentLabel);
    await this.recordDateInput.fill(input.recordDate);
    await this.diagnosisInput.fill(input.diagnosis);
    await this.treatmentInput.fill(input.treatment ?? '');
    await this.observationsInput.fill(input.observations ?? '');
    await this.weightInput.fill(input.weight ?? '');

    if (input.attachmentPath) {
      await this.attachmentInput.setInputFiles(input.attachmentPath);
    }

    await this.submitButton.click();
  }

  async search(term: string): Promise<void> {
    const encodedTerm = encodeURIComponent(term);
    await Promise.all([
      this.page.waitForResponse(
        (response) =>
          response.request().method() === 'GET' &&
          response.url().includes('/clinical-records') &&
          response.url().includes(`search=${encodedTerm}`)
      ),
      this.searchInput.fill(term),
    ]);
    await this.waitUntilTableReady();
  }

  rowByDiagnosis(text: string): Locator {
    return this.rows.filter({ has: this.page.getByText(text, { exact: false }) });
  }

  async waitUntilTableReady(): Promise<void> {
    await this.loadingState.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => undefined);
  }
}

import { expect, type Locator, type Page } from '@playwright/test';

export class EntitySelectorModalComponent {
  readonly backdrop: Locator;
  readonly modalCard: Locator;
  readonly searchInput: Locator;
  readonly loadingState: Locator;
  readonly closeButton: Locator;

  constructor(private readonly page: Page, private readonly title: string) {
    this.modalCard = page.locator('.modal-card.panel').filter({
      has: page.getByRole('heading', { name: title }),
    });
    this.backdrop = page.locator('.modal-backdrop').filter({ has: this.modalCard });
    this.searchInput = this.modalCard.getByRole('searchbox');
    this.loadingState = this.modalCard.getByText('Cargando datos...');
    this.closeButton = this.modalCard.getByRole('button', { name: 'Cerrar' });
  }

  async expectOpen(): Promise<void> {
    await expect(this.modalCard).toBeVisible();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
    await expect(this.modalCard).toBeHidden();
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
  }

  async selectByText(value: string): Promise<void> {
    const row = this.modalCard.locator('tbody tr').filter({
      has: this.modalCard.getByText(value, { exact: false }),
    });
    await row.getByRole('button', { name: 'Seleccionar' }).click();
  }

  async selectFirst(): Promise<void> {
    await this.modalCard.locator('tbody tr').first().getByRole('button', { name: 'Seleccionar' }).click();
  }
}

import { expect, type Locator, type Page } from '@playwright/test';

import { clickReliably } from '../../utils/interactions';

export class EntitySelectorModalComponent {
  readonly backdrop: Locator;
  readonly modalCard: Locator;
  readonly searchInput: Locator;
  readonly loadingState: Locator;
  readonly closeButton: Locator;
  readonly rows: Locator;

  constructor(private readonly page: Page, private readonly title: string) {
    this.modalCard = page.locator('.modal-card.panel').filter({
      has: page.getByRole('heading', { name: title }),
    });
    this.backdrop = page.locator('.modal-backdrop').filter({ has: this.modalCard });
    this.searchInput = this.modalCard.getByRole('searchbox');
    this.loadingState = this.modalCard.getByText('Cargando datos...');
    this.closeButton = this.modalCard.getByRole('button', { name: 'Cerrar' });
    this.rows = this.modalCard.locator('tbody tr');
  }

  async expectOpen(): Promise<void> {
    await expect(this.modalCard).toBeVisible();
    await this.loadingState.waitFor({ state: 'hidden', timeout: 20000 }).catch(() => undefined);
  }

  async close(): Promise<void> {
    await clickReliably(this.closeButton);
    await expect(this.modalCard).toBeHidden();
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
  }

  async selectByText(value: string): Promise<void> {
    const row = this.rows.filter({ hasText: value }).first();
    await expect(row).toBeVisible({ timeout: 20000 });
    await clickReliably(row.getByRole('button', { name: 'Seleccionar' }));
  }

  async selectFirst(): Promise<void> {
    const row = this.rows.first();
    await expect(row).toBeVisible({ timeout: 20000 });
    await clickReliably(row.getByRole('button', { name: 'Seleccionar' }));
  }
}

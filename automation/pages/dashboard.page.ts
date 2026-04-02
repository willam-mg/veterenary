import { expect, type Locator, type Page } from '@playwright/test';

import { routes } from '../config/constants';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  readonly statsCards: Locator;
  readonly nextAppointmentsTable: Locator;

  constructor(page: Page) {
    super(page, routes.dashboard);
    this.statsCards = page.locator('.stat-card');
    this.nextAppointmentsTable = page.locator('table').filter({
      has: page.getByRole('columnheader', { name: 'Fecha' }),
    });
  }

  async waitUntilLoaded(): Promise<void> {
    await this.waitForUrl();
    await this.expectHeading(/Dashboard veterinario/i);
    await expect(this.statsCards.first()).toBeVisible({ timeout: 20000 });
  }
}

import { expect, type Locator, type Page } from '@playwright/test';

import { routes } from '../../config/constants';
import { clickReliably } from '../../utils/interactions';

export class AppShellComponent {
  constructor(private readonly page: Page) {}

  get loadingScreen(): Locator {
    return this.page.getByText('Conectando con la API veterinaria...');
  }

  get shell(): Locator {
    return this.page.getByTestId('app-shell');
  }

  get nav(): Locator {
    return this.page.getByTestId('main-nav');
  }

  get logoutButton(): Locator {
    return this.page.getByTestId('logout-button');
  }

  navLink(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  async expectAuthenticated(): Promise<void> {
    await this.loadingScreen.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => undefined);
    await expect(this.shell).toBeVisible({ timeout: 30000 });
    await expect(this.nav).toBeVisible({ timeout: 30000 });
    await expect(this.logoutButton).toBeVisible({ timeout: 30000 });
  }

  async logout(): Promise<void> {
    await clickReliably(this.logoutButton);
  }

  private async navigate(path: string): Promise<void> {
    await this.page.evaluate((targetPath) => {
      window.history.pushState({}, '', targetPath);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, path);
  }

  async openDashboard(): Promise<void> {
    await this.navigate(routes.dashboard);
  }

  async openClients(): Promise<void> {
    await this.navigate(routes.clients);
  }

  async openVeterinarians(): Promise<void> {
    await this.navigate(routes.veterinarians);
  }

  async openPets(): Promise<void> {
    await this.navigate(routes.pets);
  }

  async openAppointments(): Promise<void> {
    await this.navigate(routes.appointments);
  }

  async openClinicalRecords(): Promise<void> {
    await this.navigate(routes.clinicalRecords);
  }
}

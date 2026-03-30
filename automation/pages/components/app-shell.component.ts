import { expect, type Locator, type Page } from '@playwright/test';

export class AppShellComponent {
  constructor(private readonly page: Page) {}

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
    await expect(this.shell).toBeVisible();
    await expect(this.nav).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async openDashboard(): Promise<void> {
    await this.navLink('nav-dashboard').click();
  }

  async openClients(): Promise<void> {
    await this.navLink('nav-clients').click();
  }

  async openVeterinarians(): Promise<void> {
    await this.navLink('nav-veterinarians').click();
  }

  async openPets(): Promise<void> {
    await this.navLink('nav-pets').click();
  }

  async openAppointments(): Promise<void> {
    await this.navLink('nav-appointments').click();
  }

  async openClinicalRecords(): Promise<void> {
    await this.navLink('nav-records').click();
  }
}

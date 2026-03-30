import { test as base } from '@playwright/test';

import { AppShellComponent } from '../pages/components/app-shell.component';
import { AppointmentsPage } from '../pages/appointments.page';
import { ClinicalRecordsPage } from '../pages/clinical-records.page';
import { ClientsPage } from '../pages/clients.page';
import { DashboardPage } from '../pages/dashboard.page';
import { LoginPage } from '../pages/login.page';
import { PetsPage } from '../pages/pets.page';
import { RegisterPage } from '../pages/register.page';
import { VeterinariansPage } from '../pages/veterinarians.page';

type PagesFixture = {
  appShell: AppShellComponent;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  dashboardPage: DashboardPage;
  clientsPage: ClientsPage;
  veterinariansPage: VeterinariansPage;
  petsPage: PetsPage;
  appointmentsPage: AppointmentsPage;
  clinicalRecordsPage: ClinicalRecordsPage;
};

export const test = base.extend<PagesFixture>({
  appShell: async ({ page }, use) => use(new AppShellComponent(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  registerPage: async ({ page }, use) => use(new RegisterPage(page)),
  dashboardPage: async ({ page }, use) => use(new DashboardPage(page)),
  clientsPage: async ({ page }, use) => use(new ClientsPage(page)),
  veterinariansPage: async ({ page }, use) => use(new VeterinariansPage(page)),
  petsPage: async ({ page }, use) => use(new PetsPage(page)),
  appointmentsPage: async ({ page }, use) => use(new AppointmentsPage(page)),
  clinicalRecordsPage: async ({ page }, use) => use(new ClinicalRecordsPage(page)),
});

export { expect } from '@playwright/test';

import { test } from '../../fixtures/auth.fixture';

test.describe('Smoke | Navigation', () => {
  test('authenticated user can open main protected modules', async ({
    appShell,
    dashboardPage,
    clientsPage,
    veterinariansPage,
    petsPage,
    appointmentsPage,
    clinicalRecordsPage,
  }) => {
    await dashboardPage.waitUntilLoaded();

    await appShell.openClients();
    await clientsPage.waitUntilLoaded();

    await appShell.openVeterinarians();
    await veterinariansPage.waitUntilLoaded();

    await appShell.openPets();
    await petsPage.waitUntilLoaded();

    await appShell.openAppointments();
    await appointmentsPage.waitUntilLoaded();

    await appShell.openClinicalRecords();
    await clinicalRecordsPage.waitUntilLoaded();
  });
});

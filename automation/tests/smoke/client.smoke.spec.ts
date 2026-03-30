import { test, expect } from '../../fixtures/auth.fixture';
import { uniqueEmail, uniqueText } from '../../utils/dataGenerator';

test.describe('Smoke | Clients', () => {
  test('user can create a client and find it in the list', async ({ clientsPage }) => {
    const firstName = uniqueText('SmokeClient');
    const lastName = 'Automation';
    const fullName = `${firstName} ${lastName}`;

    await clientsPage.goto();
    await clientsPage.waitUntilLoaded();
    await clientsPage.createClient({
      firstName,
      lastName,
      email: uniqueEmail('smoke.client'),
      phone: '70010001',
      documentNumber: uniqueText('CI'),
      address: 'Automation Street 123',
      notes: 'Created by smoke suite',
    });

    await expect(clientsPage.successMessage).toBeVisible();
    await clientsPage.search(fullName);
    await expect(clientsPage.rowByClientName(fullName)).toBeVisible();
  });
});

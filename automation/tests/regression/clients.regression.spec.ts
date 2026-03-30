import { test, expect } from '../../fixtures/auth.fixture';
import { uniqueEmail, uniqueText } from '../../utils/dataGenerator';

test.describe('Regression | Clients', () => {
  test('search narrows results to the created client', async ({ clientsPage }) => {
    const firstName = uniqueText('RegressionClient');
    const lastName = 'Search';
    const fullName = `${firstName} ${lastName}`;

    await clientsPage.goto();
    await clientsPage.waitUntilLoaded();
    await clientsPage.createClient({
      firstName,
      lastName,
      email: uniqueEmail('regression.client'),
      phone: '70040001',
      documentNumber: uniqueText('REG'),
      address: 'Regression avenue',
      notes: 'Created to validate filtering',
    });

    await expect(clientsPage.successMessage).toBeVisible();
    await clientsPage.search(firstName);
    await expect(clientsPage.rowByClientName(fullName)).toBeVisible();
  });
});

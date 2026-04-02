import { test, expect } from '../../fixtures/auth.fixture';
import { ApiClient } from '../../utils/apiClient';
import { futureDate, uniqueEmail, uniqueText } from '../../utils/dataGenerator';

test.describe('E2E | Client and Pet', () => {
  test('user can create a client and then create a pet for that client', async ({
    clientsPage,
    page,
    petsPage,
    request,
  }) => {
    const firstName = uniqueText('E2EClient');
    const lastName = 'Owner';
    const fullName = `${firstName} ${lastName}`;
    const petName = uniqueText('E2EPet');

    await clientsPage.goto();
    await clientsPage.waitUntilLoaded();
    await clientsPage.createClient({
      firstName,
      lastName,
      email: uniqueEmail('e2e.client'),
      phone: '70030001',
      documentNumber: uniqueText('OWNER'),
      address: 'Owner avenue 44',
      notes: 'Owner created in E2E test',
    });

    await expect(clientsPage.successMessage).toBeVisible();
    await clientsPage.search(fullName);
    await expect(clientsPage.rowByClientName(fullName)).toBeVisible();

    const token = await page.evaluate(() => window.localStorage.getItem('vet-demo-token'));
    const api = new ApiClient(request, token ?? undefined);
    const clientResponse = await api.get(`/clients?search=${encodeURIComponent(fullName)}`);
    expect(clientResponse.ok()).toBeTruthy();

    const clientBody = (await clientResponse.json()) as {
      data: { items: Array<{ id: number }> };
    };
    const clientId = clientBody.data.items[0]?.id;

    expect(clientId).toBeTruthy();

    const petResponse = await api.post('/pets', {
      client_id: clientId,
      name: petName,
      species: 'dog',
      breed: 'Beagle',
      sex: 'male',
      birth_date: futureDate(30),
      weight: '12.5',
      color: 'White and brown',
      microchip_number: uniqueText('MICRO'),
      allergies: 'None',
      notes: 'Pet created in E2E test',
    });

    expect(petResponse.ok()).toBeTruthy();

    await petsPage.goto();
    await petsPage.waitUntilLoaded();
    await petsPage.search(petName);
    await expect(petsPage.rowByPetName(petName)).toBeVisible();
  });
});

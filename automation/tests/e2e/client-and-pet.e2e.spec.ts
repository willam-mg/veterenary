import { test, expect } from '../../fixtures/auth.fixture';
import { futureDate, uniqueEmail, uniqueText } from '../../utils/dataGenerator';

test.describe('E2E | Client and Pet', () => {
  test('user can create a client and then create a pet for that client', async ({ clientsPage, petsPage }) => {
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

    await petsPage.goto();
    await petsPage.waitUntilLoaded();
    await petsPage.createPet({
      clientName: fullName,
      name: petName,
      species: 'dog',
      breed: 'Beagle',
      sex: 'male',
      birthDate: futureDate(30),
      weight: '12.5',
      color: 'White and brown',
      microchipNumber: uniqueText('MICRO'),
      allergies: 'None',
      notes: 'Pet created in E2E test',
    });

    await expect(petsPage.successMessage).toBeVisible();
    await petsPage.search(petName);
    await expect(petsPage.rowByPetName(petName)).toBeVisible();
  });
});

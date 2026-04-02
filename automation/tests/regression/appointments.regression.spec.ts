import { test, expect } from '../../fixtures/auth.fixture';
import { ApiClient } from '../../utils/apiClient';
import { futureDateTimeLocal, uniqueText } from '../../utils/dataGenerator';

test.describe('Regression | Appointments', () => {
  test('user can filter appointments by unique reason', async ({ appointmentsPage, page, request }) => {
    const token = await page.evaluate(() => window.localStorage.getItem('vet-demo-token'));
    const api = new ApiClient(request, token ?? undefined);
    const reason = uniqueText('RegressionAppointment');
    const appointmentsResponse = await api.get('/appointments?per_page=1');

    expect(appointmentsResponse.ok()).toBeTruthy();

    const appointmentsBody = (await appointmentsResponse.json()) as {
      data: { items: Array<{ pet_id: number; veterinarian_id: number }> };
    };

    const petId = appointmentsBody.data.items[0]?.pet_id;
    const veterinarianId = appointmentsBody.data.items[0]?.veterinarian_id;

    expect(petId).toBeTruthy();
    expect(veterinarianId).toBeTruthy();

    const createResponse = await api.post('/appointments', {
      pet_id: petId,
      veterinarian_id: veterinarianId,
      scheduled_at: futureDateTimeLocal(3, 15, 0).replace('T', ' ') + ':00',
      status: 'confirmed',
      reason,
      notes: 'Created for search regression',
      services: [],
    });

    expect(createResponse.ok()).toBeTruthy();

    await appointmentsPage.goto();
    await appointmentsPage.waitUntilLoaded();
    await appointmentsPage.search(reason);
    await expect(appointmentsPage.rows).toHaveCount(1);
  });
});

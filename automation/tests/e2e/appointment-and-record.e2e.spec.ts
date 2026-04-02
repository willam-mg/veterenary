import { test, expect } from '../../fixtures/auth.fixture';
import { ApiClient } from '../../utils/apiClient';
import { futureDate, futureDateTimeLocal, uniqueText } from '../../utils/dataGenerator';

test.describe('E2E | Appointment and Clinical Record', () => {
  test('user can create an appointment and a clinical record from existing entities', async ({
    clinicalRecordsPage,
    page,
    request,
  }) => {
    test.setTimeout(60000);

    const token = await page.evaluate(() => window.localStorage.getItem('vet-demo-token'));
    const api = new ApiClient(request, token ?? undefined);
    const appointmentReason = uniqueText('Consulta');
    const diagnosis = uniqueText('Diagnostico');
    const appointmentsResponse = await api.get('/appointments?per_page=1');

    expect(appointmentsResponse.ok()).toBeTruthy();

    const appointmentsBody = (await appointmentsResponse.json()) as {
      data: { items: Array<{ pet_id: number; veterinarian_id: number }> };
    };
    const petId = appointmentsBody.data.items[0]?.pet_id;
    const veterinarianId = appointmentsBody.data.items[0]?.veterinarian_id;

    expect(petId).toBeTruthy();
    expect(veterinarianId).toBeTruthy();

    const createAppointmentResponse = await api.post('/appointments', {
      pet_id: petId,
      veterinarian_id: veterinarianId,
      scheduled_at: futureDateTimeLocal(2, 9, 30).replace('T', ' ') + ':00',
      status: 'scheduled',
      reason: appointmentReason,
      notes: 'Appointment created in E2E flow',
      services: [],
    });

    expect(createAppointmentResponse.ok()).toBeTruthy();

    const createdAppointmentBody = (await createAppointmentResponse.json()) as {
      data: { id: number };
    };

    const createRecordResponse = await api.post('/clinical-records', {
      pet_id: petId,
      veterinarian_id: veterinarianId,
      appointment_id: createdAppointmentBody.data.id,
      record_date: futureDate(1),
      diagnosis,
      treatment: 'Reposo y control',
      observations: 'Clinical record created in E2E flow',
      weight: '11.2',
    });

    expect(createRecordResponse.ok()).toBeTruthy();

    await clinicalRecordsPage.goto();
    await clinicalRecordsPage.waitUntilLoaded();
    await clinicalRecordsPage.search(diagnosis);
    await expect(clinicalRecordsPage.rowByDiagnosis(diagnosis)).toBeVisible();
  });
});

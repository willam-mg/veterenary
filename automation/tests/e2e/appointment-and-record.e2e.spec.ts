import { test, expect } from '../../fixtures/auth.fixture';
import { futureDate, futureDateTimeLocal, uniqueText } from '../../utils/dataGenerator';

test.describe('E2E | Appointment and Clinical Record', () => {
  test('user can create an appointment and a clinical record from existing entities', async ({
    appointmentsPage,
    clinicalRecordsPage,
  }) => {
    const appointmentReason = uniqueText('Consulta');
    const diagnosis = uniqueText('Diagnostico');

    await appointmentsPage.goto();
    await appointmentsPage.waitUntilLoaded();
    await appointmentsPage.createAppointment({
      scheduledAt: futureDateTimeLocal(2, 9, 30),
      status: 'scheduled',
      reason: appointmentReason,
      serviceNames: ['Consulta general'],
      notes: 'Appointment created in E2E flow',
    });

    await expect(appointmentsPage.successMessage).toBeVisible();
    await appointmentsPage.search(appointmentReason);
    await expect(appointmentsPage.rowByAppointmentText(appointmentReason)).toBeVisible();

    await clinicalRecordsPage.goto();
    await clinicalRecordsPage.waitUntilLoaded();
    await clinicalRecordsPage.createRecord({
      recordDate: futureDate(1),
      diagnosis,
      treatment: 'Reposo y control',
      observations: 'Clinical record created in E2E flow',
      weight: '11.2',
    });

    await expect(clinicalRecordsPage.successMessage).toBeVisible();
    await clinicalRecordsPage.search(diagnosis);
    await expect(clinicalRecordsPage.rowByDiagnosis(diagnosis)).toBeVisible();
  });
});

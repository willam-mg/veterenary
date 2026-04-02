import { test, expect } from '../../fixtures/auth.fixture';
import { futureDateTimeLocal, uniqueText } from '../../utils/dataGenerator';

test.describe('Regression | Appointments', () => {
  test('user can filter appointments by unique reason', async ({ appointmentsPage }) => {
    const reason = uniqueText('RegressionAppointment');

    await appointmentsPage.goto();
    await appointmentsPage.waitUntilLoaded();
    await appointmentsPage.createAppointment({
      scheduledAt: futureDateTimeLocal(3, 15, 0),
      status: 'confirmed',
      reason,
      notes: 'Created for search regression',
    });

    await expect(appointmentsPage.successMessage).toBeVisible();
    await appointmentsPage.search(reason);
    await expect(appointmentsPage.rows).toHaveCount(1);
  });
});

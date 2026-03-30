import { test, expect } from '@playwright/test';

import { ApiClient } from '../../utils/apiClient';
import { uniqueEmail, uniqueText } from '../../utils/dataGenerator';

test.describe('API | Clients', () => {
  test('authenticated user can create and fetch a client', async ({ request }) => {
    const api = new ApiClient(request);
    const firstName = uniqueText('ApiClient');
    const lastName = 'Suite';
    const createResponse = await api.post('/clients', {
      first_name: firstName,
      last_name: lastName,
      email: uniqueEmail('api.client'),
      phone: '70020001',
      document_number: uniqueText('DOC'),
      address: 'API avenue',
      notes: 'Created from API suite',
    });

    expect(createResponse.ok()).toBeTruthy();

    const createdBody = (await createResponse.json()) as { data: { id: number; full_name: string } };
    expect(createdBody.data.full_name).toContain(firstName);

    const listResponse = await api.get('/clients?search=' + encodeURIComponent(firstName));
    expect(listResponse.ok()).toBeTruthy();

    const listBody = (await listResponse.json()) as { data: { items: Array<{ id: number; full_name: string }> } };
    expect(listBody.data.items.some((item) => item.id === createdBody.data.id)).toBeTruthy();
  });
});

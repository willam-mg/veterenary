import { test, expect } from '@playwright/test';

import { env } from '../../config/env';
import { loginByApi } from '../../utils/authHelper';

test.describe('API | Auth', () => {
  test('login returns bearer token for demo user', async ({ request }) => {
    const session = await loginByApi(request);

    expect(session.token).toBeTruthy();
    expect(session.user.email).toBe(env.demoUserEmail);
  });

  test('me returns the authenticated profile', async ({ request }) => {
    const session = await loginByApi(request);
    const response = await request.get(`${env.apiBaseUrl}/auth/me`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${session.token}`,
      },
    });

    expect(response.ok()).toBeTruthy();

    const body = (await response.json()) as { data: { email: string } };
    expect(body.data.email).toBe(env.demoUserEmail);
  });
});

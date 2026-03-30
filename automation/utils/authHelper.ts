import type { APIRequestContext } from '@playwright/test';

import { env } from '../config/env';

export type AuthSession = {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
};

export const loginByApi = async (
  request: APIRequestContext,
  email = env.demoUserEmail,
  password = env.demoUserPassword,
): Promise<AuthSession> => {
  const response = await request.post(`${env.apiBaseUrl}/auth/login`, {
    data: { email, password },
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok()) {
    throw new Error(`Login API failed with status ${response.status()}`);
  }

  const body = (await response.json()) as {
    data: {
      token: string;
      user: AuthSession['user'];
    };
  };

  return {
    token: body.data.token,
    user: body.data.user,
  };
};

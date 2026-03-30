import type { APIRequestContext, APIResponse } from '@playwright/test';

import { env } from '../config/env';
import { loginByApi } from './authHelper';

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async authHeaders(): Promise<Record<string, string>> {
    const session = await loginByApi(this.request);

    return {
      Accept: 'application/json',
      Authorization: `Bearer ${session.token}`,
    };
  }

  async get(path: string): Promise<APIResponse> {
    return this.request.get(`${env.apiBaseUrl}${path}`, {
      headers: await this.authHeaders(),
    });
  }

  async post(path: string, data: unknown): Promise<APIResponse> {
    return this.request.post(`${env.apiBaseUrl}${path}`, {
      data,
      headers: await this.authHeaders(),
    });
  }

  async delete(path: string): Promise<APIResponse> {
    return this.request.delete(`${env.apiBaseUrl}${path}`, {
      headers: await this.authHeaders(),
    });
  }
}

import { test as base } from './test.fixture';
import { env } from '../config/env';
import { loginByApi } from '../utils/authHelper';

type AuthFixture = {
  authenticated: void;
};

export const test = base.extend<AuthFixture>({
  authenticated: [
    async ({ page, request, appShell }, use) => {
      const session = await loginByApi(request);

      await page.addInitScript((token) => {
        window.localStorage.setItem('vet-demo-token', token);
      }, session.token);

      await page.goto(env.webBaseUrl);
      await appShell.expectAuthenticated();
      await use(undefined);
    },
    { auto: true },
  ],
});

export { expect } from './test.fixture';

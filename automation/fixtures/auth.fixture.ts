import { test as base } from './test.fixture';

import { env } from '../config/env';

type AuthFixture = {
  authenticated: void;
};

export const test = base.extend<AuthFixture>({
  authenticated: [
    async ({ page, loginPage, appShell }, use) => {
      await loginPage.goto();
      await loginPage.waitUntilLoaded();
      await loginPage.login(env.demoUserEmail, env.demoUserPassword);
      await appShell.expectAuthenticated();
      await use(undefined);
    },
    { auto: true },
  ],
});

export { expect } from './test.fixture';

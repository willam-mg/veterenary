import { test, expect } from '../../fixtures/test.fixture';

test.describe('Smoke | Auth', () => {
  test('demo user can log in and see the application shell', async ({ loginPage, appShell }) => {
    await loginPage.goto();
    await loginPage.waitUntilLoaded();
    await loginPage.loginAsDemoUser();

    await appShell.expectAuthenticated();
    await expect(appShell.navLink('nav-dashboard')).toBeVisible();
  });
});

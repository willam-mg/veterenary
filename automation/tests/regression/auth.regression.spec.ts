import { test, expect } from '../../fixtures/test.fixture';

test.describe('Regression | Auth', () => {
  test('invalid credentials show an error message', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.waitUntilLoaded();
    await loginPage.login('invalid@vetdemo.test', 'wrong-password');

    await expect(loginPage.errorMessage).toBeVisible();
  });
});

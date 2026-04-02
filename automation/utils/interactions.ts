import { expect, type Locator } from '@playwright/test';

export async function clickReliably(locator: Locator): Promise<void> {
  await expect(locator).toBeVisible();
  await locator.scrollIntoViewIfNeeded().catch(() => undefined);

  try {
    await locator.click({ timeout: 2000 });
    return;
  } catch {
    // Firefox occasionally leaves otherwise visible controls in a non-actionable state.
  }

  try {
    await locator.evaluate((element) => {
      (element as HTMLElement).click();
    });
    return;
  } catch {
    await locator.click({ force: true, timeout: 2000 });
  }
}

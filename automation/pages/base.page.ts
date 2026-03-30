import { expect, type Locator, type Page } from '@playwright/test';

import { env } from '../config/env';

export abstract class BasePage {
  protected constructor(protected readonly page: Page, protected readonly path: string) {}

  async goto(): Promise<void> {
    await this.page.goto(`${env.webBaseUrl}${this.path}`);
  }

  async waitForUrl(): Promise<void> {
    await this.page.waitForURL(`**${this.path}`);
  }

  protected async expectHeading(name: string | RegExp): Promise<void> {
    await expect(this.page.getByRole('heading', { name })).toBeVisible();
  }

  protected messageByClass(cssClass: string): Locator {
    return this.page.locator(`.message.${cssClass}`);
  }

  get successMessage(): Locator {
    return this.messageByClass('success');
  }

  get errorMessage(): Locator {
    return this.messageByClass('error');
  }
}

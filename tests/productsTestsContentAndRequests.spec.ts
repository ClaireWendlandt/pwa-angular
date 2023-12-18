import { expect, test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/');
  await page.locator('#mat-tab-link-1').click();
  const responsePromise = await page.waitForResponse(
    (response) =>
      response.url() === 'https://dummyjson.com/products?limit=10' &&
      response.status() === 200
  );
  console.log('response,', await responsePromise.json());
  await page.getByRole('img', { name: 'iPhone X' }).click();
  await expect(page.getByRole('img', { name: 'iPhone X' })).toBeVisible();
});

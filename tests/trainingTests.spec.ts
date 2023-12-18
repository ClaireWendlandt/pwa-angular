import { expect, test } from '@playwright/test';

test('Has user network status', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/');
  const userNetworkStatus = page.locator('div.userNetworkStatus');
  await expect(page).not.toHaveTitle(/Playwright/);
  await expect(userNetworkStatus).toContainText(/User is/);
});

test('go to products and get product list', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/');
  await page.getByText(' Products ', { exact: true }).click();
  await page.waitForURL('http://127.0.0.1:8080/products?page=1');

  const responsePromise = await page.waitForResponse(
    (response) =>
      response.url() === 'https://dummyjson.com/products?limit=10' &&
      response.status() === 200
  );
  console.log('response,', await responsePromise.json());
});

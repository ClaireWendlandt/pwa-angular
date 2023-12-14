import { expect, test } from '@playwright/test';

test('Has user network status', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/');
  const userNetworkStatus = page.locator('div.userNetworkStatus');
  await expect(page).not.toHaveTitle(/Playwright/);
  await expect(userNetworkStatus).toContainText(/User is/);
});

test('go to products and get product list', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/');
  await page.getByText(' PRODUCTS ').click();
});

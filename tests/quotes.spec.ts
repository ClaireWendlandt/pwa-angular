import { expect, test } from '@playwright/test';

test('Go to the quote page', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/');
  await page.waitForURL('**/home');
  await page.goto('http://127.0.0.1:8080/quotes');
  await expect(page.url().includes('quotes')).toBeTruthy();
  await expect(page.getByTestId('randomQuote')).toContainText('Random quote');
  await page.getByTestId('quoteButton').click();
});

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
  // await page.waitForRequest(
  //   (request) =>
  //     request.url() === 'https://dummyjson.com/products?limit=10' &&
  //     request.method() === 'GET'
  // );
  // const requestPromise = page.waitForRequest(
  //   'https://dummyjson.com/products?limit=10'
  // );
  // await requestPromise;
  const responsePromise = await page.waitForResponse(
    (response) =>
      response.url() === 'https://dummyjson.com/products?limit=10' &&
      response.status() === 200
  );
  // const response = await responsePromise;

  // console.log(
  //   'request :',
  //   requestPromise.then((request) => console.log('request !,', request))
  // );
  // console.log('responsePromise,', responsePromise);
  console.log('response,', await responsePromise.json());
  // await page.on('response', (response) => {
  //   console.log(response);
  // });
});

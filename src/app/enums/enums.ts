export enum DummyJsonAPI {
  DummyJsonUrl = 'https://dummyjson.com/',
  ProductListEndpoint = 'products',
  ProductListUrl = `${DummyJsonUrl}${ProductListEndpoint}`,
  ProductAdd = `${ProductListUrl}/add`,
}

export const productCached = 'productCached';
export const waitingProduct = 'waitingProduct';

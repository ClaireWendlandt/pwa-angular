export enum ProductAPI {
  ProductUrl = 'https://dummyjson.com/',
  ProductListEndpoint = 'products',
  ProductListUrl = `${ProductUrl}${ProductListEndpoint}`,
  ProductAdd = `${ProductListUrl}/add`,
}

export const productCached = 'productCached';
export const waitingProduct = 'waitingProduct';

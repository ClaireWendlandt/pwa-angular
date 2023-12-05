export enum ProductAPI {
  ProductUrl = 'https://dummyjson.com/',
  ProductListEndpoint = 'products',
  ProductListUrl = `${ProductUrl}${ProductListEndpoint}`,
  ProductAdd = `${ProductListUrl}/add`,
}

export const productCachedKey = 'productCached';
export const waitingProductKey = 'waitingProduct';

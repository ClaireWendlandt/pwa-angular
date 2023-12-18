export enum ProductAPI {
  ProductUrl = 'https://dummyjson.com/',
  ProductListEndpoint = 'products',
  ProductListUrl = `${ProductUrl}${ProductListEndpoint}`,
  ProductAdd = `${ProductListUrl}/add`,
}

export enum QuoteAPI {
  QuoteUrl = 'https://api.api-ninjas.com/',
  QuoteListEndpoint = 'v1/quotes',
  QuoteCategory = '?category=',
  QuoteGetByCategory = `${QuoteUrl}${QuoteListEndpoint}${QuoteCategory}`,
}

export const productCachedKey = 'productCached';
export const waitingProductKey = 'waitingProduct';

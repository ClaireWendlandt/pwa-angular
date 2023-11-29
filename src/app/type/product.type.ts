export type AllProductType = {
  total: number;
  limit: number;
  products: ProductType[];
};

export type ProductType = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: string;
  images: ProductImage;
};

export type ProductImage = string[];

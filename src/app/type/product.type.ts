import { FormControl } from '@angular/forms';

export type AllProductType = {
  total: number;
  limit: number;
  products: ProductType[];
};

export type ProductType = {
  id?: number;
  title: string;
  description: string;
  category: string;
  price: string;
  images: ProductImage;
};

export type ProductImage = string[];

export type ProductFormType = {
  title: FormControl<string | null>;
  description: FormControl<string | null>;
  category: FormControl<string | null>;
  price: FormControl<string | null>;
  images: FormControl<[] | null>;
};

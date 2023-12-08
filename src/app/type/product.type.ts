import { FormControl } from '@angular/forms';
import { LocalDbFormType, LocalDbPictureType, LocalDbType } from './db.type';

export type AllProductType = {
  total: number;
  limit: number;
  products: ProductType[];
};

export type ProductType = {
  id?: number | string;
  title: string;
  description: string;
  category: string;
  price: string;
  images: ProductImage;
} & LocalDbType &
  LocalDbPictureType;

export type ProductImage = string[];

export type ProductFormType = {
  id?: FormControl<string | number | null>;
  title: FormControl<string | null>;
  description: FormControl<string | null>;
  category: FormControl<string | null>;
  price: FormControl<string | null>;
  images: FormControl<[] | string | null>;
} & LocalDbFormType;

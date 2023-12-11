import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AllProductType } from '../type/product.type';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}

  async storePicturesAsBlobFormat(allProducts: AllProductType) {
    for (let product of allProducts.products) {
      product.localDbPicture = await this.getImageBlob(product.images[0]);
    }
    return allProducts;
  }

  async getImageBlob(imageUrl: string) {
    return firstValueFrom(this.http.get(imageUrl, { responseType: 'blob' }));
  }
}

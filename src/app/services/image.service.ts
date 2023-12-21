import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AllProductType } from '../type/product.type';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private readonly httpClient = inject(HttpClient);

  async storePicturesAsBlobFormat(allProducts: AllProductType) {
    for (let product of allProducts.products) {
      product.localDbPicture = await this.getImageBlob(product.images[0]);
    }
    return allProducts;
  }

  async getImageBlob(imageUrl: string) {
    return firstValueFrom(
      this.httpClient.get(imageUrl, { responseType: 'blob' })
    );
  }
}

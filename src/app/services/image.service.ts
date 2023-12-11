import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dexie } from 'dexie';
import { firstValueFrom } from 'rxjs';
import { AllProductType } from '../type/product.type';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}
  db = new Dexie('waitingProduddct');

  async storePicturesAsBlobFormat(allProducts: AllProductType) {
    for (let product of allProducts.products) {
      product.localDbPicture = await this.getImageBlob(product.images[0]);
    }
    return allProducts;
  }

  getImageBlob(imageUrl: string) {
    return firstValueFrom(this.http.get(imageUrl, { responseType: 'blob' }));
  }
}

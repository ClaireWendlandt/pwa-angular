import { Injectable } from '@angular/core';
import { db } from '../../../database/db';
import { waitingProduct } from '../../enums/enums';
import { ProductType } from '../../type/product.type';
import { ProductService } from '../api/product/product.service';

@Injectable({
  providedIn: 'root',
})
export class NetworkRetryService {
  constructor(private productService: ProductService) {}

  get pendingRequests() {
    return db.table(waitingProduct).toArray();
  }

  addPendingRequest(productValues: ProductType) {
    return db.table(waitingProduct).add(productValues);
  }

  async sendPendingRequests() {
    console.log('test !! ');
    for (const pendingRequest of await this.pendingRequests) {
      console.log('pendingRequest :', pendingRequest);
      this.productService.postProduct(pendingRequest, true);
    }
  }
}

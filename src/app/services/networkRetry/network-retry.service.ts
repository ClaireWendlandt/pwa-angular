import { Injectable, inject } from '@angular/core';
import { db } from '../../../database/db';
import { waitingProductKey } from '../../enums/enums';
import { ProductType } from '../../type/product.type';
import { ProductService } from '../api/product/product.service';

@Injectable({
  providedIn: 'root',
})
export class NetworkRetryService {
  private readonly productService = inject(ProductService);

  get pendingRequests() {
    return db.table(waitingProductKey).toArray();
  }

  addPendingRequest(productValues: ProductType) {
    return db.table(waitingProductKey).add(productValues);
  }

  async sendPendingRequests() {
    for (const pendingRequest of await this.pendingRequests) {
      this.productService.postProduct(pendingRequest, true);
    }
  }
}

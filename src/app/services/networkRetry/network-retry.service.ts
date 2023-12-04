import { Injectable } from '@angular/core';
import { db } from '../../../database/db';
import { waitingProduct } from '../../enums/enums';
import { ProductType } from '../../type/product.type';

@Injectable({
  providedIn: 'root',
})
export class NetworkRetryService {
  get pendingRequests() {
    return db.table(waitingProduct).toArray();
  }

  addPendingRequest(productValues: ProductType) {
    return db.table(waitingProduct).add(productValues);
  }

  async retryPendingRequests() {
    for (const pendingRequest of await this.pendingRequests) {
      console.log('pendingRequest :', pendingRequest);
      // this.postProduct(pendingRequest).subscribe(
      //   () => {
      //     // Successful request, remove from queue
      //   },
      //   (error: any) => {
      //     console.log('error', error);
      //     // Request failed, handle error and potentially add back to queue
      //   }
      // );
    }
  }

  // private postProduct(productValues: ProductType) {
  //   return this.httpClient
  //     .post<ProductType>(`${ProductAPI.ProductAdd}`, productValues)
  //     .pipe(
  //       catchError(({ status }) => {
  //         if (status !== 200) {
  //           this.addPendingRequest(productValues);
  //         }
  //         return throwError(status);
  //       })
  //     );
  // }
}

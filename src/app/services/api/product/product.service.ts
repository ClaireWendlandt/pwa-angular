import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { liveQuery } from 'dexie';
import { catchError, throwError } from 'rxjs';
import { db } from '../../../../database/db';
import { ProductAPI, waitingProductKey } from '../../../enums/enums';
import { AllProductType, ProductType } from '../../../type/product.type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  productCached$ = liveQuery(() => db.productCached.toArray());
  waitingProduct$ = liveQuery(() => db.waitingProduct.toArray());

  getOneProduct(id: string | number) {
    return this.httpClient.get<ProductType>(
      `${ProductAPI.ProductListUrl}/${id}`
    );
  }

  getProductList(limit: number, skip?: number) {
    return this.httpClient.get<AllProductType>(
      `${ProductAPI.ProductListUrl}?limit=${limit}${
        skip ? `&skip=${skip}` : ''
      }`
    );
  }

  getProductListAndNavigate(limit: number, skip: number, currentPage: number) {
    return this.getProductList(limit, skip);
  }

  navigateToFoo(currentPage: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: currentPage,
      },
      queryParamsHandling: 'merge',
    });
  }

  postProduct(productValues: ProductType, sendPendingRequest = false): boolean {
    try {
      const { id: productId, localDbId } = productValues;
      // If there is already and id, it's an update
      if (productId !== undefined && parseInt(productId.toString()) >= 0) {
        const dataToSend = { ...productValues };
        delete dataToSend.id;
        this.httpClient
          .put<ProductType>(
            `${ProductAPI.ProductListUrl}/${productId}`,
            dataToSend
          )
          .pipe(
            catchError((error) => {
              const { status } = error;
              if (localDbId) {
                db.updateTableLines(waitingProductKey, productValues);
              } else {
                db.addTableLines(waitingProductKey, productValues);
              }
              return throwError(error);
            })
          )
          .subscribe((res) => {
            if (sendPendingRequest && localDbId) {
              db.deleteTableLines(waitingProductKey, localDbId as number);
            }
          });
        // no id, it's a create
      } else {
        this.httpClient
          .post<ProductType>(`${ProductAPI.ProductAdd}`, productValues)
          .pipe(
            catchError(({ status }) => {
              if (status !== 200) {
                db.addTableLines(waitingProductKey, productValues);
              }
              return throwError(() => new Error(status));
            })
          )
          .subscribe((res) => {
            if (sendPendingRequest && localDbId) {
              db.deleteTableLines(waitingProductKey, localDbId as number);
            }
          });
      }
      return true;
    } catch {
      return false;
    }
  }
}

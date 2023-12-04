import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { liveQuery } from 'dexie';
import { Observable, catchError, throwError } from 'rxjs';
import { db } from '../../../../database/db';
import { ProductAPI, waitingProduct } from '../../../enums/enums';
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

  getProductList(limit: number, skip?: number): Observable<AllProductType> {
    return this.httpClient.get<AllProductType>(
      `${ProductAPI.ProductListUrl}?limit=${limit}${
        skip ? `&skip=${skip}` : ''
      }`
    );
  }

  getProductListAndNavigate(
    limit: number,
    skip: number,
    currentPage: number
  ): Observable<AllProductType> {
    this.navigateToFoo(currentPage);
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

  postProduct(productValues: ProductType): boolean {
    try {
      const { id: productId, localDbId } = productValues;
      console.log('product::', productValues, productId);
      // If there is already and id, it's an update
      if (productId !== undefined && parseInt(productId.toString()) >= 0) {
        this.httpClient
          .put<ProductType>(
            `${ProductAPI.ProductListUrl}${productId}`,
            productValues
          )
          .pipe(
            catchError(({ status }) => {
              console.log('product in pipe', productValues);
              this.waitingProduct$.subscribe(() => {
                if (localDbId) {
                  db.updateTableLines(waitingProduct, productValues);
                } else {
                  db.addTableLines(waitingProduct, productValues);
                }
              });

              return throwError(status);
            })
          )
          .subscribe();
        // no id, it's a create
      } else {
        this.httpClient
          .post<ProductType>(`${ProductAPI.ProductAdd}`, productValues)
          .pipe(
            catchError(({ status }) => {
              console.log('create product offline', status);
              if (status !== 200) {
                this.waitingProduct$.subscribe(() => {
                  db.addTableLines(waitingProduct, productValues);
                });
              }
              return throwError(status);
            })
          )
          .subscribe();
      }
      return true;
    } catch {
      console.log('An error occured, please retry');
      return false;
    }
  }
}

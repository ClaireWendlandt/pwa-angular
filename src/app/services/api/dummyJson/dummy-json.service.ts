import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { liveQuery } from 'dexie';
import { Observable, catchError, throwError } from 'rxjs';
import { db } from '../../../../database/db';
import {
  DummyJsonAPI,
  productCached,
  waitingProduct,
} from '../../../enums/enums';
import { AllProductType, ProductType } from '../../../type/product.type';

@Injectable({
  providedIn: 'root',
})
export class DummyJsonService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    console.log('tessst');
  }

  productCached$ = liveQuery(() => db.productCached.toArray());
  waitingProduct$ = liveQuery(() => db.waitingProduct.toArray());

  getOneProduct(id: string) {
    return this.httpClient.get<ProductType>(
      `${DummyJsonAPI.ProductListUrl}/${id}`
    );
  }

  getProductList(limit: number, skip?: number): Observable<AllProductType> {
    return this.httpClient.get<AllProductType>(
      `${DummyJsonAPI.ProductListUrl}?limit=${limit}${
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

  postProduct(productValues: ProductType, productId = undefined): boolean {
    try {
      if (productId !== undefined && productId >= 0) {
        this.httpClient
          .put<ProductType>(
            `${DummyJsonAPI.ProductListUrl}${productId}`,
            productValues
          )
          .pipe(
            catchError(({ status }) => {
              if (status !== 200) {
                this.waitingProduct$.subscribe(() => {
                  db.addTableLines(waitingProduct, productValues);
                });
                this.productCached$.subscribe((products) => {
                  console.log('products :', productCached);
                  // TODO
                  // IF    :: si productID existe dejà dans la liste des produits mis en cache (productCached$)
                  // ALORS :: je fais updateTableLines() pour l'updater
                  // SINON :: je fais un addTableLines() pour l'ajouter aux produits mis en cache
                  db.addTableLines(productCached, productValues);
                });
              }
              return throwError(status);
            })
          )
          .subscribe();
      } else {
        this.httpClient
          .post<ProductType>(`${DummyJsonAPI.ProductAdd}`, productValues)
          .pipe(
            catchError(({ status }) => {
              console.log('test333', status);
              if (status !== 200) {
                this.waitingProduct$.subscribe(() => {
                  db.addTableLines(waitingProduct, productValues);
                });
                this.productCached$.subscribe(() => {
                  db.addTableLines(productCached, productValues);
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

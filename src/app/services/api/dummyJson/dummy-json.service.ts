import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DummyJsonAPI } from '../../../enums/enums';
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

  getOneProduct(id: number): Observable<ProductType> {
    return this.httpClient.get<ProductType>(
      `${DummyJsonAPI.ProductListUrl}/${id}`
    );
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
}

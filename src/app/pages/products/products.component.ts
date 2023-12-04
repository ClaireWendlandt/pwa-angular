import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { liveQuery } from 'dexie';
import { catchError, throwError } from 'rxjs';
import { db } from '../../../database/db';
import {
  PaginationComponent,
  PaginationType,
} from '../../core/pagination/pagination.component';
import { productCached } from '../../enums/enums';
import { ProductService } from '../../services/api/product/product.service';
import { AllProductType, ProductType } from '../../type/product.type';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, PaginationComponent, MatCardModule, MatButtonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  pagination: PaginationType = {
    totalItems: 100,
    itemsPerPage: 10,
    currentPage: 1,
  };

  allProducts?: AllProductType;

  productCached$ = liveQuery(() => db.productCached.toArray());

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe((params) => {
      let pageNumber = parseInt(params['page'] || this.pagination.currentPage);

      if (
        pageNumber * this.pagination.itemsPerPage >
        this.pagination.totalItems
      ) {
        pageNumber = 1;
      }
      this.pagination.currentPage = pageNumber;
      this.getAllProducts();
    });
  }

  pageChange(): void {
    this.getAllProducts();
  }

  public getAllProducts(): void {
    const skip =
      this.pagination.currentPage === 1
        ? 0
        : this.pagination.itemsPerPage * (this.pagination.currentPage - 1);
    this.productService
      .getProductListAndNavigate(
        this.pagination.itemsPerPage,
        skip,
        this.pagination.currentPage
      )
      .pipe(
        catchError(({ status }) => {
          if (status !== 200) {
            this.productCached$.subscribe((cachedProducts) => {
              this.allProducts = {
                total: 10,
                limit: 10,
                products: cachedProducts,
              };
              this.pagination.totalItems = 10;
              this.pagination.currentPage = 1;
            });
          }
          return throwError(status);
        })
      )
      .subscribe(async (response) => {
        this.allProducts = response;
        await db.deleteTableLines(productCached);
        await db.bulkAddTableLines(
          productCached,
          response.products as ProductType[]
        );
        this.productCached$.subscribe((cachedProducts) => {
          console.log('cached products:', cachedProducts);
        });
      });
  }

  goToProduct(id: string | number): void {
    this.router.navigate(['/product', id]);
  }
  goToProductForm(productId?: number | string): void {
    this.router.navigate([`/product-form${productId ? `/${productId}` : ''}`]);
  }
}

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
    this.route.queryParams.subscribe(async (params) => {
      let pageNumber = parseInt(params['page'] || this.pagination.currentPage);

      if (
        pageNumber * this.pagination.itemsPerPage >
        this.pagination.totalItems
      ) {
        pageNumber = 1;
      }
      this.pagination.currentPage = pageNumber;
      this.getAllProducts();
      console.log('allProducts', this.allProducts);
    });
  }

  pageChange(): void {
    this.getAllProducts();
  }

  async errorAllProduct() {
    this.productCached$.subscribe((products) => {
      this.allProducts = {
        total: products.length,
        limit: products.length,
        products: products,
      };
      console.log('allProducts bis bis', this.allProducts);
      this.pagination.totalItems = products.length;
      this.pagination.itemsPerPage = products.length;
      this.pagination.currentPage = 1;
    });
  }

  async successResponse(response: AllProductType) {
    this.allProducts = response as AllProductType;
    await db.deleteTableLines(productCached);
    await db.bulkAddTableLines(
      productCached,
      this.allProducts?.products as ProductType[]
    );
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
        catchError((error) => {
          this.errorAllProduct();
          return throwError(error);
        })
      )
      .subscribe((response) => {
        this.successResponse(response);
      });
    console.log('allProducts bis', this.allProducts?.products);
  }

  goToProduct(id: string | number): void {
    this.router.navigate(['/product', id]);
  }
  goToProductForm(productId?: number | string): void {
    this.router.navigate([`/product-form${productId ? `/${productId}` : ''}`]);
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PaginationComponent,
  PaginationType,
} from '../../core/pagination/pagination.component';
import { DummyJsonService } from '../../services/api/dummyJson/dummy-json.service';
import { AllProductType } from '../../type/product.type';

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

  constructor(
    private dummyJsonService: DummyJsonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      let pageNumber = parseInt(params['page'] || this.pagination.currentPage);

      if (
        pageNumber * this.pagination.itemsPerPage >
        this.pagination.totalItems
      ) {
        pageNumber = 1;
      }
      this.pagination.currentPage = pageNumber;
      console.log('pagination :', this.pagination);
      console.log('page number :', pageNumber);
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
    console.log('proooooduct ');
    this.dummyJsonService
      .getProductList(
        this.pagination.itemsPerPage,
        skip,
        this.pagination.currentPage
      )
      .subscribe((response) => {
        this.allProducts = response;
      });
  }

  goToProduct(id: number): void {
    this.router.navigate(['/product', id]);
  }
}

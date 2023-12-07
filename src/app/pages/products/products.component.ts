import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  WritableSignal,
  effect,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { liveQuery } from 'dexie';
import { db } from '../../../database/db';
import {
  PaginationComponent,
  PaginationType,
} from '../../core/pagination/pagination.component';
import { productCachedKey } from '../../enums/enums';
import { ProductService } from '../../services/api/product/product.service';
import { ConnexionService } from '../../services/connexion/connexion.service';
import { ImageService } from '../../services/image.service';
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
  productCachedList: WritableSignal<ProductType[]> = signal([]);
  waitingProduct$ = liveQuery(() => db.waitingProduct.toArray());
  waitingProductList: WritableSignal<ProductType[]> = signal([]);

  displayProduct?: ProductType[];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private connexionService: ConnexionService,
    private imageService: ImageService
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
    });

    this.productCached$.subscribe((products) => {
      this.productCachedList.set(products);
    });

    this.waitingProduct$.subscribe((products) => {
      this.waitingProductList.set(products);
    });
  }
  private mergeProducts = effect(() => {
    const newProductsList: ProductType[] = [...this.productCachedList()];
    this.waitingProductList().forEach((wp) => {
      const index = this.productCachedList().findIndex(
        (product) => wp.id === product.id
      );

      index !== -1 ? (newProductsList[index] = wp) : newProductsList.push(wp);
    });
    this.allProducts = {
      total: newProductsList.length,
      limit: newProductsList.length,
      products: newProductsList,
    };
  });

  pageChange(): void {
    this.getAllProducts();
  }

  async successResponse(response: AllProductType) {
    this.allProducts = response as AllProductType;
    await db.deleteTable(productCachedKey);
    await db.bulkAddTableLines(
      productCachedKey,
      this.allProducts?.products as ProductType[]
    );
    response.products.forEach(async (element) => {
      // element.images = await getBlob(element.images[0]);
      this.imageService.downloadImage(element.images[0]);
    });
  }

  private refreshData = effect(() => {
    if (this.connexionService.isUserOnline()) {
      this.getAllProducts();
    }
  });

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
      .subscribe((response) => {
        this.successResponse(response);
      });
  }

  goToProduct(
    productId?: number | string,
    isPendingProduct: boolean = false
  ): void {
    const queryParams = isPendingProduct ? { isPendingProduct } : {};
    this.router.navigate([`/product/${productId || ''}`], { queryParams });
  }

  goToProductForm(
    productId?: number | string,
    isPendingProduct: boolean = false
  ): void {
    const queryParams = isPendingProduct ? { isPendingProduct } : {};
    this.router.navigate([`/product-form/${productId || ''}`], { queryParams });
  }
}
function getBlob(
  arg0: string
):
  | import('../../type/product.type').ProductImage
  | PromiseLike<import('../../type/product.type').ProductImage> {
  throw new Error('Function not implemented.');
}

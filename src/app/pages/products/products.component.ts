import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { liveQuery } from 'dexie';
import { tap } from 'rxjs';
import { db } from '../../../database/db';
import {
  PaginationComponent,
  PaginationType,
} from '../../core/pagination/pagination.component';
import { productCachedKey } from '../../enums/enums';
import { ProductService } from '../../services/api/product/product.service';
import { ConnexionService } from '../../services/connexion/connexion.service';
import { ImageService } from '../../services/image.service';
import { NetworkRetryService } from '../../services/networkRetry/network-retry.service';
import { AllProductType, ProductType } from '../../type/product.type';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    MatCardModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly connexionService = inject(ConnexionService);
  private readonly imageService = inject(ImageService);
  private readonly networkRetryService = inject(NetworkRetryService);

  pagination: PaginationType = {
    totalItems: 100,
    itemsPerPage: 10,
    currentPage: 1,
  };

  allProducts?: AllProductType;
  displayProduct?: ProductType[];
  online = navigator.onLine;

  get isOnline() {
    return this.connexionService.isUserOnline();
  }

  productCachedList: Signal<ProductType[]> = toSignal(
    liveQuery(() => db.productCached.toArray()),
    {
      initialValue: [],
    }
  );

  waitingProductList: Signal<ProductType[]> = toSignal(
    liveQuery(() => db.waitingProduct.toArray()),
    {
      initialValue: [],
    }
  );

  constructor() {
    effect(() => {
      if (this.online) {
        this.getDataproductsFromPagination();
      } else {
        // add tmp datas added by client in the page until the request is send when user is online again
        if (this.waitingProductList().length > 0) {
          this.waitingProductList().forEach((wp) => {
            const index = this.productCachedList().findIndex(
              (product) => wp.id === product.id
            );
            const newProductsList: ProductType[] = [
              ...this.productCachedList(),
            ];
            index !== -1
              ? (newProductsList[index] = wp)
              : newProductsList.push(wp);

            this.allProducts = this.allProductList(newProductsList);
          });
        } else {
          this.allProducts = this.allProductList(this.productCachedList());
        }
      }
    });
  }

  ngOnInit(): void {
    if (this.waitingProductList.length > 0 && this.isOnline) {
      this.networkRetryService.sendPendingRequests();
    }
  }

  getDataproductsFromPagination() {
    this.route.queryParams.subscribe(async (params) => {
      if (params['page']) {
        let pageNumber = parseInt(params['page']);

        if (
          pageNumber * this.pagination.itemsPerPage >
          this.pagination.totalItems
        ) {
          pageNumber = 1;
        }
        this.pagination.currentPage = pageNumber;
        this.getAllProducts();
      } else {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            page: 1,
          },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  pageChange(): void {
    this.productService.navigateToFoo(this.pagination.currentPage);
  }

  public getAllProducts() {
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
        tap((response) => {
          this.allProducts = response as AllProductType;
        })
      )
      .subscribe({
        complete: () => {
          db.deleteTable(productCachedKey).finally(() => {
            this.imageService
              .storePicturesAsBlobFormat(this.allProducts as AllProductType)
              // storePicturesAsBlobFormat worked
              .then(() => {
                if (this.allProducts) {
                  db.bulkPutTableLines(
                    productCachedKey,
                    this.allProducts.products as ProductType[]
                  )
                    // bulk worked
                    .then(() => {
                      this.allProducts = this.allProductList(
                        this.allProducts!.products as ProductType[]
                      );
                    })
                    // bulk operation didn't worked
                    .catch(() => {
                      console.log("bulk operation did'nt worked");
                    });
                }
              })
              // storePicturesAsBlobFormat didn't work
              .catch(() => {
                console.log("storePicturesAsBlobFormat did'nt work");
              });
            console.log('lkl');
          });
        },
        error: () => {
          db.productCached
            .toArray()
            .then(
              (response) => (this.allProducts = this.allProductList(response))
            );
        },
      });
  }

  getImage(picture: Blob | string | undefined) {
    // if image is already stored in localDBPicture, always use it for more performances
    if (picture instanceof Blob) {
      return URL.createObjectURL(picture);
    } else if (typeof picture === 'string') {
      return picture;
    } else {
      return 'assets/icons/noImage.png';
    }
  }

  allProductList(allProducts: ProductType[]) {
    return {
      total: allProducts.length,
      limit: allProducts.length,
      products: allProducts,
    };
  }
}

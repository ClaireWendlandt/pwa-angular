import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
  private readonly httpClient = inject(HttpClient);

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

  // this version is only available for developpers preview for the moment,
  //if this can be used in the future, the version without it is all down the file, and in the oninit

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
    console.log('merge products ::', this.allProducts);
  });

  pageChange(): void {
    this.productService.navigateToFoo(this.pagination.currentPage);
  }

  private refreshData = effect(async () => {
    if (await this.connexionService.isUserOnline()) {
      this.getDataproductsFromPagination();
    }
  });

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
        tap(async (response) => {
          db.deleteTable(productCachedKey).finally(() => {
            this.imageService.storePicturesAsBlobFormat(response).then(() => {
              this.allProducts = response;
              if (this.allProducts) {
                db.bulkPutTableLines(
                  productCachedKey,
                  response.products as ProductType[]
                );
              }
            });
            // for (let product of response.products) {
            //   this.httpClient
            //     .get(product.images[0], { responseType: 'blob' })
            //     .subscribe({
            //       next: (image) => {
            //         product.localDbPicture = image;
            //       },
            //       complete: () => {
            //         this.allProducts = response;
            //         if (this.allProducts) {
            //           db.bulkPutTableLines(
            //             productCachedKey,
            //             response.products as ProductType[]
            //           );
            //         }
            //       },
            //     });
            // }
          });
        })
      )
      .subscribe({
        next: (response) => {},
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
}

// productCached$ = liveQuery(() => db.productCached.toArray());
// productCachedList: WritableSignal<ProductType[]> = signal([]);
// waitingProduct$ = liveQuery(() => db.waitingProduct.toArray());
// waitingProductList: WritableSignal<ProductType[]> = signal([]);

// async ngOnInit(): Promise<void> {
//   this.productCached$.subscribe((products) => {
//     this.productCachedList.set(products);
//   });

//   this.waitingProduct$.subscribe((products) => {
//     this.waitingProductList.set(products);
//   });
// }

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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { liveQuery } from 'dexie';
import { firstValueFrom } from 'rxjs';
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
      if (params['page']) {
        console.log('params :', params);
        let pageNumber = parseInt(params['page']);

        if (
          pageNumber * this.pagination.itemsPerPage >
          this.pagination.totalItems
        ) {
          pageNumber = 1;
        }
        this.pagination.currentPage = pageNumber;
        console.log('getAllProducts from on init');
        await this.getAllProducts();
      } else {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            page: 1,
          },
          queryParamsHandling: 'merge',
        });
        // set search params to page default current page
        //this.pagination.currentPage
      }
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
    console.log('getAllProducts from pagechange');
    this.getAllProducts();
  }

  async successResponse(response: AllProductType) {
    this.allProducts = response as AllProductType;
    await db.deleteTable(productCachedKey);

    this.allProducts = await this.imageService.storePicturesAsBlobFormat(
      this.allProducts
    );

    console.log('rresss', this.allProducts);
    await db.bulkPutTableLines(
      productCachedKey,
      this.allProducts?.products as ProductType[]
    );
  }

  private refreshData = effect(() => {
    if (this.connexionService.isUserOnline()) {
      this.getAllProducts();
    }
  });

  public async getAllProducts() {
    const skip =
      this.pagination.currentPage === 1
        ? 0
        : this.pagination.itemsPerPage * (this.pagination.currentPage - 1);
    const response = await firstValueFrom(
      this.productService.getProductListAndNavigate(
        this.pagination.itemsPerPage,
        skip,
        this.pagination.currentPage
      )
    );
    this.successResponse(response);
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

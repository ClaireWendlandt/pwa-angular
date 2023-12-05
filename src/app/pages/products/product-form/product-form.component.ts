import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { liveQuery } from 'dexie';
import { catchError, take, throwError } from 'rxjs';
import { db } from '../../../../database/db';
import { productCachedKey, waitingProductKey } from '../../../enums/enums';
import { ProductService } from '../../../services/api/product/product.service';
import { ProductFormType, ProductType } from '../../../type/product.type';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnDestroy {
  productCached$ = liveQuery(() => db.productCached.toArray());
  waitingProduct$ = liveQuery(() => db.waitingProduct.toArray());

  productId?: number;
  isPendingProduct: boolean = false;

  productForm: FormGroup<ProductFormType> = new FormGroup<ProductFormType>({
    title: new FormControl('', [Validators.minLength(6), Validators.required]),
    description: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
    category: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
    price: new FormControl('', [Validators.required]),
    images: new FormControl('', [Validators.required]),
  });

  constructor(
    private productService: ProductService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      this.isPendingProduct = params['isPendingProduct'];
    });
    this.route.params.subscribe((params) => {
      this.productId = parseInt(params['id']);
      if (this.productId) {
        productService
          .getOneProduct(this.productId)
          .pipe(
            take(1),
            catchError(async ({ status }) => {
              if (status !== 200) {
                this.usePendingDatas();
              }
              return throwError(status);
            })
          )
          .subscribe((product) => {
            this.initForm(product as ProductType);
          });
      }
    });
  }

  async usePendingDatas() {
    const product = await db.getTableLineByWhere<ProductType>(
      waitingProductKey,
      this.isPendingProduct ? 'localDbId' : 'id',
      this.productId as number
    );

    setTimeout(async () => {
      if (product) {
        this.initForm(product);
      } else {
        const cachedProduct = await db.getTableLine<ProductType>(
          productCachedKey,
          this.productId as number
        );
        if (cachedProduct) {
          setTimeout(() => {
            this.initForm(cachedProduct);
          }, 10);
        }
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.productCached$;
    this.waitingProduct$;
  }

  initForm(product: ProductType) {
    const { title, description, category, price, images, localDbId } = product;

    if (this.productId) {
      this.productForm.addControl('id', new FormControl(this.productId));
    }
    if (localDbId) {
      this.productForm.addControl('localDbId', new FormControl(localDbId));
    }

    this.productForm.patchValue({
      title,
      description,
      category,
      price,
      // TODO :: gérer le formats des images plus tard
      // images: [images]
    });
  }

  async submitProduct() {
    if (
      this.productService.postProduct(this.productForm.value as ProductType)
    ) {
      this.productForm.reset();
      this.goToProducts();
    }
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}

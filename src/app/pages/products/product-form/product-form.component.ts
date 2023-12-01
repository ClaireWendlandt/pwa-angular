import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
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
import { catchError, throwError } from 'rxjs';
import { db } from '../../../../database/db';
import { productCached } from '../../../enums/enums';
import { DummyJsonService } from '../../../services/api/dummyJson/dummy-json.service';
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
export class ProductFormComponent {
  productCached$ = liveQuery(() => db.productCached.toArray());
  productId?: number;

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
    private dummyJsonService: DummyJsonService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      this.productId = parseInt(params['id']);

      if (this.productId) {
        dummyJsonService
          .getOneProduct(this.productId)
          .pipe(
            catchError(({ status }) => {
              if (status !== 200) {
                this.productCached$.subscribe(async () => {
                  this.initForm(
                    await db.getTableLine(
                      productCached,
                      this.productId as number
                    )
                  );
                });
              }
              return throwError(status);
            })
          )
          .subscribe((product) => {
            this.initForm(product);
          });
      }
    });
  }

  initForm({ title, description, category, price, images }: ProductType) {
    if (this.productId) {
      this.productForm.addControl('id', new FormControl(this.productId));
    }
    this.productForm.patchValue({
      title,
      description,
      category,
      price,
      // images: [images]
    });
  }

  async submitProduct() {
    if (
      this.dummyJsonService.postProduct(this.productForm.value as ProductType)
    ) {
      this.productForm.reset();
      this.goToProducts();
    }
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}

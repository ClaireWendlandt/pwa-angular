import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DummyJsonService } from '../../../services/api/dummyJson/dummy-json.service';
import { ProductFormType, ProductType } from '../../../type/product.type';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {
  constructor(private dummyJsonService: DummyJsonService) {}

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
    images: new FormControl([], [Validators.required]),
  });

  submitProduct() {
    if (
      this.dummyJsonService.postProduct(this.productForm.value as ProductType)
    ) {
      this.productForm.reset();
    }
  }
}

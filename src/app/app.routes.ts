import { Routes } from '@angular/router';
import { PlatformComponent } from './layouts/platform/platform.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';
import { ProductComponent } from './pages/products/product/product.component';
import { ProductsComponent } from './pages/products/products.component';
import { QuotesComponent } from './pages/quotes/quotes.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: PlatformComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        title: 'Home',
      },
      {
        path: 'products',
        component: ProductsComponent,
        title: 'Products',
      },
      {
        path: 'product/:id',
        component: ProductComponent,
        title: 'Product',
      },
      {
        path: 'product-form',
        component: ProductFormComponent,
        title: 'Add a product',
      },
      {
        path: 'product-form/:id',
        component: ProductFormComponent,
        title: 'Update a product',
      },
      {
        path: 'quotes',
        component: QuotesComponent,
        title: 'Random quote',
      },
    ],
  },
];

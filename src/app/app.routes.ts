import { Routes } from '@angular/router';
import { PlatformComponent } from './layouts/platform/platform.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';

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
    ],
  },
];

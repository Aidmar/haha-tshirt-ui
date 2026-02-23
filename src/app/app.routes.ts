import { Routes } from '@angular/router';
import { CategoryList } from './Shared/Components/features/Category/category-list/category-list';
import { AddCategory } from './Shared/Components/features/Category/add-category/add-category';
import { EditCategory } from './Shared/Components/features/Category/edit-category/edit-category';
import { ProductList } from './Shared/Components/features/Product/product-list/product-list';
import { AddProduct } from './Shared/Components/features/Product/add-product/add-product';
import { EditProduct } from './Shared/Components/features/Product/edit-product/edit-product';
import { Home } from './Home/home/home';
import { ProductListUsers } from './user-shared/product-list-users/product-list-users';
import { ProductDetailsPage } from './user-shared/product-details-page/product-details-page';
import { CartComponent } from './user-shared/Carts/cart/cart';
import { Login } from './user-shared/LoginandRegister/login/login';
import { Register } from './user-shared/LoginandRegister/register/register';
import { adminGuard } from './user-shared/LoginandRegister/Auth/auth/admin-guard';
import { About } from './user-shared/about/about';
import { Trending } from './user-shared/trending/trending';


export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  // ADMIN CATEGORY ROUTES
  {
    path: 'admin/category',
    component: CategoryList,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/category/AddCategory',
    component: AddCategory,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/category/EditCategory/:id',
    component: EditCategory,
    canActivate: [adminGuard]
  },
  // ADMIN PRODUCT ROUTES
  {
    path: 'admin/product',
    component: ProductList,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/product/add',
    component: AddProduct,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/product/edit/:id',
    component: EditProduct,
    canActivate: [adminGuard]
  },
  // PUBLIC ROUTES
  {
    path: 'products/tshirts',
    component: ProductListUsers
  },
  {
    path: 'products/productDetails/:id',
    component: ProductDetailsPage
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
    {
    path: 'about',
    component: About
  },
      {
    path: 'trending',
    component: Trending
  }
];










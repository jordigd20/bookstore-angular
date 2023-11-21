import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NoAuthGuard } from './guards/noauth.guard';
import { ResetPasswordGuard } from './guards/reset-password.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'signin',
    canActivate: [NoAuthGuard],
    loadComponent: () =>
      import('./pages/auth/signin/signin.component').then(
        (m) => m.SigninComponent
      ),
  },
  {
    path: 'signup',
    canActivate: [NoAuthGuard],
    loadComponent: () =>
      import('./pages/auth/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },
  {
    path: 'forgot-password',
    canActivate: [NoAuthGuard],
    loadComponent: () =>
      import('./pages/auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'reset-password',
    canActivate: [ResetPasswordGuard],
    loadComponent: () =>
      import('./pages/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('./pages/shop/shop.component').then((m) => m.ShopComponent),
  },
  {
    path: 'book/:id',
    loadComponent: () =>
      import('./pages/book/book.component').then((m) => m.BookComponent),
  },
  {
    path: 'dashboard/account',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/dashboard/account/account.component').then(
        (m) => m.AccountComponent
      ),
  },
  {
    path: 'dashboard/wishlist',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/dashboard/wishlist/wishlist.component').then(
        (m) => m.WishlistComponent
      ),
  },
  {
    path: 'dashboard/ratings',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/dashboard/ratings/ratings.component').then(
        (m) => m.RatingsComponent
      ),
  },
  {
    path: 'checkout',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
  },
  {
    path: 'success-checkout/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/success-checkout/success-checkout.component').then(
        (m) => m.SuccessCheckoutComponent
      ),
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent,
  },
];

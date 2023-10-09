import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NoAuthGuard } from './guards/noauth.guard';
import { ResetPasswordGuard } from './guards/reset-password.guard';

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
];

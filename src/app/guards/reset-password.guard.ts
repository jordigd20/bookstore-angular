import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const ResetPasswordGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  return route.queryParams['token'] ? true : router.navigateByUrl('/');
};

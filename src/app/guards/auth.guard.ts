import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.shouldAllowAccess(true, false).pipe(
    tap((response) => {
      if (!response) {
        router.navigateByUrl('/signin');
      }
    })
  );
};

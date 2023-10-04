import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../services/http.service';
import { map, tap } from 'rxjs';

export const NoAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.shouldAllowAccess(false, true).pipe(
    tap((response) => {
      if (!response) {
        router.navigateByUrl('/');
      }
    })
  );
};

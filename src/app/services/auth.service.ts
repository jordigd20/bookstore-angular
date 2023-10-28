import {
  Injectable,
  NgZone,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  AuthState,
  AuthUser,
  GoogleSigninResponse,
  SigninBody,
  SignupBody,
} from '../interfaces/auth.interface';
import { HttpService } from './http.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageService } from './storage.service';
import { catchError, map, tap, of, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../interfaces/user.interface';
import { AbstractControl } from '@angular/forms';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpService = inject(HttpService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private toastService = inject(ToastService);

  // State
  private authState = signal<AuthState>({
    user: null,
    token: null,
    loaded: false,
    error: null,
  });

  // Selectors
  user = computed(() => this.authState().user);
  userFullName = computed(
    () =>
      `${this.authState().user!.firstName} ${this.authState().user!.lastName}`
  );
  token = computed(() => this.authState().token);
  loaded = computed(() => this.authState().loaded);
  error = computed(() => this.authState().error);

  constructor() {
    this.validateToken$().pipe(takeUntilDestroyed()).subscribe();

    effect(() => {
      if (this.loaded() && this.token() !== null) {
        this.storageService.saveToken(this.token() as string);
      }
    });
  }

  handleGoogleSignin(response: GoogleSigninResponse) {
    this.httpService.executePost<AuthUser>('/auth/google', response).subscribe({
      next: (response: AuthUser) => {
        this.authState.update((state) => ({
          ...state,
          user: response.user,
          token: response.token,
          loaded: true,
        }));

        this.ngZone.run(() => {
          this.router.navigateByUrl('/');
        });
      },
      error: (error) => {
        this.toastService.showErrorToast(
          error.error.message ?? 'Something went wrong. Please try again later.'
        );
      },
    });
  }

  handleSignin({ email, password }: SigninBody) {
    return new Promise<boolean>((resolve) => {
      this.httpService
        .executePost<AuthUser>('/auth/login', { email, password })
        .subscribe({
          next: (response: AuthUser) => {
            this.authState.update((state) => ({
              ...state,
              user: response.user,
              token: response.token,
              loaded: true,
            }));

            resolve(true);
          },
          error: (error) => {
            this.toastService.showErrorToast(
              error.error.message ??
                'Something went wrong. Please try again later.'
            );

            resolve(false);
          },
        });
    });
  }

  handleSignup({ firstName, lastName, email, password }: SignupBody) {
    return new Promise<boolean>((resolve) => {
      this.httpService
        .executePost<User>('/auth/register', {
          firstName,
          lastName,
          email,
          password,
        })
        .subscribe({
          next: () => {
            resolve(true);
          },
          error: (error) => {
            console.error(error);
            resolve(false);
          },
        });
    });
  }

  shouldAllowAccess(success: boolean, failure: boolean) {
    return this.validateToken$().pipe(
      map((response: AuthUser | null) => {
        if (response) {
          return success;
        }

        return failure;
      }),
      catchError((error) => {
        return of(failure);
      })
    );
  }

  validateToken$() {
    return this.storageService.getToken().pipe(
      switchMap((token: string | null) => {
        if (token) {
          return this.httpService.executeAuthPost<AuthUser>(
            '/auth/token',
            {},
            token
          );
        } else {
          return of(null);
        }
      }),
      tap((response: AuthUser | null) => {
        if (response) {
          this.authState.update((state) => ({
            ...state,
            user: response.user,
            token: response.token,
            loaded: true,
          }));
        } else {
          this.logOut();
        }
      }),
      catchError((error) => {
        this.logOut();
        return throwError(() => new Error(error));
      })
    );
  }

  handleForgotPassword(email: string) {
    return new Promise<boolean>((resolve) => {
      this.httpService
        .executePost<{ message: string; ok: boolean }>(
          '/auth/forgot-password',
          { email }
        )
        .subscribe({
          next: () => {
            resolve(true);
          },
          error: (error) => {
            this.toastService.showErrorToast(
              error.error.message ??
                'Something went wrong. Please try again later.'
            );

            resolve(false);
          },
        });
    });
  }

  handleResetPassword(
    password: string,
    confirmPassword: string,
    token: string
  ) {
    return new Promise<boolean>((resolve) => {
      this.httpService
        .executeAuthPost<{ message: string; ok: boolean }>(
          '/auth/reset-password',
          { password, confirmPassword },
          token
        )
        .subscribe({
          next: ({ message }) => {
            this.toastService.showSuccessToast(message);
            resolve(true);
          },
          error: (error) => {
            const message =
              error.error.message ??
              'Something went wrong. Please try again later.';
            this.toastService.showErrorToast(
              message === 'Unauthorized'
                ? 'The time to reset your password has expired'
                : message
            );

            resolve(false);
          },
        });
    });
  }

  updateUser(user: User) {
    this.authState.update((state) => ({
      ...state,
      user,
    }));
  }

  signOut() {
    this.logOut();
    this.ngZone.run(() => {
      this.router.navigateByUrl('/');
    });
  }

  logOut() {
    this.storageService.removeToken();
    this.authState.update((state) => ({
      ...state,
      user: null,
      token: null,
      loaded: false,
    }));
  }

  matchPasswords(password: string, confirmPassword: string) {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const control = formGroup.get(password);
      const matchingControl = formGroup.get(confirmPassword);

      if (!control || !matchingControl) return null;

      if (matchingControl.errors && !matchingControl.errors['mustMatch'])
        return null;

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }
}

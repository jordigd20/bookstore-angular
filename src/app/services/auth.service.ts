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
} from '../interfaces/auth.interface';
import { HttpService } from './http.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageService } from './storage.service';
import { catchError, map, tap, of, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpService = inject(HttpService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  // State
  private authState = signal<AuthState>({
    user: null,
    token: null,
    loaded: false,
    error: null,
  });

  // Selectors
  user = computed(() => this.authState().user);
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
    this.httpService
      .executePost<AuthUser>('/auth/google', response)
      .subscribe((response: AuthUser) => {
        this.authState.update((state) => ({
          ...state,
          user: response.user,
          token: response.token,
          loaded: true,
        }));

        this.ngZone.run(() => {
          this.router.navigateByUrl('/');
        });
      });
  }

  handleSignin(email: string, password: string) {
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

  logOut() {
    this.storageService.removeToken();
    this.authState.update((state) => ({
      ...state,
      user: null,
      token: null,
      loaded: false,
    }));
  }
}

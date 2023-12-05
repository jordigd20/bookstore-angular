import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpService } from './http.service';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';
import {
  BookPaginatedResponse,
  BookRatedResponse,
  RatedBook,
} from '../interfaces/book.interface';
import { Params, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RatingsService {
  private httpService = inject(HttpService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  private noRatedBooksState = signal<{
    response: BookPaginatedResponse | undefined;
    isLoading: boolean;
    currentPage: number;
  }>({
    response: undefined,
    isLoading: false,
    currentPage: 1,
  });

  private ratedBooksState = signal<{
    response: BookRatedResponse | undefined;
    isLoading: boolean;
    currentPage: number;
  }>({
    response: undefined,
    isLoading: false,
    currentPage: 1,
  });

  noRatedBooks = computed(() => this.noRatedBooksState().response?.data);
  noRatedPagination = computed(
    () => this.noRatedBooksState().response?.pagination
  );
  isNoRatedLoading = computed(() => this.noRatedBooksState().isLoading);
  noRatedCurrentPage = computed(() => this.noRatedBooksState().currentPage);

  ratedBooks = computed(() => this.ratedBooksState().response?.data);
  ratedPagination = computed(() => this.ratedBooksState().response?.pagination);
  isRatedLoading = computed(() => this.ratedBooksState().isLoading);
  ratedCurrentPage = computed(() => this.ratedBooksState().currentPage);

  constructor() {}

  getNoRatedBooks(page: number, pageParams: Params) {
    const user = this.authService.user();
    const token = this.authService.token();

    if (!user || !token) {
      return;
    }

    this.noRatedBooksState.update((state) => ({
      ...state,
      isLoading: true,
      currentPage: page,
    }));

    this.httpService
      .executeAuthGet<BookPaginatedResponse>(
        `/ratings/${user.id}/not-rated`,
        pageParams,
        token
      )
      .subscribe({
        next: (response) => {
          this.noRatedBooksState.update((state) => ({
            ...state,
            response,
            isLoading: false,
          }));
        },
        error: (error) => {
          console.error(error);
          this.noRatedBooksState.update((state) => ({
            ...state,
            isLoading: false,
          }));

          if (error.status === 401) {
            this.router.navigate(['/signin']);
            return;
          }

          this.toastService.showErrorToast(
            'Something went wrong. Please try again later.'
          );
        },
      });
  }

  getRatedBooks(page: number, pageParams: Params) {
    const user = this.authService.user();
    const token = this.authService.token();

    if (!user || !token) {
      return;
    }

    this.ratedBooksState.update((state) => ({
      ...state,
      isLoading: true,
      currentPage: page,
    }));

    this.httpService
      .executeAuthGet<BookRatedResponse>(
        `/ratings/${user.id}`,
        pageParams,
        token
      )
      .subscribe({
        next: (response) => {
          this.ratedBooksState.update((state) => ({
            ...state,
            response,
            isLoading: false,
          }));
        },
        error: (error) => {
          console.error(error);
          this.ratedBooksState.update((state) => ({
            ...state,
            isLoading: false,
          }));

          if (error.status === 401) {
            this.router.navigate(['/signin']);
            return;
          }

          this.toastService.showErrorToast(
            'Something went wrong. Please try again later.'
          );
        },
      });
  }

  rateBook(bookId: number, rating: number) {
    return new Promise<boolean>((resolve) => {
      const user = this.authService.user();
      const token = this.authService.token();

      if (!user || !token) {
        resolve(false);
        return;
      }

      this.httpService
        .executeAuthPost<RatedBook>(
          `/ratings/${user.id}`,
          { bookId, rating },
          token
        )
        .subscribe({
          next: (response) => {
            this.noRatedBooksState.update((state) => ({
              ...state,
              response: {
                ...state.response!,
                data: state.response!.data.filter((book) => book.id !== bookId),
                pagination: {
                  ...state.response!.pagination,
                  total: state.response!.pagination.total - 1,
                },
              },
            }));

            if (this.ratedBooks()) {
              this.ratedBooksState.update((state) => ({
                ...state,
                response: {
                  ...state.response!,
                  data: [
                    {
                      rating: rating.toString(),
                      book: response.book,
                    },
                    ...state.response!.data,
                  ],
                },
              }));
            }

            resolve(true);
          },
          error: (error) => {
            console.error(error);
            if (error.status === 401) {
              this.toastService.showWarningToast(
                'You must be logged in to rate a book.'
              );

              this.router.navigate(['/signin']);

              resolve(false);
              return;
            }

            resolve(false);
            this.toastService.showErrorToast(
              'Something went wrong. Please try again later.'
            );
          },
        });
    });
  }

  updateRating(bookId: number, rating: number) {
    return new Promise<boolean>((resolve) => {
      const user = this.authService.user();
      const token = this.authService.token();

      if (!user || !token) {
        resolve(false);
        return;
      }

      this.httpService
        .executeAuthPatch<RatedBook>(
          `/ratings/${user.id}`,
          { bookId, rating },
          token
        )
        .subscribe({
          next: (response) => {
            if (this.ratedBooks()) {
              this.ratedBooksState.update((state) => ({
                ...state,
                response: {
                  ...state.response!,
                  data: state.response!.data.map((book) => {
                    if (book.book.id === bookId) {
                      return {
                        ...book,
                        rating: response.rating,
                      };
                    }

                    return book;
                  }),
                },
              }));
            }

            resolve(true);
          },
          error: (error) => {
            console.error(error);
            if (error.status === 401) {
              this.toastService.showWarningToast(
                'You must be logged in to rate a book.'
              );

              this.router.navigate(['/signin']);

              resolve(false);
              return;
            }

            resolve(false);
            this.toastService.showErrorToast(
              'Something went wrong. Please try again later.'
            );
          },
        });
    });
  }
}

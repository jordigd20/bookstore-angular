import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpService } from './http.service';
import { Book, BookPaginatedResponse } from '../interfaces/book.interface';
import { OptionalFilterState } from '../interfaces/book-filters.interface';
import { FilterState } from '../interfaces/book-filters.interface';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';

const BOOKS_PER_PAGE = 10;

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private httpService = inject(HttpService);
  private authService = inject(AuthService);
  private toast = inject(ToastrService);

  filterState = signal<FilterState>({
    search: '',
    price: '0-500',
    filterBy: '',
    category: '',
    orderBy: '',
    page: 1,
    skip: 0,
  });

  bookResponse = signal<{
    response: BookPaginatedResponse | undefined;
    isLoading: boolean;
  }>({
    response: undefined,
    isLoading: false,
  });

  search = computed(() => this.filterState().search);
  price = computed(() => this.filterState().price);
  filterBy = computed(() => this.filterState().filterBy);
  category = computed(() => this.filterState().category);
  orderBy = computed(() => this.filterState().orderBy);
  page = computed(() => Number(this.filterState().page));
  skip = computed(() => this.filterState().skip);

  books = computed(() => this.bookResponse().response?.data);
  pagination = computed(() => this.bookResponse().response?.pagination);
  isLoading = computed(() => this.bookResponse().isLoading);

  constructor() {}

  fetchBooks(filters: OptionalFilterState) {
    this.filterState.update((state) => ({
      ...state,
      ...filters,
    }));

    const params: { [key: string]: any } = {
      search: this.search(),
      price: this.price(),
      filter: this.filterBy(),
      orderBy: this.orderBy(),
      skip: this.skip(),
      take: BOOKS_PER_PAGE,
    };

    if (this.category() !== '') {
      params['category'] = this.category();
    }

    this.httpService
      .executeGet<BookPaginatedResponse>('/books', {
        ...params,
      })
      .subscribe((response) => {
        this.bookResponse.set({ response, isLoading: false });
      });
  }

  resetFilters() {
    this.filterState.update((state) => ({
      ...state,
      search: '',
      price: '0-500',
      filterBy: '',
      category: '',
      orderBy: '',
      page: 1,
      skip: 0,
    }));
  }

  fetchOneBook(slug: string) {
    return this.httpService.executeGet<Book>(`/books/${slug}`);
  }

  addBookToWishlist(bookId: number) {
    const user = this.authService.user();
    const token = this.authService.token();

    if (user === null || token === null) {
      this.showWarningToast(
        'You must be logged in to add a book to your wishlist.'
      );
      return;
    }

    this.httpService
      .executeAuthPost(
        `/users/${user.wishlist}/wishlist`,
        {
          bookIds: [bookId],
        },
        token
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          this.showSuccessToast('Book added to your wishlist');
        },
        error: (err) => {
          console.error(err);
          this.showWarningToast('You already have this book in your wishlist');
        },
      });
  }

  showSuccessToast(message: string) {
    this.toast.success(message, '', {
      toastClass:
        'relative overflow-hidden w-80 bg-background text-foreground text-sm font-medium border border-border rounded-md shadow p-4 pl-12 m-3 bg-no-repeat bg-[length:24px] bg-[15px_center] pointer-events-auto',
      positionClass: 'toast-bottom-right',
      tapToDismiss: false,
    });
  }

  showWarningToast(message: string) {
    this.toast.warning(message, '', {
      toastClass:
        'relative overflow-hidden w-80 bg-background text-foreground text-sm font-medium border border-border rounded-md shadow p-4 pl-12 m-3 bg-no-repeat bg-[length:24px] bg-[15px_center] pointer-events-auto',
      positionClass: 'toast-bottom-right',
      tapToDismiss: false,
    });
  }
}

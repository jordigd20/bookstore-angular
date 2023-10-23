import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpService } from './http.service';
import { BookPaginatedResponse } from '../interfaces/book.interface';
import { OptionalFilterState } from '../interfaces/book-filters.interface';
import { FilterState } from '../interfaces/book-filters.interface';

const BOOKS_PER_PAGE = 10;

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  httpService = inject(HttpService);

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
}

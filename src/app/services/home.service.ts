import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import { map } from 'rxjs';
import { BookPaginatedResponse } from '../interfaces/book.interface';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  httpService = inject(HttpService);

  constructor() {}

  getBestRatedBooks() {
    return this.httpService
      .executeGet<BookPaginatedResponse>('/books', {
        take: 6,
        orderBy: 'rating.desc',
      })
      .pipe(map((books) => books.data));
  }

  getBestsellerBooks() {
    return this.httpService
      .executeGet<BookPaginatedResponse>('/books', {
        take: 6,
        filter: 'bestseller',
      })
      .pipe(map((books) => books.data));
  }

  getOnSaleBooks() {
    return this.httpService
      .executeGet<BookPaginatedResponse>('/books', {
        take: 6,
        filter: 'discounted',
      })
      .pipe(map((books) => books.data));
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import { BookPaginatedResponse } from '../interfaces/book.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  httpService = inject(HttpService);

  constructor() {}

  getBooks() {
    return this.httpService
      .executeGet<BookPaginatedResponse>('/books', {
        take: 10,
      })
      .pipe(map((books) => books.data));
  }
}

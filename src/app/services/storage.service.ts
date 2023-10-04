import { Injectable, InjectionToken, PLATFORM_ID, inject } from '@angular/core';
import { of } from 'rxjs';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'window local storage object',
  {
    providedIn: 'root',
    factory: () => {
      return inject(PLATFORM_ID) === 'browser'
        ? window.localStorage
        : ({} as Storage);
    },
  }
);

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storage = inject(LOCAL_STORAGE);

  constructor() {}

  getToken() {
    return of(this.storage.getItem('token'));
  }

  saveToken(token: string) {
    this.storage.setItem('token', token);
  }

  removeToken() {
    this.storage.removeItem('token');
  }

  clear() {
    this.storage.clear();
  }
}

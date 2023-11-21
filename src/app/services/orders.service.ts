import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import { AuthService } from './auth.service';
import { Order } from '../interfaces/order.interface';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private authService = inject(AuthService);
  private httpService = inject(HttpService);

  constructor() {}

  getOrderById(id: number) {
    const user = this.authService.user();
    const token = this.authService.token();

    if (!user || !token) {
      return of();
    }

    return this.httpService.executeAuthGet<Order>(`/orders/${id}`, {}, token);
  }
}

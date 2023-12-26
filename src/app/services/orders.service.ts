import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpService } from './http.service';
import { AuthService } from './auth.service';
import { LastOrders, Order } from '../interfaces/order.interface';
import { of } from 'rxjs';
import { Router } from '@angular/router';

const months: { [key: number]: string } = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'Septemper',
  10: 'October',
  11: 'November',
  12: 'December',
};

export interface DropdownData {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private authService = inject(AuthService);
  private httpService = inject(HttpService);
  private router = inject(Router);

  private ordersState = signal<{
    response: LastOrders | undefined;
    isLoading: boolean;
    error: string | undefined;
  }>({
    response: undefined,
    isLoading: false,
    error: undefined,
  });

  ordersByDate = computed(() => this.ordersState().response?.ordersByDate);
  orders = computed(() => this.ordersState().response?.orders);
  isLoading = computed(() => this.ordersState().isLoading);
  responseError = computed(() => this.ordersState().error);

  isLastOrdersLoading = signal(true);
  yearOptions = signal<DropdownData[]>([]);
  monthOptions = signal<DropdownData[]>([]);
  currentYearValue: readonly DropdownData[] = [];
  currentMonthValue: readonly DropdownData[] = [];

  constructor() {}

  getOrderById(id: number) {
    const user = this.authService.user();
    const token = this.authService.token();

    if (!user || !token) {
      return of();
    }

    return this.httpService.executeAuthGet<Order>(`/orders/${id}`, {}, token);
  }

  getOrders(month: number, year: number) {
    const user = this.authService.user();
    const token = this.authService.token();

    if (!user || !token) {
      return;
    }

    this.httpService
      .executeAuthGet<Order[]>(
        `/orders/user/${user.id}`,
        { month, year },
        token
      )
      .subscribe({
        next: (orders) => {
          this.ordersState.set({
            response: {
              ordersByDate: this.ordersByDate()!,
              orders: orders,
            },
            isLoading: false,
            error: undefined,
          });
        },
        error: (error) => {
          console.error(error);
          this.ordersState.update((state) => ({
            ...state,
            isLoading: false,
            error,
          }));

          if (error.status === 401) {
            this.router.navigate(['/signin']);
            return;
          }
        },
      });
  }

  getLastOrders() {
    const user = this.authService.user();
    const token = this.authService.token();

    if (!user || !token) {
      return;
    }

    this.ordersState.update((state) => ({
      ...state,
      isLoading: true,
    }));
    this.isLastOrdersLoading.set(true);

    this.httpService
      .executeAuthGet<LastOrders>(`/orders/last-orders/${user.id}`, {}, token)
      .subscribe({
        next: (lastOrders) => {
          this.ordersState.set({
            response: lastOrders,
            isLoading: false,
            error: undefined,
          });
          this.isLastOrdersLoading.set(false);

          if (lastOrders.orders.length === 0) {
            return;
          }

          const years = Object.keys(lastOrders.ordersByDate).sort(
            (a, b) => Number(b) - Number(a)
          );
          this.yearOptions.set(
            years.map((years) => ({
              id: Number(years),
              name: years,
            }))
          );

          const monthOptions = lastOrders.ordersByDate[years[0]].sort(
            (a, b) => b - a
          );
          this.monthOptions.set(
            monthOptions.map((month) => ({
              id: month,
              name: months[month],
            }))
          );

          const lastYear = Math.max(...years.map((year) => Number(year)));
          const lastMonth = Math.max(...monthOptions);

          this.currentYearValue = [
            {
              id: lastYear,
              name: String(lastYear),
            },
          ];
          this.currentMonthValue = [
            {
              id: lastMonth,
              name: months[lastMonth],
            },
          ];
        },
        error: (error) => {
          this.ordersState.update((state) => ({
            ...state,
            isLoading: false,
            error,
          }));

          if (error.status === 401) {
            this.router.navigate(['/signin']);
            return;
          }
        },
      });
  }

  onYearValueChanged(year: DropdownData) {
    if (this.currentYearValue[0].id === year.id) {
      return;
    }

    this.ordersState.update((state) => ({
      ...state,
      isLoading: true,
    }));
    this.currentYearValue = [year];

    const monthOptions = this.ordersByDate()![year.name].sort((a, b) => b - a);
    this.monthOptions.set(
      monthOptions.map((month) => ({
        id: month,
        name: months[month],
      }))
    );

    const lastMonth = Math.max(...monthOptions);
    this.currentMonthValue = [
      {
        id: lastMonth,
        name: months[lastMonth],
      },
    ];

    this.getOrders(lastMonth, year.id);
  }

  onMonthValueChanged(month: DropdownData) {
    if (this.currentMonthValue[0].id === month.id) {
      return;
    }

    this.ordersState.update((state) => ({
      ...state,
      isLoading: true,
    }));
    this.currentMonthValue = [month];

    this.getOrders(month.id, this.currentYearValue[0].id);
  }

  resetOrders() {
    this.ordersState.set({
      response: undefined,
      isLoading: false,
      error: undefined,
    });
    this.isLastOrdersLoading.set(true);
    this.yearOptions.set([]);
    this.monthOptions.set([]);
    this.currentYearValue = [];
    this.currentMonthValue = [];
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { of, retry, switchMap, throwError, timer } from 'rxjs';
import { Order } from '../../interfaces/order.interface';
import { OrderTableComponent } from '../../components/order-table/order-table.component';

@Component({
  selector: 'app-success-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, OrderTableComponent],
  templateUrl: './success-checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessCheckoutComponent {
  orderService = inject(OrdersService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  isLoading = signal(true);
  order = signal<Order | undefined>(undefined);

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          if (params['id']) {
            return this.orderService.getOrderById(params['id']);
          }

          return of();
        }),
        switchMap((order) => {
          if (order.status === 'COMPLETED') {
            return of(order);
          }

          return throwError(() => new Error('Order not completed'));
        }),
        // Retry 3 times with a 10 seconds delay in case the order is still processing
        retry({
          count: 3,
          delay: (error, retryCount) => {
            if (error.error && error.error.statusCode === 403) {
              this.router.navigate(['/']);
              return of();
            }

            if (retryCount === 4) {
              return of();
            }

            return timer(10000);
          },
        })
      )
      .subscribe({
        next: (order) => {
          this.isLoading.set(false);
          this.order.set(order);

          console.log(order);
        },
        error: (error) => {
          if (error.message && error.message === 'Order not completed') {
            this.order.set(undefined);
          }

          this.isLoading.set(false);
        },
      });
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { DashboardNavComponent } from '../../../components/dashboard/dashboard-nav/dashboard-nav.component';
import { DropdownListboxComponent } from '../../../components/dropdown-listbox/dropdown-listbox.component';
import { OrdersService } from '../../../services/orders.service';
import { OrderTableComponent } from '../../../components/order-table/order-table.component';
import { OrderTableSkeletonComponent } from '../../../components/order-table-skeleton/order-table-skeleton.component';
import { ErrorWarningComponent } from '../../../components/error-warning/error-warning.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    DashboardNavComponent,
    OrderTableComponent,
    OrderTableSkeletonComponent,
    ErrorWarningComponent,
    FooterComponent,
    DropdownListboxComponent,
  ],
  templateUrl: './orders.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent {
  ordersService = inject(OrdersService);

  ngOnInit() {
    this.ordersService.getLastOrders();
  }

  ngOnDestroy() {
    this.ordersService.resetOrders();
  }
}

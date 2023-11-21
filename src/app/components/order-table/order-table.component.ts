import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../interfaces/order.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTableComponent {
  @Input({ required: true }) order!: Order;
}

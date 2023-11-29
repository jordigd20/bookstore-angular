import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-table-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-table-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTableSkeletonComponent {}

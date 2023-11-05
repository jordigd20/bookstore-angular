import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNavComponent {
  @Input({ required: true }) active: string = 'account';
}

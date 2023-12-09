import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-warning',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-warning.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorWarningComponent {}

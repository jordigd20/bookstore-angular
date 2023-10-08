import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-email-sent',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './email-sent.component.html',
})
export class EmailSentComponent {
  @Input({ required: true }) isLoading: boolean = false;
  @Output() resendEmailHandler = new EventEmitter<void>();
}

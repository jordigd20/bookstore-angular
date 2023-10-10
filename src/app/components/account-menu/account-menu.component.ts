import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-account-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './account-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountMenuComponent {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  @Input({ required: true }) fullName!: string;
  @Output() logout = new EventEmitter<void>();
}

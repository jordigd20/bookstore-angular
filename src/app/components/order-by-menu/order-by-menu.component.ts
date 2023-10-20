import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkMenu, CdkMenuItemRadio } from '@angular/cdk/menu';

@Component({
  selector: 'app-order-by-menu',
  standalone: true,
  imports: [CommonModule, CdkMenu, CdkMenuItemRadio],
  templateUrl: './order-by-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderByMenuComponent {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
}

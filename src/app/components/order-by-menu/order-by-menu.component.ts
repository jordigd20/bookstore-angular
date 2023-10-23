import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkMenu, CdkMenuItemRadio } from '@angular/cdk/menu';
import { BooksService } from '../../services/books.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-by-menu',
  standalone: true,
  imports: [CommonModule, CdkMenu, CdkMenuItemRadio],
  templateUrl: './order-by-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderByMenuComponent {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  bookService = inject(BooksService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  updateOrderBy(orderBy: string) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        orderBy,
      },
      queryParamsHandling: 'merge',
    });
  }
}

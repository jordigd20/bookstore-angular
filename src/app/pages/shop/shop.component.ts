import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { VerticalCardComponent } from '../../components/cards/vertical-card/vertical-card.component';
import { Book } from '../../interfaces/book.interface';
import { BooksService } from '../../services/books.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { BooksFilterComponent } from '../../components/books-filter/books-filter.component';
import { Dialog } from '@angular/cdk/dialog';
import { SideBooksFilterComponent } from '../../components/side-books-filter/side-books-filter.component';
import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { OrderByMenuComponent } from '../../components/order-by-menu/order-by-menu.component';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    VerticalCardComponent,
    PaginationComponent,
    BooksFilterComponent,
    OrderByMenuComponent,
    CdkMenuTrigger,
  ],
  templateUrl: './shop.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopComponent {
  homeService = inject(BooksService);
  breakpointObserver = inject(BreakpointObserver);
  dialog = inject(Dialog);

  books = signal<Book[]>([]);
  orderByMenuPosition = signal<ConnectionPositionPair[]>([]);

  ngOnInit() {
    this.homeService.getBooks().subscribe((books) => {
      this.books.set(books);
    });

    const isMobileScreen =
      this.breakpointObserver.isMatched('(max-width: 640px)');

    if (isMobileScreen) {
      this.orderByMenuPosition.set([
        new ConnectionPositionPair(
          { originX: 'start', originY: 'bottom' },
          { overlayX: 'start', overlayY: 'top' }
        ),
      ]);
    } else {
      this.orderByMenuPosition.set([
        new ConnectionPositionPair(
          { originX: 'end', originY: 'bottom' },
          { overlayX: 'end', overlayY: 'top' }
        ),
      ]);
    }
  }

  openFilter() {
    this.dialog.open(SideBooksFilterComponent, {
      ariaLabelledBy: 'Filter books',
      ariaDescribedBy: 'Filter books by title, price, category, etc.',
      backdropClass: ['backdrop-blur-sm', 'bg-black/5'],
      disableClose: true,
    });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { VerticalCardComponent } from '../../components/cards/vertical-card/vertical-card.component';
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
import { VerticalCardSkeletonComponent } from '../../components/cards/vertical-card-skeleton/vertical-card-skeleton.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

const BOOKS_PER_PAGE = 10;

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    VerticalCardComponent,
    VerticalCardSkeletonComponent,
    PaginationComponent,
    BooksFilterComponent,
    OrderByMenuComponent,
    CdkMenuTrigger,
    NgxPaginationModule,
  ],
  templateUrl: './shop.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopComponent {
  @ViewChild('scrollToTopElement') scrollToTopElement!: ElementRef<HTMLElement>;

  bookService = inject(BooksService);
  breakpointObserver = inject(BreakpointObserver);
  dialog = inject(Dialog);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  orderByMenuPosition = signal<ConnectionPositionPair[]>([]);
  booksPerPage = BOOKS_PER_PAGE;

  ngOnInit() {
    if (Object.keys(this.activatedRoute.snapshot.queryParams).length === 0) {
      this.bookService.resetFilters();
    }

    this.activatedRoute.queryParams.subscribe((params) => {
      const newParams = { ...params };

      if (params.hasOwnProperty('page')) {
        const page = Number(params['page']);

        if (page < 1) {
          newParams['page'] = 1;
          newParams['skip'] = 0;
        } else {
          newParams['skip'] =
            Number(params['page']) * this.booksPerPage - this.booksPerPage;
        }
      }

      this.bookService.fetchBooks(newParams);
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

  changePage(page: number) {
    this.scrollToTopElement.nativeElement.scrollIntoView({
      behavior: 'instant',
      block: 'end',
    });

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page,
      },
      queryParamsHandling: 'merge',
    });
  }
}

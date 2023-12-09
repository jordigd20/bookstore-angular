import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { DashboardNavComponent } from '../../../components/dashboard/dashboard-nav/dashboard-nav.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { RatingsService } from '../../../services/ratings.service';
import { VerticalCardComponent } from '../../../components/cards/vertical-card/vertical-card.component';
import { VerticalCardSkeletonComponent } from '../../../components/cards/vertical-card-skeleton/vertical-card-skeleton.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { Params } from '@angular/router';
import { RatingCardComponent } from '../../../components/cards/rating-card/rating-card.component';
import { ErrorWarningComponent } from '../../../components/error-warning/error-warning.component';

const BOOKS_PER_PAGE = 10;

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    DashboardNavComponent,
    VerticalCardComponent,
    RatingCardComponent,
    VerticalCardSkeletonComponent,
    ErrorWarningComponent,
    FooterComponent,
    NgxPaginationModule,
    PaginationComponent,
  ],
  templateUrl: './ratings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingsComponent {
  @ViewChild('scrollToTopElement') scrollToTopElement!: ElementRef<HTMLElement>;

  ratingsService = inject(RatingsService);

  booksPerPage = BOOKS_PER_PAGE;
  tabSelected = signal<'not-rated' | 'rated'>('not-rated');

  ngOnInit() {
    const initPage = 1;
    const pageParams: Params = {
      skip: initPage * this.booksPerPage - this.booksPerPage,
    };

    this.ratingsService.getNoRatedBooks(initPage, pageParams);
  }

  onTabSelected(tab: 'not-rated' | 'rated') {
    if (tab === 'rated') {
      const page = this.ratingsService.ratedCurrentPage() || 1;
      const pageParams: Params = {
        skip: page * this.booksPerPage - this.booksPerPage,
      };

      this.ratingsService.getRatedBooks(page, pageParams);
    }

    this.tabSelected.set(tab);
  }

  changePage(page: number, pageType: 'not-rated-page' | 'rated-page') {
    this.scrollToTopElement.nativeElement.scrollIntoView({
      behavior: 'instant',
      block: 'end',
    });

    if (pageType === 'not-rated-page') {
      this.ratingsService.getNoRatedBooks(page, {
        skip: page * this.booksPerPage - this.booksPerPage,
      });
    } else {
      this.ratingsService.getRatedBooks(page, {
        skip: page * this.booksPerPage - this.booksPerPage,
      });
    }
  }
}

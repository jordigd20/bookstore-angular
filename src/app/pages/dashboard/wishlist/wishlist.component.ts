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
import { FooterComponent } from '../../../components/footer/footer.component';
import { DashboardNavComponent } from '../../../components/dashboard/dashboard-nav/dashboard-nav.component';
import { VerticalCardComponent } from '../../../components/cards/vertical-card/vertical-card.component';
import { VerticalCardSkeletonComponent } from '../../../components/cards/vertical-card-skeleton/vertical-card-skeleton.component';
import { UserService } from '../../../services/user.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

const BOOKS_PER_PAGE = 10;

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    DashboardNavComponent,
    VerticalCardComponent,
    VerticalCardSkeletonComponent,
    FooterComponent,
    NgxPaginationModule,
    PaginationComponent,
  ],
  templateUrl: './wishlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistComponent {
  @ViewChild('scrollToTopElement') scrollToTopElement!: ElementRef<HTMLElement>;

  userService = inject(UserService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  booksPerPage = BOOKS_PER_PAGE;
  currentPage = signal(1);

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const pageParams: Params = {};

      if (params.hasOwnProperty('page')) {
        const page = Number(params['page']);

        if (page < 1) {
          pageParams['page'] = 1;
          pageParams['skip'] = 0;
        } else {
          pageParams['skip'] =
            Number(params['page']) * this.booksPerPage - this.booksPerPage;
        }
      }

      this.currentPage.set(Number(params['page']) || 1);
      this.userService.getUserWishlist(pageParams);
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

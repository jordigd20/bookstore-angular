import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { VerticalCardComponent } from '../../components/cards/vertical-card/vertical-card.component';
import { HorizontalCardComponent } from '../../components/cards/horizontal-card/horizontal-card.component';
import { HomeSectionComponent } from '../../components/home-section/home-section.component';
import { HomeService } from '../../services/home.service';
import { Subject, forkJoin, of, retry, takeUntil, timer } from 'rxjs';
import { Book } from '../../interfaces/book.interface';
import { VerticalCardSkeletonComponent } from '../../components/cards/vertical-card-skeleton/vertical-card-skeleton.component';
import { ErrorWarningComponent } from '../../components/error-warning/error-warning.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
    HomeSectionComponent,
    VerticalCardComponent,
    VerticalCardSkeletonComponent,
    HorizontalCardComponent,
    ErrorWarningComponent
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  homeService = inject(HomeService);

  categories = [
    {
      name: 'Science Fiction',
      slug: 'science-fiction',
      image: 'science-fiction.webp',
      link: '/shop',
    },
    {
      name: 'Mistery & Thrillers',
      slug: 'mistery-thrillers',
      image: 'mistery-thrillers.webp',
      link: '/shop',
    },
    {
      name: 'Romance',
      slug: 'romance',
      image: 'romance.webp',
      link: '/shop',
    },
    {
      name: 'Fantasy',
      slug: 'fantasy',
      image: 'fantasy.webp',
      link: '/shop',
    },
  ];

  isLoading = signal(false);
  errorHappened = signal(false);
  destroy$ = new Subject<void>();

  bestRatedBooks = signal<Book[]>([]);
  bestsellerBooks = signal<Book[]>([]);
  onSaleBooks = signal<Book[]>([]);

  ngOnInit() {
    this.isLoading.set(true);

    forkJoin([
      this.homeService.getBestRatedBooks(),
      this.homeService.getBestsellerBooks(),
      this.homeService.getOnSaleBooks(),
    ])
      .pipe(
        retry({
          count: 3,
          delay: (error, retryCount) => {
            if (retryCount === 4) {
              return of();
            }

            return timer(5000);
          },
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ([bestRatedBooks, bestsellerBooks, onSaleBooks]) => {
          this.isLoading.set(false);
          this.bestRatedBooks.set(bestRatedBooks);
          this.bestsellerBooks.set(bestsellerBooks);
          this.onSaleBooks.set(onSaleBooks);
        },
        error: (error) => {
          console.error(error);
          this.errorHappened.set(true);
          this.isLoading.set(false);
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

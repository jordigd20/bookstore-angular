import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { VerticalCardComponent } from '../../components/cards/vertical-card/vertical-card.component';
import { HorizontalCardComponent } from '../../components/cards/horizontal-card/horizontal-card.component';
import { HomeSectionComponent } from '../../components/home-section/home-section.component';
import { HomeService } from '../../services/home.service';
import { forkJoin } from 'rxjs';
import { Book } from '../../interfaces/book.interface';

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
    HorizontalCardComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  homeService = inject(HomeService);

  categories = [
    {
      name: 'Science Fiction',
      image: 'science-fiction.webp',
      link: '/science-fiction',
    },
    {
      name: 'Mistery & Thrillers',
      image: 'mistery-thrillers.webp',
      link: '/mistery-thrillers',
    },
    {
      name: 'Romance',
      image: 'romance.webp',
      link: '/romance',
    },
    {
      name: 'Fantasy',
      image: 'fantasy.webp',
      link: '/fantasy',
    },
  ];

  bestRatedBooks = signal<Book[]>([]);
  bestsellerBooks = signal<Book[]>([]);
  onSaleBooks = signal<Book[]>([]);

  ngOnInit() {
    forkJoin([
      this.homeService.getBestRatedBooks(),
      this.homeService.getBestsellerBooks(),
      this.homeService.getOnSaleBooks(),
    ]).subscribe(([bestRatedBooks, bestsellerBooks, onSaleBooks]) => {
      this.bestRatedBooks.set(bestRatedBooks);
      this.bestsellerBooks.set(bestsellerBooks);
      this.onSaleBooks.set(onSaleBooks);
    });
  }
}

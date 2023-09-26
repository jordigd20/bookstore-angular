import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { VerticalCardComponent } from '../../components/cards/vertical-card/vertical-card.component';
import { HorizontalCardComponent } from '../../components/cards/horizontal-card/horizontal-card.component';
import { HomeSectionComponent } from '../../components/home-section/home-section.component';

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
      name: 'Fiction & Literature',
      image: 'fiction-literature.webp',
      link: '/fiction-literature',
    },
  ];
}

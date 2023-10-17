import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Book } from '../../../interfaces/book.interface';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-vertical-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vertical-card.component.html',
})
export class VerticalCardComponent {
  @ViewChild('categoryTag') categoryTag!: ElementRef<HTMLDivElement>;

  @Input({ required: true }) book!: Book;

  cartService = inject(CartService);
  isLoading = signal(false);

  animateHover(type: string) {
    if (type === 'enter') {
      this.categoryTag.nativeElement.setAttribute('data-state', 'active');
    }

    if (type === 'leave') {
      this.categoryTag.nativeElement.setAttribute('data-state', 'inactive');
    }
  }

  async addToCart(idBook: number) {
    this.isLoading.set(true);
    await this.cartService.addToCart(idBook);
    this.isLoading.set(false);
  }
}

import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Book } from '../../../interfaces/book.interface';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-horizontal-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './horizontal-card.component.html',
})
export class HorizontalCardComponent {
  @Input({ required: true }) book!: Book;

  cartService = inject(CartService);

  isLoading = signal(false);

  async addToCart(idBook: number) {
    this.isLoading.set(true);
    await this.cartService.addToCart(idBook);
    this.isLoading.set(false);
  }
}

import {
  ChangeDetectionStrategy,
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
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-vertical-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vertical-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalCardComponent {
  @ViewChild('categoryTag') categoryTag!: ElementRef<HTMLDivElement>;

  @Input({ required: true }) book!: Book;
  @Input({ required: true }) isWishlisted!: boolean;

  cartService = inject(CartService);
  userService = inject(UserService);
  isLoadingCart = signal(false);
  isLoadingWishlist = signal(false);

  animateHover(type: string) {
    if (this.book.categories) {
      if (type === 'enter') {
        this.categoryTag.nativeElement.setAttribute('data-state', 'active');
      }

      if (type === 'leave') {
        this.categoryTag.nativeElement.setAttribute('data-state', 'inactive');
      }
    }
  }

  async addToCart(idBook: number) {
    this.isLoadingCart.set(true);
    await this.cartService.addToCart(idBook);
    this.isLoadingCart.set(false);
  }

  async removeFromWishlist(idBook: number) {
    this.isLoadingWishlist.set(true);
    await this.userService.removeBookFromWishlist(idBook);
    this.isLoadingWishlist.set(false);
  }
}

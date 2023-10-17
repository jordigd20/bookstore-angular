import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartBook } from '../../../interfaces/cart.interface';
import { CartService } from '../../../services/cart.service';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './cart-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent implements OnInit {
  @ViewChild('quantityInput') quantityInput!: ElementRef<HTMLInputElement>;

  @Input({ required: true }) cartBook!: CartBook;

  cartService = inject(CartService);

  quantityControl = new FormControl(1, [
    Validators.required,
    Validators.min(1),
    Validators.pattern('^[0-9]*$'),
  ]);
  debounceTimer: NodeJS.Timeout | undefined;
  isLoading = signal(false);

  ngOnInit() {
    this.quantityControl.setValue(this.cartBook.quantity);
  }

  validateQuantity(event: KeyboardEvent) {
    const allowedCharacters = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
    ];

    if (!allowedCharacters.includes(event.key)) {
      event.preventDefault();
    }
  }

  inputHandler(event: any) {
    console.log(this.quantityControl.valid);
    if (this.quantityControl.invalid) return;

    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(async () => {
      const quantity = Number(this.quantityInput.nativeElement.value);
      this.debounceTimer = undefined;

      this.isLoading.set(true);
      await this.cartService.updateQuantity(this.cartBook.book.id, quantity);
      this.isLoading.set(false);
    }, 1000);
  }

  async addOne() {
    const quantity = Number(this.quantityInput.nativeElement.value) + 1;
    this.quantityInput.nativeElement.value = String(quantity);
    this.isLoading.set(true);
    await this.cartService.updateQuantity(this.cartBook.book.id, quantity);
    this.isLoading.set(false);
  }

  async subtractOne() {
    if (Number(this.quantityInput.nativeElement.value) <= 1) return;

    const quantity = Number(this.quantityInput.nativeElement.value) - 1;
    this.quantityInput.nativeElement.value = String(quantity);
    this.isLoading.set(true);
    await this.cartService.updateQuantity(this.cartBook.book.id, quantity);
    this.isLoading.set(false);
  }

  async removeBook() {
    this.isLoading.set(true);
    await this.cartService.removeBook(this.cartBook.book.id);
    this.isLoading.set(false);
  }
}

import { Injectable, computed, signal } from '@angular/core';
import { CartState } from '../interfaces/cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartState = signal<CartState>({
    id: null,
    cart: [],
  });

  cartId = computed(() => this.cartState().id);
  cart = computed(() => this.cartState().cart);

  constructor() {}


}

import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CartResponse, CartState } from '../interfaces/cart.interface';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { tap } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { SideCartComponent } from '../components/side-cart/cart/side-cart.component';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private httpService = inject(HttpService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private dialog = inject(Dialog);

  cartState = signal<CartState>({
    id: null,
    total: 0,
    cart: [],
  });

  cartId = computed(() => this.cartState().id);
  total = computed(() => this.cartState().total);
  cart = computed(() => this.cartState().cart);

  constructor() {
    effect(
      () => {
        const user = this.authService.user();
        const token = this.authService.token();

        if (user !== null && token !== null) {
          this.getUserCart(user.cart, token).subscribe();
        } else {
          this.resetCart();
        }
      },
      { allowSignalWrites: true }
    );
  }

  getUserCart(idCart: number, token: string) {
    return this.httpService
      .executeAuthGet<CartResponse>(`/carts/${idCart}`, {}, token)
      .pipe(
        tap((response) => {
          this.cartState.update((state) => ({
            ...state,
            id: idCart,
            total: Number(response.total),
            cart: response.cart.map((cart) => ({
              quantity: cart.quantity,
              book: cart.book,
            })),
          }));
        })
      );
  }

  resetCart() {
    this.cartState.update((state) => ({
      ...state,
      id: null,
      cart: [],
    }));
  }

  addToCart(idBook: number) {
    return new Promise<boolean>((resolve) => {
      const user = this.authService.user();
      const token = this.authService.token();

      if (user !== null && token !== null) {
        this.httpService
          .executeAuthPost<CartResponse>(
            `/carts/${user.cart}`,
            {
              books: [
                {
                  bookId: idBook,
                  quantity: 1,
                },
              ],
            },
            token
          )
          .subscribe({
            next: (response) => {
              this.cartState.update((state) => ({
                ...state,
                total: Number(response.total),
                cart: response.cart.map((cart) => ({
                  quantity: cart.quantity,
                  book: cart.book,
                })),
              }));

              this.toastService.showSuccessToast('Book added to cart');

              resolve(true);
            },
            error: (error) => {
              console.error(error);
              this.toastService.showErrorToast(
                'You already have this book in your cart'
              );
              resolve(false);
            },
          });
      } else {
        this.openCart();
        resolve(false);
      }
    });
  }

  updateQuantity(idBook: number, quantity: number) {
    return new Promise<boolean>((resolve) => {
      const user = this.authService.user();
      const token = this.authService.token();

      if (user !== null && token !== null) {
        this.httpService
          .executeAuthPatch<CartResponse>(
            `/carts/${user.cart}/books/${idBook}`,
            {
              quantity,
            },
            token
          )
          .subscribe({
            next: (response) => {
              console.log(response);
              this.cartState.update((state) => ({
                ...state,
                total: Number(response.total),
                cart: response.cart.map((cart) => ({
                  quantity: cart.quantity,
                  book: cart.book,
                })),
              }));

              resolve(true);
            },
            error: (error) => {
              console.error(error);
              this.toastService.showErrorToast(
                'An error ocurred while updating the book in the cart'
              );
              resolve(false);
            },
          });
      } else {
        resolve(false);
      }
    });
  }

  removeBook(idBook: number) {
    return new Promise<boolean>((resolve) => {
      const user = this.authService.user();
      const token = this.authService.token();

      if (user !== null && token !== null) {
        this.httpService
          .executeAuthDelete<CartResponse>(
            `/carts/${user.cart}/books/${idBook}`,
            token
          )
          .subscribe({
            next: (response) => {
              this.cartState.update((state) => ({
                ...state,
                total: Number(response.total),
                cart: response.cart.map((cart) => ({
                  quantity: cart.quantity,
                  book: cart.book,
                })),
              }));

              resolve(true);
            },
            error: (error) => {
              console.error(error);
              this.toastService.showErrorToast(
                'An error ocurred while removing the book'
              );
              resolve(false);
            },
          });
      } else {
        resolve(false);
      }
    });
  }

  openCart() {
    this.dialog.open(SideCartComponent, {
      ariaLabelledBy: 'Shopping cart',
      ariaDescribedBy: 'Shopping cart',
      backdropClass: ['backdrop-blur-sm', 'bg-black/5'],
      disableClose: true,
    });
  }
}

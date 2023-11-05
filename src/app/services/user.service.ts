import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { Address, CreateAddress, User } from '../interfaces/user.interface';
import { ToastService } from './toast.service';
import { map } from 'rxjs';
import { BookPaginatedResponse } from '../interfaces/book.interface';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authService = inject(AuthService);
  private httpService = inject(HttpService);
  private toastService = inject(ToastService);

  private userWishlist = signal<{
    response: BookPaginatedResponse | undefined;
    isLoading: boolean;
  }>({
    response: undefined,
    isLoading: false,
  });
  userAddresses = signal<Address[]>([]);

  wishlistedBooks = computed(() => this.userWishlist().response?.data);
  pagination = computed(() => this.userWishlist().response?.pagination);
  isLoading = computed(() => this.userWishlist().isLoading);

  constructor() {}

  getUserAddresses(idUser: number) {
    const user = this.authService.user();
    const token = this.authService.token();

    if (!user || !token) {
      return;
    }

    this.httpService
      .executeAuthGet<Address[]>(`/addresses/${idUser}`, {}, token)
      .subscribe({
        next: (response) => {
          this.userAddresses.set(response);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  updateUser(firstName: string, lastName: string) {
    return new Promise<boolean>((resolve) => {
      const user = this.authService.user();
      const token = this.authService.token();

      if (!user || !token) {
        resolve(false);
        return;
      }

      this.httpService
        .executeAuthPatch<User>(
          `/users/profile/${user.id}`,
          { firstName, lastName },
          token
        )
        .subscribe({
          next: (response) => {
            this.authService.updateUser(response);
            this.toastService.showSuccessToast('Profile updated successfully');
            resolve(true);
          },
          error: (error) => {
            this.toastService.showErrorToast(
              'An error ocurred while updating the profile'
            );
            resolve(false);
          },
        });
    });
  }

  updatePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    return new Promise<boolean>((resolve) => {
      const user = this.authService.user();
      const token = this.authService.token();

      if (!user || !token) {
        resolve(false);
        return;
      }

      this.httpService
        .executeAuthPatch<{ message: string; ok: boolean }>(
          `/users/password/${user.id}`,
          { currentPassword, newPassword, confirmPassword },
          token
        )
        .subscribe({
          next: (response) => {
            this.toastService.showSuccessToast('Password updated successfully');
            resolve(true);
          },
          error: (error) => {
            if (error.status === 400) {
              this.toastService.showErrorToast(error.error.message);
              resolve(false);
              return;
            }

            this.toastService.showErrorToast(
              'An error ocurred while updating the password'
            );
            resolve(false);
          },
        });
    });
  }

  createAddress(address: CreateAddress) {
    return new Promise<boolean>((resolve) => {
      const user = this.authService.user();
      const token = this.authService.token();

      if (!user || !token) {
        resolve(false);
        return;
      }

      this.httpService
        .executeAuthPost<Address>(`/addresses/${user.id}`, address, token)
        .subscribe({
          next: (response) => {
            this.userAddresses.update((addresses) => [...addresses, response]);
            this.toastService.showSuccessToast('Address created successfully');
            resolve(true);
          },
          error: (error) => {
            console.log(error);
            if (error.error.statusCode === 400) {
              const errorMessage = error.error.message[0];
              const message =
                errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);

              this.toastService.showErrorToast(message);
              resolve(false);
              return;
            }

            this.toastService.showErrorToast(
              'An error ocurred while creating the address'
            );
            resolve(false);
          },
        });
    });
  }

  updateAddress(idAddress: number, address: CreateAddress) {
    return new Promise<boolean>((resolve) => {
      const user = this.authService.user();
      const token = this.authService.token();

      if (!user || !token) {
        resolve(false);
        return;
      }

      this.httpService
        .executeAuthPatch<Address>(`/addresses/${idAddress}`, address, token)
        .subscribe({
          next: (response) => {
            this.userAddresses.update((addresses) => {
              const addressIndex = addresses.findIndex(
                (address) => address.id === idAddress
              );

              if (addressIndex === -1) {
                return addresses;
              }

              addresses[addressIndex] = response;
              return addresses;
            });

            this.toastService.showSuccessToast('Address updated successfully');
            resolve(true);
          },
          error: (error) => {
            console.log(error);
            if (error.error.statusCode === 400) {
              const errorMessage = error.error.message[0];
              const message =
                errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);

              this.toastService.showErrorToast(message);
              resolve(false);
              return;
            }

            this.toastService.showErrorToast(
              'An error ocurred while updating the address'
            );
            resolve(false);
          },
        });
    });
  }

  deleteAddress(idAddress: number) {
    return new Promise<boolean>((resolve) => {
      const user = this.authService.user();
      const token = this.authService.token();

      if (!user || !token) {
        resolve(false);
        return;
      }

      this.httpService
        .executeAuthDelete(`/addresses/${idAddress}`, {}, token)
        .subscribe({
          next: (response) => {
            this.userAddresses.update((addresses) =>
              addresses.filter((address) => address.id !== idAddress)
            );
            this.toastService.showSuccessToast('Address deleted successfully');
            resolve(true);
          },
          error: (error) => {
            this.toastService.showErrorToast(
              'An error ocurred while deleting the address'
            );
            resolve(false);
          },
        });
    });
  }

  getUserWishlist(pageParams: Params) {
    const user = this.authService.user();
    const token = this.authService.token();

    if (!user || !token) {
      return;
    }

    this.userWishlist.update((state) => ({ ...state, isLoading: true }));

    this.httpService
      .executeAuthGet<BookPaginatedResponse>(
        `/users/${user.id}/wishlist/`,
        pageParams,
        token
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          this.userWishlist.set({ response, isLoading: false });
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  addBookToWishlist(bookId: number) {
    const user = this.authService.user();
    const token = this.authService.token();

    if (user === null || token === null) {
      this.toastService.showWarningToast(
        'You must be logged in to add a book to your wishlist.'
      );
      return;
    }

    this.httpService
      .executeAuthPost(
        `/users/${user.id}/wishlist`,
        {
          bookIds: [bookId],
        },
        token
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          this.toastService.showSuccessToast('Book added to your wishlist');
        },
        error: (err) => {
          console.error(err);
          this.toastService.showWarningToast(
            'You already have this book in your wishlist'
          );
        },
      });
  }

  removeBookFromWishlist(bookId: number) {
    const user = this.authService.user();
    const token = this.authService.token();

    if (!user || !token) {
      return;
    }

    this.httpService
      .executeAuthDelete<BookPaginatedResponse>(
        `/users/${user.id}/wishlist/`,
        {
          bookIds: [bookId],
          skip: this.pagination()!.skip,
          take: this.pagination()!.take,
        },
        token
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          this.userWishlist.update((state) => ({
            ...state,
            response,
          }));
        },
        error: (error) => {
          this.toastService.showErrorToast(
            'An error ocurred while removing the book from your wishlist'
          );
          console.error(error);
        },
      });
  }

  getCountries() {
    return this.httpService
      .getCountries<
        {
          name: string;
          dial_code: string;
          code: string;
        }[]
      >(
        'https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json'
      )
      .pipe(
        map((response) => {
          return response.map((country) => {
            return {
              name: country.name,
              dialCode: country.dial_code,
              code: country.code,
            };
          });
        })
      );
  }
}

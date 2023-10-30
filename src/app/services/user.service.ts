import { Injectable, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { Address, CreateAddress, User } from '../interfaces/user.interface';
import { ToastService } from './toast.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authService = inject(AuthService);
  private httpService = inject(HttpService);
  private toastService = inject(ToastService);

  userAddresses = signal<Address[]>([]);

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
        .executeAuthDelete(`/addresses/${idAddress}`, token)
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

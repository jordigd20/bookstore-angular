import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { User } from '../interfaces/user.interface';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authService = inject(AuthService);
  private httpService = inject(HttpService);
  private toastService = inject(ToastService);

  constructor() {}

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
        .executeAuthPatch<User>(
          `/users/password/${user.id}`,
          { currentPassword, newPassword, confirmPassword },
          token
        )
        .subscribe({
          next: (response) => {
            console.log(response);
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
}

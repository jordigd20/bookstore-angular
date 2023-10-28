import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { User } from '../interfaces/user.interface';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authService = inject(AuthService);
  private httpService = inject(HttpService);
  private toast = inject(ToastrService);

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
            resolve(true);
          },
          error: (error) => {
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
            this.showSuccessToast('Password updated successfully');
            resolve(true);
          },
          error: (error) => {
            if (error.status === 400) {
              this.showErrorToast(error.error.message);
              resolve(false);
              return;
            }

            this.showErrorToast('An error ocurred while updating the password');
            resolve(false);
          },
        });
    });
  }

  showErrorToast(message: string) {
    this.toast.error(message, '', {
      toastClass:
        'relative overflow-hidden w-80 bg-background text-foreground text-sm font-medium border border-border rounded-md shadow p-4 pl-12 m-3 bg-no-repeat bg-[length:24px] bg-[15px_center] pointer-events-auto',
      positionClass: 'toast-bottom-right',
      tapToDismiss: false,
    });
  }

  showSuccessToast(message: string) {
    this.toast.success(message, '', {
      toastClass:
        'relative overflow-hidden w-80 bg-background text-foreground text-sm font-medium border border-border rounded-md shadow p-4 pl-12 m-3 bg-no-repeat bg-[length:24px] bg-[15px_center] pointer-events-auto',
      positionClass: 'toast-bottom-right',
      tapToDismiss: false,
    });
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { DashboardNavComponent } from '../../../components/dashboard/dashboard-nav/dashboard-nav.component';
import { Dialog } from '@angular/cdk/dialog';
import { AccountFormComponent } from '../../../components/dashboard/account-form/account-form.component';
import { AuthService } from '../../../services/auth.service';
import { ChangePasswordFormComponent } from '../../../components/dashboard/change-password-form/change-password-form.component';
import { UserService } from '../../../services/user.service';
import { Address } from '../../../interfaces/user.interface';
import { AddressFormComponent } from '../../../components/dashboard/address-form/address-form.component';
import { ConfirmationModalComponent } from 'src/app/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    DashboardNavComponent,
  ],
  templateUrl: './account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {
  dialog = inject(Dialog);
  authService = inject(AuthService);
  userService = inject(UserService);

  async ngOnInit() {
    await this.userService.getUserAddresses();
  }

  openAccountDialog() {
    this.dialog.open(AccountFormComponent, {
      ariaLabelledBy: 'Edit account details',
      ariaDescribedBy: 'Edit account details',
      backdropClass: ['backdrop-blur-sm', 'bg-black/5'],
      disableClose: true,
    });
  }

  openChangePasswordDialog() {
    this.dialog.open(ChangePasswordFormComponent, {
      ariaLabelledBy: 'Change password form',
      ariaDescribedBy: 'Change password form',
      backdropClass: ['backdrop-blur-sm', 'bg-black/5'],
      disableClose: true,
      data: {},
    });
  }

  openDeleteConfirmationModal(idAddress: number) {
    this.dialog.open(ConfirmationModalComponent, {
      ariaLabelledBy: 'Confirm to delete the address',
      ariaDescribedBy: 'Confirm to delete the address',
      backdropClass: ['backdrop-blur-sm', 'bg-black/5'],
      disableClose: true,
      data: {
        title: 'Delete address',
        message: 'Are you sure you want to delete this address?',
        confirmText: 'Delete',
        isDestructive: true,
        confirmHandler: () => this.userService.deleteAddress(idAddress),
      },
    });
  }

  modifyAddress(address: Address) {
    this.dialog.open(AddressFormComponent, {
      ariaLabelledBy: 'Edit address',
      ariaDescribedBy: 'Edit address',
      backdropClass: ['backdrop-blur-sm', 'bg-black/5'],
      disableClose: true,
      data: {
        address,
        type: 'edit',
      },
    });
  }

  createAddress() {
    this.dialog.open(AddressFormComponent, {
      ariaLabelledBy: 'Create new address',
      ariaDescribedBy: 'Create new address',
      backdropClass: ['backdrop-blur-sm', 'bg-black/5'],
      disableClose: true,
      data: {
        type: 'create',
      },
    });
  }
}

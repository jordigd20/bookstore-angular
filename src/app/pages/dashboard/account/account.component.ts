import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { DashboardNavComponent } from '../../../components/dashboard/dashboard-nav/dashboard-nav.component';
import { Dialog } from '@angular/cdk/dialog';
import { AccountFormComponent } from '../../../components/dashboard/account-form/account-form.component';
import { AuthService } from '../../../services/auth.service';
import { ChangePasswordFormComponent } from '../../../components/dashboard/change-password-form/change-password-form.component';

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

  openAccountDialog() {
    this.dialog.open(AccountFormComponent, {
      ariaLabelledBy: 'Update account details',
      ariaDescribedBy: 'Update account details',
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
    });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthBackgroundComponent } from '../../../components/auth/auth-background/auth-background.component';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { PasswordFormComponent } from '../../../components/auth/password-form/password-form.component';
import { Subject } from 'rxjs';
import { EmailSentComponent } from '../../../components/auth/email-sent/email-sent.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AuthBackgroundComponent,
    PasswordFormComponent,
    EmailSentComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  toastService = inject(ToastService);

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  focusInput = new Subject<string>();
  isLoading = signal(false);
  emailSent = signal(false);

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  async onSubmit() {
    if (this.email?.invalid) {
      this.focusInput.next('email');
      return;
    }

    this.isLoading.set(true);
    const isEmailSent = await this.authService.handleForgotPassword(
      this.email?.value as string
    );

    if (isEmailSent) {
      this.emailSent.set(true);
      console.log('Email sent');
    }

    this.isLoading.set(false);
  }

  async resendEmail() {
    if (this.email?.invalid) {
      this.toastService.showErrorToast(
        'Something went wrong. Please try again.'
      );
      return;
    }

    this.isLoading.set(true);
    await this.authService.handleForgotPassword(this.email?.value as string);
    this.isLoading.set(false);
  }
}

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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ForgotPasswordFormComponent } from '../../../components/auth/forgot-password-form/forgot-password-form.component';
import { Subject } from 'rxjs';
import { EmailSentComponent } from '../../../components/auth/email-sent/email-sent.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AuthBackgroundComponent,
    ReactiveFormsModule,
    ForgotPasswordFormComponent,
    EmailSentComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;

  fb = inject(FormBuilder);
  authService = inject(AuthService);

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  focusInput = new Subject<void>();
  isLoading = signal(false);
  emailSent = signal(false);

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  async onSubmit() {
    if (this.email?.invalid) {
      this.focusInput.next();
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
      this.authService.showToast('Something went wrong. Please try again.');
      return;
    }

    this.isLoading.set(true);
    await this.authService.handleForgotPassword(this.email?.value as string);
    this.isLoading.set(false);
  }
}

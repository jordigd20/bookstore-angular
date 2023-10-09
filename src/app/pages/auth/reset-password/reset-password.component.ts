import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthBackgroundComponent } from '../../../components/auth/auth-background/auth-background.component';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { PasswordFormComponent } from '../../../components/auth/password-form/password-form.component';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, AuthBackgroundComponent, PasswordFormComponent],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  activeRoute = inject(ActivatedRoute);
  router = inject(Router);

  resetPasswordForm = this.fb.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50),
          Validators.pattern(
            /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
          ),
        ],
      ],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: this.authService.matchPasswords(
        'password',
        'confirmPassword'
      ),
    }
  );
  submitted = false;
  isLoading = signal(false);
  focusInput = new Subject<string>();
  token = '';

  ngOnInit() {
    this.token = this.activeRoute.snapshot.queryParams['token'];
  }

  async onSubmit() {
    if (this.resetPasswordForm.get('password')?.invalid) {
      this.focusInput.next('password');
      return;
    }

    if (this.resetPasswordForm.get('confirmPassword')?.invalid) {
      this.focusInput.next('confirmPassword');
      return;
    }

    this.isLoading.set(true);

    const isSuccesfull = await this.authService.handleResetPassword(
      this.resetPasswordForm.get('password')?.value as string,
      this.resetPasswordForm.get('confirmPassword')?.value as string,
      this.token
    );

    if (isSuccesfull) {
      this.router.navigateByUrl('/signin');
    }

    this.isLoading.set(false);
  }
}

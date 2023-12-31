import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AuthBackgroundComponent } from '../../../components/auth/auth-background/auth-background.component';
import { AuthFormComponent } from '../../../components/auth/auth-form/auth-form.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    AuthBackgroundComponent,
    AuthFormComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './signin.component.html',
})
export class SigninComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  signinForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
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
  });

  isLoading = signal(false);
  focusInput = new Subject<string>();

  async onSubmit() {
    if (this.signinForm.get('email')?.invalid) {
      this.focusInput.next('email');
      return;
    }

    if (this.signinForm.get('password')?.invalid) {
      this.focusInput.next('password');
      return;
    }

    this.isLoading.set(true);
    const { email, password } = this.signinForm.value;
    const isLoggedIn = await this.authService.handleSignin({
      email: email as string,
      password: password as string,
    });

    if (isLoggedIn) {
      this.router.navigateByUrl('/');
    }

    this.isLoading.set(false);
  }
}

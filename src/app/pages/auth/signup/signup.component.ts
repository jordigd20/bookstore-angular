import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthBackgroundComponent } from 'src/app/components/auth/auth-background/auth-background.component';
import { AuthService } from '../../../services/auth.service';
import { AuthFormComponent } from '../../../components/auth/auth-form/auth-form.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    AuthBackgroundComponent,
    AuthFormComponent,
  ],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  signupForm = this.fb.group({
    firstName: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(25)],
    ],
    lastName: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
    ],
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
    if (this.signupForm.get('firstName')?.invalid) {
      this.focusInput.next('firstName');
      return;
    }

    if (this.signupForm.get('lastName')?.invalid) {
      this.focusInput.next('lastName');
      return;
    }

    if (this.signupForm.get('email')?.invalid) {
      this.focusInput.next('email');
      return;
    }

    if (this.signupForm.get('password')?.invalid) {
      this.focusInput.next('password');
      return;
    }

    this.isLoading.set(true);
    const { firstName, lastName, email, password } = this.signupForm.value;
    const isLoggedIn = await this.authService.handleSignup({
      firstName: firstName as string,
      lastName: lastName as string,
      email: email as string,
      password: password as string,
    });

    if (isLoggedIn) {
      this.router.navigateByUrl('/signin');
    }

    this.isLoading.set(false);
  }
}

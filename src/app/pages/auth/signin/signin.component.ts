import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './signin.component.html',
})
export class SigninComponent {
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;

  fb = inject(FormBuilder);

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
  submitted = false;
  passwordErrors: { [key: string]: string } = {
    required: 'Password must be at least 6 characters',
    minlength: 'Password must be at least 6 characters',
    maxlength: 'Password must be less than 50 characters',
    pattern:
      'Password must have at least 6 characters, one uppercase, one lowercase, and one number',
  };
  currentPasswordError = this.passwordErrors['required'];

  get email() {
    return this.signinForm.get('email');
  }

  get password() {
    return this.signinForm.get('password');
  }

  onSubmit() {
    this.submitted = true;

    if (this.email?.invalid) {
      this.emailInput.nativeElement.focus();
      return;
    }

    if (this.password?.invalid) {
      this.passwordInput.nativeElement.focus();

      const errors = this.signinForm.controls.password.errors;

      if (errors) {
        const firstKey = Object.keys(errors)[0];
        this.currentPasswordError = this.passwordErrors[firstKey];
      }

      return;
    }

    console.log(this.signinForm.value);
  }

  onPasswordChange() {
    const errors = this.signinForm.controls.password.errors;

    if (this.password?.invalid && errors) {
      const firstKey = Object.keys(errors)[0];
      this.currentPasswordError = this.passwordErrors[firstKey];
    }
  }
}

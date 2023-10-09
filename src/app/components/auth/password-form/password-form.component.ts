import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-password-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './password-form.component.html',
})
export class PasswordFormComponent {
  @ViewChildren('formInput') formInputs!: QueryList<
    ElementRef<HTMLInputElement>
  >;

  @Input() formType: 'forgotPassword' | 'resetPassword' = 'forgotPassword';
  @Input() forgotPasswordForm!: FormGroup<{
    email: FormControl<string | null>;
  }>;
  @Input() resetPasswordForm!: FormGroup<{
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
  }>;
  @Input({ required: true }) isLoading: boolean = false;
  @Input({ required: true }) focusInput$!: Observable<string>;
  @Output() submitHandler = new EventEmitter<void>();

  authService = inject(AuthService);

  passwordErrors: { [key: string]: string } = {
    required: 'Password must be at least 6 characters',
    minlength: 'Password must be at least 6 characters',
    maxlength: 'Password must be less than 50 characters',
    pattern:
      'Password must have at least 6 characters, one uppercase, one lowercase, and one number',
  };
  currentPasswordError = this.passwordErrors['required'];
  submitted = false;
  destroy$ = new Subject<void>();

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  get password() {
    return this.resetPasswordForm.get('password');
  }

  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }

  ngOnInit() {
    this.focusInput$
      .pipe(takeUntil(this.destroy$))
      .subscribe((inputToFocus) => {
        if (inputToFocus !== '') {
          const input = this.formInputs.find(
            (input) => input.nativeElement.name === inputToFocus
          );

          if (input) {
            input.nativeElement.focus();
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    this.submitted = true;
    this.submitHandler.emit();
  }

  onPasswordChange() {
    const errors = this.resetPasswordForm.controls.password.errors;

    if (this.password?.invalid && errors) {
      const firstKey = Object.keys(errors)[0];
      this.currentPasswordError = this.passwordErrors[firstKey];
    }
  }
}

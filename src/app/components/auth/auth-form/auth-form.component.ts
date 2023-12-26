import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { GoogleSigninResponse } from '../../../interfaces/auth.interface';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './auth-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('googleContainer') googleContainer!: ElementRef<HTMLDivElement>;
  @ViewChildren('formInput') formInputs!: QueryList<
    ElementRef<HTMLInputElement>
  >;

  @Input() formType: 'signin' | 'signup' = 'signin';
  @Input() signupForm!: FormGroup<{
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;
  @Input() signinForm!: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;
  @Input({ required: true }) isLoading: boolean = false;
  @Input({ required: true }) focusInput$!: Observable<string>;
  @Output() submitHandler = new EventEmitter<void>();

  authService = inject(AuthService);
  renderer = inject(Renderer2);
  el = inject(ElementRef);

  submitted = false;
  passwordErrors: { [key: string]: string } = {
    required: 'Password must be at least 6 characters',
    minlength: 'Password must be at least 6 characters',
    maxlength: 'Password must be less than 50 characters',
    pattern:
      'Password must have at least 6 characters, one uppercase, one lowercase, and one number',
  };
  currentPasswordError = this.passwordErrors['required'];
  destroy$ = new Subject<void>();

  get firstName() {
    return this.signupForm.get('firstName');
  }

  get lastName() {
    return this.signupForm.get('lastName');
  }

  get email() {
    return this.formType === 'signin'
      ? this.signinForm.get('email')
      : this.signupForm.get('email');
  }

  get password() {
    return this.formType === 'signin'
      ? this.signinForm.get('password')
      : this.signupForm.get('password');
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

  ngAfterViewInit() {
    this.renderGoogleDiv().then(() => {
      //@ts-ignore
      google.accounts.id.initialize({
        client_id:
          '240456501479-2tupv41rrq7sq013c8uq01nsm67aqnr4.apps.googleusercontent.com',
        callback: this.handleGoogleResponse.bind(this),
      });

      //@ts-ignore
      google.accounts.id.renderButton(document.getElementById('googleSignin'), {
        theme: 'outline',
        size: 'large',
      });
    });
  }

  renderGoogleDiv() {
    return new Promise<void>((resolve) => {
      const googleButton = this.renderer.createElement('div');
      googleButton.id = 'googleSignin';

      this.renderer.appendChild(
        this.googleContainer.nativeElement,
        googleButton
      );

      resolve();
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
    const errors =
      this.formType === 'signin'
        ? this.signinForm.controls.password.errors
        : this.signupForm.controls.password.errors;

    if (this.password?.invalid && errors) {
      const firstKey = Object.keys(errors)[0];
      this.currentPasswordError = this.passwordErrors[firstKey];
    }
  }

  handleGoogleResponse(response: GoogleSigninResponse) {
    this.authService.handleGoogleSignin(response);
  }
}

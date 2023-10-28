import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-change-password-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordFormComponent {
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  @ViewChildren('formInput') formInputs!: QueryList<
    ElementRef<HTMLInputElement>
  >;

  dialogRef = inject(DialogRef);
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  userService = inject(UserService);
  isLoading = signal(false);
  passwordForm = this.fb.group(
    {
      currentPassword: [
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
      newPassword: [
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
        'newPassword',
        'confirmPassword'
      ),
    }
  );
  passwordErrors: { [key: string]: string } = {
    required: 'Password must be at least 6 characters',
    minlength: 'Password must be at least 6 characters',
    maxlength: 'Password must be less than 50 characters',
    pattern:
      'Password must have at least 6 characters, one uppercase, one lowercase, and one number',
  };
  currentPasswordError = this.passwordErrors['required'];
  newPasswordError = this.passwordErrors['required'];
  submitted = false;
  focusInput = new Subject<string>();
  destroy$ = new Subject<void>();

  get currentPassword() {
    return this.passwordForm.get('currentPassword')!;
  }

  get newPassword() {
    return this.passwordForm.get('newPassword')!;
  }

  get confirmPassword() {
    return this.passwordForm.get('confirmPassword')!;
  }

  ngOnInit() {
    this.dialogRef.outsidePointerEvents.subscribe((event: MouseEvent) => {
      if (event.type === 'click') {
        this.container.nativeElement.classList.remove('animate-zoom-in');
        this.container.nativeElement.classList.add('animate-zoom-out');
      }
    });

    this.focusInput
      .pipe(takeUntil(this.destroy$))
      .subscribe((inputName: string) => {
        const input = this.formInputs.find(
          (input) => input.nativeElement.name === inputName
        );

        if (input) {
          input.nativeElement.focus();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.container.nativeElement.classList.remove('animate-zoom-in');
    this.container.nativeElement.classList.add('animate-zoom-out');
  }

  closeModal() {
    this.container.nativeElement.classList.remove('animate-zoom-in');
    this.container.nativeElement.classList.add('animate-zoom-out');
  }

  onDialogAnimationEnd(event: AnimationEvent) {
    if (event.animationName === 'zoom-out') {
      this.dialogRef.close();
    }
  }

  onPasswordChange(type: string) {
    const errors =
      type === 'currentPassword'
        ? this.passwordForm.controls.currentPassword.errors
        : this.passwordForm.controls.newPassword.errors;

    if(type === 'currentPassword' && this.currentPassword?.invalid && errors) {
      const firstKey = Object.keys(errors)[0];
      this.currentPasswordError = this.passwordErrors[firstKey];
    }

    if(type === 'newPassword' && this.newPassword?.invalid && errors) {
      const firstKey = Object.keys(errors)[0];
      this.newPasswordError = this.passwordErrors[firstKey];
    }
  }

  async onSubmit() {
    this.submitted = true;

    if (this.currentPassword?.invalid) {
      this.focusInput.next('currentPassword');
      return;
    }

    if (this.newPassword?.invalid) {
      this.focusInput.next('newPassword');
      return;
    }

    if (this.confirmPassword?.invalid) {
      this.focusInput.next('confirmPassword');
      return;
    }

    this.isLoading.set(true);
    await this.userService.updatePassword(
      this.currentPassword.value as string,
      this.newPassword.value as string,
      this.confirmPassword.value as string
    );
    this.isLoading.set(false);
  }
}

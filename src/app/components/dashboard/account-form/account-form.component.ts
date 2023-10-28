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
import { DialogRef } from '@angular/cdk/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFormComponent {
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  @ViewChildren('formInput') formInputs!: QueryList<
    ElementRef<HTMLInputElement>
  >;

  dialogRef = inject(DialogRef);
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  userService = inject(UserService);

  isLoading = signal(false);
  accountForm = this.fb.group({
    firstName: [
      this.authService.user()!.firstName,
      [Validators.required, Validators.minLength(2), Validators.maxLength(25)],
    ],
    lastName: [
      this.authService.user()!.lastName,
      [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
    ],
  });
  submitted = false;
  focusInput = new Subject<string>();
  destroy$ = new Subject<void>();

  get firstName() {
    return this.accountForm.get('firstName')!;
  }

  get lastName() {
    return this.accountForm.get('lastName')!;
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

  async onSubmit() {
    this.submitted = true;

    if (this.firstName?.invalid) {
      this.focusInput.next('firstName');
      return;
    }

    if (this.lastName?.invalid) {
      this.focusInput.next('lastName');
      return;
    }

    this.isLoading.set(true);
    await this.userService.updateUser(
      this.firstName.value as string,
      this.lastName.value as string
    );
    this.isLoading.set(false);
  }
}

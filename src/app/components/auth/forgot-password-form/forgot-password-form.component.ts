import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forgot-password-form.component.html',
})
export class ForgotPasswordFormComponent {
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;

  @Input({ required: true }) forgotPasswordForm!: FormGroup<{
    email: FormControl<string | null>;
  }>;
  @Input({ required: true }) isLoading: boolean = false;
  @Input({ required: true }) focusInput$!: Observable<void>;
  @Output() submitHandler = new EventEmitter<void>();

  fb = inject(FormBuilder);
  authService = inject(AuthService);

  submitted = false;
  destroy$ = new Subject<void>();

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  ngOnInit() {
    this.focusInput$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.emailInput.nativeElement.focus();
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
}

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperCheckoutComponent } from '../../components/checkout/stepper-checkout/stepper-checkout.component';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';
import { CdkStepperModule, StepperSelectionEvent } from '@angular/cdk/stepper';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { UserService } from '../../services/user.service';
import { CheckoutCartComponent } from '../../components/checkout/checkout-cart/checkout-cart.component';
import { CheckoutAddressComponent } from '../../components/checkout/checkout-address/checkout-address.component';
import { ClipboardModule } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    StepperCheckoutComponent,
    CheckoutCartComponent,
    CheckoutAddressComponent,
    RouterLink,
    CdkStepperModule,
    ReactiveFormsModule,
    ClipboardModule,
  ],
  templateUrl: './checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent {
  fb = inject(FormBuilder);
  cartService = inject(CartService);
  userService = inject(UserService);

  testCard = '4242424242424242';
  stepperForm = this.fb.group({
    steps: this.fb.array([
      this.fb.group({
        cart: [[], Validators.required],
      }),
      this.fb.group({
        address: [undefined, [Validators.required]],
      }),
      this.fb.group({
        card: [this.testCard, Validators.required],
      }),
    ]),
  });
  isCopied = signal(false);
  isLoadingAddresses = signal(false);
  isLoadingPayment = signal(false);

  constructor() {
    toObservable(this.cartService.cart)
      .pipe(takeUntilDestroyed())
      .subscribe((cart) => {
        this.stepperForm.patchValue({
          steps: [
            {
              cart: cart,
            },
          ],
        });
      });
  }

  get formArray() {
    return this.stepperForm.get('steps');
  }

  async selectionChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1) {
      this.isLoadingAddresses.set(true);
      await this.userService.getUserAddresses();
      this.isLoadingAddresses.set(false);
      const addresses = this.userService.userAddresses();

      if (addresses.length > 0) {
        this.onAddressSelected(
          this.formArray?.get([1])?.value.address ?? addresses[0].id
        );
      }
    }
  }

  onAddressSelected(address: number | undefined) {
    this.formArray?.get([1])?.patchValue({
      address,
    });
  }

  async onSubmit() {
    if (this.formArray?.get([0])?.invalid) {
      return;
    }

    if (this.formArray?.get([1])?.invalid) {
      return;
    }

    const addressId = this.formArray?.get([1])?.value.address;

    this.isLoadingPayment.set(true);
    await this.cartService.checkoutSession(addressId);
    this.isLoadingPayment.set(false);
  }

  onCopyToClipboard(message: HTMLSpanElement) {
    message.classList.remove('animate-zoom-out');
    message.classList.add('animate-zoom-in');
    this.isCopied.set(true);
  }

  toggleIsCopied(message: HTMLSpanElement) {
    message.classList.remove('animate-zoom-in');

    setTimeout(() => {
      message.classList.add('animate-zoom-out');
    }, 500);
  }

  onAnimationCopiedEnd(event: AnimationEvent) {
    if (event.animationName === 'zoom-out') {
      this.isCopied.set(false);
    }
  }
}

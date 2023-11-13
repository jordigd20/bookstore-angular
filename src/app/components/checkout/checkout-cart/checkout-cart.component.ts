import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { CartItemComponent } from '../../side-cart/cart-item/cart-item.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CartItemComponent, CdkStepperModule],
  templateUrl: './checkout-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutCartComponent {
  cartService = inject(CartService);
}

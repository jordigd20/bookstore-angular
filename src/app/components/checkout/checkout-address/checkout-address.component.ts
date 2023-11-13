import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
  WritableSignal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CartService } from '../../../services/cart.service';
import { UserService } from '../../../services/user.service';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { Address } from '../../../interfaces/user.interface';
import { AddressFormComponent } from '../../dashboard/address-form/address-form.component';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-checkout-address',
  standalone: true,
  imports: [CommonModule, RouterLink, CdkStepperModule],
  templateUrl: './checkout-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressComponent {
  @ViewChildren('radioAddresses') radioAddresses!: QueryList<
    ElementRef<HTMLButtonElement>
  >;

  @Input({ required: true }) isLoading = false;
  @Input({ required: true }) addressSelected!: number | undefined;
  @Output() selectAddress = new EventEmitter<number | undefined>();

  cartService = inject(CartService);
  userService = inject(UserService);
  dialog = inject(Dialog);

  ngOnInit() {
    const addresses = this.userService.userAddresses();

    if (addresses.length > 0) {
      this.selectAddress.emit(addresses[0].id);
    }
  }

  onAddressSelected(idAddress: number | undefined) {
    this.radioAddresses.forEach((address) => {
      if (address.nativeElement.id === `address-${idAddress}`) {
        address.nativeElement.setAttribute('aria-checked', 'true');
      } else {
        address.nativeElement.setAttribute('aria-checked', 'false');
      }
    });

    this.selectAddress.emit(idAddress);
  }

  openDeleteConfirmationModal(idAddress: number) {
    this.dialog.open(ConfirmationModalComponent, {
      ariaLabelledBy: 'Confirm to delete the address',
      ariaDescribedBy: 'Confirm to delete the address',
      backdropClass: ['backdrop-blur-sm', 'bg-black/5'],
      disableClose: true,
      data: {
        title: 'Delete address',
        message: 'Are you sure you want to delete this address?',
        confirmText: 'Delete',
        isDestructive: true,
        confirmHandler: () => this.deleteAddress(idAddress),
      },
    });
    document.getElementById('btn')?.offsetWidth;
  }

  modifyAddress(address: Address) {
    this.dialog.open(AddressFormComponent, {
      ariaLabelledBy: 'Edit address',
      ariaDescribedBy: 'Edit address',
      backdropClass: ['backdrop-blur-sm', 'bg-black/5'],
      disableClose: true,
      data: {
        address,
        type: 'edit',
      },
    });
  }

  createAddress() {
    this.dialog.open(AddressFormComponent, {
      ariaLabelledBy: 'Create new address',
      ariaDescribedBy: 'Create new address',
      backdropClass: ['backdrop-blur-sm', 'bg-black/5'],
      disableClose: true,
      data: {
        type: 'create',
        selectAddressInCheckout: () => this.selectAddressAfterCreate(),
      },
    });
  }

  selectAddressAfterCreate() {
    if (this.userService.userAddresses().length === 1) {
      this.onAddressSelected(this.userService.userAddresses()[0].id);
    }
  }

  async deleteAddress(idAddress: number) {
    await this.userService.deleteAddress(idAddress);

    if (this.userService.userAddresses().length === 0) {
      this.onAddressSelected(undefined);
    } else {
      this.onAddressSelected(this.userService.userAddresses()[0].id);
    }
  }
}

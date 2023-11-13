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
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { Address, CreateAddress } from '../../../interfaces/user.interface';
import { CdkMenu, CdkMenuItemRadio, CdkMenuTrigger } from '@angular/cdk/menu';
import { ConnectionPositionPair } from '@angular/cdk/overlay';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItemRadio,
  ],
  templateUrl: './address-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormComponent {
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  @ViewChild('countryButton') countryButton!: ElementRef<HTMLButtonElement>;
  @ViewChildren('formInput') formInputs!: QueryList<
    ElementRef<HTMLInputElement>
  >;

  dialogRef = inject(DialogRef);
  fb = inject(FormBuilder);
  userService = inject(UserService);
  data: {
    address?: Address;
    type: 'create' | 'edit';
    selectAddressInCheckout?: () => void;
  } = inject(DIALOG_DATA);

  isLoading = signal(false);
  addressForm = this.fb.group(
    {
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      dialCode: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      countryCode: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', [Validators.required]],
      province: [''],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      address: ['', [Validators.required]],
    },
    {
      validators: this.validatePhoneNumber(),
    }
  );
  countries = signal<
    {
      name: string;
      dialCode: string;
      code: string;
    }[]
  >([]);
  dropdownPosition = [
    new ConnectionPositionPair(
      { originX: 'center', originY: 'bottom' },
      { overlayX: 'center', overlayY: 'top' }
    ),
  ];
  submitted = false;
  focusInput = new Subject<string>();
  destroy$ = new Subject<void>();

  get firstName() {
    return this.addressForm.get('firstName')!;
  }

  get lastName() {
    return this.addressForm.get('lastName')!;
  }

  get dialCode() {
    return this.addressForm.get('dialCode')!;
  }

  get phone() {
    return this.addressForm.get('phone')!;
  }

  get countryCode() {
    return this.addressForm.get('countryCode')!;
  }

  get country() {
    return this.addressForm.get('country')!;
  }

  get province() {
    return this.addressForm.get('province')!;
  }

  get city() {
    return this.addressForm.get('city')!;
  }

  get postalCode() {
    return this.addressForm.get('postalCode')!;
  }

  get address() {
    return this.addressForm.get('address')!;
  }

  ngOnInit() {
    if (this.data.type === 'edit') {
      this.addressForm.patchValue({
        firstName: this.data.address?.firstName,
        lastName: this.data.address?.lastName,
        countryCode: this.data.address?.countryCode,
        country: this.data.address?.country,
        province: this.data.address?.province,
        city: this.data.address?.city,
        postalCode: this.data.address?.postalCode,
        address: this.data.address?.address,
      });
    }

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

    this.userService.getCountries().subscribe((countries) => {
      this.countries.set(countries);

      if (this.data.type === 'edit') {
        const country = countries.find(
          (country) => country.code === this.data.address?.countryCode
        );

        if (country) {
          const phone = this.data.address?.phone.slice(country.dialCode.length);

          this.addressForm.patchValue({
            dialCode: country.dialCode,
            phone,
          });
        }
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

  onCountrySelected(country: { name: string; dialCode: string; code: string }) {
    this.addressForm.patchValue({
      countryCode: country.code,
      country: country.name,
      dialCode: country.dialCode,
    });
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

    if (this.country?.invalid) {
      this.countryButton.nativeElement.focus();
      return;
    }

    if (this.phone?.invalid) {
      this.focusInput.next('phone');
      return;
    }

    if (this.city?.invalid) {
      this.focusInput.next('city');
      return;
    }

    if (this.postalCode?.invalid) {
      this.focusInput.next('postalCode');
      return;
    }

    if (this.address?.invalid) {
      this.focusInput.next('address');
      return;
    }

    const address: CreateAddress = {
      firstName: this.firstName.value!,
      lastName: this.lastName.value!,
      phone: `${this.dialCode.value}${this.phone.value}`,
      countryCode: this.countryCode.value!,
      country: this.country.value!,
      province: this.province.value!,
      city: this.city.value!,
      postalCode: this.postalCode.value!,
      address: this.address.value!,
    };

    this.isLoading.set(true);

    if (this.data.type === 'create') {
      const isCreated = await this.userService.createAddress(address);
      this.isLoading.set(false);

      if (isCreated && this.data.selectAddressInCheckout) {
        this.closeModal();
      } else {
        this.closeModal();
      }

      if (isCreated) {
        this.data.selectAddressInCheckout?.();
        this.closeModal();
      }

      return;
    }

    const isUpdated = await this.userService.updateAddress(
      this.data.address!.id,
      address
    );
    this.isLoading.set(false);

    if (isUpdated) {
      this.closeModal();
    }

    return;
  }

  onlyAllowNumbers(event: KeyboardEvent) {
    const allowedCharacters = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
    ];

    if (!allowedCharacters.includes(event.key)) {
      event.preventDefault();
    }
  }

  validatePhoneNumber() {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const phoneControl = formGroup.get('phone');
      const dialCodeControl = formGroup.get('dialCode');

      if (!phoneControl || !dialCodeControl) return null;

      if (phoneControl.errors && !phoneControl.errors['invalidPhone']) {
        return null;
      }

      const fullPhoneNumber = `${dialCodeControl.value}${phoneControl.value}`;
      const isValid = /^\+[1-9]\d{1,14}$/.test(fullPhoneNumber);

      if (!isValid) {
        phoneControl.setErrors({ invalidPhone: true });
        return { invalidPhone: true };
      } else {
        phoneControl.setErrors(null);
        return null;
      }
    };
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { Dialog } from '@angular/cdk/dialog';
import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { HoverDropdownMenuComponent } from '../hover-dropdown-menu/hover-dropdown-menu.component';
import { NavbarMobileComponent } from '../navbar-mobile/navbar-mobile.component';
import { AuthService } from '../../services/auth.service';
import { AccountMenuComponent } from '../account-menu/account-menu.component';
import { SideCartComponent } from '../side-cart/cart/side-cart.component';
import { CartService } from '../../services/cart.service';

export interface NavigationBar {
  id: string;
  label: string;
  link?: string;
  children?: NavigationBar[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    RouterLink,
    CdkMenuTrigger,
    HoverDropdownMenuComponent,
    NavbarMobileComponent,
    AccountMenuComponent,
  ],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  @ViewChildren(CdkMenuTrigger) dropdownTriggers!: QueryList<CdkMenuTrigger>;
  @ViewChildren('buttonOrigin') buttonsTrigger!: QueryList<
    ElementRef<HTMLButtonElement>
  >;
  @ViewChild('accountDropdownMenu')
  accountDropdownMenu!: ElementRef<HTMLDivElement>;

  dialog = inject(Dialog);
  authService = inject(AuthService);
  cartService = inject(CartService);

  navigation: NavigationBar[] = [
    { id: 'home', label: 'Home', link: '/' },
    { id: 'shop', label: 'Shop', link: '/shop' },
    {
      id: 'categories',
      label: 'Categories',
      children: [
        {
          id: 'fiction-literature',
          label: 'Fiction & Literature',
          link: '/shop',
        },
        { id: 'science-fiction', label: 'Science Fiction', link: '/shop' },
        {
          id: 'mistery-thrillers',
          label: 'Mistery & Thrillers',
          link: '/shop',
        },
        { id: 'romance', label: 'Romance', link: '/shop' },
        { id: 'fantasy', label: 'Fantasy', link: '/shop' },
        { id: 'health-fitness', label: 'Health & Fitness', link: '/shop' },
        { id: 'self-help', label: 'Self-Help', link: '/shop' },
        { id: 'horror-tales', label: 'Horror tales', link: '/shop' },
        {
          id: 'biography-autobiography',
          label: 'Biography & Autobiography',
          link: '/shop',
        },
        { id: 'humor', label: 'Humor', link: '/shop' },
        { id: 'art', label: 'Art', link: '/shop' },
      ],
    },
  ];
  dropdownPosition = [
    new ConnectionPositionPair(
      { originX: 'center', originY: 'bottom' },
      { overlayX: 'center', overlayY: 'top' }
    ),
  ];
  accountMenuPosition = [
    new ConnectionPositionPair(
      { originX: 'end', originY: 'bottom' },
      { overlayX: 'end', overlayY: 'top' }
    ),
  ];

  openDropdown({
    menu,
    id,
  }: {
    menu: ElementRef<HTMLUListElement> | undefined;
    id: string;
  }) {
    const button = this.buttonsTrigger.find(
      (button) => button.nativeElement.id === id
    );

    if (button) {
      button.nativeElement.setAttribute('data-state', 'opened');
    }

    const trigger = this.dropdownTriggers.find(
      (trigger) => (trigger.menuData as { id: string }).id === id
    );

    if (trigger) {
      trigger.open();

      menu?.nativeElement?.classList.remove('hidden');
      menu?.nativeElement?.setAttribute('data-state', 'opened');
    }
  }

  closeDropdown({
    menu,
    id,
  }: {
    menu: ElementRef<HTMLUListElement> | undefined;
    id: string;
  }) {
    menu?.nativeElement?.setAttribute('data-state', 'closed');

    const button = this.buttonsTrigger.find(
      (button) => button.nativeElement.id === id
    );

    if (button) {
      button.nativeElement.setAttribute('data-state', 'closed');
    }

    const animationEndHandler = (event: AnimationEvent) => {
      if (event.animationName === 'zoom-out') {
        const trigger = this.dropdownTriggers.find(
          (trigger) => (trigger.menuData as { id: string }).id === id
        );

        if (trigger) {
          trigger.close();
          menu?.nativeElement?.classList.add('hidden');
          menu?.nativeElement?.removeEventListener(
            'animationend',
            animationEndHandler
          );
        }
      }
    };

    menu?.nativeElement?.addEventListener('animationend', animationEndHandler);
  }

  openNavbarMobile() {
    this.dialog.open(NavbarMobileComponent, {
      ariaLabelledBy: 'Navigation bar',
      ariaDescribedBy: 'Navigation bar for mobile devices',
      backdropClass: ['backdrop-blur-sm', 'bg-black/5'],
      disableClose: true,
      data: {
        navigation: this.navigation,
      },
    });
  }

  openCart() {
    this.dialog.open(SideCartComponent, {
      ariaLabelledBy: 'Shopping cart',
      ariaDescribedBy: 'Shopping cart',
      backdropClass: ['backdrop-blur-sm', 'bg-black/5'],
      disableClose: true,
    });
  }
}

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
import { CdkMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { NavbarMobileComponent } from '../navbar-mobile/navbar-mobile.component';

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
    CdkMenu,
    CdkMenuItem,
    DropdownMenuComponent,
    NavbarMobileComponent,
    DialogModule,
  ],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  @ViewChild(CdkMenuTrigger) categoriesTrigger!: CdkMenuTrigger;
  @ViewChildren('buttonOrigin') buttonsTrigger!: QueryList<
    ElementRef<HTMLButtonElement>
  >;

  dialog = inject(Dialog);

  navigation: NavigationBar[] = [
    { id: 'home', label: 'Home', link: '/' },
    { id: 'shop', label: 'Shop', link: '/' },
    {
      id: 'categories',
      label: 'Categories',
      children: [
        { id: 'fiction-literature', label: 'Fiction & Literature', link: '/' },
        { id: 'science-fiction', label: 'Science Fiction', link: '/' },
        { id: 'mistery-thrillers', label: 'Mistery & Thrillers', link: '/' },
        { id: 'romance', label: 'Romance', link: '/' },
        { id: 'fantasy', label: 'Fantasy', link: '/' },
        { id: 'health-fitness', label: 'Health & Fitness', link: '/' },
        { id: 'self-help', label: 'Self-Help', link: '/' },
        { id: 'horror-tales', label: 'Horror tales', link: '/' },
        {
          id: 'biography-autobiography',
          label: 'Biography & Autobiography',
          link: '/',
        },
        { id: 'humor', label: 'Humor', link: '/' },
        { id: 'art', label: 'Art', link: '/' },
      ],
    },
  ];

  dropdownPosition = [
    new ConnectionPositionPair(
      { originX: 'center', originY: 'bottom' },
      { overlayX: 'center', overlayY: 'top' }
    ),
  ];

  openDropdown(menu: ElementRef<HTMLUListElement> | undefined) {
    this.buttonsTrigger.first.nativeElement.setAttribute(
      'data-state',
      'opened'
    );
    this.categoriesTrigger.open();
    menu?.nativeElement?.classList.remove('hidden');
    menu?.nativeElement?.setAttribute('data-state', 'opened');
  }

  closeDropdown(menu: ElementRef<HTMLUListElement> | undefined) {
    menu?.nativeElement?.setAttribute('data-state', 'closed');
    this.buttonsTrigger.first.nativeElement.setAttribute(
      'data-state',
      'closed'
    );

    const animationEndHandler = (event: AnimationEvent) => {
      if (event.animationName === 'zoom-out') {
        this.categoriesTrigger.close();
        menu?.nativeElement?.classList.add('hidden');
        menu?.nativeElement?.removeEventListener(
          'animationend',
          animationEndHandler
        );
      }
    };

    menu?.nativeElement.addEventListener('animationend', animationEndHandler);
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
}

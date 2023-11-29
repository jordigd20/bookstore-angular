import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkListbox,
  CdkListboxModule,
  CdkOption,
  ListboxValueChangeEvent,
} from '@angular/cdk/listbox';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { DropdownData, OrdersService } from '../../services/orders.service';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dropdown-listbox',
  standalone: true,
  imports: [
    CommonModule,
    CdkListbox,
    CdkOption,
    ClickOutsideDirective,
    CdkListboxModule,
  ],
  templateUrl: './dropdown-listbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownListboxComponent {
  @Input({ required: true }) title!: 'year' | 'month';
  @Input({ required: true }) width!: number;

  ordersService = inject(OrdersService);
  elem = inject(ElementRef);

  isDropdownOpen = signal(false);

  ngOnInit() {}

  @HostListener('window:keyup.esc')
  onEscapeKeyup() {
    if (this.isDropdownOpen()) {
      const listbox = this.elem.nativeElement.querySelector('ul');
      this.closeDropdown(listbox);
    }
  }

  closeDropdown(listbox: HTMLUListElement) {
    listbox.classList.add('animate-zoom-out');
    this.elem.nativeElement.querySelector('button').focus();
  }

  onValueChange(event: ListboxValueChangeEvent<DropdownData>) {
    if (event.value.length > 0) {
      this.handleValueChange(event.value[0]);
    }

    this.isDropdownOpen.set(false);
    this.elem.nativeElement.querySelector('button').focus();
  }

  private handleValueChange(value: DropdownData) {
    if (this.title === 'year') {
      this.ordersService.onYearValueChanged(value);
    } else {
      this.ordersService.onMonthValueChanged(value);
    }
  }

  toggleDropdown() {
    if (this.isDropdownOpen()) {
      const listbox = this.elem.nativeElement.querySelector('ul');
      this.closeDropdown(listbox);
      return;
    }

    this.isDropdownOpen.set(true);
  }

  onDropdownAnimationEnd(event: AnimationEvent, listbox: HTMLUListElement) {
    if (event.animationName === 'zoom-out') {
      listbox.classList.remove('animate-zoom-out');
      this.isDropdownOpen.set(false);
    }
  }

  compareWith(a: DropdownData, b: DropdownData) {
    return a.id === b.id;
  }
}

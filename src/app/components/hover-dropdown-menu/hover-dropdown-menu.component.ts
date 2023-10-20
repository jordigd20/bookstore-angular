import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  Subject,
  debounceTime,
  filter,
  fromEvent,
  share,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';
import { NavigationBar } from '../navbar/navbar.component';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';

@Component({
  selector: 'hover-dropdown-menu',
  standalone: true,
  imports: [NgFor, RouterLink, CdkMenu, CdkMenuItem],
  templateUrl: './hover-dropdown-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HoverDropdownMenuComponent implements OnInit, OnDestroy {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @ViewChild('menu') menu!: ElementRef<HTMLUListElement>;

  @Input({ required: true }) dropdownOrigin!: HTMLButtonElement;
  @Input({ required: true }) dropdownId!: string;
  @Input({ required: true }) data!: NavigationBar[];
  @Output() open = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();

  isOpened = false;
  destroy$ = new Subject<void>();

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    const open$ = fromEvent(this.dropdownOrigin, 'mouseenter').pipe(
      filter(() => !this.isOpened),
      switchMap((enterEvent) =>
        fromEvent(document, 'mousemove').pipe(
          startWith(enterEvent),
          filter((event) => this.dropdownOrigin === event['target'])
        )
      ),
      share()
    );

    open$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.changeState(true));

    const close$ = fromEvent(document, 'mousemove').pipe(
      debounceTime(20),
      filter(() => this.isOpened),
      filter((event) =>
        this.isMovedOutside(this.dropdownOrigin, this.menu.nativeElement, event)
      )
    );

    open$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => close$)
      )
      .subscribe(() => this.changeState(false));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private changeState(isOpened: boolean) {
    this.isOpened = isOpened;
    isOpened
      ? this.open.emit({ menu: this.menu, id: this.dropdownId })
      : this.close.emit({ menu: this.menu, id: this.dropdownId });
    this.changeDetectorRef.markForCheck();
  }

  private isMovedOutside(
    dropdownOrigin: HTMLButtonElement,
    menu: HTMLUListElement,
    event: any
  ): boolean {
    return !(
      dropdownOrigin.contains(event['target']) || menu.contains(event['target'])
    );
  }
}

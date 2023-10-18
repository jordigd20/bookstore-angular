import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
} from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CdkAccordionItem, CdkAccordionModule } from '@angular/cdk/accordion';
import { RouterLink } from '@angular/router';
import { NavigationBar } from '../navbar/navbar.component';

@Component({
  selector: 'app-navbar-mobile',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, RouterLink, CdkAccordionModule],
  templateUrl: './navbar-mobile.component.html',
})
export class NavbarMobileComponent implements OnInit {
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  @ViewChildren('accordionContent') accordionsContent!: QueryList<
    ElementRef<HTMLDivElement>
  >;

  dialogRef = inject(DialogRef);
  data: { navigation: NavigationBar[] } = inject(DIALOG_DATA);

  accordionContentHeights: { [key: string]: string } = {
    categories: '316px',
  };

  ngOnInit() {
    this.dialogRef.outsidePointerEvents.subscribe((event: MouseEvent) => {
      if (event.type === 'click') {
        this.container.nativeElement.classList.add('animate-slide-out');
      }
    });
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.container.nativeElement.classList.add('animate-slide-out');
  }

  closeModal() {
    this.container.nativeElement.classList.add('animate-slide-out');
  }

  toggleAccordion(accordion: CdkAccordionItem, index: number) {
    if (accordion.expanded) {
      const accordionContent = this.accordionsContent.find(
        (accordion) => accordion.nativeElement.id === `accordion-body-${index}`
      );

      if (accordionContent) {
        accordionContent.nativeElement.classList.add('animate-accordion-up');
      }
    } else {
      accordion.open();
    }
  }

  onDialogAnimationEnd(event: AnimationEvent) {
    if (event.animationName === 'slide-out') {
      this.dialogRef.close();
    }
  }

  onAccordionAnimationEnd(event: AnimationEvent, accordion: CdkAccordionItem) {
    if (event.animationName === 'accordion-up') {
      accordion.close();
    }
  }
}

import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogRef } from '@angular/cdk/dialog';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-cart',
  standalone: true,
  imports: [CommonModule, CartItemComponent, RouterLink],
  templateUrl: './side-cart.component.html',
})
export class SideCartComponent {
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  dialogRef = inject(DialogRef);

  ngOnInit() {
    this.dialogRef.outsidePointerEvents.subscribe((event: MouseEvent) => {
      if (event.type === 'click') {
        this.container.nativeElement.classList.add('animate-slide-out-right');
      }
    });
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.container.nativeElement.classList.add('animate-slide-out-right');
  }

  closeModal() {
    this.container.nativeElement.classList.add('animate-slide-out-right');
  }

  onDialogAnimationEnd(event: AnimationEvent) {
    if (event.animationName === 'slide-out-right') {
      this.dialogRef.close();
    }
  }
}

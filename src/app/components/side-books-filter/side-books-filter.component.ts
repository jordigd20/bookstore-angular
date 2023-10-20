import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksFilterComponent } from '../books-filter/books-filter.component';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-side-books-filter',
  standalone: true,
  imports: [CommonModule, BooksFilterComponent],
  templateUrl: './side-books-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideBooksFilterComponent {
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

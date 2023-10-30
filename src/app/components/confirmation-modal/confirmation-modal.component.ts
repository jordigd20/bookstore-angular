import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;

  dialogRef = inject(DialogRef);
  data: {
    title: string;
    message: string;
    confirmText: string;
    isDestructive: boolean;
    confirmHandler: () => void;
  } = inject(DIALOG_DATA);

  isLoading = signal(false);

  ngOnInit() {
    this.dialogRef.outsidePointerEvents.subscribe((event: MouseEvent) => {
      if (event.type === 'click' && !this.isLoading()) {
        this.container.nativeElement.classList.remove('animate-zoom-in');
        this.container.nativeElement.classList.add('animate-zoom-out');
      }
    });
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

  async confirmAction() {
    this.isLoading.set(true);
    await this.data.confirmHandler();
    this.isLoading.set(false);
    this.closeModal();
  }
}

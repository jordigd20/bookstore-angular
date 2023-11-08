import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { RatingsService } from '../../../services/ratings.service';

const filledStarPath =
  'M5.825 22L7.45 14.975L2 10.25L9.2 9.625L12 3L14.8 9.625L22 10.25L16.55 14.975L18.175 22L12 18.275L5.825 22Z';
const emptyStarPath =
  'm8.85 17.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425l-.825 3.575ZM5.825 22l1.625-7.025L2 10.25l7.2-.625L12 3l2.8 6.625l7.2.625l-5.45 4.725L18.175 22L12 18.275L5.825 22ZM12 13.25Z';

@Component({
  selector: 'app-rating-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingFormComponent {
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  @ViewChildren('starPath') starsPath!: QueryList<ElementRef<SVGPathElement>>;
  @ViewChildren('starSvg') starsSvg!: QueryList<ElementRef<HTMLElement>>;

  ratingsService = inject(RatingsService);
  dialogRef = inject(DialogRef);
  renderer = inject(Renderer2);
  data: {
    idBook: number;
    type: 'create' | 'update';
    currentRate?: string;
  } = inject(DIALOG_DATA);

  isLoading = signal(false);
  hoveredIndex = signal(-1);
  selectedRating = signal(0);

  ngOnInit() {
    this.dialogRef.outsidePointerEvents.subscribe((event: MouseEvent) => {
      if (event.type === 'click' && !this.isLoading()) {
        this.container.nativeElement.classList.remove('animate-zoom-in');
        this.container.nativeElement.classList.add('animate-zoom-out');
      }
    });

    if (this.data.currentRate) {
      this.selectedRating.set(+this.data.currentRate);
    }
  }

  ngAfterViewInit() {
    if (this.data.currentRate) {
      const index = +this.data.currentRate - 1;

      this.starsPath.forEach((path, i) => {
        if (i <= index) {
          this.renderer.setAttribute(path.nativeElement, 'd', filledStarPath);
        } else {
          this.renderer.setAttribute(path.nativeElement, 'd', emptyStarPath);
        }
      });

      this.starsSvg.forEach((svg, i) => {
        if (i <= index) {
          svg.nativeElement.setAttribute('data-state', 'active');
        } else {
          svg.nativeElement.setAttribute('data-state', 'inactive');
        }
      });
    }
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

  onHoverStar(index: number) {
    if (this.selectedRating() !== 0 && index + 1 < this.selectedRating())
      return;

    this.hoveredIndex.set(index);
    this.starsPath.forEach((path, i) => {
      if (i <= index) {
        this.renderer.setAttribute(path.nativeElement, 'd', filledStarPath);
      } else {
        this.renderer.setAttribute(path.nativeElement, 'd', emptyStarPath);
      }
    });

    this.starsSvg.forEach((svg, i) => {
      if (i <= index) {
        svg.nativeElement.setAttribute('data-state', 'active');
      } else {
        svg.nativeElement.setAttribute('data-state', 'inactive');
      }
    });
  }

  onMouseLeave() {
    if (this.selectedRating() > 0) {
      this.starsPath.forEach((path, i) => {
        if (i >= this.selectedRating()) {
          this.renderer.setAttribute(path.nativeElement, 'd', emptyStarPath);
        }
      });

      this.starsSvg.forEach((svg, i) => {
        if (i >= this.selectedRating()) {
          svg.nativeElement.setAttribute('data-state', 'inactive');
        }
      });

      return;
    }

    this.hoveredIndex.set(-1);
    this.starsPath.forEach((path) => {
      this.renderer.setAttribute(path.nativeElement, 'd', emptyStarPath);
    });
    this.starsSvg.forEach((svg) => {
      svg.nativeElement.setAttribute('data-state', 'inactive');
    });
  }

  selectRate(index: number) {
    this.selectedRating.set(index + 1);

    this.starsPath.forEach((path, i) => {
      if (i <= index) {
        this.renderer.setAttribute(path.nativeElement, 'd', filledStarPath);
      } else {
        this.renderer.setAttribute(path.nativeElement, 'd', emptyStarPath);
      }
    });

    this.starsSvg.forEach((svg, i) => {
      if (i <= index) {
        svg.nativeElement.setAttribute('data-state', 'active');
      } else {
        svg.nativeElement.setAttribute('data-state', 'inactive');
      }
    });
  }

  async rateBook() {
    if (this.selectedRating() === 0) return;

    this.isLoading.set(true);
    await this.ratingsService.rateBook(this.data.idBook, this.selectedRating());
    this.isLoading.set(false);
    this.closeModal();
  }

  async updateRating() {
    if (this.selectedRating() === 0) return;

    this.isLoading.set(true);
    await this.ratingsService.updateRating(
      this.data.idBook,
      this.selectedRating()
    );
    this.isLoading.set(false);
    this.closeModal();
  }
}

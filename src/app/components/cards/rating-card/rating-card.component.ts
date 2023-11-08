import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingsService } from '../../../services/ratings.service';
import { Book } from 'src/app/interfaces/book.interface';
import { RouterLink } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { RatingFormComponent } from '../../dashboard/rating-form/rating-form.component';

@Component({
  selector: 'app-rating-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './rating-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingCardComponent {
  @ViewChild('categoryTag') categoryTag!: ElementRef<HTMLDivElement>;

  @Input({ required: true }) book!: Book;
  @Input({ required: true }) type!: 'not-rated' | 'rated';
  @Input() rating: string | undefined;

  ratingsService = inject(RatingsService);
  dialog = inject(Dialog);

  animateHover(type: string) {
    if (this.book.categories) {
      if (type === 'enter') {
        this.categoryTag.nativeElement.setAttribute('data-state', 'active');
      }

      if (type === 'leave') {
        this.categoryTag.nativeElement.setAttribute('data-state', 'inactive');
      }
    }
  }

  openRateBookModal(idBook: number) {
    this.dialog.open(RatingFormComponent, {
      ariaLabelledBy: 'Rate book form',
      ariaDescribedBy: 'Rate book form',
      backdropClass: ['backdrop-blur-sm', 'bg-black/5'],
      disableClose: true,
      data: {
        idBook,
        type: 'create',
      },
    });
  }

  openUpdateRateModal(idBook: number) {
    this.dialog.open(RatingFormComponent, {
      ariaLabelledBy: 'Update rate form',
      ariaDescribedBy: 'Update rate form',
      backdropClass: ['backdrop-blur-sm', 'bg-black/5'],
      disableClose: true,
      data: {
        idBook,
        type: 'update',
        currentRate: this.rating,
      },
    });
  }
}

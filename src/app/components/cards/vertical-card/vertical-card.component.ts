import { Component, ElementRef, Input, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Book } from '../../../interfaces/book.interface';

@Component({
  selector: 'app-vertical-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vertical-card.component.html',
})
export class VerticalCardComponent {
  @ViewChild('categoryTag') categoryTag!: ElementRef<HTMLDivElement>;
  @Input({ required: true }) book!: Book;

  animateHover(type: string) {
    if (type === 'enter') {
      this.categoryTag.nativeElement.setAttribute('data-state', 'active');
    }

    if (type === 'leave') {
      this.categoryTag.nativeElement.setAttribute('data-state', 'inactive');
    }
  }
}

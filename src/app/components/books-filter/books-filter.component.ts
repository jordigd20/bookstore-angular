import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-books-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './books-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksFilterComponent {
  categories = [
    { label: 'All', active: true },
    { label: 'Fiction & Literature', active: false },
    { label: 'Science Fiction', active: false },
    { label: 'Mistery & Thrillers', active: false },
    { label: 'Romance', active: false },
    { label: 'Fantasy', active: false },
    { label: 'Health & Fitness', active: false },
    { label: 'Self-Help', active: false },
    { label: 'Horror tales', active: false },
    { label: 'Biography & Autobiography', active: false },
    { label: 'Humor', active: false },
    { label: 'Art', active: false },
  ];
}

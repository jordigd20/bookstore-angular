import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksService } from '../../services/books.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterBy } from '../../interfaces/book-filters.interface';

@Component({
  selector: 'app-books-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './books-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksFilterComponent {
  bookService = inject(BooksService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  categories = [
    { label: 'All', slug: '' },
    { label: 'Science Fiction', slug: 'science-fiction' },
    { label: 'Mistery & Thrillers', slug: 'mistery-thrillers' },
    {
      label: 'Fiction & Literature',
      slug: 'fiction-literature',
    },
    { label: 'Romance', slug: 'romance' },
    { label: 'Fantasy', slug: 'fantasy' },
    { label: 'Health & Fitness', slug: 'health-fitness' },
    { label: 'Self-Help', slug: 'self-help' },
    { label: 'Horror tales', slug: 'horror-tales' },
    {
      label: 'Biography & Autobiography',
      slug: 'biography-autobiography',
    },
    { label: 'Humor', slug: 'humor' },
    { label: 'Art', slug: 'art' },
  ];
  debounceTimer: NodeJS.Timeout | undefined;

  handleSearch(input: HTMLInputElement) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          search: input.value,
        },
        queryParamsHandling: 'merge',
      });
    }, 500);
  }

  handlePrice(minInput: HTMLInputElement, maxInput: HTMLInputElement) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    let minPrice = minInput.value;
    let maxPrice = maxInput.value;

    if (minPrice === '' || maxPrice === '') {
      return;
    }

    this.debounceTimer = setTimeout(() => {
      if (Number(minPrice) < 0) {
        minPrice = '0';
      }

      if (Number(minPrice) > 500) {
        minPrice = '500';
      }

      if (Number(maxPrice) < 0) {
        maxPrice = '0';
      }

      if (Number(maxPrice) > 500) {
        maxPrice = '500';
      }

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          price: `${minPrice}-${maxPrice}`,
        },
        queryParamsHandling: 'merge',
      });
    }, 500);
  }

  validatePriceQuantity(event: KeyboardEvent) {
    const allowedCharacters = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
    ];

    if (!allowedCharacters.includes(event.key)) {
      event.preventDefault();
    }
  }

  toggleCheckbox(checkbox: HTMLButtonElement) {
    const checkboxValue =
      checkbox.attributes.getNamedItem('aria-checked')?.value;
    const checkboxName = checkbox.attributes.getNamedItem('name')?.value;
    const currentFilter = this.bookService.filterBy().split('.');

    if (checkboxValue === 'false') {
      checkbox.setAttribute('aria-checked', 'true');

      if (currentFilter[0] === '') {
        this.updateFilterBy(checkboxName as 'discounted' | 'bestseller');
      } else if (
        currentFilter[0] === 'discounted' ||
        currentFilter[0] === 'bestseller'
      ) {
        this.updateFilterBy(
          `${currentFilter[0]}.${checkboxName}` as
            | 'discounted.bestseller'
            | 'bestseller.discounted'
        );
      }

      return;
    }

    checkbox.setAttribute('aria-checked', 'false');
    if (currentFilter.length === 1 && currentFilter[0] === checkboxName) {
      this.updateFilterBy('');
    } else if (
      currentFilter[0] === 'discounted' ||
      currentFilter[0] === 'bestseller'
    ) {
      const remainingCheckbox = currentFilter.filter(
        (filter) => filter !== checkboxName
      );

      this.updateFilterBy(remainingCheckbox[0] as 'discounted' | 'bestseller');
    }
  }

  setCategory(slug: string) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        category: slug,
        page: 1,
      },
      queryParamsHandling: 'merge',
    });
  }

  resetFilters() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        search: null,
        price: null,
        filterBy: null,
        category: null,
        orderBy: null,
        page: null,
      },
      queryParamsHandling: 'merge',
    });

    this.bookService.resetFilters();
  }

  private updateFilterBy(filter: FilterBy) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        filterBy: filter,
      },
      queryParamsHandling: 'merge',
    });
  }
}

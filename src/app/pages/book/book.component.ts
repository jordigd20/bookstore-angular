import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { CdkAccordionItem, CdkAccordionModule } from '@angular/cdk/accordion';
import { BooksService } from '../../services/books.service';
import { Book } from '../../interfaces/book.interface';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { BookSkeletonComponent } from '../../components/book-skeleton/book-skeleton.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
    BreadcrumbsComponent,
    CdkAccordionModule,
    BookSkeletonComponent,
  ],
  templateUrl: './book.component.html',
})
export class BookComponent {
  @ViewChildren('accordionContent') accordionsContent!: QueryList<
    ElementRef<HTMLDivElement>
  >;

  bookService = inject(BooksService);
  cartService = inject(CartService);
  authService = inject(AuthService);
  userService = inject(UserService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  isLoading = signal(true);
  isBookLoading = signal(false);
  book = signal<Book | undefined>(undefined);

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params['id'];
    const slug = params.split('-').slice(1).join('-');

    if (!slug) {
      this.router.navigate(['/not-found']);
    }

    this.bookService.fetchOneBook(slug).subscribe({
      next: (book) => {
        this.isLoading.set(false);
        this.book.set(book);
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/not-found']);
      },
    });
  }

  async addToCart(idBook: number) {
    this.isBookLoading.set(true);
    await this.cartService.addToCart(idBook);
    this.isBookLoading.set(false);
  }

  toggleAccordion(accordion: CdkAccordionItem, id: string) {
    if (accordion.expanded) {
      const accordionContent = this.accordionsContent.find(
        (accordion) => accordion.nativeElement.id === id
      );

      if (accordionContent) {
        const height = accordionContent.nativeElement.offsetHeight;

        accordionContent.nativeElement.style.setProperty(
          '--accordion-content-height',
          `${height}px`
        );

        accordionContent.nativeElement.classList.add('animate-accordion-up');
      }
    } else {
      accordion.open();
    }
    document.getElementById('description-body')?.clientHeight;
  }

  onAccordionAnimationEnd(event: AnimationEvent, accordion: CdkAccordionItem) {
    if (event.animationName === 'accordion-up') {
      accordion.close();
    }
  }
}

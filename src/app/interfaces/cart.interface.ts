import { Book } from './book.interface';

export interface CartState {
  id: number | null;
  cart: CartBook[];
}

export interface CartBook {
  quantity: number;
  book: Book;
}

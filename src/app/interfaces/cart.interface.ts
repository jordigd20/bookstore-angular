import { Book } from './book.interface';

export interface CartState {
  id: number | null;
  total: number;
  cart: CartBook[];
}

export interface CartBook {
  quantity: number;
  book: Book;
}

export interface CartResponse {
  total: string;
  cart: {
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
    book: Book;
  }[];
}

import { Book } from './book.interface';

export interface Order {
  id: number;
  status: 'COMPLETED' | 'PENDING' | 'CANCELED' | 'PROCESSING';
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  addressId: number;
  total: string;
  receiptUrl: string;
  books: OrderBook[];
}

export interface OrderBook {
  quantity: number;
  price: string;
  createdAt: Date;
  updatedAt: Date;
  orderId: number;
  bookId: number;
  book: Book;
}
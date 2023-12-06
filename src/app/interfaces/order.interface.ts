import { Book } from './book.interface';

export interface LastOrders {
  ordersByDate: { [key: string]: number[] };
  orders: Order[];
}

export interface Order {
  id: number;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED' | 'PROCESSING';
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

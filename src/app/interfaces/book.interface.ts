export interface Book {
  id: number;
  ISBN: string;
  slug: string;
  title: string;
  author: string;
  publisher: string;
  publishedDate: Date;
  description: string;
  pageCount: number;
  imageLink: string;
  language: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  isBestseller: string;
  createdAt: Date;
  updatedAt: Date;
}

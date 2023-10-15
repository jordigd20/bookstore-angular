export interface BookPaginatedResponse {
  data: Book[];
  pagination: {
    skip: number;
    take: number;
    total: number;
  };
}

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
  currentPrice: string;
  originalPrice: string;
  discount: number;
  isBestseller: string;
  createdAt: Date;
  updatedAt: Date;
  categories?: BookCategory[];
  averageRating?: string;
  ratingsCount?: number;
}

export interface BookCategory {
  id: number;
  slug: string;
  name: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

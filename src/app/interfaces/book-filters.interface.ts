export interface FilterState {
  search: string;
  price: string;
  filterBy: FilterBy;
  category: string;
  orderBy: OrderBy;
  skip: number;
  page: number;
}

export interface OptionalFilterState {
  search?: string;
  price?: string;
  filterBy?: FilterBy;
  category?: string;
  orderBy?: OrderBy;
  skip?: number;
  page?: number;
}

export type FilterBy =
  | 'discounted'
  | 'bestseller'
  | 'discounted.bestseller'
  | 'bestseller.discounted'
  | '';

export type OrderBy =
  | 'price.asc'
  | 'price.desc'
  | 'rating.asc'
  | 'rating.desc'
  | 'title.asc'
  | 'title.desc'
  | 'publishedDate.asc'
  | 'publishedDate.desc'
  | '';

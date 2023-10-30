export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  oauthProvider: string;
  role: string;
  createdAt: string;
  cart: number;
  wishlist: number;
}

export interface Address {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string;
  country: string;
  province: string;
  city: string;
  postalCode: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

export interface CreateAddress {
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string;
  country: string;
  province: string;
  city: string;
  postalCode: string;
  address: string;
}

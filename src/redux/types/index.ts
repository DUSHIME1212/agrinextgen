
// Action Types
export const USER_LOADING = 'USER_LOADING';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAIL = 'USER_LOGIN_FAIL';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_UPDATE_PROFILE = 'USER_UPDATE_PROFILE';

export const PRODUCTS_LOADING = 'PRODUCTS_LOADING';
export const PRODUCTS_LOAD_SUCCESS = 'PRODUCTS_LOAD_SUCCESS';
export const PRODUCTS_LOAD_FAIL = 'PRODUCTS_LOAD_FAIL';

export const CART_ADD_ITEM = 'CART_ADD_ITEM';
export const CART_REMOVE_ITEM = 'CART_REMOVE_ITEM';
export const CART_UPDATE_QUANTITY = 'CART_UPDATE_QUANTITY';
export const CART_CLEAR = 'CART_CLEAR';

export type UserRole = 'SELLER' | 'CUSTOMER' | 'ADMIN'; // Use uppercase to match your API

export interface User {
  id: string;
  email: string;
  name?: string;
  businessName?: string;
  contactPerson?: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  // Add other user fields as needed
}

export interface AuthResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  seller: string;
  stock: number;
  rating: number;
  numReviews: number;
}

export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sellerId: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export interface RootState {
  user: UserState;
  products: ProductsState;
  cart: CartState;
}
// Authentication types
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

// Transaction types
export interface Transaction {
  id: number;
  title: string;
  description: string;
  value: number | string;
  transaction_date: string;
}

export interface TransactionFormData {
  title: string;
  description: string;
  value: number;
  transaction_date: string;
}

// Pagination types
export interface PaginationData {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  next?: string;
  prev?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationData;
  links: PaginationLinks;
}

// Filter types
export interface DateRangeFilter {
  start_date?: string;
  end_date?: string;
}
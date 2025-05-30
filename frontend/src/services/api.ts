import { AuthResponse, LoginCredentials, PaginatedResponse, SignupData, Transaction, TransactionFormData } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

// Helper to handle API responses
const handleResponse = async (response: Response) => {
  if (response.status === 204) {
    return null;
  }
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  
  return response.json();
};

// Get authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Authentication API calls
export const authAPI = {
  signup: async (data: SignupData) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },
  
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    return handleResponse(response);
  },
};

// Generic transaction API with type parameter
const createTransactionAPI = <T extends Transaction>(endpoint: string) => ({
  getAll: async (page = 1, pageSize = 10, startDate?: string, endDate?: string): Promise<PaginatedResponse<T>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await fetch(`${API_URL}/${endpoint}?${params.toString()}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    
    return handleResponse(response);
  },
  
  getById: async (id: number): Promise<T> => {
    const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    
    return handleResponse(response);
  },
  
  create: async (data: TransactionFormData): Promise<T> => {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },
  
  update: async (id: number, data: Partial<TransactionFormData>): Promise<T> => {
    const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },
  
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(),
      },
    });
    
    return handleResponse(response);
  },
});

export const expensesAPI = createTransactionAPI<Transaction>('costs');
export const incomesAPI = createTransactionAPI<Transaction>('receivements');
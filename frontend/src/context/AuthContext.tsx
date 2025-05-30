import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AuthState, LoginCredentials, SignupData, User } from '../types';
import { authAPI } from '../services/api';
import { jwtDecode } from 'jwt-decode';

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

// Action types
type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'SIGNUP_REQUEST' }
  | { type: 'SIGNUP_SUCCESS' }
  | { type: 'SIGNUP_FAILURE'; payload: string }
  | { type: 'LOGOUT' };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'SIGNUP_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'SIGNUP_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

// Context
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode JWT to get user info
        const decoded = jwtDecode<{ id: number; name: string; email: string }>(token);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            token,
            user: {
              id: decoded.id,
              name: decoded.name,
              email: decoded.email,
            },
          },
        });
      } catch (error) {
        // Invalid token
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      const response = await authAPI.login(credentials);
      const { access_token } = response;
      
      // Store token
      localStorage.setItem('token', access_token);
      
      // Decode JWT to get user info
      const decoded = jwtDecode<{ id: number; name: string; email: string }>(access_token);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: access_token,
          user: {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
          },
        },
      });
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to login',
      });
      throw error;
    }
  };

  // Signup function
  const signup = async (data: SignupData) => {
    dispatch({ type: 'SIGNUP_REQUEST' });
    try {
      await authAPI.signup(data);
      dispatch({ type: 'SIGNUP_SUCCESS' });
    } catch (error) {
      dispatch({
        type: 'SIGNUP_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to signup',
      });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
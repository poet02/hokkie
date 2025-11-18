// API Helper for making requests to backend Express server
import { useState, useCallback } from 'react';

// Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: any[];
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
}

// Environment configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// Helper function to get auth token (modify based on your auth setup)
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

// Helper function to get common headers
const getHeaders = (customHeaders?: Record<string, string>): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Main API request function
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    method = 'GET',
    headers: customHeaders = {},
    body,
    timeout = 10000,
    retries = 0,
  } = options;

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers = getHeaders(customHeaders);

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include', // Important for cookies/sessions
  };

  if (body && method !== 'GET') {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  let attempts = 0;

  while (attempts <= retries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      config.signal = controller.signal;

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw {
          message: data.message || `HTTP error! status: ${response.status}`,
          status: response.status,
          errors: data.errors,
        } as ApiError;
      }

      return {
        data,
        message: data.message,
        status: response.status,
        success: response.status >= 200 && response.status < 300,
      };

    } catch (error: any) {
      attempts++;

      if (attempts > retries) {
        if (error.name === 'AbortError') {
          throw {
            message: 'Request timeout',
            status: 408,
          } as ApiError;
        }

        throw {
          message: error.message || 'Network error',
          status: error.status || 0,
          errors: error.errors,
        } as ApiError;
      }

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }
  }

  throw {
    message: 'Max retries exceeded',
    status: 0,
  } as ApiError;
};

// Convenience methods
export const api = {
  get: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

// File upload helper
export const uploadFile = async <T = any>(
  endpoint: string,
  file: File,
  additionalData: Record<string, any> = {},
  options?: Omit<RequestOptions, 'method' | 'body' | 'headers'>
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const formData = new FormData();
  formData.append('file', file);
  
  Object.entries(additionalData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const headers: HeadersInit = {};
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
    credentials: 'include',
    signal: AbortSignal.timeout(options?.timeout || 30000),
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message || `Upload failed with status: ${response.status}`,
      status: response.status,
      errors: data.errors,
    } as ApiError;
  }

  return {
    data,
    message: data.message,
    status: response.status,
    success: true,
  };
};

// React hook for API calls with state management
export const useApi = <T = any>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<T | null>(null);

  const call = useCallback(async (
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest<T>(endpoint, options);
      setData(response.data);
      setLoading(false);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      setLoading(false);
      throw apiError;
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    call,
    loading,
    error,
    data,
    reset,
  };
};

// Utility function to handle API errors
export const handleApiError = (error: ApiError, customHandler?: (error: ApiError) => void) => {
  if (customHandler) {
    customHandler(error);
    return;
  }

  // Default error handling
  console.error('API Error:', error);

  switch (error.status) {
    case 401:
      // Unauthorized - redirect to login
      window.location.href = '/login';
      break;
    case 403:
      // Forbidden
      alert('You do not have permission to perform this action.');
      break;
    case 404:
      // Not found
      alert('The requested resource was not found.');
      break;
    case 500:
      // Server error
      alert('A server error occurred. Please try again later.');
      break;
    default:
      alert(error.message || 'An unexpected error occurred.');
  }
};

// Debug helper (remove in production)
if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', API_BASE_URL);
}
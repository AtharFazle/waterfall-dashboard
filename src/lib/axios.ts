"use client";

    /* eslint-disable */
import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { API_URL } from '@/constant';

// Types
interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

// Token management
class TokenManager {
  private static getAccessToken(): string | null {
    console.log(typeof window,'window');
     if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private static getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  static setTokens(tokens: AuthTokens): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  static clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  static hasValidToken(): boolean {
    return !!this.getAccessToken();
  }

  static getAuthHeader(): string | null {
    const token = this.getAccessToken();
    return token ? `Bearer ${token}` : null;
  }
}

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization' : TokenManager.getAuthHeader() || 'aok',
  },
});

// Custom error class for API errors
export class ApiErrorClass extends Error {
  public status?: number;
  public code?: string;
  public details?: Record<string, any>;

  constructor(message: string, status?: number, code?: string, details?: Record<string, any>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Request queue for token refresh
interface QueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}

class RequestQueue {
  private static isRefreshing = false;
  private static failedQueue: QueueItem[] = [];

  static async processQueue(error: any = null, token: string | null = null): Promise<void> {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  static addToQueue(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.failedQueue.push({ resolve, reject });
    });
  }

  static setRefreshing(status: boolean): void {
    this.isRefreshing = status;
  }

  static getRefreshing(): boolean {
    return this.isRefreshing;
  }
}

// Setup interceptors
export const setupInterceptors = (queryClient?: QueryClient) => {
  // Request Interceptor
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add auth token
      const authHeader = TokenManager.getAuthHeader();
      if (authHeader) {
        config.headers.Authorization = authHeader;
      }

      // Add request metadata
      config.headers['X-Request-ID'] = crypto.randomUUID();
      config.headers['X-Timestamp'] = new Date().toISOString();

      // Development logging
      if (process.env.NODE_ENV === 'development') {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: `${config.baseURL}${config.url}`,
          headers: config.headers,
          data: config.data,
        });
      }

      return config;
    },
    (error: AxiosError) => {
      console.error('❌ Request Setup Error:', error);
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  api.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      // Development logging
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ API Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
      }

      return response;
    },
    async (error: AxiosError<ApiError>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle token refresh for 401 errors
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        if (RequestQueue.getRefreshing()) {
          try {
            const token = await RequestQueue.addToQueue();
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        originalRequest._retry = true;
        RequestQueue.setRefreshing(true);

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await axios.post<RefreshResponse>('/auth/refresh', {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          TokenManager.setTokens({
            accessToken,
            refreshToken: newRefreshToken || refreshToken,
          });

          RequestQueue.processQueue(null, accessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          return api(originalRequest);
        } catch (refreshError) {
          RequestQueue.processQueue(refreshError, null);
          TokenManager.clearTokens();
          
          // Invalidate all queries on auth failure
          queryClient?.clear();
          
          // Redirect to login (you might want to use your router here)
          window.location.href = '/login';
          
          return Promise.reject(new ApiErrorClass('Authentication failed', 401));
        } finally {
          RequestQueue.setRefreshing(false);
        }
      }

      // Handle different error types
      if (error.response) {
        const { status, data } = error.response;
        const message = data?.message || 'An error occurred';

        // Log error details
        console.error('❌ API Error:', {
          status,
          message,
          url: error.config?.url,
          method: error.config?.method,
        });

        // Handle specific status codes
        switch (status) {
          case 401:
            console.error('❌ Unauthorized:', message);
            window.location.href = '/login';
            break;
          case 403:
            // Forbidden - might want to show a specific message
            break;
          case 404:
            // Not found - React Query will handle this
            break;
          case 422:
            // Validation errors
            break;
          case 500:
            // Server error - might want to show a toast
            break;
        }

        throw new ApiErrorClass(message, status, data?.code, data?.details);
      } else if (error.request) {
        // Network error
        console.error('❌ Network Error:', error.message);
        throw new ApiErrorClass('Network error occurred', undefined, 'NETWORK_ERROR');
      } else {
        // Other error
        console.error('❌ Error:', error.message);
        throw new ApiErrorClass(error.message, undefined, 'UNKNOWN_ERROR');
      }
    }
  );
};

// API service functions with proper typing
export const apiClient = {
  get: <T = any>(url: string, config?: any): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.get<ApiResponse<T>>(url, config),

  post: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.post<ApiResponse<T>>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.put<ApiResponse<T>>(url, data, config),

  patch: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.patch<ApiResponse<T>>(url, data, config),

  delete: <T = any>(url: string, config?: any): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.delete<ApiResponse<T>>(url, config),
};

// React Query integration helpers
export const createApiQueryFn = <T>(url: string) => 
  async (): Promise<T> => {
    const response = await apiClient.get<T>(url);
    return response.data.data;
  };

export const createApiMutationFn = <TData, TVariables>(
  url: string,
  method: 'post' | 'put' | 'patch' | 'delete' = 'post'
) => 
  async (variables: TVariables): Promise<TData> => {
    const response = await apiClient[method]<TData>(url, variables);
    return response.data.data;
  };

// Export the configured axios instance
export default api;

// Usage examples:

// React Query hook example:
/*
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query hook
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: createApiQueryFn<User[]>('/users'),
  });
};

// Mutation hook
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createApiMutationFn<User, CreateUserData>('/users', 'post'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Setup in your App component:
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupInterceptors } from './api/interceptors';

const queryClient = new QueryClient();
setupInterceptors(queryClient);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      // Your app components
    </QueryClientProvider>
  );
}
*/
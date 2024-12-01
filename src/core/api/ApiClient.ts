import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { store } from '@core/store';
import { setLoading } from '@core/store/slices/uiSlice';
import { setGlobalError } from '@core/store/slices/errorSlice';
import { getAuthToken, refreshSession } from '@core/utils/session';
import { ApiResponse, ApiError } from '../types/api';

// Constants
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;
const CIRCUIT_BREAKER_THRESHOLD = 5;
const CIRCUIT_BREAKER_RESET_TIMEOUT = 60000;

export class ApiClient {
  private axios: AxiosInstance;
  private failureCount: number = 0;
  private circuitOpen: boolean = false;
  private lastError: Date | null = null;

  constructor(baseURL: string) {
    this.axios = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.axios.interceptors.request.use(
      async (config) => {
        store.dispatch(setLoading(true));
        
        if (this.circuitOpen) {
          if (this.lastError && Date.now() - this.lastError.getTime() > CIRCUIT_BREAKER_RESET_TIMEOUT) {
            this.resetCircuitBreaker();
          } else {
            throw new Error('Circuit breaker is open');
          }
        }

        try {
          const token = await getAuthToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
        }

        return config;
      },
      (error) => {
        store.dispatch(setLoading(false));
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axios.interceptors.response.use(
      (response) => {
        store.dispatch(setLoading(false));
        this.failureCount = 0;
        return response;
      },
      async (error: AxiosError) => {
        store.dispatch(setLoading(false));
        
        // Handle token expiration
        if (error.response?.status === 401) {
          try {
            await refreshSession();
            const token = await getAuthToken();
            if (token && error.config) {
              error.config.headers.Authorization = `Bearer ${token}`;
              return this.axios.request(error.config);
            }
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        this.failureCount++;
        if (this.failureCount >= CIRCUIT_BREAKER_THRESHOLD) {
          this.openCircuitBreaker();
        }

        const errorMessage = this.extractErrorMessage(error);
        store.dispatch(setGlobalError(errorMessage));
        return Promise.reject(error);
      }
    );
  }

  private async retryRequest<T>(
    requestFn: () => Promise<AxiosResponse<ApiResponse<T>>>,
    retries: number = MAX_RETRIES,
    delay: number = INITIAL_RETRY_DELAY
  ): Promise<ApiResponse<T>> {
    try {
      const response = await requestFn();
      return response.data;
    } catch (error) {
      if (retries === 0 || !this.shouldRetry(error as AxiosError)) {
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      return this.retryRequest(requestFn, retries - 1, delay * 2);
    }
  }

  private shouldRetry(error: AxiosError): boolean {
    // Retry on network errors or 5xx server errors
    return !error.response || (error.response.status >= 500 && error.response.status < 600);
  }

  private openCircuitBreaker() {
    this.circuitOpen = true;
    this.lastError = new Date();
  }

  private resetCircuitBreaker() {
    this.circuitOpen = false;
    this.failureCount = 0;
    this.lastError = null;
  }

  private extractErrorMessage(error: AxiosError): string {
    if (error.response?.data && typeof error.response.data === 'object') {
      const data = error.response.data as ApiError;
      return data.message || 'An unexpected error occurred';
    }
    return error.message || 'Network error occurred';
  }

  // Generic request method with retries and circuit breaker
  async request<T>(config: {
    method: string;
    endpoint: string;
    data?: any;
    params?: any;
    headers?: Record<string, string>;
  }): Promise<ApiResponse<T>> {
    return this.retryRequest(() =>
      this.axios.request({
        method: config.method,
        url: config.endpoint,
        data: config.data,
        params: config.params,
        headers: config.headers
      })
    );
  }

  // Convenience methods
  async get<T>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', endpoint, params });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', endpoint, data });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', endpoint, data });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', endpoint });
  }
}

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { getAuthToken, refreshSession } from '@core/utils/session';
import { store } from '@core/store';
import { setGlobalError } from '@core/store/slices/errorSlice';
import { setLoading } from '@core/store/slices/uiSlice';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

class ApiClient {
  private client: AxiosInstance;
  private cache: Map<string, { data: any; timestamp: number }>;
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
    });
    this.cache = new Map();
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        store.dispatch(setLoading(true));
        
        // Add auth token
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
    this.client.interceptors.response.use(
      (response) => {
        store.dispatch(setLoading(false));
        return response;
      },
      async (error: AxiosError) => {
        store.dispatch(setLoading(false));

        const originalRequest = error.config as RetryConfig;
        
        // Handle token expiration
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await refreshSession();
            return this.client(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        let errorMessage = 'An unexpected error occurred';
        if (error.response) {
          errorMessage = error.response.data?.message || error.message;
        } else if (error.request) {
          errorMessage = 'No response received from server';
        }

        store.dispatch(setGlobalError(errorMessage));
        return Promise.reject(error);
      }
    );
  }

  private async retryRequest(config: AxiosRequestConfig, retries = 0): Promise<any> {
    try {
      const response = await this.client(config);
      return response.data;
    } catch (error) {
      if (retries < MAX_RETRIES && this.shouldRetry(error as AxiosError)) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retries + 1)));
        return this.retryRequest(config, retries + 1);
      }
      throw error;
    }
  }

  private shouldRetry(error: AxiosError): boolean {
    return (
      error.code === 'ECONNABORTED' ||
      error.response?.status === 429 ||
      error.response?.status === 503 ||
      error.response?.status === 504
    );
  }

  private getCacheKey(config: AxiosRequestConfig): string {
    return `${config.method}-${config.url}-${JSON.stringify(config.params)}-${JSON.stringify(
      config.data
    )}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const cacheKey = this.getCacheKey(config);

    // Return cached data if available and valid
    if (config.method?.toLowerCase() === 'get') {
      const cached = this.cache.get(cacheKey);
      if (cached && this.isCacheValid(cached.timestamp)) {
        return cached.data;
      }
    }

    const data = await this.retryRequest(config);

    // Cache GET requests
    if (config.method?.toLowerCase() === 'get') {
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
    }

    return data;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'get', url });
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'post', url, data });
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'put', url, data });
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'patch', url, data });
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'delete', url });
  }

  clearCache() {
    this.cache.clear();
  }
}

export const apiClient = new ApiClient();

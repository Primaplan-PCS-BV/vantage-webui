import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { components } from '../types/api';

// Type aliases for better readability
export type ChatRequest = components['schemas']['ChatRequest'];
export type ChatResponse = components['schemas']['ChatResponse'];
export type HealthResponse = components['schemas']['HealthResponse'];
export type ValidationError = components['schemas']['ValidationError'];
export type HTTPValidationError = components['schemas']['HTTPValidationError'];

// API Error class for better error handling
export class ApiError extends Error {
  status?: number;
  data?: unknown;
  originalError?: AxiosError;

  constructor(
    message: string,
    status?: number,
    data?: unknown,
    originalError?: AxiosError
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.originalError = originalError;
  }
}

// Notification callback type
type NotificationCallback = (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;

// Global notification handler
let notificationHandler: NotificationCallback | null = null;

export const setNotificationHandler = (handler: NotificationCallback) => {
  notificationHandler = handler;
};

// Create axios instance with configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens, logging, etc.
api.interceptors.request.use(
  (config) => {
    // Add auth token if available (for future implementation)
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }

    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('[API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling and notifications
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }

    return response;
  },
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.error('[API Response Error]', error);
    }

    // Handle different error scenarios
    let errorMessage = 'An unexpected error occurred';
    let notificationType: 'error' | 'warning' = 'error';

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 400:
          errorMessage = 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please login again.';
          // TODO: Redirect to login or refresh token
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'The requested resource was not found.';
          break;
        case 422:
          // Validation error from FastAPI
          if (data?.detail && Array.isArray(data.detail)) {
            const validationErrors = data.detail as ValidationError[];
            errorMessage = validationErrors
              .map((err) => `${err.loc.join('.')}: ${err.msg}`)
              .join(', ');
          } else {
            errorMessage = 'Validation error. Please check your input.';
          }
          notificationType = 'warning';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = 'Service temporarily unavailable. Please try again later.';
          break;
        default:
          errorMessage = data?.detail || data?.message || errorMessage;
      }
    } else if (error.request) {
      // Request made but no response received
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your connection and try again.';
      } else {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }
    }

    // Trigger global notification if handler is set
    if (notificationHandler) {
      notificationHandler(notificationType, errorMessage);
    }

    // Return a custom API error
    return Promise.reject(
      new ApiError(errorMessage, error.response?.status, error.response?.data, error)
    );
  }
);

// Helper function to handle API responses
const handleResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

// API Service functions with proper typing

/**
 * Send a chat message to the Vantage AI agent
 */
export const postChat = async (data: ChatRequest): Promise<ChatResponse> => {
  const response = await api.post<ChatResponse>('/chat', data);
  return handleResponse(response);
};

/**
 * Check the health status of the API
 */
export const getHealth = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>('/health');
  return handleResponse(response);
};

/**
 * Get performance statistics
 */
export const getPerformance = async (): Promise<unknown> => {
  const response = await api.get<unknown>('/performance');
  return handleResponse(response);
};

/**
 * Start performance profiling session
 */
export const startProfiling = async (): Promise<unknown> => {
  const response = await api.post<unknown>('/performance/profile/start');
  return handleResponse(response);
};

/**
 * Stop performance profiling and get results
 */
export const stopProfiling = async (): Promise<unknown> => {
  const response = await api.post<unknown>('/performance/profile/stop');
  return handleResponse(response);
};

/**
 * Monitor performance during high-load chat bursts
 */
export const monitorChatBurst = async (durationSeconds?: number): Promise<unknown> => {
  const params = durationSeconds !== undefined ? { duration_seconds: durationSeconds } : undefined;
  const response = await api.post<unknown>('/performance/monitor-burst', null, { params });
  return handleResponse(response);
};

/**
 * Get P6 database connection status
 */
export const getP6Status = async (): Promise<unknown> => {
  const response = await api.get<unknown>('/p6/status');
  return handleResponse(response);
};

/**
 * Get root endpoint information
 */
export const getRoot = async (): Promise<unknown> => {
  const response = await api.get<unknown>('/');
  return handleResponse(response);
};

// Utility functions for common operations

/**
 * Retry a failed request with exponential backoff
 */
export const retryRequest = async <T>(
  request: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> => {
  let lastError: Error | undefined;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await request();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on client errors (4xx)
      if (error instanceof ApiError && error.status && error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

/**
 * Cancel all pending requests
 */
export const cancelAllRequests = () => {
  // This would require implementing AbortController logic
  // For now, this is a placeholder
  console.warn('Request cancellation not yet implemented');
};

// Export the axios instance for advanced usage
export { api as axiosInstance };

// Export types
export type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError };

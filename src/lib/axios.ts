import axios from 'axios';

// Create axios instance with default configuration for Laravel Sanctum SPA
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true, // Essential for Sanctum SPA authentication
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Required by Laravel
  },
});

// Request interceptor to handle CSRF token
api.interceptors.request.use(
  (config) => {
    // For SPA authentication, CSRF token is handled automatically via cookies
    // No need to manually set CSRF token for Sanctum SPA
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Don't redirect to login if already on login page or if it's a refresh attempt
      if (window.location.pathname !== '/login' && !originalRequest._retry) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Handle 419 CSRF token mismatch - refresh CSRF cookie and retry
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.get('/sanctum/csrf-cookie');
        return api(originalRequest);
      } catch (csrfError) {
        // If CSRF refresh fails, redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(csrfError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.warn('Access forbidden:', error.response.data?.message);
    }

    // Handle 422 Validation Errors
    if (error.response?.status === 422) {
      console.warn('Validation error:', error.response.data?.errors);
    }

    return Promise.reject(error);
  }
);

export default api;

// Helper function to get CSRF cookie (used before authentication requests)
export const getCsrfCookie = () => {
  return api.get('/sanctum/csrf-cookie');
};

// Helper function to handle API errors with improved error messages
export const handleApiError = (error: any): string => {
  // Handle network errors
  if (!error.response) {
    return 'Network error. Please check your internet connection.';
  }

  const { status, data } = error.response;

  // Handle specific status codes
  switch (status) {
    case 401:
      return 'Authentication required. Please log in.';
    case 403:
      return 'Access denied. You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 419:
      return 'Your session has expired. Please refresh the page and try again.';
    case 422:
      // Handle validation errors
      if (data?.errors) {
        const errors = Object.values(data.errors).flat() as string[];
        return errors[0] || 'Validation failed. Please check your input.';
      }
      return 'Validation failed. Please check your input.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      break;
  }

  // Return specific error message from API if available
  if (data?.message) {
    return data.message;
  }

  // Fallback error message
  return error.message || 'An unexpected error occurred. Please try again.';
};

// Helper function to check if error is a validation error
export const isValidationError = (error: any): boolean => {
  return error.response?.status === 422;
};

// Helper function to get validation errors as object
export const getValidationErrors = (error: any): Record<string, string[]> => {
  if (isValidationError(error)) {
    return error.response.data?.errors || {};
  }
  return {};
};

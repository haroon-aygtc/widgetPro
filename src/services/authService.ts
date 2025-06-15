import { userApi, handleApiError, type ApiResponse } from "@/lib/api";

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  roles?: Array<{
    id: number;
    name: string;
    display_name: string;
  }>;
  permissions?: Array<{
    id: number;
    name: string;
    display_name: string;
  }>;
}

export interface AuthResponse {
  user: AuthUser;
  token?: string;
  message?: string;
}

// Authentication service class
class AuthService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      credentials: "include", // Include cookies for session-based auth
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest", // Laravel CSRF requirement
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data: data,
          },
          message: data.message || "An error occurred",
        };
      }

      return data;
    } catch (error: any) {
      if (error.response) {
        throw error;
      }
      throw {
        message: "Network error occurred",
        response: { status: 500, data: {} },
      };
    }
  }

  // Get CSRF token
  async getCsrfToken(): Promise<void> {
    try {
      await fetch(`${this.baseURL}/sanctum/csrf-cookie`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
    } catch (error) {
      console.warn("Failed to get CSRF token:", error);
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Get CSRF token first
    await this.getCsrfToken();

    const response = await this.request<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    return response.data;
  }

  // Register user
  async register(
    userData: Omit<RegisterData, "confirmPassword">,
  ): Promise<AuthResponse> {
    // Get CSRF token first
    await this.getCsrfToken();

    const response = await this.request<AuthResponse>("/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    return response.data;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await this.request<void>("/logout", {
        method: "POST",
      });
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.warn("Logout request failed:", error);
    }
  }

  // Get current user
  async getCurrentUser(): Promise<AuthUser> {
    const response = await this.request<AuthUser>("/user");
    return response.data;
  }

  // Refresh user data
  async refreshUser(): Promise<AuthUser> {
    return this.getCurrentUser();
  }

  // Check if user is authenticated
  async checkAuth(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Password reset request
  async requestPasswordReset(email: string): Promise<void> {
    await this.getCsrfToken();

    await this.request<void>("/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  // Reset password
  async resetPassword(data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> {
    await this.getCsrfToken();

    await this.request<void>("/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Email verification
  async resendEmailVerification(): Promise<void> {
    await this.request<void>("/email/verification-notification", {
      method: "POST",
    });
  }
}

// Create auth service instance
export const authService = new AuthService("http://localhost:8000");

// Auth error handler
export const handleAuthError = (error: any): string => {
  return handleApiError(error);
};

// Auth validation helpers
export const authValidation = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isStrongPassword: (password: string): boolean => {
    return (
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password)
    );
  },

  passwordsMatch: (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
  },
};

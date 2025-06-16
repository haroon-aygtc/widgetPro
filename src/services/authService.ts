import api, { getCsrfCookie, handleApiError } from "@/lib/axios";

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  remember?: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  status: string;
  roles?: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
  permissions?: Array<{
    id: number;
    name: string;
    display_name: string;
    category: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: AuthUser;
  errors?: Record<string, string[]>;
}

// Authentication service class using pure Sanctum SPA authentication
class AuthService {
  // Get CSRF token for SPA authentication
  async getCsrfToken(): Promise<void> {
    await getCsrfCookie();
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Get CSRF token first for SPA authentication
    await this.getCsrfToken();

    const response = await api.post<AuthResponse>("/api/login", credentials);
    return response.data;
  }

  // Register user
  async register(userData: RegisterData): Promise<AuthResponse> {
    // Get CSRF token first for SPA authentication
    await this.getCsrfToken();

    const response = await api.post<AuthResponse>("/api/register", userData);
    return response.data;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post("/api/logout");
    } catch (error) {
      // Log error but don't throw - we want to clear local state regardless
      console.warn('Logout API call failed:', handleApiError(error));
    }
  }

  // Get current user
  async getCurrentUser(): Promise<AuthUser> {
    const response = await api.get<AuthResponse>("/api/user");
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'User not authenticated');
    }
    return response.data.data;
  }

  // Refresh user data (same as getCurrentUser for SPA)
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
  async requestPasswordReset(data: ForgotPasswordData): Promise<void> {
    await this.getCsrfToken();
    const response = await api.post<AuthResponse>("/api/forgot-password", data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to send password reset email');
    }
  }

  // Reset password
  async resetPassword(data: ResetPasswordData): Promise<void> {
    await this.getCsrfToken();
    const response = await api.post<AuthResponse>("/api/reset-password", data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to reset password');
    }
  }

  // Email verification
  // async resendEmailVerification(): Promise<void> {
  //   const response = await api.post<AuthResponse>("/api/email/verification-notification");
  //   if (!response.data.success) {
  //     throw new Error(response.data.message || 'Failed to send verification email');
  //   }
  // }

  // // Verify email (this would typically be handled by a link in email)
  // async verifyEmail(id: string, hash: string): Promise<void> {
  //   const response = await api.get<AuthResponse>(`/api/email/verify/${id}/${hash}`);
  //   if (!response.data.success) {
  //     throw new Error(response.data.message || 'Failed to verify email');
  //   }
  // }
}

// Create auth service instance
export const authService = new AuthService();

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

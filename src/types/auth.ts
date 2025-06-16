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
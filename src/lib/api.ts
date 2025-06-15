// Central API client for all backend communication
interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string[]>;
  }
  
  interface PaginatedResponse<T> extends ApiResponse<T[]> {
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  }
  
  class ApiClient {
    private baseURL: string;
    private token: string | null = null;
  
    constructor() {
      this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      this.token = localStorage.getItem('auth_token');
    }
  
    private async request<T = any>(
      endpoint: string,
      options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
      const url = `${this.baseURL}${endpoint}`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      };
  
      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }
  
      try {
        const response = await fetch(url, {
          ...options,
          headers,
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || 'API request failed');
        }
  
        return data;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('auth_token', token);
    }
  
    clearToken() {
      this.token = null;
      localStorage.removeItem('auth_token');
    }
  
    // Generic CRUD methods
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
      return this.request<T>(endpoint, { method: 'GET' });
    }
  
    async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
      return this.request<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  
    async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
      return this.request<T>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }
  
    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
      return this.request<T>(endpoint, { method: 'DELETE' });
    }
  
    // Paginated requests
    async getPaginated<T>(
      endpoint: string,
      params?: Record<string, any>
    ): Promise<PaginatedResponse<T>> {
      const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
      return this.request<T[]>(`${endpoint}${queryString}`, { method: 'GET' }) as Promise<PaginatedResponse<T>>;
    }
  }
  
  // Export singleton instance
  export const apiClient = new ApiClient();
  
  // User Management API
  export interface User {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles: Role[];
    permissions: Permission[];
  }
  
  export interface Role {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    permissions: Permission[];
    users_count?: number;
  }
  
  export interface Permission {
    id: number;
    name: string;
    display_name: string;
    description: string;
    category: string;
    created_at: string;
    updated_at: string;
    roles_count?: number;
    users_count?: number;
  }
  
  export interface UserActivity {
    id: number;
    user_id: number;
    action: string;
    description: string;
    ip_address: string;
    user_agent: string;
    location: string;
    status: 'success' | 'failed' | 'warning';
    details: string;
    created_at: string;
    user: User;
  }
  
  export const userApi = {
    // Users
    getUsers: (params?: { search?: string; role?: string; status?: string; page?: number }) =>
      apiClient.getPaginated<User>('/users', params),
    
    getUser: (id: number) =>
      apiClient.get<User>(`/users/${id}`),
    
    createUser: (data: { name: string; email: string; password: string; role_ids?: number[] }) =>
      apiClient.post<User>('/users', data),
    
    updateUser: (id: number, data: { name?: string; email?: string; status?: string; role_ids?: number[] }) =>
      apiClient.put<User>(`/users/${id}`, data),
    
    deleteUser: (id: number) =>
      apiClient.delete(`/users/${id}`),
    
    // Roles
    getRoles: (params?: { search?: string; page?: number }) =>
      apiClient.getPaginated<Role>('/roles', params),
    
    getRole: (id: number) =>
      apiClient.get<Role>(`/roles/${id}`),
    
    createRole: (data: { name: string; description: string; permission_ids?: number[] }) =>
      apiClient.post<Role>('/roles', data),
    
    updateRole: (id: number, data: { name?: string; description?: string; permission_ids?: number[] }) =>
      apiClient.put<Role>(`/roles/${id}`, data),
    
    deleteRole: (id: number) =>
      apiClient.delete(`/roles/${id}`),
    
    // Permissions
    getPermissions: (params?: { search?: string; category?: string; page?: number }) =>
      apiClient.getPaginated<Permission>('/permissions', params),
    
    getPermission: (id: number) =>
      apiClient.get<Permission>(`/permissions/${id}`),
    
    createPermission: (data: { name: string; display_name: string; description: string; category: string }) =>
      apiClient.post<Permission>('/permissions', data),
    
    updatePermission: (id: number, data: { name?: string; display_name?: string; description?: string; category?: string }) =>
      apiClient.put<Permission>(`/permissions/${id}`, data),
    
    deletePermission: (id: number) =>
      apiClient.delete(`/permissions/${id}`),
    
    // Role Assignment
    assignRole: (userId: number, roleId: number) =>
      apiClient.post(`/users/${userId}/roles`, { role_id: roleId }),
    
    removeRole: (userId: number, roleId: number) =>
      apiClient.delete(`/users/${userId}/roles/${roleId}`),
    
    // Permission Assignment
    assignPermission: (userId: number, permissionId: number) =>
      apiClient.post(`/users/${userId}/permissions`, { permission_id: permissionId }),
    
    removePermission: (userId: number, permissionId: number) =>
      apiClient.delete(`/users/${userId}/permissions/${permissionId}`),
    
    assignPermissionsToUser: (userId: number, permissionIds: number[]) =>
      apiClient.post(`/users/${userId}/permissions/bulk`, { permission_ids: permissionIds }),
    
    // User Activity
    getUserActivities: (params?: { 
      search?: string; 
      user_id?: number; 
      action?: string; 
      status?: string;
      date_from?: string;
      date_to?: string;
      page?: number;
    }) =>
      apiClient.getPaginated<UserActivity>('/user-activities', params),
    
    exportUserActivities: (params?: Record<string, any>) =>
      apiClient.get('/user-activities/export', params),
  };
  
  // Error handling utility
  export const handleApiError = (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  };
  
  // Validation error handling
  export const handleValidationErrors = (errors: Record<string, string[]>): Record<string, string> => {
    const formattedErrors: Record<string, string> = {};
    Object.keys(errors).forEach(field => {
      formattedErrors[field] = errors[field][0]; // Take first error message
    });
    return formattedErrors;
  };
  
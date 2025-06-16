import api from "./axios";

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  roles?: Role[];
  permissions?: Permission[];
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  permissions?: Permission[];
  users_count?: number;
}

export interface Permission {
  id: number;
  name: string;
  display_name: string;
  description?: string;
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
  description?: string;
  status: "success" | "failed" | "warning";
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

// API Client using Axios
class ApiClient {
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response = await api.request({
        method,
        url: `/api${endpoint}`,
        data,
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // User endpoints
  async getUsers(params?: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<User>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.role) searchParams.append("role", params.role);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.per_page) searchParams.append("per_page", params.per_page.toString());

    const query = searchParams.toString();
    const response = await api.get(`/api/users${query ? `?${query}` : ""}`);
    return response.data;
  }

  async getUser(id: number): Promise<ApiResponse<User>> {
    return this.request<User>('GET', `/users/${id}`);
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role_ids?: number[];
    status?: string;
  }): Promise<ApiResponse<User>> {
    return this.request<User>('POST', "/users", data);
  }

  async updateUser(
    id: number,
    data: {
      name?: string;
      email?: string;
      role_ids?: number[];
      status?: string;
    },
  ): Promise<ApiResponse<User>> {
    return this.request<User>('PUT', `/users/${id}`, data);
  }

  async changeUserPassword(
    id: number,
    data: {
      password: string;
      password_confirmation: string;
    },
  ): Promise<ApiResponse<User>> {
    return this.request<User>('PUT', `/users/${id}/password`, data);
  }

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return this.request<void>('DELETE', `/users/${id}`);
  }

  // Role endpoints
  async getRoles(params?: {
    search?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Role>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.per_page) searchParams.append("per_page", params.per_page.toString());

    const query = searchParams.toString();
    const response = await api.get(`/api/roles${query ? `?${query}` : ""}`);
    return response.data;
  }

  async getRole(id: number): Promise<ApiResponse<Role>> {
    return this.request<Role>('GET', `/roles/${id}`);
  }

  async createRole(data: {
    name: string;
    description: string;
    permission_ids?: number[];
  }): Promise<ApiResponse<Role>> {
    return this.request<Role>('POST', "/roles", data);
  }

  async updateRole(
    id: number,
    data: {
      name: string;
      description: string;
      permission_ids?: number[];
    },
  ): Promise<ApiResponse<Role>> {
    return this.request<Role>('PUT', `/roles/${id}`, data);
  }

  async deleteRole(id: number): Promise<ApiResponse<void>> {
    return this.request<void>('DELETE', `/roles/${id}`);
  }

  // Permission endpoints
  async getPermissions(params?: {
    search?: string;
    category?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Permission>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.category) searchParams.append("category", params.category);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.per_page) searchParams.append("per_page", params.per_page.toString());

    const query = searchParams.toString();
    const response = await api.get(`/api/permissions${query ? `?${query}` : ""}`);
    return response.data;
  }

  async getPermissionsGrouped(): Promise<ApiResponse<Record<string, Permission[]>>> {
    return this.request<Record<string, Permission[]>>('GET', "/permissions/grouped");
  }

  async createPermission(data: {
    name: string;
    display_name: string;
    description?: string;
    category: string;
  }): Promise<ApiResponse<Permission>> {
    return this.request<Permission>('POST', "/permissions", data);
  }

  async updatePermission(
    id: number,
    data: {
      name: string;
      display_name: string;
      description?: string;
      category: string;
    },
  ): Promise<ApiResponse<Permission>> {
    return this.request<Permission>('PUT', `/permissions/${id}`, data);
  }

  async deletePermission(id: number): Promise<ApiResponse<void>> {
    return this.request<void>('DELETE', `/permissions/${id}`);
  }

  // User Activity endpoints
  async getUserActivities(params?: {
    search?: string;
    user_id?: number;
    action?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<UserActivity>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.user_id) searchParams.append("user_id", params.user_id.toString());
    if (params?.action) searchParams.append("action", params.action);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.date_from) searchParams.append("date_from", params.date_from);
    if (params?.date_to) searchParams.append("date_to", params.date_to);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.per_page) searchParams.append("per_page", params.per_page.toString());

    const query = searchParams.toString();
    const response = await api.get(`/api/user-activities${query ? `?${query}` : ""}`);
    return response.data;
  }

  async getUserActivityStatistics(params?: {
    date_from?: string;
    date_to?: string;
  }): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();
    if (params?.date_from) searchParams.append("date_from", params.date_from);
    if (params?.date_to) searchParams.append("date_to", params.date_to);

    const query = searchParams.toString();
    return this.request<any>('GET', `/user-activities/statistics${query ? `?${query}` : ""}`);
  }

  // Role-Permission assignment
  async assignPermissionsToRole(
    roleId: number,
    permissionIds: number[],
  ): Promise<ApiResponse<void>> {
    return this.request<void>('POST', `/roles/${roleId}/permissions`, {
      permission_ids: permissionIds
    });
  }

  // User-Permission assignment
  async assignPermissionsToUser(
    userId: number,
    permissionIds: number[],
  ): Promise<ApiResponse<void>> {
    return this.request<void>('POST', `/users/${userId}/permissions/bulk`, {
      permission_ids: permissionIds
    });
  }

  // User-Role assignment
  async assignRolesToUser(
    userId: number,
    roleIds: number[],
  ): Promise<ApiResponse<void>> {
    return this.request<void>('POST', `/users/${userId}/roles`, {
      role_ids: roleIds
    });
  }

  async getPermissionUsers(permissionId: number) {
    return this.request<User[]>('GET', `/permissions/${permissionId}/users`);
  }

  async getPermissionRoles(permissionId: number) {
    return this.request<Role[]>('GET', `/permissions/${permissionId}/roles`);
  }
}

// Create API client instance
export const userApi = new ApiClient();

// Re-export error handlers from axios
export { handleApiError, isValidationError, getValidationErrors } from "./axios";

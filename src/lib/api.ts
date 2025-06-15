const API_BASE_URL = "http://localhost:8000/api";

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  status: string;
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
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// API Client
class ApiClient {
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
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
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

  // User endpoints
  async getUsers(params?: {
    search?: string;
    role?: string;
    page?: number;
  }): Promise<ApiResponse<User[]>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.role) searchParams.append("role", params.role);
    if (params?.page) searchParams.append("page", params.page.toString());

    const query = searchParams.toString();
    return this.request<User[]>(`/users${query ? `?${query}` : ""}`);
  }

  async getUser(id: number): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`);
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role_ids?: number[];
  }): Promise<ApiResponse<User>> {
    return this.request<User>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateUser(
    id: number,
    data: {
      name: string;
      email: string;
      role_ids?: number[];
    },
  ): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${id}`, {
      method: "DELETE",
    });
  }

  // Role endpoints
  async getRoles(params?: {
    search?: string;
    page?: number;
  }): Promise<ApiResponse<Role[]>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.page) searchParams.append("page", params.page.toString());

    const query = searchParams.toString();
    return this.request<Role[]>(`/roles${query ? `?${query}` : ""}`);
  }

  async getRole(id: number): Promise<ApiResponse<Role>> {
    return this.request<Role>(`/roles/${id}`);
  }

  async createRole(data: {
    name: string;
    description: string;
    permission_ids?: number[];
  }): Promise<ApiResponse<Role>> {
    return this.request<Role>("/roles", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateRole(
    id: number,
    data: {
      name: string;
      description: string;
      permission_ids?: number[];
    },
  ): Promise<ApiResponse<Role>> {
    return this.request<Role>(`/roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteRole(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/roles/${id}`, {
      method: "DELETE",
    });
  }

  // Permission endpoints
  async getPermissions(params?: {
    search?: string;
    category?: string;
    page?: number;
  }): Promise<ApiResponse<Permission[]>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.category) searchParams.append("category", params.category);
    if (params?.page) searchParams.append("page", params.page.toString());

    const query = searchParams.toString();
    return this.request<Permission[]>(
      `/permissions${query ? `?${query}` : ""}`,
    );
  }

  async getPermissionsGrouped(): Promise<
    ApiResponse<Record<string, Permission[]>>
  > {
    return this.request<Record<string, Permission[]>>("/permissions/grouped");
  }

  async createPermission(data: {
    name: string;
    display_name: string;
    description?: string;
    category: string;
  }): Promise<ApiResponse<Permission>> {
    return this.request<Permission>("/permissions", {
      method: "POST",
      body: JSON.stringify(data),
    });
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
    return this.request<Permission>(`/permissions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePermission(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/permissions/${id}`, {
      method: "DELETE",
    });
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
  }): Promise<ApiResponse<UserActivity[]>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.user_id)
      searchParams.append("user_id", params.user_id.toString());
    if (params?.action) searchParams.append("action", params.action);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.date_from) searchParams.append("date_from", params.date_from);
    if (params?.date_to) searchParams.append("date_to", params.date_to);
    if (params?.page) searchParams.append("page", params.page.toString());

    const query = searchParams.toString();
    return this.request<UserActivity[]>(
      `/user-activities${query ? `?${query}` : ""}`,
    );
  }

  async getUserActivityStatistics(params?: {
    date_from?: string;
    date_to?: string;
  }): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();
    if (params?.date_from) searchParams.append("date_from", params.date_from);
    if (params?.date_to) searchParams.append("date_to", params.date_to);

    const query = searchParams.toString();
    return this.request<any>(
      `/user-activities/statistics${query ? `?${query}` : ""}`,
    );
  }

  // Role-Permission assignment
  async assignPermissionsToRole(
    roleId: number,
    permissionIds: number[],
  ): Promise<ApiResponse<void>> {
    return this.request<void>(`/roles/${roleId}/permissions`, {
      method: "POST",
      body: JSON.stringify({ permission_ids: permissionIds }),
    });
  }

  // User-Permission assignment
  async assignPermissionsToUser(
    userId: number,
    permissionIds: number[],
  ): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${userId}/permissions`, {
      method: "POST",
      body: JSON.stringify({ permission_ids: permissionIds }),
    });
  }

  // User-Role assignment
  async assignRolesToUser(
    userId: number,
    roleIds: number[],
  ): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${userId}/roles`, {
      method: "POST",
      body: JSON.stringify({ role_ids: roleIds }),
    });
  }
}

// Create API client instance
export const userApi = new ApiClient(API_BASE_URL);

// Error handler utility
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    const firstError = Object.values(errors)[0];
    if (Array.isArray(firstError)) {
      return firstError[0] as string;
    }
  }
  return error.message || "An unexpected error occurred";
};

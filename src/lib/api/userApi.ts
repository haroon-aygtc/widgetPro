import { BaseApiClient } from "./config/BaseApiClient";
import type { ApiResponse, PaginatedResponse } from "../../types/api";
import type { User, Role, Permission, UserActivity } from "../../types/user";

class UserApiClient extends BaseApiClient {
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
        const response = await super.request<PaginatedResponse<User>>(
            'GET',
            `/users${query ? `?${query}` : ""}`
        );
        return response;
    }

    async getUser(id: number): Promise<ApiResponse<User>> {
        return super.request<ApiResponse<User>>('GET', `/users/${id}`);
    }

    async createUser(data: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        role_ids?: number[];
        status?: string;
    }): Promise<ApiResponse<User>> {
        return super.request<ApiResponse<User>>('POST', "/users", data);
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
        return super.request<ApiResponse<User>>('PUT', `/users/${id}`, data);
    }

    async changeUserPassword(
        id: number,
        data: {
            password: string;
            password_confirmation: string;
        },
    ): Promise<ApiResponse<User>> {
        return super.request<ApiResponse<User>>('PUT', `/users/${id}/password`, data);
    }

    async deleteUser(id: number): Promise<ApiResponse<void>> {
        return super.request<ApiResponse<void>>('DELETE', `/users/${id}`);
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
        const response = await super.request<PaginatedResponse<Role>>(
            'GET',
            `/roles${query ? `?${query}` : ""}`
        );
        return response;
    }

    async getRole(id: number): Promise<ApiResponse<Role>> {
        return super.request<ApiResponse<Role>>('GET', `/roles/${id}`);
    }

    async createRole(data: {
        name: string;
        description: string;
        permission_ids?: number[];
    }): Promise<ApiResponse<Role>> {
        return super.request<ApiResponse<Role>>('POST', "/roles", data);
    }

    async updateRole(
        id: number,
        data: {
            name: string;
            description: string;
            permission_ids?: number[];
        },
    ): Promise<ApiResponse<Role>> {
        return super.request<ApiResponse<Role>>('PUT', `/roles/${id}`, data);
    }

    async deleteRole(id: number): Promise<ApiResponse<void>> {
        return super.request<ApiResponse<void>>('DELETE', `/roles/${id}`);
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
        const response = await super.request<PaginatedResponse<Permission>>(
            'GET',
            `/permissions${query ? `?${query}` : ""}`
        );
        return response;
    }

    async getPermissionsGrouped(): Promise<ApiResponse<Record<string, Permission[]>>> {
        return super.request<ApiResponse<Record<string, Permission[]>>>(
            'GET', "/permissions/grouped"
        );
    }

    async createPermission(data: {
        name: string;
        display_name: string;
        description?: string;
        category: string;
    }): Promise<ApiResponse<Permission>> {
        return super.request<ApiResponse<Permission>>('POST', "/permissions", data);
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
        return super.request<ApiResponse<Permission>>('PUT', `/permissions/${id}`, data);
    }

    async deletePermission(id: number): Promise<ApiResponse<void>> {
        return super.request<ApiResponse<void>>('DELETE', `/permissions/${id}`);
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
        return super.request<PaginatedResponse<UserActivity>>(
            'GET',
            `/user-activities${query ? `?${query}` : ""}`
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
        return super.request<ApiResponse<any>>('GET', `/user-activities/statistics${query ? `?${query}` : ""}`);
    }

    // Role-Permission assignment
    async assignPermissionsToRole(
        roleId: number,
        permissionIds: number[],
    ): Promise<ApiResponse<void>> {
        return super.request<ApiResponse<void>>('POST', `/roles/${roleId}/permissions`, {
            permission_ids: permissionIds
        });
    }

    // User-Permission assignment
    async assignPermissionsToUser(
        userId: number,
        permissionIds: number[],
    ): Promise<ApiResponse<void>> {
        return super.request<ApiResponse<void>>('POST', `/users/${userId}/permissions/bulk`, {
            permission_ids: permissionIds
        });
    }

    // User-Role assignment
    async assignRolesToUser(
        userId: number,
        roleIds: number[],
    ): Promise<ApiResponse<void>> {
        return super.request<ApiResponse<void>>('POST', `/users/${userId}/roles`, {
            role_ids: roleIds
        });
    }

    async getPermissionUsers(permissionId: number) {
        return super.request<ApiResponse<User[]>>('GET', `/permissions/${permissionId}/users`);
    }

    async getPermissionRoles(permissionId: number) {
        return super.request<ApiResponse<Role[]>>('GET', `/permissions/${permissionId}/roles`);
    }
}

export const userApi = new UserApiClient();
export { handleApiError, isValidationError, getValidationErrors } from "@/lib/api/config/axios"; 
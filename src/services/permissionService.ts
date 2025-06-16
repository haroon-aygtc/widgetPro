import { userApi, handleApiError } from "@/lib/api/userApi";
import type { Permission } from "@/types/user";
import { z } from "zod";

// Validation schemas
export const createPermissionSchema = z.object({
  name: z.string().min(2, "Permission name must be at least 2 characters"),
  display_name: z.string().min(1, "Display name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
});

export const updatePermissionSchema = z.object({
  name: z.string().min(2, "Permission name must be at least 2 characters"),
  display_name: z.string().min(1, "Display name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
});

export type CreatePermissionData = z.infer<typeof createPermissionSchema>;
export type UpdatePermissionData = z.infer<typeof updatePermissionSchema>;

// Permission service class
export class PermissionService {
  async getPermissions(params?: {
    search?: string;
    category?: string;
    page?: number;
  }) {
    try {
      const response = await userApi.getPermissions(params);
      return { success: true, data: response.data || [], error: null };
    } catch (error) {
      return { success: false, data: [], error: handleApiError(error) };
    }
  }

  async getPermissionsGrouped() {
    try {
      const response = await userApi.getPermissionsGrouped();
      return { success: true, data: response.data || {}, error: null };
    } catch (error) {
      return { success: false, data: {}, error: handleApiError(error) };
    }
  }

  async createPermission(data: CreatePermissionData) {
    try {
      // Validate data
      const validatedData = createPermissionSchema.parse(data) as {
        name: string;
        display_name: string;
        description?: string;
        category: string;
      };
      // Note: This endpoint might not exist in the current API
      // You may need to add it to the backend
      const response = await userApi.createPermission(validatedData);
      return { success: true, data: response.data, error: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        return {
          success: false,
          data: null,
          error: "Validation failed",
          fieldErrors,
        };
      }
      return { success: false, data: null, error: handleApiError(error) };
    }
  }

  async updatePermission(id: number, data: UpdatePermissionData) {
    try {
      // Validate data
      const validatedData = updatePermissionSchema.parse(data) as {
        name: string;
        display_name: string;
        description?: string;
        category: string;
      };
      // Note: This endpoint might not exist in the current API
      // You may need to add it to the backend
      const response = await userApi.updatePermission(id, validatedData);
      return { success: true, data: response.data, error: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        return {
          success: false,
          data: null,
          error: "Validation failed",
          fieldErrors,
        };
      }
      return { success: false, data: null, error: handleApiError(error) };
    }
  }

  async deletePermission(id: number) {
    try {
      // Note: This endpoint might not exist in the current API
      // You may need to add it to the backend
      await userApi.deletePermission(id);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }

  async getPermissionUsers(permissionId: number) {
    return userApi.getPermissionUsers(permissionId);
  }

  async getPermissionRoles(permissionId: number) {
    return userApi.getPermissionRoles(permissionId);
  }
}

// Export singleton instance
export const permissionService = new PermissionService();

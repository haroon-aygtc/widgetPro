import { userApi, handleApiError } from "@/lib/api/userApi";
import type { Role } from "@/types/user";
import { z } from "zod";

// Validation schemas
export const createRoleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters"),
  description: z.string().min(1, "Description is required"),
  permission_ids: z.array(z.number()).optional(),
});

export const updateRoleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters"),
  description: z.string().min(1, "Description is required"),
  permission_ids: z.array(z.number()).optional(),
});

export type CreateRoleData = z.infer<typeof createRoleSchema>;
export type UpdateRoleData = z.infer<typeof updateRoleSchema>;

// Role service class
export class RoleService {
  async getRoles(params?: { search?: string; page?: number }) {
    try {
      const response = await userApi.getRoles(params);
      return { success: true, data: response.data || [], error: null };
    } catch (error) {
      return { success: false, data: [], error: handleApiError(error) };
    }
  }

  async getRole(id: number) {
    try {
      const response = await userApi.getRole(id);
      return { success: true, data: response.data, error: null };
    } catch (error) {
      return { success: false, data: null, error: handleApiError(error) };
    }
  }

  async createRole(data: CreateRoleData) {
    try {
      // Validate data
      const validatedData = createRoleSchema.parse(data) as {
        name: string;
        description: string;
        permission_ids?: number[];
      };
      const response = await userApi.createRole(validatedData);
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

  async updateRole(id: number, data: UpdateRoleData) {
    try {
      // Validate data
      const validatedData = updateRoleSchema.parse(data) as {
        name: string;
        description: string;
        permission_ids?: number[];
      };
      const response = await userApi.updateRole(id, validatedData);
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

  async deleteRole(id: number) {
    try {
      await userApi.deleteRole(id);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }

  async assignPermissionsToRole(roleId: number, permissionIds: number[]) {
    try {
      await userApi.assignPermissionsToRole(roleId, permissionIds);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }
}

// Export singleton instance
export const roleService = new RoleService();

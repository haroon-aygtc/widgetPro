import { userApi, User, handleApiError } from "@/lib/api";
import { z } from "zod";

// Validation schemas
export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role_ids: z.array(z.number()).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role_ids: z.array(z.number()).optional(),
});

export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;

// User service class
export class UserService {
  async getUsers(params?: { search?: string; role?: string; page?: number }) {
    try {
      const response = await userApi.getUsers(params);
      return { success: true, data: response.data || [], error: null };
    } catch (error) {
      return { success: false, data: [], error: handleApiError(error) };
    }
  }

  async getUser(id: number) {
    try {
      const response = await userApi.getUser(id);
      return { success: true, data: response.data, error: null };
    } catch (error) {
      return { success: false, data: null, error: handleApiError(error) };
    }
  }

  async createUser(data: CreateUserData) {
    try {
      // Validate data
      const validatedData = createUserSchema.parse(data);
      const response = await userApi.createUser(validatedData);
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

  async updateUser(id: number, data: UpdateUserData) {
    try {
      // Validate data
      const validatedData = updateUserSchema.parse(data);
      const response = await userApi.updateUser(id, validatedData);
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

  async deleteUser(id: number) {
    try {
      await userApi.deleteUser(id);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }

  async assignRolesToUser(userId: number, roleIds: number[]) {
    try {
      await userApi.assignRolesToUser(userId, roleIds);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }

  async assignPermissionsToUser(userId: number, permissionIds: number[]) {
    try {
      await userApi.assignPermissionsToUser(userId, permissionIds);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }
}

// Export singleton instance
export const userService = new UserService();

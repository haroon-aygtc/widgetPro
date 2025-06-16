import { userApi, User, handleApiError, isValidationError, getValidationErrors } from "@/lib/api";
import { createUserSchema, updateUserSchema, changePasswordSchema } from "@/lib/validation";
import { z } from "zod";

export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;

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
      // Validate data on frontend first
      const validatedData = createUserSchema.parse(data);
      const response = await userApi.createUser(validatedData as {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        role_ids?: number[];
        status?: string;
      });
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

      // Handle API validation errors
      if (isValidationError(error)) {
        const fieldErrors = getValidationErrors(error);
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
      // Validate data on frontend first
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

      // Handle API validation errors
      if (isValidationError(error)) {
        const fieldErrors = getValidationErrors(error);
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

  async changePassword(id: number, data: ChangePasswordData) {
    try {
      // Validate data on frontend first
      const validatedData = changePasswordSchema.parse(data);
      const response = await userApi.changeUserPassword(id, validatedData as {
        password: string;
        password_confirmation: string;
      });
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

      // Handle API validation errors
      if (isValidationError(error)) {
        const fieldErrors = getValidationErrors(error);
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

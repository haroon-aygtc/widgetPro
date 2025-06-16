import { useState, useEffect, useCallback } from "react";
import { User, Role } from "@/lib/api";
import {
  userService,
  CreateUserData,
  UpdateUserData,
  ChangePasswordData,
} from "@/services/userService";
import { roleService } from "@/services/roleService";
import { useOperationLoading } from "@/contexts/LoadingContext";
import { toastUtils } from "@/components/ui/use-toast";

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    isLoading,
    start: startLoading,
    stop: stopLoading,
  } = useOperationLoading("user-management");

  // Fetch users with debouncing
  const fetchUsers = useCallback(async () => {
    startLoading("Loading users...");
    const result = await userService.getUsers({
      search: searchTerm,
      role: filterRole !== "all" ? filterRole : undefined,
    });

    if (result.success) {
      setUsers(result.data);
    } else {
      toastUtils.apiError("Failed to load users");
    }
    stopLoading();
  }, [searchTerm, filterRole, startLoading, stopLoading]);

  // Fetch roles
  const fetchRoles = useCallback(async () => {
    const result = await roleService.getRoles();
    if (result.success) {
      setRoles(result.data);
    } else {
      console.error("Failed to fetch roles:", result.error);
    }
  }, []);

  // Create user
  const createUser = useCallback(
    async (data: CreateUserData) => {
      startLoading("Creating user...");
      const result = await userService.createUser(data);

      if (result.success) {
        toastUtils.apiSuccess("User created");
        await fetchUsers();
        setErrors({});
        return { success: true };
      } else {
        if (result.fieldErrors) {
          setErrors(result.fieldErrors as Record<string, string>);
        } else {
          toastUtils.apiError("Failed to create user");
        }
        return { success: false, error: result.error };
      }
      stopLoading();
    },
    [fetchUsers, startLoading, stopLoading],
  );

  // Update user
  const updateUser = useCallback(
    async (id: number, data: UpdateUserData) => {
      startLoading("Updating user...");
      const result = await userService.updateUser(id, data);

      if (result.success) {
        toastUtils.apiSuccess("User updated");
        await fetchUsers();
        setErrors({});
        return { success: true };
      } else {
        if (result.fieldErrors) {
          setErrors(result.fieldErrors as Record<string, string>);
        } else {
          toastUtils.apiError("Failed to update user");
        }
        return { success: false, error: result.error };
      }
      stopLoading();
    },
    [fetchUsers, startLoading, stopLoading],
  );

  // Change user password
  const changePassword = useCallback(
    async (id: number, data: ChangePasswordData) => {
      startLoading("Changing password...");
      const result = await userService.changePassword(id, data);

      if (result.success) {
        toastUtils.apiSuccess("Password changed successfully");
        setErrors({});
        return { success: true };
      } else {
        if (result.fieldErrors) {
          setErrors(result.fieldErrors as Record<string, string>);
        } else {
          toastUtils.apiError("Failed to change password");
        }
        return { success: false, error: result.error };
      }
      stopLoading();
    },
    [startLoading, stopLoading],
  );

  // Delete user
  const deleteUser = useCallback(
    async (id: number) => {
      startLoading("Deleting user...");
      const result = await userService.deleteUser(id);

      if (result.success) {
        toastUtils.apiSuccess("User deleted");
        await fetchUsers();
      } else {
        toastUtils.apiError("Failed to delete user");
      }
      stopLoading();
    },
    [fetchUsers, startLoading, stopLoading],
  );

  // Assign roles to user
  const assignRolesToUser = useCallback(
    async (userId: number, roleIds: number[]) => {
      startLoading("Assigning roles...");
      try {
        const result = await userService.assignRolesToUser(userId, roleIds);

        if (result.success) {
          toastUtils.apiSuccess("Roles assigned successfully");
          await fetchUsers();
          return { success: true };
        } else {
          if (result.fieldErrors) {
            // Handle field-specific errors
            const errorMessages = Object.values(result.fieldErrors).flat();
            toastUtils.apiError(
              errorMessages.join(", ") || "Failed to assign roles",
            );
          } else {
            toastUtils.apiError(result.error || "Failed to assign roles");
          }
          return {
            success: false,
            error: result.error,
            fieldErrors: result.fieldErrors,
          };
        }
      } catch (error) {
        toastUtils.apiError("An unexpected error occurred");
        return { success: false, error: "An unexpected error occurred" };
      } finally {
        stopLoading();
      }
    },
    [fetchUsers, startLoading, stopLoading],
  );

  // Clear errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Initialize data - fetch roles once on mount
  useEffect(() => {
    fetchRoles();
  }, []); // Empty dependency array for one-time fetch

  // Initial user fetch - only once on mount
  useEffect(() => {
    fetchUsers();
  }, []); // Empty dependency array for one-time fetch

  // Debounced user fetching - only when search term or filter changes
  useEffect(() => {
    if (searchTerm || filterRole !== "all") {
      const debounceTimer = setTimeout(() => {
        fetchUsers();
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm, filterRole]); // Only refetch when search/filter changes

  return {
    // State
    users,
    roles,
    searchTerm,
    filterRole,
    errors,
    isLoading,

    // Actions
    setSearchTerm,
    setFilterRole,
    createUser,
    updateUser,
    changePassword,
    deleteUser,
    assignRolesToUser,
    clearErrors,
    refetchUsers: fetchUsers,
    refetchRoles: fetchRoles,
  };
}

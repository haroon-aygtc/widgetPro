import { useState, useEffect, useCallback } from "react";
import { Role, Permission } from "@/lib/api";
import {
  roleService,
  CreateRoleData,
  UpdateRoleData,
} from "@/services/roleService";
import { permissionService } from "@/services/permissionService";
import { useOperationLoading } from "@/contexts/LoadingContext";
import { toastUtils } from "@/components/ui/use-toast";

export function useRoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionsGrouped, setPermissionsGrouped] = useState<
    Record<string, Permission[]>
  >({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    isLoading,
    start: startLoading,
    stop: stopLoading,
  } = useOperationLoading("role-management");

  // Fetch roles
  const fetchRoles = useCallback(async () => {
    startLoading("Loading roles...");
    const result = await roleService.getRoles();

    if (result.success) {
      setRoles(result.data);
    } else {
      toastUtils.apiError("Failed to load roles");
    }
    stopLoading();
  }, [startLoading, stopLoading]);

  // Fetch permissions
  const fetchPermissions = useCallback(async () => {
    const [permissionsResult, groupedResult] = await Promise.all([
      permissionService.getPermissions(),
      permissionService.getPermissionsGrouped(),
    ]);

    if (permissionsResult.success) {
      setPermissions(permissionsResult.data);
    }

    if (groupedResult.success) {
      setPermissionsGrouped(groupedResult.data);
    }

    if (!permissionsResult.success || !groupedResult.success) {
      toastUtils.apiError("Failed to load permissions");
    }
  }, []);

  // Create role
  const createRole = useCallback(
    async (data: CreateRoleData) => {
      startLoading("Creating role...");
      const result = await roleService.createRole(data);

      if (result.success) {
        toastUtils.apiSuccess("Role created");
        await fetchRoles();
        setErrors({});
        return { success: true };
      } else {
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
        } else {
          toastUtils.apiError("Failed to create role");
        }
        return { success: false, error: result.error };
      }
      stopLoading();
    },
    [fetchRoles, startLoading, stopLoading],
  );

  // Update role
  const updateRole = useCallback(
    async (id: number, data: UpdateRoleData) => {
      startLoading("Updating role...");
      const result = await roleService.updateRole(id, data);

      if (result.success) {
        toastUtils.apiSuccess("Role updated");
        await fetchRoles();
        setErrors({});
        return { success: true };
      } else {
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
        } else {
          toastUtils.apiError("Failed to update role");
        }
        return { success: false, error: result.error };
      }
      stopLoading();
    },
    [fetchRoles, startLoading, stopLoading],
  );

  // Delete role
  const deleteRole = useCallback(
    async (id: number) => {
      startLoading("Deleting role...");
      const result = await roleService.deleteRole(id);

      if (result.success) {
        toastUtils.apiSuccess("Role deleted");
        await fetchRoles();
      } else {
        toastUtils.apiError("Failed to delete role");
      }
      stopLoading();
    },
    [fetchRoles, startLoading, stopLoading],
  );

  // Assign permissions to role
  const assignPermissionsToRole = useCallback(
    async (roleId: number, permissionIds: number[]) => {
      startLoading("Assigning permissions...");
      const result = await roleService.assignPermissionsToRole(
        roleId,
        permissionIds,
      );

      if (result.success) {
        toastUtils.apiSuccess("Permissions assigned");
        await fetchRoles();
      } else {
        toastUtils.apiError("Failed to assign permissions");
      }
      stopLoading();
    },
    [fetchRoles, startLoading, stopLoading],
  );

  // Clear errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Initialize data
  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

  return {
    // State
    roles,
    permissions,
    permissionsGrouped,
    errors,
    isLoading,

    // Actions
    createRole,
    updateRole,
    deleteRole,
    assignPermissionsToRole,
    clearErrors,
    refetchRoles: fetchRoles,
    refetchPermissions: fetchPermissions,
  };
}

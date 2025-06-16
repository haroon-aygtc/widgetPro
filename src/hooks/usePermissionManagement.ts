import { useState, useEffect, useCallback } from "react";
import type { Permission } from "@/types/user";
import {
  permissionService,
  CreatePermissionData,
  UpdatePermissionData,
} from "@/services/permissionService";
import { useOperationLoading } from "@/contexts/LoadingContext";
import { toastUtils } from "@/components/ui/use-toast";

export function usePermissionManagement() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    isLoading,
    start: startLoading,
    stop: stopLoading,
  } = useOperationLoading("permission-management");

  // Fetch permissions with debouncing
  const fetchPermissions = useCallback(async () => {
    startLoading("Loading permissions...");
    const result = await permissionService.getPermissions({
      search: searchTerm,
      category: filterCategory !== "all" ? filterCategory : undefined,
    });

    if (result.success) {
      setPermissions(result.data);
    } else {
      toastUtils.apiError("Failed to load permissions");
    }
    stopLoading();
  }, [searchTerm, filterCategory, startLoading, stopLoading]);

  // Create permission
  const createPermission = useCallback(
    async (data: CreatePermissionData) => {
      startLoading("Creating permission...");
      const result = await permissionService.createPermission(data);

      if (result.success) {
        toastUtils.apiSuccess("Permission created");
        await fetchPermissions();
        setErrors({});
        return { success: true };
      } else {
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
        } else {
          toastUtils.apiError("Failed to create permission");
        }
        return { success: false, error: result.error };
      }
      stopLoading();
    },
    [fetchPermissions, startLoading, stopLoading],
  );

  // Update permission
  const updatePermission = useCallback(
    async (id: number, data: UpdatePermissionData) => {
      startLoading("Updating permission...");
      const result = await permissionService.updatePermission(id, data);

      if (result.success) {
        toastUtils.apiSuccess("Permission updated");
        await fetchPermissions();
        setErrors({});
        return { success: true };
      } else {
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
        } else {
          toastUtils.apiError("Failed to update permission");
        }
        return { success: false, error: result.error };
      }
      stopLoading();
    },
    [fetchPermissions, startLoading, stopLoading],
  );

  // Delete permission
  const deletePermission = useCallback(
    async (id: number) => {
      startLoading("Deleting permission...");
      const result = await permissionService.deletePermission(id);

      if (result.success) {
        toastUtils.apiSuccess("Permission deleted");
        await fetchPermissions();
      } else {
        toastUtils.apiError("Failed to delete permission");
      }
      stopLoading();
    },
    [fetchPermissions, startLoading, stopLoading],
  );

  // Clear errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Get unique categories
  const categories = [...new Set(permissions.map((p) => p.category))];

  // Initial fetch - only once on mount
  useEffect(() => {
    fetchPermissions();
  }, []); // Empty dependency array for one-time fetch

  // Debounced permission fetching - only when search term or filter changes
  useEffect(() => {
    if (searchTerm || filterCategory !== "all") {
      const debounceTimer = setTimeout(() => {
        fetchPermissions();
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm, filterCategory]); // Only refetch when search/filter changes

  return {
    // State
    permissions,
    categories,
    searchTerm,
    filterCategory,
    errors,
    isLoading,

    // Actions
    setSearchTerm,
    setFilterCategory,
    createPermission,
    updatePermission,
    deletePermission,
    clearErrors,
    refetchPermissions: fetchPermissions,
  };
}

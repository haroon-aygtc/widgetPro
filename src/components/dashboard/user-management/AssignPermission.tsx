import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Key,
  Loader2,
  Mail,
  Plus,
  Minus,
  CheckCircle,
  CheckSquare,
  Square,
} from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { usePermissionManagement } from "@/hooks/usePermissionManagement";
import { userService } from "@/services/userService";
import { useToast } from "@/components/ui/use-toast";
import { Permission, User } from "@/types/user";

interface AssignPermissionProps {
  preSelectedUser?: User | null;
  onUserAssigned?: () => void;
}

const AssignPermission: React.FC<AssignPermissionProps> = ({ preSelectedUser, onUserAssigned }) => {
  const {
    isLoading,
    refetchUsers,
  } = useUserManagement();

  const { permissions } = usePermissionManagement();
  const { toast } = useToast();

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Handle preSelectedUser prop
  useEffect(() => {
    if (preSelectedUser) {
      setSelectedUser(preSelectedUser);
      // Only select direct permissions, not those from roles
      setSelectedPermissions(
        preSelectedUser.permissions?.map((p: any) => p.id.toString()) || [],
      );
    }
  }, [preSelectedUser]);

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "super admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "admin":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "user":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "User Management": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "Content Management": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "System Administration": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "Analytics": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "Settings": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  // Get all permissions that the user has (both direct and through roles)
  const getUserAllPermissions = (user: any) => {
    const directPermissions = user.permissions || [];
    const rolePermissions = user.roles?.flatMap((role: any) => role.permissions || []) || [];

    // Combine and deduplicate permissions
    const allPermissions = [...directPermissions, ...rolePermissions];
    const uniquePermissions = allPermissions.filter((permission, index, self) =>
      index === self.findIndex(p => p.id === permission.id)
    );

    return {
      direct: directPermissions,
      fromRoles: rolePermissions,
      all: uniquePermissions
    };
  };

  const handleAssignPermissions = (user: any) => {
    setSelectedUser(user);
    // Only select direct permissions, not those from roles
    setSelectedPermissions(
      user.permissions?.map((p: any) => p.id.toString()) || [],
    );
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(
        selectedPermissions.filter((id) => id !== permissionId),
      );
    }
  };

  // Select all permissions
  const handleSelectAll = () => {
    const allPermissionIds = permissions.map(p => p.id.toString());
    setSelectedPermissions(allPermissionIds);
  };

  // Deselect all permissions
  const handleDeselectAll = () => {
    setSelectedPermissions([]);
  };

  // Select all permissions in a category
  const handleSelectAllInCategory = (category: string) => {
    const categoryPermissions = permissions.filter(p => p.category === category);
    const categoryPermissionIds = categoryPermissions.map(p => p.id.toString());

    // Add category permissions to selected permissions (avoid duplicates)
    const newSelectedPermissions = [...new Set([...selectedPermissions, ...categoryPermissionIds])];
    setSelectedPermissions(newSelectedPermissions);
  };

  // Deselect all permissions in a category
  const handleDeselectAllInCategory = (category: string) => {
    const categoryPermissions = permissions.filter(p => p.category === category);
    const categoryPermissionIds = categoryPermissions.map(p => p.id.toString());

    // Remove category permissions from selected permissions
    const newSelectedPermissions = selectedPermissions.filter(id => !categoryPermissionIds.includes(id));
    setSelectedPermissions(newSelectedPermissions);
  };

  // Check if all permissions in a category are selected
  const areAllCategoryPermissionsSelected = (category: string) => {
    const categoryPermissions = permissions.filter(p => p.category === category);
    const categoryPermissionIds = categoryPermissions.map(p => p.id.toString());
    return categoryPermissionIds.every(id => selectedPermissions.includes(id));
  };

  // Check if user has permission through roles (not directly assigned)
  const hasPermissionThroughRole = (permissionId: string) => {
    if (!selectedUser) return false;
    const userPermissions = getUserAllPermissions(selectedUser);
    const rolePermissionIds = userPermissions.fromRoles.map(p => p.id.toString());
    return rolePermissionIds.includes(permissionId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setSubmitting(true);

      // Convert string IDs to numbers
      const permissionIds = selectedPermissions.map(id => parseInt(id));

      // Call the user service to assign permissions
      const result = await userService.assignPermissionsToUser(selectedUser.id, permissionIds);

      if (result.success) {
        toast({
          title: "Success",
          description: `Permissions assigned successfully to ${selectedUser.name}`,
          variant: "success",
        });

        // Refresh users data to show updated permissions
        await refetchUsers();

        // If this was triggered from parent component, call the callback
        if (onUserAssigned) {
          onUserAssigned();
        } else {
          // Otherwise, reset to list view
          setSelectedUser(null);
          setSelectedPermissions([]);
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to assign permissions",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error assigning permissions:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while assigning permissions",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    if (onUserAssigned) {
      onUserAssigned();
    } else {
      setSelectedUser(null);
      setSelectedPermissions([]);
    }
  };

  const permissionsByCategory = permissions.reduce(
    (acc, perm) => {
      if (!acc[perm.category]) acc[perm.category] = [];
      acc[perm.category].push(perm);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  if (isLoading) {
    return (
      <Card className="bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          <span className="ml-2 text-muted-foreground">Loading users...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-2xl font-bold text-violet-700 dark:text-violet-300">
            Permission Assignment
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            Manage individual user permissions and access controls
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>

        {selectedUser && (
          <div className="w-full bg-gradient-to-br from-white to-violet-50/30 dark:from-gray-900 dark:to-violet-950/30 border-2 border-violet-200/50 dark:border-violet-800/50 shadow-xl rounded-lg">
            <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-b border-violet-200/50 dark:border-violet-800/50 p-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16 ring-2 ring-violet-200/50 dark:ring-violet-800/50">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`}
                    alt={selectedUser.name}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-lg">
                    {selectedUser.name.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                    Assign Permissions to {selectedUser.name}
                  </h2>
                  <p className="text-muted-foreground mt-1 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-1 w-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-violet-700 dark:text-violet-300">
                      Available Permissions
                    </h3>
                  </div>

                  {/* Permission Controls */}
                  <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-violet-50/50 to-purple-50/50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-lg border border-violet-200/50 dark:border-violet-800/50 mb-6">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-950/50 dark:hover:bg-green-900/50 dark:border-green-800 dark:text-green-300"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDeselectAll}
                      className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-950/50 dark:hover:bg-red-900/50 dark:border-red-800 dark:text-red-300"
                    >
                      <Minus className="h-4 w-4 mr-1" />
                      Deselect All
                    </Button>
                    <div className="ml-auto text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {selectedPermissions.length} of {permissions.length} permissions selected
                    </div>
                  </div>
                  <div className="space-y-6">
                    {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => {
                      const allCategorySelected = areAllCategoryPermissionsSelected(category);
                      return (
                        <div key={category} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-medium text-violet-700 dark:text-violet-300">
                                {category}
                              </h3>
                              <Badge className={getCategoryColor(category)}>
                                {(categoryPermissions as Permission[]).length} permissions
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => allCategorySelected
                                  ? handleDeselectAllInCategory(category)
                                  : handleSelectAllInCategory(category)
                                }
                                className="text-xs"
                              >
                                {allCategorySelected ? (
                                  <>
                                    <Square className="h-3 w-3 mr-1" />
                                    Deselect All
                                  </>
                                ) : (
                                  <>
                                    <CheckSquare className="h-3 w-3 mr-1" />
                                    Select All
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="grid gap-3">
                            {(categoryPermissions as Permission[]).map((permission: Permission) => {
                              const isSelected = selectedPermissions.includes(permission.id.toString());
                              const hasViaRole = hasPermissionThroughRole(permission.id.toString());

                              return (
                                <div
                                  key={permission.id}
                                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${hasViaRole
                                    ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/50 cursor-not-allowed opacity-75"
                                    : isSelected
                                      ? "border-violet-500 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 shadow-lg shadow-violet-500/20 ring-2 ring-violet-200 dark:ring-violet-800"
                                      : "border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/30 dark:hover:bg-violet-950/20"
                                    }`}
                                  onClick={() => !hasViaRole && handlePermissionChange(permission.id.toString(), !isSelected)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-200/50 dark:border-violet-800/50">
                                        <Key className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <div className="font-medium text-violet-700 dark:text-violet-300">
                                            {permission.display_name}
                                          </div>
                                          {hasViaRole && (
                                            <Badge variant="outline" className="text-xs bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700">
                                              Via Role
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                          {permission.description || 'No description'}
                                        </p>
                                        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded mt-1 inline-block">
                                          {permission.name}
                                        </code>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {isSelected && !hasViaRole && (
                                        <CheckCircle className="h-5 w-5 text-violet-600 dark:text-violet-400 drop-shadow-sm" />
                                      )}
                                      {hasViaRole && (
                                        <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 drop-shadow-sm" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-violet-200/50 dark:border-violet-800/50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={submitting}
                    className="px-6 border-2 border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="px-8 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Assigning Permissions...
                      </>
                    ) : (
                      "Assign Permissions"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignPermission;

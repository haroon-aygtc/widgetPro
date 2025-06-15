import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Key,
  Crown,
  UserCheck,
  List,
  Grid,
  CheckCircle,
  Minus,
  Loader2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { CreateRoleData, UpdateRoleData } from "@/services/roleService";

const Roles = () => {
  const {
    roles,
    permissions,
    permissionsGrouped,
    errors,
    isLoading,
    createRole,
    updateRole,
    deleteRole,
    clearErrors,
  } = useRoleManagement();

  const [activeSubTab, setActiveSubTab] = React.useState("list");
  const [viewMode, setViewMode] = React.useState("grid");
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editRole, setEditRole] = React.useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = React.useState<
    string[]
  >([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const permissionIds = selectedPermissions.map((id) => parseInt(id));

      if (isEditMode && editRole) {
        const updateData: UpdateRoleData = {
          name: formData.name,
          description: formData.description,
          permission_ids: permissionIds,
        };
        const result = await updateRole(editRole.id, updateData);
        if (result.success) {
          resetForm();
          setActiveSubTab("list");
        }
      } else {
        const createData: CreateRoleData = {
          name: formData.name,
          description: formData.description,
          permission_ids: permissionIds,
        };
        const result = await createRole(createData);
        if (result.success) {
          resetForm();
          setActiveSubTab("list");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setSelectedPermissions([]);
    clearErrors();
    setIsEditMode(false);
    setEditRole(null);
  };

  const handleEdit = (role: any) => {
    setIsEditMode(true);
    setEditRole(role);
    setFormData({
      name: role.name,
      description: role.description || "",
    });
    setSelectedPermissions(
      role.permissions?.map((p: any) => p.id.toString()) || [],
    );
    clearErrors();
    setActiveSubTab("add");
  };

  const handleDelete = async (roleId: number) => {
    if (!confirm("Are you sure you want to delete this role?")) {
      return;
    }
    await deleteRole(roleId);
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "super admin":
        return Crown;
      case "admin":
        return Shield;
      case "manager":
        return UserCheck;
      case "user":
        return Users;
      default:
        return Key;
    }
  };

  const getRoleColor = (roleName: string) => {
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

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(
        selectedPermissions.filter((id) => id !== permissionId),
      );
    }
  };

  const handleSelectAll = () => {
    setSelectedPermissions(permissions.map((p) => p.id.toString()));
  };

  const handleDeselectAll = () => {
    setSelectedPermissions([]);
  };

  const handleCategoryToggle = (category: string, checked: boolean) => {
    const categoryPermissions = (permissionsGrouped[category] || []).map((p) =>
      p.id.toString(),
    );

    if (checked) {
      const newPermissions = [
        ...new Set([...selectedPermissions, ...categoryPermissions]),
      ];
      setSelectedPermissions(newPermissions);
    } else {
      setSelectedPermissions(
        selectedPermissions.filter((id) => !categoryPermissions.includes(id)),
      );
    }
  };

  const permissionsByCategory = permissionsGrouped;

  if (isLoading) {
    return (
      <Card className="bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          <span className="ml-2 text-muted-foreground">Loading roles...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-2xl font-bold text-violet-700 dark:text-violet-300">
            Roles Management
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            Define and manage user roles with specific permissions
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeSubTab}
          onValueChange={setActiveSubTab}
          className="w-full mb-4"
        >
          <TabsList>
            <TabsTrigger value="list">Roles List</TabsTrigger>
            <TabsTrigger value="add">
              {isEditMode ? "Edit Role" : "Add Role"}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-6">
            <div className="flex justify-end mb-4 gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                {" "}
                <Grid className="h-4 w-4 mr-1" /> Grid{" "}
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                {" "}
                <List className="h-4 w-4 mr-1" /> List{" "}
              </Button>
              <Button
                className="ml-2"
                onClick={() => {
                  setActiveSubTab("add");
                  setIsEditMode(false);
                  setEditRole(null);
                }}
              >
                {" "}
                <Plus className="h-4 w-4 mr-2" /> Add Role{" "}
              </Button>
            </div>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => {
                  const IconComponent = getRoleIcon(role.name);
                  const roleColor = getRoleColor(role.name);
                  return (
                    <Card
                      key={role.id}
                      className="hover:shadow-lg transition-all duration-200 hover:shadow-violet-500/10"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-200/50 dark:border-violet-800/50">
                              <IconComponent className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                              <CardTitle className="text-lg text-violet-700 dark:text-violet-300">
                                {role.name}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={roleColor}>{role.name}</Badge>
                                <Badge variant="outline" className="text-xs">
                                  {role.users_count || 0} users
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleEdit(role)}
                              >
                                <Edit className="h-4 w-4 mr-2" /> Edit Role
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="h-4 w-4 mr-2" /> View Users
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(role.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete Role
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">
                          {role.description}
                        </CardDescription>
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-violet-700 dark:text-violet-300 mb-2">
                              Permissions ({role.permissions?.length || 0})
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {role.permissions
                                ?.slice(0, 4)
                                .map((permission) => (
                                  <Badge
                                    key={permission.id}
                                    variant="outline"
                                    className="text-xs bg-violet-50 dark:bg-violet-950/50 border-violet-200 dark:border-violet-800"
                                  >
                                    {permission.display_name}
                                  </Badge>
                                )) || []}
                              {(role.permissions?.length || 0) > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{(role.permissions?.length || 0) - 4} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Created:{" "}
                            {new Date(role.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {roles.map((role) => (
                  <Card
                    key={role.id}
                    className="flex flex-row items-center justify-between p-4 hover:shadow-lg transition-all duration-200 hover:shadow-violet-500/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-200/50 dark:border-violet-800/50">
                        {React.createElement(getRoleIcon(role.name), {
                          className:
                            "h-5 w-5 text-violet-600 dark:text-violet-400",
                        })}
                      </div>
                      <div>
                        <div className="font-medium text-violet-700 dark:text-violet-300">
                          {role.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {role.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleColor(role.name)}>
                        {role.name}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(role)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="add" className="space-y-6">
            <div className="w-full bg-gradient-to-br from-white to-violet-50/30 dark:from-gray-900 dark:to-violet-950/30 border-2 border-violet-200/50 dark:border-violet-800/50 shadow-xl rounded-lg">
              <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-b border-violet-200/50 dark:border-violet-800/50 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                      {isEditMode ? "Edit Role" : "Create New Role"}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      {isEditMode
                        ? "Modify role settings and permissions."
                        : "Define a new role with specific permissions and access levels."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                  {/* Left Side - Basic Information Form */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="h-1 w-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-violet-700 dark:text-violet-300">
                        Basic Information
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="roleName"
                          className="text-sm font-semibold text-violet-700 dark:text-violet-300 flex items-center gap-2"
                        >
                          <Shield className="h-4 w-4" />
                          Role Name
                        </Label>
                        <Input
                          id="roleName"
                          className={`h-12 border-2 ${errors.name ? "border-red-500 focus:border-red-500" : "border-violet-200/60 dark:border-violet-800/60 focus:border-violet-400 dark:focus:border-violet-600"} bg-white/50 dark:bg-gray-900/50`}
                          placeholder="Enter role name (e.g., Content Manager)"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                        {errors.name && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="roleDescription"
                          className="text-sm font-semibold text-violet-700 dark:text-violet-300 flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Description
                        </Label>
                        <Textarea
                          id="roleDescription"
                          className={`border-2 ${errors.description ? "border-red-500 focus:border-red-500" : "border-violet-200/60 dark:border-violet-800/60 focus:border-violet-400 dark:focus:border-violet-600"} bg-white/50 dark:bg-gray-900/50`}
                          placeholder="Describe the role's purpose and responsibilities"
                          rows={4}
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                        />
                        {errors.description && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-6 border-t border-violet-200/50 dark:border-violet-800/50">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          resetForm();
                          setActiveSubTab("list");
                        }}
                        disabled={submitting}
                        className="flex-1 border-2 border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={submitting}
                        onClick={handleSubmit}
                        className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {isEditMode ? "Updating..." : "Creating..."}
                          </>
                        ) : isEditMode ? (
                          "Update Role"
                        ) : (
                          "Create Role"
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Right Side - Permissions Selection */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="h-1 w-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-violet-700 dark:text-violet-300">
                        Role Permissions
                      </h3>
                    </div>

                    {/* Permission Controls */}
                    <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-violet-50/50 to-purple-50/50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-lg border border-violet-200/50 dark:border-violet-800/50">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedPermissions(
                            permissions.map((p) => p.id.toString()),
                          )
                        }
                        className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-950/50 dark:hover:bg-green-900/50 dark:border-green-800 dark:text-green-300"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Select All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPermissions([])}
                        className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-950/50 dark:hover:bg-red-900/50 dark:border-red-800 dark:text-red-300"
                      >
                        <Minus className="h-4 w-4 mr-1" />
                        Deselect All
                      </Button>
                      <div className="ml-auto text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {selectedPermissions.length} of {permissions.length}{" "}
                        permissions selected
                      </div>
                    </div>

                    {/* Permissions List */}
                    <div className="max-h-[600px] overflow-y-auto pr-2">
                      <div className="space-y-6">
                        {Object.entries(permissionsByCategory).map(
                          ([category, categoryPermissions]) => {
                            const categoryPermissionIds =
                              categoryPermissions.map((p) => p.id.toString());
                            const selectedInCategory =
                              selectedPermissions.filter((id) =>
                                categoryPermissionIds.includes(id),
                              ).length;
                            const allSelected =
                              selectedInCategory ===
                              categoryPermissionIds.length;
                            const someSelected =
                              selectedInCategory > 0 &&
                              selectedInCategory < categoryPermissionIds.length;

                            return (
                              <div key={category} className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 rounded-lg border border-violet-200/50 dark:border-violet-800/50">
                                  <div className="flex items-center gap-3">
                                    <Checkbox
                                      checked={allSelected}
                                      ref={(el) => {
                                        if (el) el.indeterminate = someSelected;
                                      }}
                                      onCheckedChange={(checked) =>
                                        handleCategoryToggle(
                                          category,
                                          checked as boolean,
                                        )
                                      }
                                      className="border-2 border-violet-300 dark:border-violet-700"
                                    />
                                    <h4 className="text-base font-bold text-violet-700 dark:text-violet-300">
                                      {category}
                                    </h4>
                                    <Badge
                                      variant="outline"
                                      className="bg-violet-100 dark:bg-violet-900/50 border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300"
                                    >
                                      {selectedInCategory}/
                                      {categoryPermissionIds.length}
                                    </Badge>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleCategoryToggle(
                                        category,
                                        !allSelected,
                                      )
                                    }
                                    className="text-violet-600 hover:text-violet-700 hover:bg-violet-100 dark:text-violet-400 dark:hover:text-violet-300 dark:hover:bg-violet-900/50"
                                  >
                                    {allSelected
                                      ? "Deselect All"
                                      : "Select All"}
                                  </Button>
                                </div>
                                <div className="space-y-2 pl-4">
                                  {categoryPermissions.map((permission) => {
                                    const isChecked =
                                      selectedPermissions.includes(
                                        permission.id.toString(),
                                      );
                                    return (
                                      <div
                                        key={permission.id}
                                        className={`group relative flex items-start space-x-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                                          isChecked
                                            ? "bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 border-violet-300 dark:border-violet-700 shadow-sm"
                                            : "bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-800"
                                        }`}
                                        onClick={() =>
                                          handlePermissionChange(
                                            permission.id.toString(),
                                            !isChecked,
                                          )
                                        }
                                      >
                                        <Checkbox
                                          id={permission.id.toString()}
                                          checked={isChecked}
                                          onCheckedChange={(checked) =>
                                            handlePermissionChange(
                                              permission.id.toString(),
                                              checked as boolean,
                                            )
                                          }
                                          className="mt-0.5 border-2 border-violet-300 dark:border-violet-700 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="flex-1 min-w-0">
                                          <Label
                                            htmlFor={permission.id.toString()}
                                            className="font-semibold text-violet-700 dark:text-violet-300 cursor-pointer group-hover:text-violet-800 dark:group-hover:text-violet-200 transition-colors block mb-1 text-sm"
                                          >
                                            {permission.display_name}
                                          </Label>
                                          <p className="text-xs text-muted-foreground leading-relaxed">
                                            {permission.description}
                                          </p>
                                        </div>
                                        {isChecked && (
                                          <div className="absolute top-2 right-2">
                                            <CheckCircle className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Roles;

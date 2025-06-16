import React, { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Key,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2,
    Grid,
    List,
} from "lucide-react";
import { usePermissionManagement } from "@/hooks/usePermissionManagement";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import {
  CreatePermissionData,
  UpdatePermissionData,
} from "@/services/permissionService";
import DeleteConfirmation from "@/components/ui/delete-confirmation";
import { permissionService } from "@/services/permissionService";

const Permissions = () => {
  const {
    permissions,
    categories,
    searchTerm,
    filterCategory,
    errors,
    isLoading,
    setSearchTerm,
    setFilterCategory,
    createPermission,
    updatePermission,
    deletePermission,
    clearErrors,
  } = usePermissionManagement();

    const deleteConfirmation = useDeleteConfirmation();

    const [activeSubTab, setActiveSubTab] = useState("list");
    const [viewMode, setViewMode] = useState("grid");
    const [isEditMode, setIsEditMode] = useState(false);
    const [editPermission, setEditPermission] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    display_name: "",
    description: "",
    category: "",
  });

    const [viewUsers, setViewUsers] = useState<any[]>([]);
    const [viewRoles, setViewRoles] = useState<any[]>([]);
    const [loadingView, setLoadingView] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditMode && editPermission) {
        const updateData: UpdatePermissionData = {
          name: formData.name,
          display_name: formData.display_name,
          description: formData.description,
          category: formData.category,
        };
        const result = await updatePermission(editPermission.id, updateData);
        if (result.success) {
          resetForm();
                    setActiveSubTab("list");
        }
      } else {
        const createData: CreatePermissionData = {
          name: formData.name,
          display_name: formData.display_name,
          description: formData.description,
          category: formData.category,
        };
        const result = await createPermission(createData);
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
    setFormData({ name: "", display_name: "", description: "", category: "" });
    clearErrors();
    setIsEditMode(false);
    setEditPermission(null);
  };

  const handleEdit = (permission: any) => {
    setIsEditMode(true);
    setEditPermission(permission);
    setFormData({
      name: permission.name,
      display_name: permission.display_name,
      description: permission.description || "",
      category: permission.category,
    });
    clearErrors();
        setActiveSubTab("add");
    };

    const handleDelete = (permission: any) => {
        deleteConfirmation.confirmDeletePermission(permission, () => {
            deletePermission(permission.id);
        });
    };

    const [showViewModal, setShowViewModal] = useState(false);
    const [viewModalType, setViewModalType] = useState<'users' | 'roles'>('users');
    const [selectedPermissionForView, setSelectedPermissionForView] = useState<any>(null);

    const handleViewUsers = async (permission: any) => {
        setSelectedPermissionForView(permission);
        setViewModalType('users');
        setShowViewModal(true);
        setLoadingView(true);
        const res = await permissionService.getPermissionUsers(permission.id);
        setViewUsers(res.data || []);
        setLoadingView(false);
    };

    const handleViewRoles = async (permission: any) => {
        setSelectedPermissionForView(permission);
        setViewModalType('roles');
        setShowViewModal(true);
        setLoadingView(true);
        const res = await permissionService.getPermissionRoles(permission.id);
        setViewRoles(res.data || []);
        setLoadingView(false);
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

    if (isLoading) {
        return (
            <Card className="bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
                <CardContent className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                    <span className="ml-2 text-muted-foreground">Loading permissions...</span>
                </CardContent>
            </Card>
        );
    }

  return (
    <>
            <Card className="bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
                        <CardTitle className="text-2xl font-bold text-violet-700 dark:text-violet-300">
            Permissions Management
                        </CardTitle>
                        <CardDescription className="text-muted-foreground mt-1">
            Define and manage system permissions and access controls
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
                            <TabsTrigger value="list">Permissions List</TabsTrigger>
                            <TabsTrigger value="add">
                                {isEditMode ? "Edit Permission" : "Add Permission"}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="list" className="space-y-6">
                            {/* Search and Filters */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search permissions by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

                            {/* View Controls */}
                            <div className="flex justify-end mb-4 gap-2">
                                <Button
                                    variant={viewMode === "grid" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid className="h-4 w-4 mr-1" /> Grid
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="h-4 w-4 mr-1" /> List
                                </Button>
                                <Button
                                    className="ml-2"
                                    onClick={() => {
                                        setActiveSubTab("add");
                                        setIsEditMode(false);
                                        setEditPermission(null);
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add Permission
                                </Button>
                            </div>

                            {/* Grid View */}
                            {viewMode === "grid" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {permissions.map((permission) => (
                                        <Card
                    key={permission.id}
                                            className="hover:shadow-lg transition-all duration-200 hover:shadow-violet-500/10"
                  >
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200/50 dark:border-green-800/50">
                                                            <Key className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                                                            <CardTitle className="text-lg text-violet-700 dark:text-violet-300">
                            {permission.display_name}
                                                            </CardTitle>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge className={getCategoryColor(permission.category)}>
                                                                    {permission.category}
                                                                </Badge>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {permission.roles_count || 0} roles
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
                            onClick={() => handleEdit(permission)}
                          >
                                                                <Edit className="h-4 w-4 mr-2" /> Edit Permission
                          </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleViewRoles(permission)}
                                                            >
                                                                <Shield className="h-4 w-4 mr-2" /> View Roles
                          </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleViewUsers(permission)}
                                                            >
                                                                <Users className="h-4 w-4 mr-2" /> View Users
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                                                                onClick={() => handleDelete(permission)}
                          >
                                                                <Trash2 className="h-4 w-4 mr-2" /> Delete Permission
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <CardDescription className="mb-4">
                                                    {permission.description || "No description"}
                                                </CardDescription>
                                                <div className="space-y-3">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-violet-700 dark:text-violet-300 mb-2">
                                                            Permission Key
                                                        </h4>
                                                        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                            {permission.name}
                                                        </code>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                        <span>
                                                            Created: {new Date(permission.created_at).toLocaleDateString()}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <Badge variant="outline" className="text-xs">
                                                                {permission.users_count || 0} users
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                /* List View */
                                <div className="space-y-2">
                                    {permissions.map((permission) => (
                                        <Card
                                            key={permission.id}
                                            className="flex flex-row items-center justify-between p-4 hover:shadow-lg transition-all duration-200 hover:shadow-violet-500/10"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200/50 dark:border-green-800/50">
                                                    <Key className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-violet-700 dark:text-violet-300">
                                                        {permission.display_name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {permission.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {permission.description || "No description"}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={getCategoryColor(permission.category)}>
                                                    {permission.category}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {permission.roles_count || 0} roles
                                                </Badge>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEdit(permission)}
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
                                            <Key className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                                                {isEditMode ? "Edit Permission" : "Create New Permission"}
                                            </h2>
                                            <p className="text-muted-foreground mt-1">
                                                {isEditMode
                                                    ? "Modify permission details and access controls."
                                                    : "Define a new permission with specific access controls."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="grid gap-6">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="permissionName"
                                                    className="text-sm font-semibold text-violet-700 dark:text-violet-300 flex items-center gap-2"
                                                >
                                                    <Key className="h-4 w-4" />
                                                    Permission Key
                                                </Label>
                                                <Input
                                                    id="permissionName"
                                                    className={`h-12 border-2 ${errors.name ? "border-red-500 focus:border-red-500" : "border-violet-200/60 dark:border-violet-800/60 focus:border-violet-400 dark:focus:border-violet-600"} bg-white/50 dark:bg-gray-900/50`}
                                                    placeholder="e.g., widget.create"
                                                    value={formData.name}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, name: e.target.value })
                                                    }
                                                />
                                                {errors.name && (
                                                    <p className="text-sm text-red-600">{errors.name}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="displayName"
                                                    className="text-sm font-semibold text-violet-700 dark:text-violet-300 flex items-center gap-2"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                    Display Name
                                                </Label>
                                                <Input
                                                    id="displayName"
                                                    className={`h-12 border-2 ${errors.display_name ? "border-red-500 focus:border-red-500" : "border-violet-200/60 dark:border-violet-800/60 focus:border-violet-400 dark:focus:border-violet-600"} bg-white/50 dark:bg-gray-900/50`}
                                                    placeholder="e.g., Create Widgets"
                                                    value={formData.display_name}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            display_name: e.target.value,
                                                        })
                                                    }
                                                />
                                                {errors.display_name && (
                                                    <p className="text-sm text-red-600">{errors.display_name}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="category"
                                                    className="text-sm font-semibold text-violet-700 dark:text-violet-300 flex items-center gap-2"
                                                >
                                                    <Filter className="h-4 w-4" />
                                                    Category
                                                </Label>
                                                <Input
                                                    id="category"
                                                    className={`h-12 border-2 ${errors.category ? "border-red-500 focus:border-red-500" : "border-violet-200/60 dark:border-violet-800/60 focus:border-violet-400 dark:focus:border-violet-600"} bg-white/50 dark:bg-gray-900/50`}
                                                    placeholder="e.g., User Management"
                                                    value={formData.category}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, category: e.target.value })
                                                    }
                                                />
                                                {errors.category && (
                                                    <p className="text-sm text-red-600">{errors.category}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="description"
                                                    className="text-sm font-semibold text-violet-700 dark:text-violet-300 flex items-center gap-2"
                                                >
                                                    <AlertCircle className="h-4 w-4" />
                                                    Description
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    className={`border-2 ${errors.description ? "border-red-500 focus:border-red-500" : "border-violet-200/60 dark:border-violet-800/60 focus:border-violet-400 dark:focus:border-violet-600"} bg-white/50 dark:bg-gray-900/50`}
                                                    placeholder="Describe what this permission allows"
                                                    rows={3}
                                                    value={formData.description}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            description: e.target.value,
                                                        })
                                                    }
                                                />
                                                {errors.description && (
                                                    <p className="text-sm text-red-600">{errors.description}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-violet-200/50 dark:border-violet-800/50">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    resetForm();
                                                    setActiveSubTab("list");
                                                }}
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
                                                        {isEditMode ? "Updating..." : "Creating..."}
                                                    </>
                                                ) : isEditMode ? (
                                                    "Update Permission"
                                                ) : (
                                                    "Create Permission"
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
        </CardContent>
      </Card>

            {/* View Users/Roles Modal */}
            <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {viewModalType === 'users' ? (
                                <>
                                    <Users className="h-5 w-5 text-blue-600" />
                                    Users with "{selectedPermissionForView?.display_name}" Permission
                                </>
                            ) : (
                                <>
                                    <Shield className="h-5 w-5 text-purple-600" />
                                    Roles with "{selectedPermissionForView?.display_name}" Permission
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {viewModalType === 'users'
                                ? `Users who have been granted the "${selectedPermissionForView?.display_name}" permission`
                                : `Roles that include the "${selectedPermissionForView?.display_name}" permission`
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-96 overflow-y-auto">
                        {loadingView ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
                            </div>
                        ) : viewModalType === 'users' ? (
                            <div className="space-y-3">
                                {viewUsers.length > 0 ? (
                                    viewUsers.map((user: any) => (
                                        <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                                    alt={user.name}
                                                />
                                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                                    {user.name.split(" ").map((n: string) => n[0]).join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {user.email}
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {user.status || 'Active'}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        No users have this permission directly assigned
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {viewRoles.length > 0 ? (
                                    viewRoles.map((role: any) => (
                                        <div key={role.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-200/50 dark:border-purple-800/50">
                                                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                    {role.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {role.description || 'No description'}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {role.users_count || 0} users
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {role.permissions_count || 0} permissions
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        No roles include this permission
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmation
                open={deleteConfirmation.isOpen}
                onOpenChange={deleteConfirmation.closeDialog}
                onConfirm={deleteConfirmation.onConfirm}
                onCancel={deleteConfirmation.handleCancel}
                item={deleteConfirmation.item}
                type={deleteConfirmation.type}
                title={deleteConfirmation.title}
                description={deleteConfirmation.description}
            />
    </>
  );
};

export default Permissions;
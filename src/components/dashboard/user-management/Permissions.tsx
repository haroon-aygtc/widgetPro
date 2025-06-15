import React, { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "lucide-react";
import { usePermissionManagement } from "@/hooks/usePermissionManagement";
import {
  CreatePermissionData,
  UpdatePermissionData,
} from "@/services/permissionService";

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

  const [isCreatePermissionOpen, setIsCreatePermissionOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    display_name: "",
    description: "",
    category: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editPermission, setEditPermission] = useState<any>(null);

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
    setIsCreatePermissionOpen(false);
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
    setIsCreatePermissionOpen(true);
  };

  const handleDelete = async (permissionId: number) => {
    if (!confirm("Are you sure you want to delete this permission?")) {
      return;
    }
    await deletePermission(permissionId);
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-300">
            Permissions Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Define and manage system permissions and access controls
          </p>
        </div>
        <Dialog
          open={isCreatePermissionOpen}
          onOpenChange={setIsCreatePermissionOpen}
        >
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Permission
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Permission</DialogTitle>
              <DialogDescription>
                Define a new permission with specific access controls.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="permissionName" className="text-right">
                    Permission Key
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="permissionName"
                      className={errors.name ? "border-red-500" : ""}
                      placeholder="e.g., widget.create"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="displayName" className="text-right">
                    Display Name
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="displayName"
                      className={errors.display_name ? "border-red-500" : ""}
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
                      <p className="text-sm text-red-600 mt-1">
                        {errors.display_name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="category"
                      className={errors.category ? "border-red-500" : ""}
                      placeholder="e.g., User Management"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    />
                    {errors.category && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.category}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <div className="col-span-3">
                    <Textarea
                      id="description"
                      className={errors.description ? "border-red-500" : ""}
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
                      <p className="text-sm text-red-600 mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </form>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={resetForm}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
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
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6 bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
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
        </CardContent>
      </Card>

      {/* Permissions Table */}
      <Card className="bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-violet-600" />
            Permissions ({permissions.length})
          </CardTitle>
          <CardDescription>
            Manage system permissions and access controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-600 mx-auto" />
                    <span className="ml-2 text-muted-foreground">
                      Loading permissions...
                    </span>
                  </TableCell>
                </TableRow>
              ) : permissions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No permissions found
                  </TableCell>
                </TableRow>
              ) : (
                permissions.map((permission) => (
                  <TableRow
                    key={permission.id}
                    className="hover:bg-violet-50/50 dark:hover:bg-violet-950/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-200/50 dark:border-violet-800/50">
                          <Key className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                          <div className="font-medium text-violet-700 dark:text-violet-300">
                            {permission.display_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {permission.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {permission.description || "No description"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{permission.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {permission.roles_count || 0} roles
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {permission.users_count || 0} users
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(permission.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
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
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Permission
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            View Roles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            View Users
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(permission.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Permission
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default Permissions;

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Mail,
  Users as UsersIcon,
  Loader2,
  Key,
  Grid,
  List,
  Plus,
  CheckCircle,
  AlertCircle,
  Settings,
  UserCheck,
} from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { CreateUserData, UpdateUserData } from "@/services/userService";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import { createUserSchema, updateUserSchema } from "@/lib/validation";
import { toastUtils } from "@/components/ui/use-toast";
import DeleteConfirmation from "@/components/ui/delete-confirmation";
import { User } from "@/lib/api";

interface UsersProps {
  onAssignPermission?: (user: any) => void;
  onAssignRole?: (user: any) => void;
}

const Users: React.FC<UsersProps> = ({ onAssignPermission, onAssignRole }) => {
  const {
    users,
    roles,
    searchTerm,
    filterRole,
    errors,
    isLoading,
    setSearchTerm,
    setFilterRole,
    createUser,
    updateUser,
    changePassword,
    deleteUser,
    assignRolesToUser,
    clearErrors,
  } = useUserManagement();

  const deleteConfirmation = useDeleteConfirmation();

  // UI state management
  const [activeSubTab, setActiveSubTab] = React.useState("list");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editUser, setEditUser] = React.useState<User | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  // Modal states
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  const [passwordChangeUser, setPasswordChangeUser] = React.useState<User | null>(null);
  const [passwordData, setPasswordData] = React.useState({
    password: "",
    password_confirmation: "",
  });
  const [showRoleModal, setShowRoleModal] = React.useState(false);
  const [roleManagementUser, setRoleManagementUser] = React.useState<User | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = React.useState<number[]>([]);

  // Form data
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_ids: [] as number[],
  });

  // Form validation
  const {
    validateForm,
    validateField,
    setFieldTouched,
    getFieldError,
    clearErrors: clearValidationErrors,
  } = useFormValidation(isEditMode ? updateUserSchema : createUserSchema, {
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    const validation = await validateForm(formData);
    if (!validation.success) {
      Object.keys(formData).forEach((field) => {
        setFieldTouched(field, true);
      });

      const errorMessages = Object.keys(validation.errors)
        .filter((key) => validation.errors[key])
        .map((key) => validation.errors[key]);
      const errorCount = errorMessages.length;
      toastUtils.validationError(errorCount, errorMessages);
      return;
    }

    setSubmitting(true);

    try {
      if (isEditMode && editUser) {
        const updateData: UpdateUserData = {
          name: formData.name,
          email: formData.email,
          role_ids: formData.role_ids,
        };

        const result = await updateUser(editUser.id, updateData);
        if (result.success) {
          resetForm();
          setActiveSubTab("list");
          toastUtils.apiSuccess("User updated successfully");
        }
      } else {
        const createData: CreateUserData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          role_ids: formData.role_ids,
        };
        const result = await createUser(createData);
        if (result.success) {
          resetForm();
          setActiveSubTab("list");
          toastUtils.apiSuccess("User created successfully");
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", password_confirmation: "", role_ids: [] });
    clearErrors();
    clearValidationErrors();
    setIsEditMode(false);
    setEditUser(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleInputBlur = (field: string) => {
    setFieldTouched(field, true);
  };

  const handleEdit = (user: User) => {
    setIsEditMode(true);
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      password_confirmation: "",
      role_ids: user.roles?.map((role: any) => role.id) || [],
    });
    clearErrors();
    setActiveSubTab("add");
  };

  const handleDelete = (user: User) => {
    deleteConfirmation.confirmDeleteUser(user, () => {
      deleteUser(user.id);
    });
  };

  const handleChangePassword = (user: User) => {
    setPasswordChangeUser(user);
    setPasswordData({ password: "", password_confirmation: "" });
    setShowPasswordModal(true);
  };

  const handleManageRoles = (user: User) => {
    setRoleManagementUser(user);
    setSelectedRoleIds(user.roles?.map((role: any) => role.id) || []);
    setShowRoleModal(true);
  };

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleManagementUser) return;

    setSubmitting(true);
    try {
      await assignRolesToUser(roleManagementUser.id, selectedRoleIds);
      setShowRoleModal(false);
      setRoleManagementUser(null);
      setSelectedRoleIds([]);
      toastUtils.apiSuccess("User roles updated successfully");
    } catch (error) {
      console.error("Role assignment error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordChangeUser) return;

    if (!passwordData.password || passwordData.password.length < 8) {
      toastUtils.validationError(1, ["Password must be at least 8 characters"]);
      return;
    }

    if (passwordData.password !== passwordData.password_confirmation) {
      toastUtils.validationError(1, ["Password confirmation does not match"]);
      return;
    }

    setSubmitting(true);
    try {
      const result = await changePassword(passwordChangeUser.id, {
        password: passwordData.password,
        password_confirmation: passwordData.password_confirmation,
      });

      if (result.success) {
        setShowPasswordModal(false);
        setPasswordChangeUser(null);
        setPasswordData({ password: "", password_confirmation: "" });
        toastUtils.apiSuccess("Password updated successfully");
      }
    } catch (error) {
      console.error("Password update error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "admin":
      case "super admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "user":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

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
    <>
      <Card className="bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-2xl font-bold text-violet-700 dark:text-violet-300">
              Users Management
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Manage user accounts, roles, and access permissions
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
              <TabsTrigger value="list">Users List</TabsTrigger>
              <TabsTrigger value="add">
                {isEditMode ? "Edit User" : "Add User"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-[150px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
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
                    setEditUser(null);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add User
                </Button>
              </div>

              {/* Grid View */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.map((user) => (
                    <Card
                      key={user.id}
                      className="hover:shadow-lg transition-all duration-200 hover:shadow-violet-500/10"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 ring-2 ring-violet-200/50 dark:ring-violet-800/50">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                alt={user.name}
                              />
                              <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg text-violet-700 dark:text-violet-300">
                                {user.name}
                              </CardTitle>
                              <div className="flex items-center gap-1 mt-1">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{user.email}</span>
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
                                onClick={() => handleEdit(user)}
                              >
                                <Edit className="h-4 w-4 mr-2" /> Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleChangePassword(user)}
                              >
                                <Key className="h-4 w-4 mr-2" /> Change Password
                              </DropdownMenuItem>

                              {onAssignRole && (
                                <DropdownMenuItem
                                  onClick={() => onAssignRole(user)}
                                >
                                  <UserCheck className="h-4 w-4 mr-2" /> Assign Role
                                </DropdownMenuItem>
                              )}
                              {onAssignPermission && (
                                <DropdownMenuItem
                                  onClick={() => onAssignPermission(user)}
                                >
                                  <Settings className="h-4 w-4 mr-2" /> Assign Permission
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(user)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <Badge variant={user.status === "active" ? "default" : "secondary"}>
                              {user.status === 'active' ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <AlertCircle className="h-3 w-3 mr-1" />
                              )}
                              {user.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Roles</span>
                            <div className="flex flex-wrap gap-1">
                              {user.roles?.slice(0, 2).map((role) => (
                                <Badge
                                  key={role.id}
                                  className={getRoleBadgeColor(role.name)}
                                  variant="outline"
                                >
                                  {role.name}
                                </Badge>
                              ))}
                              {(user.roles?.length || 0) > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{(user.roles?.length || 0) - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          {user.created_at && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Joined</span>
                              <span className="text-sm">{new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-2">
                  {users.map((user) => (
                    <Card
                      key={user.id}
                      className="flex flex-row items-center justify-between p-4 hover:shadow-lg transition-all duration-200 hover:shadow-violet-500/10"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-violet-200/50 dark:ring-violet-800/50">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                            alt={user.name}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-violet-700 dark:text-violet-300">
                            {user.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {user.email}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {user.roles?.map((role) => (
                              <Badge
                                key={role.id}
                                className={getRoleBadgeColor(role.name)}
                                variant="outline"
                              >
                                {role.name}
                              </Badge>
                            )) || <Badge variant="outline">No Role</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.status === "active" ? "default" : "secondary"}>
                          {user.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEdit(user)}>
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangePassword(user)}>
                              <Key className="h-4 w-4 mr-2" /> Change Password
                            </DropdownMenuItem>

                            {onAssignRole && (
                              <DropdownMenuItem
                                onClick={() => onAssignRole(user)}
                              >
                                <UserCheck className="h-4 w-4 mr-2" /> Assign Role
                              </DropdownMenuItem>
                            )}
                            {onAssignPermission && (
                              <DropdownMenuItem
                                onClick={() => onAssignPermission(user)}
                              >
                                <Settings className="h-4 w-4 mr-2" /> Assign Permission
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleDelete(user)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                      <UserPlus className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                        {isEditMode ? "Edit User Account" : "Create New User"}
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        {isEditMode
                          ? "Modify user account details and permissions."
                          : "Set up a new user account with appropriate role and access levels."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Profile Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-1 w-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-violet-700 dark:text-violet-300">
                          Profile Information
                        </h3>
                      </div>

                      <div className="grid gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="name"
                            className="text-sm font-semibold text-violet-700 dark:text-violet-300 flex items-center gap-2"
                          >
                            <UsersIcon className="h-4 w-4" />
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            className={`h-12 border-2 ${(errors.name || getFieldError("name")) ? "border-red-500 focus:border-red-500" : "border-violet-200/60 dark:border-violet-800/60 focus:border-violet-400 dark:focus:border-violet-600"} bg-white/50 dark:bg-gray-900/50`}
                            placeholder="Enter user's full name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            onBlur={() => handleInputBlur("name")}
                          />
                          {(errors.name || getFieldError("name")) && (
                            <p className="text-sm text-red-600">{errors.name || getFieldError("name")}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-sm font-semibold text-violet-700 dark:text-violet-300 flex items-center gap-2"
                          >
                            <Mail className="h-4 w-4" />
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            className={`h-12 border-2 ${(errors.email || getFieldError("email")) ? "border-red-500 focus:border-red-500" : "border-violet-200/60 dark:border-violet-800/60 focus:border-violet-400 dark:focus:border-violet-600"} bg-white/50 dark:bg-gray-900/50`}
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            onBlur={() => handleInputBlur("email")}
                          />
                          {(errors.email || getFieldError("email")) && (
                            <p className="text-sm text-red-600">{errors.email || getFieldError("email")}</p>
                          )}
                        </div>

                        {/* Password fields - only for create mode */}
                        {!isEditMode && (
                          <>
                            <div className="space-y-2">
                              <Label
                                htmlFor="password"
                                className="text-sm font-semibold text-violet-700 dark:text-violet-300 flex items-center gap-2"
                              >
                                <Shield className="h-4 w-4" />
                                Password
                              </Label>
                              <Input
                                id="password"
                                type="password"
                                className={`h-12 border-2 ${(errors.password || getFieldError("password")) ? "border-red-500 focus:border-red-500" : "border-violet-200/60 dark:border-violet-800/60 focus:border-violet-400 dark:focus:border-violet-600"} bg-white/50 dark:bg-gray-900/50`}
                                placeholder="Enter password (min 8 characters)"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                onBlur={() => handleInputBlur("password")}
                              />
                              {(errors.password || getFieldError("password")) && (
                                <p className="text-sm text-red-600">
                                  {errors.password || getFieldError("password")}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor="password_confirmation"
                                className="text-sm font-semibold text-violet-700 dark:text-violet-300 flex items-center gap-2"
                              >
                                <Shield className="h-4 w-4" />
                                Confirm Password
                              </Label>
                              <Input
                                id="password_confirmation"
                                type="password"
                                className={`h-12 border-2 ${(errors.password_confirmation || getFieldError("password_confirmation")) ? "border-red-500 focus:border-red-500" : "border-violet-200/60 dark:border-violet-800/60 focus:border-violet-400 dark:focus:border-violet-600"} bg-white/50 dark:bg-gray-900/50`}
                                placeholder="Confirm your password"
                                value={formData.password_confirmation}
                                onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
                                onBlur={() => handleInputBlur("password_confirmation")}
                              />
                              {(errors.password_confirmation || getFieldError("password_confirmation")) && (
                                <p className="text-sm text-red-600">
                                  {errors.password_confirmation || getFieldError("password_confirmation")}
                                </p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Role Assignment Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-1 w-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-violet-700 dark:text-violet-300">
                          Role Assignment
                        </h3>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="role"
                          className="text-sm font-semibold text-violet-700 dark:text-violet-300 flex items-center gap-2"
                        >
                          <Shield className="h-4 w-4" />
                          User Role
                        </Label>
                        <Select
                          value={
                            formData.role_ids.length > 0
                              ? formData.role_ids[0].toString()
                              : ""
                          }
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              role_ids: value ? [parseInt(value)] : [],
                            })
                          }
                        >
                          <SelectTrigger className="h-12 border-2 border-violet-200/60 dark:border-violet-800/60 focus:border-violet-400 dark:focus:border-violet-600 bg-white/50 dark:bg-gray-900/50">
                            <SelectValue placeholder="Choose a role for this user" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem
                                key={role.id}
                                value={role.id.toString()}
                                className="py-3"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-3 h-3 rounded-full ${getRoleBadgeColor(role.name).split(" ")[0]}`}
                                  ></div>
                                  <span className="font-medium">{role.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground mt-1">
                          Role determines the user's access level and available permissions
                        </p>
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
                          "Update User"
                        ) : (
                          "Create User"
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

      {/* Password Change Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-violet-600" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Update password for {passwordChangeUser?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password (min 8 characters)"
                value={passwordData.password}
                onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={passwordData.password_confirmation}
                onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                className="h-12"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordModal(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Role Management Modal */}
      <Dialog open={showRoleModal} onOpenChange={setShowRoleModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-violet-600" />
              Manage Roles
            </DialogTitle>
            <DialogDescription>
              Assign roles to {roleManagementUser?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRoleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${roleManagementUser?.name}`}
                      alt={roleManagementUser?.name}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                      {roleManagementUser?.name?.split(" ").map((n: string) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300">
                      {roleManagementUser?.name}
                    </h4>
                    <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                      {roleManagementUser?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                  Current Roles
                </Label>
                <div className="flex flex-wrap gap-2">
                  {roleManagementUser?.roles?.map((role: any) => (
                    <Badge key={role.id} className={getRoleBadgeColor(role.name)}>
                      {role.name}
                    </Badge>
                  )) || <Badge variant="outline">No roles assigned</Badge>}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                  Assign New Roles
                </Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-3 p-3 rounded-lg border border-violet-200/50 dark:border-violet-800/50 hover:bg-violet-50/50 dark:hover:bg-violet-950/50">
                      <input
                        type="checkbox"
                        id={`role-${role.id}`}
                        checked={selectedRoleIds.includes(role.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRoleIds([...selectedRoleIds, role.id]);
                          } else {
                            setSelectedRoleIds(selectedRoleIds.filter(id => id !== role.id));
                          }
                        }}
                        className="rounded border-violet-300 text-violet-600 focus:ring-violet-500"
                      />
                      <label htmlFor={`role-${role.id}`} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-violet-700 dark:text-violet-300">
                              {role.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {role.description || "No description"}
                            </div>
                          </div>
                          <Badge className={getRoleBadgeColor(role.name)}>
                            {role.permissions?.length || 0} permissions
                          </Badge>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRoleModal(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Roles"
                )}
              </Button>
            </DialogFooter>
          </form>
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

export default Users;
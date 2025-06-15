import React from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Mail,
  Calendar,
  Users as UsersIcon,
  Loader2,
} from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { CreateUserData, UpdateUserData } from "@/services/userService";

const Users = () => {
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
    deleteUser,
    clearErrors,
  } = useUserManagement();

  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editUser, setEditUser] = React.useState<any>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    role_ids: [] as number[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        }
      } else {
        const createData: CreateUserData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role_ids: formData.role_ids,
        };
        const result = await createUser(createData);
        if (result.success) {
          resetForm();
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", role_ids: [] });
    clearErrors();
    setIsEditMode(false);
    setEditUser(null);
  };

  const handleEdit = (user: any) => {
    setIsEditMode(true);
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role_ids: user.roles?.map((role: any) => role.id) || [],
    });
    clearErrors();
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }
    await deleteUser(userId);
  };

  const getStatusBadgeVariant = (status: string) => {
    return status === "Active" ? "default" : "secondary";
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
    <Card className="bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-2xl font-bold text-violet-700 dark:text-violet-300">
            Users Management
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            Manage user accounts, roles, and permissions
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Users List Side */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
            <Card className="bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-violet-600" />
                  Users ({users.length})
                </CardTitle>
                <CardDescription>
                  Manage user accounts and their access levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-violet-50/50 dark:hover:bg-violet-950/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 ring-2 ring-violet-200/50 dark:ring-violet-800/50">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                alt={user.name}
                              />
                              <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-violet-700 dark:text-violet-300 text-sm">
                                {user.name}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.roles?.map((role) => (
                              <Badge
                                key={role.id}
                                className={getRoleBadgeColor(role.name)}
                              >
                                {role.name}
                              </Badge>
                            )) || <Badge variant="outline">No Role</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "active" ? "default" : "secondary"
                            }
                          >
                            {user.status}
                          </Badge>
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
                                onClick={() => handleEdit(user)}
                              >
                                <Edit className="h-4 w-4 mr-2" /> Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Shield className="h-4 w-4 mr-2" /> Manage Roles
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(user.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* User Form Side */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-white to-violet-50/30 dark:from-gray-900 dark:to-violet-950/30 border-2 border-violet-200/50 dark:border-violet-800/50 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-b border-violet-200/50 dark:border-violet-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg">
                    <UserPlus className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                      {isEditMode ? "Edit User Account" : "Create New User"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-1">
                      {isEditMode
                        ? "Modify user account details and permissions."
                        : "Set up a new user account with appropriate role and access levels."}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
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
                          className={`h-12 border-2 ${errors.name ? "border-red-500 focus:border-red-500" : "border-violet-200/60 dark:border-violet-800/60 focus:border-violet-400 dark:focus:border-violet-600"} bg-white/50 dark:bg-gray-900/50`}
                          placeholder="Enter user's full name"
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
                          htmlFor="email"
                          className="text-sm font-semibold text-violet-700 dark:text-violet-300 flex items-center gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          className={`h-12 border-2 ${errors.email ? "border-red-500 focus:border-red-500" : "border-violet-200/60 dark:border-violet-800/60 focus:border-violet-400 dark:focus:border-violet-600"} bg-white/50 dark:bg-gray-900/50`}
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                        {errors.email && (
                          <p className="text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>

                      {!isEditMode && (
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
                            className={`h-12 border-2 ${errors.password ? "border-red-500 focus:border-red-500" : "border-violet-200/60 dark:border-violet-800/60 focus:border-violet-400 dark:focus:border-violet-600"} bg-white/50 dark:bg-gray-900/50`}
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
                          />
                          {errors.password && (
                            <p className="text-sm text-red-600">
                              {errors.password}
                            </p>
                          )}
                        </div>
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
                        Role determines the user's access level and available
                        permissions
                      </p>
                    </div>
                  </div>

                  {/* Additional Settings */}
                  {isEditMode && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-1 w-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-violet-700 dark:text-violet-300">
                          Account Status
                        </h3>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-blue-700 dark:text-blue-300">
                              Account Status
                            </p>
                            <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                              Current status: {editUser?.status}
                            </p>
                          </div>
                          <Badge
                            variant={
                              editUser?.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {editUser?.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-violet-200/50 dark:border-violet-800/50">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={submitting}
                      className="px-6 border-2 border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                    >
                      {isEditMode ? "Cancel" : "Clear"}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Users;

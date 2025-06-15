import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Key,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { usePermissionManagement } from "@/hooks/usePermissionManagement";

const AssignPermission = () => {
  const {
    users,
    roles,
    searchTerm,
    filterRole,
    isLoading,
    setSearchTerm,
    setFilterRole,
  } = useUserManagement();

  const { permissions } = usePermissionManagement();

  const [isManagePermissionsOpen, setIsManagePermissionsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

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

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(
        selectedPermissions.filter((id) => id !== permissionId),
      );
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;

    try {
      setSubmitting(true);
      // Note: This would need to be implemented in the userService
      // For now, we'll just close the dialog
      setIsManagePermissionsOpen(false);
      setSelectedUser(null);
      setSelectedPermissions([]);
    } finally {
      setSubmitting(false);
    }
  };

  const openPermissionsDialog = (user: any) => {
    setSelectedUser(user);
    setSelectedPermissions(
      user.permissions?.map((p: any) => p.id.toString()) || [],
    );
    setIsManagePermissionsOpen(true);
  };

  const permissionsByCategory = permissions.reduce(
    (acc, perm) => {
      if (!acc[perm.category]) acc[perm.category] = [];
      acc[perm.category].push(perm);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-300">
            Assign Permission to User
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage individual user permissions and access controls
          </p>
        </div>
      </div>

      {/* Info Alert */}
      <Alert className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/50 dark:from-blue-950/50 dark:to-indigo-950/50 dark:border-blue-800">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Permission Management:</strong> Individual permissions
          override role-based permissions. Use carefully to maintain security
          and access control.
        </AlertDescription>
      </Alert>

      {/* Filters and Search */}
      <Card className="mb-6 bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
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
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-violet-600" />
            User Permission Management ({users.length})
          </CardTitle>
          <CardDescription>
            Manage individual user permissions and access controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-600 mx-auto" />
                    <span className="ml-2 text-muted-foreground">
                      Loading users...
                    </span>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-violet-50/50 dark:hover:bg-violet-950/50"
                  >
                    <TableCell>
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
                          <div className="text-sm text-muted-foreground">
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
                      <div className="flex flex-wrap gap-1">
                        {user.permissions?.slice(0, 3).map((permission) => (
                          <Badge
                            key={permission.id}
                            variant="outline"
                            className="text-xs bg-violet-50 dark:bg-violet-950/50 border-violet-200 dark:border-violet-800"
                          >
                            {permission.display_name}
                          </Badge>
                        )) || []}
                        {(user.permissions?.length || 0) > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{(user.permissions?.length || 0) - 3} more
                          </Badge>
                        )}
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
                    <TableCell className="text-muted-foreground">
                      {new Date(user.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openPermissionsDialog(user)}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Manage Permissions
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Manage Permissions Dialog */}
      <Dialog
        open={isManagePermissionsOpen}
        onOpenChange={setIsManagePermissionsOpen}
      >
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Manage Permissions for {selectedUser?.name}
            </DialogTitle>
            <DialogDescription>
              Select the permissions you want to assign to this user. Changes
              will override role-based permissions.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              {Object.entries(permissionsByCategory).map(
                ([category, permissions]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="text-lg font-semibold text-violet-700 dark:text-violet-300 border-b border-violet-200 dark:border-violet-800 pb-2">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map((permission) => {
                        const IconComponent = permission.icon;
                        const isChecked = selectedPermissions.includes(
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
                ),
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedPermissions.length} of {permissions.length} permissions
              selected
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsManagePermissionsOpen(false);
                  setSelectedUser(null);
                  setSelectedPermissions([]);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSavePermissions} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Permissions"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssignPermission;

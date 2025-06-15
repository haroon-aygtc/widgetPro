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
} from "lucide-react";

const Roles = () => {
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);

  // Mock data for roles
  const roles = [
    {
      id: 1,
      name: "Super Admin",
      description: "Full system access with all permissions",
      userCount: 2,
      permissions: [
        "user.create",
        "user.read",
        "user.update",
        "user.delete",
        "role.create",
        "role.read",
        "role.update",
        "role.delete",
        "widget.create",
        "widget.read",
        "widget.update",
        "widget.delete",
        "analytics.read",
        "settings.update",
      ],
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      icon: Crown,
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      name: "Admin",
      description: "Administrative access with most permissions",
      userCount: 5,
      permissions: [
        "user.read",
        "user.update",
        "role.read",
        "widget.create",
        "widget.read",
        "widget.update",
        "widget.delete",
        "analytics.read",
        "settings.update",
      ],
      color:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      icon: Shield,
      createdAt: "2024-01-05",
    },
    {
      id: 3,
      name: "Manager",
      description: "Team management with limited administrative access",
      userCount: 8,
      permissions: [
        "user.read",
        "widget.create",
        "widget.read",
        "widget.update",
        "analytics.read",
      ],
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      icon: UserCheck,
      createdAt: "2024-01-10",
    },
    {
      id: 4,
      name: "User",
      description: "Standard user with basic widget management",
      userCount: 25,
      permissions: ["widget.read", "widget.update", "analytics.read"],
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      icon: Users,
      createdAt: "2024-01-15",
    },
    {
      id: 5,
      name: "Viewer",
      description: "Read-only access to widgets and analytics",
      userCount: 12,
      permissions: ["widget.read", "analytics.read"],
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      icon: Key,
      createdAt: "2024-01-20",
    },
  ];

  const availablePermissions = [
    { id: "user.create", name: "Create Users", category: "User Management" },
    { id: "user.read", name: "View Users", category: "User Management" },
    { id: "user.update", name: "Edit Users", category: "User Management" },
    { id: "user.delete", name: "Delete Users", category: "User Management" },
    { id: "role.create", name: "Create Roles", category: "Role Management" },
    { id: "role.read", name: "View Roles", category: "Role Management" },
    { id: "role.update", name: "Edit Roles", category: "Role Management" },
    { id: "role.delete", name: "Delete Roles", category: "Role Management" },
    {
      id: "widget.create",
      name: "Create Widgets",
      category: "Widget Management",
    },
    { id: "widget.read", name: "View Widgets", category: "Widget Management" },
    {
      id: "widget.update",
      name: "Edit Widgets",
      category: "Widget Management",
    },
    {
      id: "widget.delete",
      name: "Delete Widgets",
      category: "Widget Management",
    },
    { id: "analytics.read", name: "View Analytics", category: "Analytics" },
    { id: "settings.update", name: "Update Settings", category: "System" },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-300">
            Roles Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Define and manage user roles with specific permissions
          </p>
        </div>
        <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a new role with specific permissions and access levels.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="roleName" className="text-right">
                  Role Name
                </Label>
                <Input
                  id="roleName"
                  className="col-span-3"
                  placeholder="Enter role name"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="roleDescription" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="roleDescription"
                  className="col-span-3"
                  placeholder="Describe the role and its purpose"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Permissions</Label>
                <div className="col-span-3 space-y-4 max-h-60 overflow-y-auto">
                  {Object.entries(
                    availablePermissions.reduce(
                      (acc, perm) => {
                        if (!acc[perm.category]) acc[perm.category] = [];
                        acc[perm.category].push(perm);
                        return acc;
                      },
                      {} as Record<string, typeof availablePermissions>,
                    ),
                  ).map(([category, perms]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium text-sm text-violet-700 dark:text-violet-300">
                        {category}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {perms.map((perm) => (
                          <label
                            key={perm.id}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <input type="checkbox" className="rounded" />
                            <span>{perm.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateRoleOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setIsCreateRoleOpen(false)}>
                Create Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => {
          const IconComponent = role.icon;
          return (
            <Card
              key={role.id}
              className="bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50 hover:shadow-lg transition-all duration-200 hover:shadow-violet-500/10"
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
                        <Badge className={role.color}>{role.name}</Badge>
                        <Badge variant="outline" className="text-xs">
                          {role.userCount} users
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
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Role
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="h-4 w-4 mr-2" />
                        View Users
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Role
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
                      Permissions ({role.permissions.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 4).map((permission) => (
                        <Badge
                          key={permission}
                          variant="outline"
                          className="text-xs bg-violet-50 dark:bg-violet-950/50 border-violet-200 dark:border-violet-800"
                        >
                          {permission.split(".")[1]}
                        </Badge>
                      ))}
                      {role.permissions.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created: {role.createdAt}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
};

export default Roles;

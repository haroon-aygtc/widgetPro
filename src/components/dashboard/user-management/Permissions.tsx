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
  Database,
  BarChart3,
  Settings,
  MessageSquare,
} from "lucide-react";

const Permissions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isCreatePermissionOpen, setIsCreatePermissionOpen] = useState(false);

  // Mock data for permissions
  const permissions = [
    {
      id: 1,
      name: "user.create",
      displayName: "Create Users",
      description: "Ability to create new user accounts",
      category: "User Management",
      rolesCount: 2,
      usersCount: 7,
      icon: Users,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      name: "user.read",
      displayName: "View Users",
      description: "Ability to view user accounts and profiles",
      category: "User Management",
      rolesCount: 5,
      usersCount: 52,
      icon: Users,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      createdAt: "2024-01-01",
    },
    {
      id: 3,
      name: "user.update",
      displayName: "Edit Users",
      description: "Ability to modify user account information",
      category: "User Management",
      rolesCount: 3,
      usersCount: 15,
      icon: Users,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      createdAt: "2024-01-01",
    },
    {
      id: 4,
      name: "user.delete",
      displayName: "Delete Users",
      description: "Ability to permanently delete user accounts",
      category: "User Management",
      rolesCount: 1,
      usersCount: 2,
      icon: Users,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      createdAt: "2024-01-01",
    },
    {
      id: 5,
      name: "role.create",
      displayName: "Create Roles",
      description: "Ability to create new user roles",
      category: "Role Management",
      rolesCount: 1,
      usersCount: 2,
      icon: Shield,
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      createdAt: "2024-01-01",
    },
    {
      id: 6,
      name: "widget.create",
      displayName: "Create Widgets",
      description: "Ability to create new chat widgets",
      category: "Widget Management",
      rolesCount: 4,
      usersCount: 40,
      icon: MessageSquare,
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      createdAt: "2024-01-01",
    },
    {
      id: 7,
      name: "widget.read",
      displayName: "View Widgets",
      description: "Ability to view chat widgets and their configurations",
      category: "Widget Management",
      rolesCount: 5,
      usersCount: 52,
      icon: MessageSquare,
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      createdAt: "2024-01-01",
    },
    {
      id: 8,
      name: "analytics.read",
      displayName: "View Analytics",
      description: "Ability to view analytics and reports",
      category: "Analytics",
      rolesCount: 5,
      usersCount: 52,
      icon: BarChart3,
      color:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      createdAt: "2024-01-01",
    },
    {
      id: 9,
      name: "settings.update",
      displayName: "Update Settings",
      description: "Ability to modify system settings and configurations",
      category: "System",
      rolesCount: 2,
      usersCount: 7,
      icon: Settings,
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      createdAt: "2024-01-01",
    },
  ];

  const categories = [...new Set(permissions.map((p) => p.category))];

  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch =
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || permission.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="permissionName" className="text-right">
                  Permission Key
                </Label>
                <Input
                  id="permissionName"
                  className="col-span-3"
                  placeholder="e.g., widget.create"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="displayName" className="text-right">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  className="col-span-3"
                  placeholder="e.g., Create Widgets"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category.toLowerCase().replace(" ", "-")}
                      >
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="new-category">
                      + Add New Category
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  className="col-span-3"
                  placeholder="Describe what this permission allows"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreatePermissionOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setIsCreatePermissionOpen(false)}>
                Create Permission
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
            Permissions ({filteredPermissions.length})
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
              {filteredPermissions.map((permission) => {
                const IconComponent = permission.icon;
                return (
                  <TableRow
                    key={permission.id}
                    className="hover:bg-violet-50/50 dark:hover:bg-violet-950/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-200/50 dark:border-violet-800/50">
                          <IconComponent className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                          <div className="font-medium text-violet-700 dark:text-violet-300">
                            {permission.displayName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {permission.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {permission.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={permission.color}>
                        {permission.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {permission.rolesCount} roles
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {permission.usersCount} users
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {permission.createdAt}
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
                          <DropdownMenuItem>
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
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Permission
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default Permissions;

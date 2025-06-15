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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Key,
  Search,
  Filter,
  Shield,
  Users,
  Database,
  BarChart3,
  Settings,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
} from "lucide-react";

const AssignPermission = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [isManagePermissionsOpen, setIsManagePermissionsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Mock data for users with their current permissions
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      role: "Admin",
      status: "Active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
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
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      role: "Manager",
      status: "Active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      permissions: [
        "user.read",
        "widget.create",
        "widget.read",
        "widget.update",
        "analytics.read",
      ],
      lastUpdated: "2024-01-10",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      role: "User",
      status: "Inactive",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      permissions: ["widget.read", "widget.update", "analytics.read"],
      lastUpdated: "2024-01-05",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@company.com",
      role: "Viewer",
      status: "Active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      permissions: ["widget.read", "analytics.read"],
      lastUpdated: "2024-01-20",
    },
  ];

  // Mock data for available permissions
  const availablePermissions = [
    {
      id: "user.create",
      name: "Create Users",
      description: "Ability to create new user accounts",
      category: "User Management",
      icon: Users,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      id: "user.read",
      name: "View Users",
      description: "Ability to view user accounts and profiles",
      category: "User Management",
      icon: Users,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      id: "user.update",
      name: "Edit Users",
      description: "Ability to modify user account information",
      category: "User Management",
      icon: Users,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      id: "user.delete",
      name: "Delete Users",
      description: "Ability to permanently delete user accounts",
      category: "User Management",
      icon: Users,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      id: "role.create",
      name: "Create Roles",
      description: "Ability to create new user roles",
      category: "Role Management",
      icon: Shield,
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      id: "role.read",
      name: "View Roles",
      description: "Ability to view user roles and permissions",
      category: "Role Management",
      icon: Shield,
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      id: "widget.create",
      name: "Create Widgets",
      description: "Ability to create new chat widgets",
      category: "Widget Management",
      icon: MessageSquare,
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
    {
      id: "widget.read",
      name: "View Widgets",
      description: "Ability to view chat widgets and configurations",
      category: "Widget Management",
      icon: MessageSquare,
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
    {
      id: "widget.update",
      name: "Edit Widgets",
      description: "Ability to modify widget configurations",
      category: "Widget Management",
      icon: MessageSquare,
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
    {
      id: "widget.delete",
      name: "Delete Widgets",
      description: "Ability to permanently delete widgets",
      category: "Widget Management",
      icon: MessageSquare,
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
    {
      id: "analytics.read",
      name: "View Analytics",
      description: "Ability to view analytics and reports",
      category: "Analytics",
      icon: BarChart3,
      color:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    },
    {
      id: "settings.update",
      name: "Update Settings",
      description: "Ability to modify system settings",
      category: "System",
      icon: Settings,
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    },
  ];

  const roles = ["Admin", "Manager", "User", "Viewer"];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "User":
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

  const handleSavePermissions = () => {
    if (selectedUser) {
      // Here you would typically make an API call to update user permissions
      console.log(
        `Updating permissions for ${selectedUser.name}:`,
        selectedPermissions,
      );
      setIsManagePermissionsOpen(false);
      setSelectedUser(null);
      setSelectedPermissions([]);
    }
  };

  const openPermissionsDialog = (user: any) => {
    setSelectedUser(user);
    setSelectedPermissions([...user.permissions]);
    setIsManagePermissionsOpen(true);
  };

  const permissionsByCategory = availablePermissions.reduce(
    (acc, perm) => {
      if (!acc[perm.category]) acc[perm.category] = [];
      acc[perm.category].push(perm);
      return acc;
    },
    {} as Record<string, typeof availablePermissions>,
  );

  return (
    <div className="p-6 bg-gradient-to-br from-background via-background to-violet-50/30 dark:to-violet-950/30 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Assign Permission to User
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage individual user permissions and access controls
          </p>
        </div>
      </div>

      {/* Info Alert */}
      <Alert className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/50 dark:to-indigo-950/50 dark:border-blue-800">
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
                    <SelectItem key={role} value={role}>
                      {role}
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
            User Permission Management ({filteredUsers.length})
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
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-violet-50/50 dark:hover:bg-violet-950/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-violet-200/50 dark:ring-violet-800/50">
                        <AvatarImage src={user.avatar} alt={user.name} />
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
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.slice(0, 3).map((permission) => (
                        <Badge
                          key={permission}
                          variant="outline"
                          className="text-xs bg-violet-50 dark:bg-violet-950/50 border-violet-200 dark:border-violet-800"
                        >
                          {permission.split(".")[1]}
                        </Badge>
                      ))}
                      {user.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.lastUpdated}
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
              ))}
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
                          permission.id,
                        );
                        return (
                          <div
                            key={permission.id}
                            className="flex items-start space-x-3 p-3 rounded-lg border border-violet-200/50 dark:border-violet-800/50 hover:bg-violet-50/50 dark:hover:bg-violet-950/50"
                          >
                            <Checkbox
                              id={permission.id}
                              checked={isChecked}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(
                                  permission.id,
                                  checked as boolean,
                                )
                              }
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                <Label
                                  htmlFor={permission.id}
                                  className="font-medium text-violet-700 dark:text-violet-300 cursor-pointer"
                                >
                                  {permission.name}
                                </Label>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {permission.description}
                              </p>
                            </div>
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
              {selectedPermissions.length} of {availablePermissions.length}{" "}
              permissions selected
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
              <Button onClick={handleSavePermissions}>Save Permissions</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignPermission;

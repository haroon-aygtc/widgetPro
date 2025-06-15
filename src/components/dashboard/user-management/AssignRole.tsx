import React, { useState } from "react";
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
import {
  UserCheck,
  Search,
  Filter,
  Plus,
  Shield,
  Users,
  Crown,
  Key,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const AssignRole = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [isAssignRoleOpen, setIsAssignRoleOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState("");

  // Mock data for users
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      currentRole: "Admin",
      status: "Active",
      lastLogin: "2 hours ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      roleAssignedAt: "2024-01-15",
      roleAssignedBy: "Super Admin",
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      currentRole: "Manager",
      status: "Active",
      lastLogin: "1 day ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      roleAssignedAt: "2024-01-10",
      roleAssignedBy: "Admin",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      currentRole: "User",
      status: "Inactive",
      lastLogin: "1 week ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      roleAssignedAt: "2024-01-05",
      roleAssignedBy: "Manager",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@company.com",
      currentRole: "Viewer",
      status: "Active",
      lastLogin: "3 hours ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      roleAssignedAt: "2024-01-20",
      roleAssignedBy: "Admin",
    },
  ];

  // Mock data for roles
  const roles = [
    {
      id: 1,
      name: "Super Admin",
      description: "Full system access with all permissions",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      icon: Crown,
      permissionCount: 14,
    },
    {
      id: 2,
      name: "Admin",
      description: "Administrative access with most permissions",
      color:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      icon: Shield,
      permissionCount: 9,
    },
    {
      id: 3,
      name: "Manager",
      description: "Team management with limited administrative access",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      icon: UserCheck,
      permissionCount: 5,
    },
    {
      id: 4,
      name: "User",
      description: "Standard user with basic widget management",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      icon: Users,
      permissionCount: 3,
    },
    {
      id: 5,
      name: "Viewer",
      description: "Read-only access to widgets and analytics",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      icon: Key,
      permissionCount: 2,
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.currentRole === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    const roleData = roles.find((r) => r.name === role);
    return roleData
      ? roleData.color
      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  const handleAssignRole = () => {
    if (selectedUser && selectedRole) {
      // Here you would typically make an API call to assign the role
      console.log(
        `Assigning role ${selectedRole} to user ${selectedUser.name}`,
      );
      setIsAssignRoleOpen(false);
      setSelectedUser(null);
      setSelectedRole("");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-300">
            Assign Role to User
          </h2>
          <p className="text-muted-foreground mt-1">
            Assign or modify user roles and access levels
          </p>
        </div>
      </div>

      {/* Info Alert */}
      <Alert className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/50 dark:to-indigo-950/50 dark:border-blue-800">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Role Assignment Guidelines:</strong> Ensure users have
          appropriate roles based on their responsibilities. Higher-level roles
          inherit permissions from lower-level roles.
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
                    <SelectItem key={role.name} value={role.name}>
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
            <UserCheck className="h-5 w-5 text-violet-600" />
            User Role Assignments ({filteredUsers.length})
          </CardTitle>
          <CardDescription>
            Manage user role assignments and access levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role Assigned</TableHead>
                <TableHead>Assigned By</TableHead>
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
                    <Badge className={getRoleBadgeColor(user.currentRole)}>
                      {user.currentRole}
                    </Badge>
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
                    {user.roleAssignedAt}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.roleAssignedBy}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog
                      open={isAssignRoleOpen && selectedUser?.id === user.id}
                      onOpenChange={(open) => {
                        setIsAssignRoleOpen(open);
                        if (!open) {
                          setSelectedUser(null);
                          setSelectedRole("");
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setSelectedRole(user.currentRole);
                          }}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Change Role
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Role to {user.name}</DialogTitle>
                          <DialogDescription>
                            Select a new role for this user. This will update
                            their permissions and access levels.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Current Role</Label>
                            <div className="col-span-3">
                              <Badge
                                className={getRoleBadgeColor(user.currentRole)}
                              >
                                {user.currentRole}
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="newRole" className="text-right">
                              New Role
                            </Label>
                            <Select
                              value={selectedRole}
                              onValueChange={setSelectedRole}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map((role) => {
                                  const IconComponent = role.icon;
                                  return (
                                    <SelectItem
                                      key={role.name}
                                      value={role.name}
                                    >
                                      <div className="flex items-center gap-2">
                                        <IconComponent className="h-4 w-4" />
                                        <span>{role.name}</span>
                                        <Badge
                                          variant="outline"
                                          className="ml-auto text-xs"
                                        >
                                          {role.permissionCount} perms
                                        </Badge>
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                          {selectedRole &&
                            selectedRole !== user.currentRole && (
                              <div className="col-span-4">
                                <Alert className="bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800">
                                  <CheckCircle className="h-4 w-4" />
                                  <AlertDescription>
                                    <strong>Role Change:</strong> {user.name}{" "}
                                    will be assigned the {selectedRole} role
                                    with
                                    {
                                      roles.find((r) => r.name === selectedRole)
                                        ?.permissionCount
                                    }{" "}
                                    permissions.
                                  </AlertDescription>
                                </Alert>
                              </div>
                            )}
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsAssignRoleOpen(false);
                              setSelectedUser(null);
                              setSelectedRole("");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleAssignRole}
                            disabled={
                              !selectedRole || selectedRole === user.currentRole
                            }
                          >
                            Assign Role
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default AssignRole;

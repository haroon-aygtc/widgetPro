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
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { useRoleManagement } from "@/hooks/useRoleManagement";

const AssignRole = () => {
  const {
    users,
    searchTerm,
    filterRole,
    isLoading,
    setSearchTerm,
    setFilterRole,
    assignRolesToUser,
  } = useUserManagement();

  const { roles } = useRoleManagement();

  const [isAssignRoleOpen, setIsAssignRoleOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState("");
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

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      setSubmitting(true);
      await assignRolesToUser(selectedUser.id, [parseInt(selectedRole)]);
      setIsAssignRoleOpen(false);
      setSelectedUser(null);
      setSelectedRole("");
    } finally {
      setSubmitting(false);
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
            <UserCheck className="h-5 w-5 text-violet-600" />
            User Role Assignments ({users.length})
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
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "secondary"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      System
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
                              setSelectedRole("");
                            }}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Change Role
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Assign Role to {user.name}
                            </DialogTitle>
                            <DialogDescription>
                              Select a new role for this user. This will update
                              their permissions and access levels.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">
                                Current Roles
                              </Label>
                              <div className="col-span-3 flex flex-wrap gap-1">
                                {user.roles?.map((role) => (
                                  <Badge
                                    key={role.id}
                                    className={getRoleBadgeColor(role.name)}
                                  >
                                    {role.name}
                                  </Badge>
                                )) || <Badge variant="outline">No Role</Badge>}
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
                                  {roles.map((role) => (
                                    <SelectItem
                                      key={role.id}
                                      value={role.id.toString()}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span>{role.name}</span>
                                        <Badge
                                          variant="outline"
                                          className="ml-auto text-xs"
                                        >
                                          {role.permissions?.length || 0} perms
                                        </Badge>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            {selectedRole && (
                              <div className="col-span-4">
                                <Alert className="bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800">
                                  <CheckCircle className="h-4 w-4" />
                                  <AlertDescription>
                                    <strong>Role Assignment:</strong>{" "}
                                    {user.name} will be assigned the{" "}
                                    {
                                      roles.find(
                                        (r) => r.id.toString() === selectedRole,
                                      )?.name
                                    }{" "}
                                    role with{" "}
                                    {roles.find(
                                      (r) => r.id.toString() === selectedRole,
                                    )?.permissions?.length || 0}{" "}
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
                              disabled={!selectedRole || submitting}
                            >
                              {submitting ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Assigning...
                                </>
                              ) : (
                                "Assign Role"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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

export default AssignRole;

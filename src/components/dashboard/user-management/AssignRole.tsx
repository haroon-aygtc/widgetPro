import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  Shield,
  CheckCircle,
  Loader2,
  Mail,
  Plus,
  Minus,
} from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { User } from "@/lib/api";

interface AssignRoleProps {
  preSelectedUser?: User | null;
  onUserAssigned?: () => void;
}

const AssignRole: React.FC<AssignRoleProps> = ({ preSelectedUser, onUserAssigned }) => {
  const {
    isLoading,
    assignRolesToUser,
  } = useUserManagement();

  const { roles } = useRoleManagement();

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Handle preSelectedUser prop
  useEffect(() => {
    if (preSelectedUser) {
      setSelectedUser(preSelectedUser);
      setSelectedRoleIds(preSelectedUser.roles?.map((role: any) => role.id) || []);
    }
  }, [preSelectedUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setSubmitting(true);
      await assignRolesToUser(selectedUser.id, selectedRoleIds);

      // If this was triggered from parent component, call the callback
      if (onUserAssigned) {
        onUserAssigned();
      } else {
        // Otherwise, reset form
        setSelectedUser(null);
        setSelectedRoleIds([]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    if (onUserAssigned) {
      onUserAssigned();
    } else { // its not a callback, so reset the form
      setSelectedUser(null);
      setSelectedRoleIds([]);
    }
  };

  const handleRoleToggle = (roleId: number) => {
    setSelectedRoleIds(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSelectAll = () => {
    setSelectedRoleIds(roles.map((role) => role.id));
  };

  const handleDeselectAll = () => {
    setSelectedRoleIds([]);
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
            Role Assignment
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            Assign or modify user roles and access levels
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>


        {selectedUser && (
          <div className="w-full bg-gradient-to-br from-white to-violet-50/30 dark:from-gray-900 dark:to-violet-950/30 border-2 border-violet-200/50 dark:border-violet-800/50 shadow-xl rounded-lg">
            <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-b border-violet-200/50 dark:border-violet-800/50 p-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16 ring-2 ring-violet-200/50 dark:ring-violet-800/50">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`}
                    alt={selectedUser.name}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-lg">
                    {selectedUser.name.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                    Assign Roles to {selectedUser.name}
                  </h2>
                  <p className="text-muted-foreground mt-1 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-1 w-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-violet-700 dark:text-violet-300">
                      Available Roles
                    </h3>
                  </div>

                  {/* Role Controls */}
                  <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-violet-50/50 to-purple-50/50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-lg border border-violet-200/50 dark:border-violet-800/50 mb-6">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-950/50 dark:hover:bg-green-900/50 dark:border-green-800 dark:text-green-300"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDeselectAll}
                      className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-950/50 dark:hover:bg-red-900/50 dark:border-red-800 dark:text-red-300"
                    >
                      <Minus className="h-4 w-4 mr-1" />
                      Deselect All
                    </Button>
                    <div className="ml-auto text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {selectedRoleIds.length} of {roles.length} roles selected
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedRoleIds.includes(role.id)
                          ? "border-violet-500 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 shadow-lg shadow-violet-500/20 ring-2 ring-violet-200 dark:ring-violet-800"
                          : "border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/30 dark:hover:bg-violet-950/20"
                          }`}
                        onClick={() => handleRoleToggle(role.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-200/50 dark:border-violet-800/50">
                              <Shield className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                              <div className="font-medium text-violet-700 dark:text-violet-300">
                                {role.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {role.description || 'No description'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {role.permissions?.length || 0} permissions
                            </Badge>
                            {selectedRoleIds.includes(role.id) && (
                              <CheckCircle className="h-5 w-5 text-violet-600 dark:text-violet-400 drop-shadow-sm" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-violet-200/50 dark:border-violet-800/50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
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
                        Assigning Roles...
                      </>
                    ) : (
                      "Assign Roles"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignRole;

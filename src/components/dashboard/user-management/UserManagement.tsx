import { useState, lazy, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users as UsersIcon,
  Shield,
  Key,
  UserCheck,
  Activity,
  Settings,
  Loader2,
} from "lucide-react";
import ErrorBoundary from "@/components/ui/error-boundary";
import type { User } from "@/types/user";

// Lazy load components to improve initial load time
const Users = lazy(() => import("./Users"));
const Roles = lazy(() => import("./Roles"));
const Permissions = lazy(() => import("./Permissions"));
const AssignRole = lazy(() => import("./AssignRole"));
const AssignPermission = lazy(() => import("./AssignPermission"));
const UserActivity = lazy(() => import("./UserActivity"));

// Loading component for lazy-loaded tabs
const TabLoader = ({ message = "Loading..." }: { message?: string }) => (
  <Card className="bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
    <CardContent className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      <span className="ml-2 text-muted-foreground">{message}</span>
    </CardContent>
  </Card>
);

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [selectedUserForAssignment, setSelectedUserForAssignment] = useState<User | null>(null);

  // Handle assign permission action from Users component
  const handleAssignPermission = (user: User) => {
    setSelectedUserForAssignment(user);
    setActiveTab("assign-permission");
  };

  // Handle assign role action from Users component
  const handleAssignRole = (user: User) => {
    setSelectedUserForAssignment(user);
    setActiveTab("assign-role");
  };

  // Clear selected user when switching tabs manually
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value !== "assign-permission" && value !== "assign-role") {
      setSelectedUserForAssignment(null);
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-violet-50/20 dark:to-violet-950/20">
        <Card className="w-full bg-card/80 backdrop-blur-xl border-none shadow-none">
          <CardHeader className="pb-0">
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              User Management
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Comprehensive user, role, and permission management system
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="mb-6 bg-muted/50">
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="roles" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Roles
                </TabsTrigger>
                <TabsTrigger value="permissions" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Permissions
                </TabsTrigger>
                <TabsTrigger value="assign-role" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Assign Role
                </TabsTrigger>
                <TabsTrigger value="assign-permission" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Assign Permission
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-6">
                <ErrorBoundary>
                  <Suspense fallback={<TabLoader message="Loading users..." />}>
                    <Users
                      onAssignPermission={handleAssignPermission}
                      onAssignRole={handleAssignRole}
                    />
                  </Suspense>
                </ErrorBoundary>
              </TabsContent>
              <TabsContent value="roles" className="space-y-6">
                <ErrorBoundary>
                  <Suspense fallback={<TabLoader message="Loading roles..." />}>
                    <Roles />
                  </Suspense>
                </ErrorBoundary>
              </TabsContent>
              <TabsContent value="permissions" className="space-y-6">
                <ErrorBoundary>
                  <Suspense fallback={<TabLoader message="Loading permissions..." />}>
                    <Permissions />
                  </Suspense>
                </ErrorBoundary>
              </TabsContent>
              <TabsContent value="assign-role" className="space-y-6">
                <ErrorBoundary>
                  <Suspense fallback={<TabLoader message="Loading role assignment..." />}>
                    <AssignRole
                      preSelectedUser={selectedUserForAssignment}
                      onUserAssigned={() => {
                        setSelectedUserForAssignment(null);
                        setActiveTab("users");
                      }}
                    />
                  </Suspense>
                </ErrorBoundary>
              </TabsContent>
              <TabsContent value="assign-permission" className="space-y-6">
                <ErrorBoundary>
                  <Suspense fallback={<TabLoader message="Loading permission assignment..." />}>
                    <AssignPermission
                      preSelectedUser={selectedUserForAssignment}
                      onUserAssigned={() => {
                        setSelectedUserForAssignment(null);
                        setActiveTab("users");
                      }}
                    />
                  </Suspense>
                </ErrorBoundary>
              </TabsContent>
              <TabsContent value="activity" className="space-y-6">
                <ErrorBoundary>
                  <Suspense fallback={<TabLoader message="Loading user activity..." />}>
                    <UserActivity />
                  </Suspense>
                </ErrorBoundary>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default UserManagement;

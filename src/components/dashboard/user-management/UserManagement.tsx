import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users as UsersIcon,
  Shield,
  Key,
  UserCheck,
  Activity,
  Settings,
  BarChart3,
  Crown,
} from "lucide-react";
import Users from "./Users";
import Roles from "./Roles";
import Permissions from "./Permissions";
import AssignRole from "./AssignRole";
import AssignPermission from "./AssignPermission";
import UserActivity from "./UserActivity";
import ErrorBoundary from "@/components/ui/error-boundary";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <ErrorBoundary>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-violet-50/20 dark:to-violet-950/20">
        {/* Header */}
        <header className="border-b bg-card/80 backdrop-blur-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive user, role, and permission management system
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
                <BarChart3 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">52 active users</span>
              </div>
              <Button variant="outline" size="sm">
                <Crown className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            </div>
          </div>
        </header>

        <div className="bg-background w-full p-6 rounded-lg">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
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
              <TabsTrigger
                value="permissions"
                className="flex items-center gap-2"
              >
                <Key className="h-4 w-4" />
                Permissions
              </TabsTrigger>
              <TabsTrigger
                value="assign-role"
                className="flex items-center gap-2"
              >
                <UserCheck className="h-4 w-4" />
                Assign Role
              </TabsTrigger>
              <TabsTrigger
                value="assign-permission"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Assign Permission
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              <Users />
            </TabsContent>

            <TabsContent value="roles" className="space-y-6">
              <Roles />
            </TabsContent>

            <TabsContent value="permissions" className="space-y-6">
              <Permissions />
            </TabsContent>

            <TabsContent value="assign-role" className="space-y-6">
              <AssignRole />
            </TabsContent>

            <TabsContent value="assign-permission" className="space-y-6">
              <AssignPermission />
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <UserActivity />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default UserManagement;

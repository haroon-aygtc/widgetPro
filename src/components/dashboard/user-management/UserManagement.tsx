import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Shield,
  Key,
  UserCheck,
  Activity,
  Settings,
} from "lucide-react";
import Users from "./Users";
import Roles from "./Roles";
import Permissions from "./Permissions";
import AssignRole from "./AssignRole";
import AssignPermission from "./AssignPermission";
import UserActivity from "./UserActivity";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="p-6 bg-gradient-to-br from-background via-background to-violet-50/30 dark:to-violet-950/30 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive user, role, and permission management system
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
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

        <TabsContent value="users" className="mt-6">
          <Users />
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <Roles />
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <Permissions />
        </TabsContent>

        <TabsContent value="assign-role" className="mt-6">
          <AssignRole />
        </TabsContent>

        <TabsContent value="assign-permission" className="mt-6">
          <AssignPermission />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <UserActivity />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;

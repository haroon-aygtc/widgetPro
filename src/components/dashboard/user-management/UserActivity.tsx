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
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import {
  Activity,
  Search,
  Filter,
  Calendar,
  Download,
  Eye,
  LogIn,
  LogOut,
  Settings,
  MessageSquare,
  Database,
  Shield,
  Users,
  Clock,
  MapPin,
  Monitor,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { addDays } from "date-fns";

const UserActivity = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActivity, setFilterActivity] = useState("all");
  const [filterUser, setFilterUser] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -7),
    to: new Date(),
  });

  // Mock data for user activities
  const activities = [
    {
      id: 1,
      user: {
        name: "John Doe",
        email: "john.doe@company.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        role: "Admin",
      },
      action: "login",
      description: "User logged into the system",
      timestamp: "2024-01-22 14:30:25",
      ipAddress: "192.168.1.100",
      location: "New York, US",
      device: "Chrome on Windows",
      status: "success",
      details: "Successful login from trusted device",
    },
    {
      id: 2,
      user: {
        name: "Sarah Wilson",
        email: "sarah.wilson@company.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        role: "Manager",
      },
      action: "widget_create",
      description: "Created new chat widget 'Customer Support'",
      timestamp: "2024-01-22 13:45:12",
      ipAddress: "192.168.1.101",
      location: "California, US",
      device: "Safari on macOS",
      status: "success",
      details: "Widget created with GPT-4 model configuration",
    },
    {
      id: 3,
      user: {
        name: "Mike Johnson",
        email: "mike.johnson@company.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
        role: "User",
      },
      action: "settings_update",
      description: "Updated widget appearance settings",
      timestamp: "2024-01-22 12:20:45",
      ipAddress: "192.168.1.102",
      location: "Texas, US",
      device: "Firefox on Linux",
      status: "success",
      details: "Changed widget theme from light to dark mode",
    },
    {
      id: 4,
      user: {
        name: "Emily Davis",
        email: "emily.davis@company.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
        role: "Viewer",
      },
      action: "view_analytics",
      description: "Viewed analytics dashboard",
      timestamp: "2024-01-22 11:15:30",
      ipAddress: "192.168.1.103",
      location: "Florida, US",
      device: "Chrome on Android",
      status: "success",
      details: "Accessed conversation metrics and performance data",
    },
    {
      id: 5,
      user: {
        name: "John Doe",
        email: "john.doe@company.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        role: "Admin",
      },
      action: "user_create",
      description: "Created new user account",
      timestamp: "2024-01-22 10:30:15",
      ipAddress: "192.168.1.100",
      location: "New York, US",
      device: "Chrome on Windows",
      status: "success",
      details:
        "Created user account for alex.smith@company.com with Manager role",
    },
    {
      id: 6,
      user: {
        name: "Sarah Wilson",
        email: "sarah.wilson@company.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        role: "Manager",
      },
      action: "login_failed",
      description: "Failed login attempt",
      timestamp: "2024-01-22 09:45:22",
      ipAddress: "192.168.1.101",
      location: "California, US",
      device: "Safari on macOS",
      status: "failed",
      details: "Invalid password entered, account temporarily locked",
    },
    {
      id: 7,
      user: {
        name: "Mike Johnson",
        email: "mike.johnson@company.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
        role: "User",
      },
      action: "logout",
      description: "User logged out of the system",
      timestamp: "2024-01-22 08:30:10",
      ipAddress: "192.168.1.102",
      location: "Texas, US",
      device: "Firefox on Linux",
      status: "success",
      details: "Normal logout process completed",
    },
    {
      id: 8,
      user: {
        name: "Emily Davis",
        email: "emily.davis@company.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
        role: "Viewer",
      },
      action: "permission_denied",
      description: "Attempted to access restricted area",
      timestamp: "2024-01-22 07:15:45",
      ipAddress: "192.168.1.103",
      location: "Florida, US",
      device: "Chrome on Android",
      status: "warning",
      details:
        "Tried to access user management section without proper permissions",
    },
  ];

  const activityTypes = [
    "login",
    "logout",
    "login_failed",
    "widget_create",
    "widget_update",
    "widget_delete",
    "settings_update",
    "view_analytics",
    "user_create",
    "user_update",
    "permission_denied",
  ];

  const users = [...new Set(activities.map((a) => a.user.name))];

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActivity =
      filterActivity === "all" || activity.action === filterActivity;
    const matchesUser =
      filterUser === "all" || activity.user.name === filterUser;
    return matchesSearch && matchesActivity && matchesUser;
  });

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "login":
        return LogIn;
      case "logout":
        return LogOut;
      case "login_failed":
        return AlertTriangle;
      case "widget_create":
      case "widget_update":
      case "widget_delete":
        return MessageSquare;
      case "settings_update":
        return Settings;
      case "view_analytics":
        return Eye;
      case "user_create":
      case "user_update":
        return Users;
      case "permission_denied":
        return Shield;
      default:
        return Activity;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Success
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Warning
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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

  const exportActivities = () => {
    // Here you would implement the export functionality
    console.log("Exporting activities...", filteredActivities);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-background via-background to-violet-50/30 dark:to-violet-950/30 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            User Activity
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor user actions and system interactions
          </p>
        </div>
        <Button onClick={exportActivities} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Activities
        </Button>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {activities.filter((a) => a.status === "success").length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Successful Actions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {activities.filter((a) => a.status === "failed").length}
                </p>
                <p className="text-sm text-muted-foreground">Failed Actions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {users.length}
                </p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
                <Activity className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                  {activities.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total Activities
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6 bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities by user, action, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filterActivity} onValueChange={setFilterActivity}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Activity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  {activityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger className="w-[150px]">
                  <Users className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DatePickerWithRange
                date={dateRange}
                onDateChange={setDateRange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities Table */}
      <Card className="bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-violet-600" />
            Recent Activities ({filteredActivities.length})
          </CardTitle>
          <CardDescription>
            Track user actions and system interactions in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Device</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((activity) => {
                const IconComponent = getActivityIcon(activity.action);
                return (
                  <TableRow
                    key={activity.id}
                    className="hover:bg-violet-50/50 dark:hover:bg-violet-950/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 ring-2 ring-violet-200/50 dark:ring-violet-800/50">
                          <AvatarImage
                            src={activity.user.avatar}
                            alt={activity.user.name}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs">
                            {activity.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-violet-700 dark:text-violet-300">
                            {activity.user.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <Badge
                              className={getRoleBadgeColor(activity.user.role)}
                              variant="outline"
                            >
                              {activity.user.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-200/50 dark:border-violet-800/50">
                          <IconComponent className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {activity.action
                              .replace("_", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {activity.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(activity.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {activity.timestamp}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {activity.location}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activity.ipAddress}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Monitor className="h-3 w-3" />
                        {activity.device}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-xs text-muted-foreground max-w-[200px] truncate">
                        {activity.details}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivity;

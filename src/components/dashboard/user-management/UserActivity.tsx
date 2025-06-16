import React from "react";
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
  Download,
  Eye,
  LogIn,
  LogOut,
  Settings,
  MessageSquare,
  Shield,
  Users,
  Clock,
  MapPin,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useUserActivity } from "@/hooks/useUserActivity";

const UserActivity = () => {
  const {
    activities,
    statistics,
    users,
    searchTerm,
    filterActivity,
    filterUser,
    dateRange,
    isLoading,
    setSearchTerm,
    setFilterActivity,
    setFilterUser,
    setDateRange,
    exportActivities,
  } = useUserActivity();

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

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-300">
            User Activity
          </h2>
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
                  {statistics.successful_activities}
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
                  {statistics.failed_activities}
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
                  {statistics.unique_users}
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
                  {statistics.total_activities}
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
      <Card className="bg-card/80 backdrop-blur-xl border-violet-200/50 dark:border-violet-800/50">
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
            Recent Activities ({activities.length})
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-600 mx-auto" />
                    <span className="ml-2 text-muted-foreground">
                      Loading activities...
                    </span>
                  </TableCell>
                </TableRow>
              ) : activities.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No activities found
                  </TableCell>
                </TableRow>
              ) : (
                activities.map((activity) => {
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
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.user?.name || "user"}`}
                              alt={activity.user?.name || "User"}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs">
                              {activity.user?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-violet-700 dark:text-violet-300">
                              {activity.user?.name || "Unknown User"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <Badge
                                className={getRoleBadgeColor(
                                  activity.user?.roles?.[0]?.name || "User",
                                )}
                                variant="outline"
                              >
                                {activity.user?.email || "Unknown email"}
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
                                ?.replace("_", " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase()) ||
                                "Unknown Action"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {activity.description || "No details"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(activity.status || "unknown")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {activity.created_at
                            ? new Date(activity.created_at).toLocaleString()
                            : "Unknown"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {activity.ip_address || "Unknown IP"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activity.ip_address || "Unknown IP"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Monitor className="h-3 w-3" />
                          {activity.user_agent
                            ? activity.user_agent.substring(0, 20) + "..."
                            : "Unknown Device"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-xs text-muted-foreground max-w-[200px] truncate">
                          {activity.description || "No details"}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default UserActivity;

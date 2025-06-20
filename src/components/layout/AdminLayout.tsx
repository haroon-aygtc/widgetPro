import React from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  MessageSquare,
  Settings,
  Database,
  Bot,
  LineChart,
  Bell,
  Search,
  HelpCircle,
  LogOut,
  Code,
  FileText,
  Users,
  Shield,
  Key,
  UserCheck,
  Activity,
  FileCheck,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [expandedModules, setExpandedModules] = React.useState<string[]>([]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate to login even if logout fails
      navigate('/login');
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isModuleExpanded = (moduleKey: string) => {
    return expandedModules.includes(moduleKey);
  };

  const toggleModule = (moduleKey: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleKey)
        ? prev.filter((key) => key !== moduleKey)
        : [...prev, moduleKey],
    );
  };

  const isModuleActive = (paths: string[]) => {
    return paths.some((path) => location.pathname.startsWith(path));
  };

  const navItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: BarChart3,
    },
    {
      path: "/admin/widgets",
      label: "Widgets",
      icon: MessageSquare,
    },
    {
      path: "/admin/ai-providers",
      label: "AI Providers",
      icon: Bot,
    },
    {
      path: "/admin/ai-models",
      label: "AI Models",
      icon: Bot,
    },
    {
      path: "/admin/knowledge-base",
      label: "Knowledge Base",
      icon: Database,
    },
    {
      path: "/admin/analytics",
      label: "Analytics",
      icon: LineChart,
    },
    {
      path: "/admin/prompt-templates",
      label: "Prompt Templates",
      icon: FileText,
    },
    {
      path: "/admin/embed",
      label: "Embed Code",
      icon: Code,
    },
    {
      path: "/admin/user-management",
      label: "User Management",
      icon: Users,
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: Settings,
    },
  ];


  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-slate-50/20 dark:to-slate-950/20">
      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t shadow-lg">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 min-h-[60px] ${isActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium truncate">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-card/80 backdrop-blur-xl shadow-xl shadow-violet-500/5">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-violet-200/20 dark:border-violet-800/20">
          <div className="flex items-center">
            <div className="relative">
              <MessageSquare className="h-6 w-6 mr-2 text-transparent bg-gradient-to-r from-teal-600 to-emerald-700 bg-clip-text" />
              <div className="absolute inset-0 h-6 w-6 mr-2 bg-gradient-to-r from-teal-600 to-emerald-700 rounded-sm blur-sm opacity-20"></div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
              ChatWidget Pro
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${isActive(item.path)
                    ? "bg-gradient-to-r from-teal-500/10 to-emerald-500/10 text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/50 shadow-sm"
                    : "hover:bg-gradient-to-r hover:from-teal-500/5 hover:to-emerald-500/5 hover:text-teal-600 dark:hover:text-teal-400 hover:translate-x-1"
                    }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}


          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-violet-200/20 dark:border-violet-800/20">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-200/50 dark:border-teal-800/50 backdrop-blur-sm">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 ring-2 ring-violet-200/50 dark:ring-violet-800/50">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'admin'}`}
                  alt="User"
                />
                <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-violet-700 dark:text-violet-300">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-violet-500/70 dark:text-violet-400/70">
                  {user?.email || 'Loading...'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="border-b bg-card/80 backdrop-blur-xl p-4 shadow-sm shadow-violet-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                {location.pathname === "/admin" && "Dashboard"}
                {location.pathname === "/admin/widgets" &&
                  "Widget Configuration"}
                {location.pathname === "/admin/ai-providers" && "AI Providers"}
                {location.pathname === "/admin/ai-models" && "AI Models"}
                {location.pathname === "/admin/knowledge-base" &&
                  "Knowledge Base"}
                {location.pathname === "/admin/analytics" && "Analytics"}
                {location.pathname === "/admin/prompt-templates" &&
                  "Prompt Templates"}
                {location.pathname === "/admin/embed" && "Embed Code"}
                {location.pathname === "/admin/settings" && "Settings"}
                {location.pathname === "/admin/users" && "Users"}
                {location.pathname === "/admin/roles" && "Roles"}
                {location.pathname === "/admin/permissions" && "Permissions"}
                {location.pathname === "/admin/assign-role" &&
                  "Assign Role to User"}
                {location.pathname === "/admin/assign-permission" &&
                  "Assign Permission to User"}
                {location.pathname === "/admin/user-activity" &&
                  "User Activity"}
                {location.pathname === "/admin/activity-logs" &&
                  "Activity Logs & Audit Trail"}
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-violet-50 dark:hover:bg-violet-950/50"
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-violet-50 dark:hover:bg-violet-950/50 relative"
              >
                <Bell className="h-4 w-4" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </div>
              </Button>

              {/* Help */}
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-violet-50 dark:hover:bg-violet-950/50"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Menu */}
              <div className="flex items-center space-x-2 pl-2 border-l border-violet-200/50 dark:border-violet-800/50">
                <Avatar className="h-8 w-8 ring-2 ring-violet-200/50 dark:ring-violet-800/50">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'admin'}`}
                    alt="User"
                  />
                  <AvatarFallback className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-xs font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto pb-20 md:pb-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

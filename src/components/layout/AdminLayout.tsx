import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
} from "lucide-react";

const AdminLayout = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
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
      path: "/admin/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-violet-50/30 dark:to-violet-950/30">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-card/80 backdrop-blur-xl shadow-xl shadow-violet-500/5">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-violet-200/20 dark:border-violet-800/20">
          <div className="flex items-center">
            <div className="relative">
              <MessageSquare className="h-6 w-6 mr-2 text-transparent bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text" />
              <div className="absolute inset-0 h-6 w-6 mr-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-sm blur-sm opacity-20"></div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
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
                  className={`flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-700 dark:text-violet-300 border border-violet-200/50 dark:border-violet-800/50 shadow-sm"
                      : "hover:bg-gradient-to-r hover:from-violet-500/5 hover:to-purple-500/5 hover:text-violet-600 dark:hover:text-violet-400 hover:translate-x-1"
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
          <div className="flex items-center p-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-200/50 dark:border-violet-800/50 backdrop-blur-sm">
            <Avatar className="h-8 w-8 mr-2 ring-2 ring-violet-200/50 dark:ring-violet-800/50">
              <AvatarImage
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                alt="User"
              />
              <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-semibold">
                AD
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-violet-700 dark:text-violet-300">
                Admin User
              </p>
              <p className="text-xs text-violet-500/70 dark:text-violet-400/70">
                admin@company.com
              </p>
            </div>
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
                {location.pathname === "/admin/ai-models" && "AI Models"}
                {location.pathname === "/admin/knowledge-base" &&
                  "Knowledge Base"}
                {location.pathname === "/admin/analytics" && "Analytics"}
                {location.pathname === "/admin/prompt-templates" &&
                  "Prompt Templates"}
                {location.pathname === "/admin/embed" && "Embed Code"}
                {location.pathname === "/admin/settings" && "Settings"}
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
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                    alt="User"
                  />
                  <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-semibold">
                    AD
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-violet-50 dark:hover:bg-violet-950/50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  authService,
  type AuthUser,
  handleAuthError,
} from "@/services/authService";
import { toastUtils } from "@/components/ui/use-toast";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  checkPermission: (permission: string) => boolean;
  checkRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Initialize auth state
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
      // Don't show error toast on initial load if not authenticated
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      toastUtils.loginSuccess();
    } catch (error) {
      const errorMessage = handleAuthError(error);
      toastUtils.loginError(errorMessage);
      throw error;
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
      toastUtils.registerSuccess();
    } catch (error) {
      const errorMessage = handleAuthError(error);
      toastUtils.registerError(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toastUtils.logoutSuccess();
    } catch (error) {
      // Even if logout fails on server, clear local state
      setUser(null);
      console.warn("Logout error:", error);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.refreshUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
      toastUtils.sessionExpired();
      throw error;
    }
  };

  const checkPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.some((p) => p.name === permission);
  };

  const checkRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.some((r) => r.name === role);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    checkPermission,
    checkRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to access this page.
            </p>
            <a href="/login" className="text-violet-600 hover:text-violet-700">
              Sign In
            </a>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Hook for permission-based access control
export function usePermission(permission: string) {
  const { checkPermission } = useAuth();
  return checkPermission(permission);
}

// Hook for role-based access control
export function useRole(role: string) {
  const { checkRole } = useAuth();
  return checkRole(role);
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import ErrorBoundary from "@/components/ui/error-boundary";
import { toastUtils } from "@/components/ui/use-toast";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useOperationLoading } from "@/contexts/LoadingContext";
import { loginSchema } from "@/lib/validation";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Use unified loading state management
  const loginLoading = useOperationLoading("login");

  const {
    errors,
    validateForm,
    validateField,
    setFieldTouched,
    getFieldError,
  } = useFormValidation(loginSchema, {
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field !== "remember") {
      validateField(field, value);
    }
  };

  const handleInputBlur = (field: string) => {
    setFieldTouched(field, true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = await validateForm(formData);
    if (!validation.success) {
      const errorCount = Object.keys(errors).filter(
        (key) => errors[key],
      ).length;
      toastUtils.validationError(errorCount);
      return;
    }

    loginLoading.start("Signing you in...");

    try {
      loginLoading.updateMessage("Verifying credentials...");
      await login({
        email: formData.email,
        password: formData.password,
        remember: formData.remember || false,
      });

      loginLoading.updateProgress(100);
      loginLoading.updateMessage("Login successful!");

      setTimeout(() => {
        navigate("/admin");
      }, 500);
    } catch (error) {
      // Error handling is done in AuthContext
      console.error("Login error:", error);
    } finally {
      loginLoading.stop();
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background flex">
        {/* Left Column - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-700 via-teal-700 to-emerald-800 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23ffffff fill-opacity=0.05%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
            {/* Logo */}
            <div className="flex items-center mb-12">
              <div className="relative">
                <MessageSquare className="h-12 w-12 mr-4 text-white" />
                <div className="absolute inset-0 h-12 w-12 mr-4 bg-white rounded-lg blur-lg opacity-20"></div>
              </div>
              <h1 className="text-4xl font-bold">HelixChat</h1>
            </div>

            {/* Main Heading */}
            <div className="mb-12">
              <h2 className="text-5xl font-bold leading-tight mb-6">
                Welcome back to the future of
                <span className="block bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
                  customer engagement
                </span>
              </h2>
              <p className="text-xl text-violet-100 leading-relaxed">
                Transform your website with AI-powered chat widgets that
                understand, engage, and convert visitors into customers.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="h-6 w-6 text-yellow-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    AI-Powered Intelligence
                  </h3>
                  <p className="text-violet-200">
                    Advanced AI models that understand context and provide
                    meaningful responses
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Shield className="h-6 w-6 text-green-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Enterprise Security
                  </h3>
                  <p className="text-violet-200">
                    Bank-grade security with end-to-end encryption and
                    compliance
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Zap className="h-6 w-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Lightning Fast Setup
                  </h3>
                  <p className="text-violet-200">
                    Deploy in minutes with our intuitive configuration interface
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">10K+</div>
                <div className="text-violet-200 text-sm">Active Widgets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                <div className="text-violet-200 text-sm">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-violet-200 text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Link
                to="/"
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to home
              </Link>
              <ThemeToggle />
            </div>

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center mb-8">
              <div className="relative">
                <MessageSquare className="h-10 w-10 mr-3 text-violet-600" />
                <div className="absolute inset-0 h-10 w-10 mr-3 bg-gradient-to-r from-teal-600 to-emerald-700 rounded-sm blur-sm opacity-20"></div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
                HelixChat
              </h1>
            </div>

            <Card className="border-0 shadow-2xl shadow-violet-500/10 bg-card/80 backdrop-blur-xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent mb-2">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Sign in to your HelixChat account to continue
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        onBlur={() => handleInputBlur("email")}
                        className={`pl-10 h-12 border-violet-200/50 dark:border-violet-800/50 focus:border-violet-400 dark:focus:border-violet-600 transition-colors ${getFieldError("email")
                          ? "border-red-500 focus:border-red-500 bg-red-50/50 dark:bg-red-950/20"
                          : ""
                          }`}
                        required
                      />
                      {getFieldError("email") && (
                        <p className="text-sm text-red-500 mt-1">
                          {getFieldError("email")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        onBlur={() => handleInputBlur("password")}
                        className={`pl-10 pr-10 h-12 border-violet-200/50 dark:border-violet-800/50 focus:border-violet-400 dark:focus:border-violet-600 transition-colors ${getFieldError("password")
                          ? "border-red-500 focus:border-red-500 bg-red-50/50 dark:bg-red-950/20"
                          : ""
                          }`}
                        required
                      />
                      {getFieldError("password") && (
                        <p className="text-sm text-red-500 mt-1">
                          {getFieldError("password")}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        id="remember"
                        type="checkbox"
                        checked={formData.remember}
                        onChange={(e) => handleInputChange("remember", e.target.checked)}
                        className="rounded border-violet-200 dark:border-violet-800"
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm text-muted-foreground"
                      >
                        Remember me
                      </Label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 shadow-lg shadow-teal-600/20 hover:shadow-xl hover:shadow-teal-600/25 transition-all duration-300 text-base font-semibold"
                    disabled={loginLoading.isLoading}
                  >
                    {loginLoading.isLoading
                      ? loginLoading.loadingState?.message || "Signing in..."
                      : "Sign In"}
                  </Button>
                </form>

                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-3 text-muted-foreground font-medium">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Button
                      variant="outline"
                      className="h-12 border-violet-200/50 dark:border-violet-800/50 hover:bg-violet-50 dark:hover:bg-violet-950/50 transition-all duration-200"
                    >
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 border-violet-200/50 dark:border-violet-800/50 hover:bg-violet-50 dark:hover:bg-violet-950/50 transition-all duration-200"
                    >
                      <svg
                        className="h-5 w-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                      </svg>
                      GitHub
                    </Button>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium transition-colors"
                    >
                      Sign up for free
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Login;

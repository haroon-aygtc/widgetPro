import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLoading } from "@/contexts/LoadingContext";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  message?: string;
}

const Loading = ({ className, size = "md", message }: LoadingProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={cn("flex items-center justify-center space-x-2", className)}
    >
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {message && (
        <span className="text-sm text-muted-foreground font-medium">
          {message}
        </span>
      )}
    </div>
  );
};

const GlobalLoading = () => {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border-2 border-border/60 rounded-lg p-6 shadow-xl">
        <Loading size="lg" message={loadingMessage || "Loading..."} />
      </div>
    </div>
  );
};

export { Loading, GlobalLoading };

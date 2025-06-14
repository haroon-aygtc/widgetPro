import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends Omit<ButtonProps, "variant"> {
  variant?: "primary" | "secondary" | "outline";
  gradient?: boolean;
  children: React.ReactNode;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  variant = "primary",
  gradient = true,
  className,
  children,
  ...props
}) => {
  const getButtonClasses = () => {
    if (!gradient) return "";
    
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300";
      case "secondary":
        return "bg-white/95 text-violet-600 hover:bg-white hover:text-violet-700 shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm";
      case "outline":
        return "border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-950/50 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-300";
      default:
        return "";
    }
  };

  return (
    <Button
      variant={gradient ? "default" : variant as any}
      className={cn(getButtonClasses(), className)}
      {...props}
    >
      {children}
    </Button>
  );
};

export default GradientButton;

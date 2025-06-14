import React from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent";
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

const gradientVariants = {
  primary: "bg-gradient-to-r from-violet-600 to-purple-600",
  secondary: "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600",
  accent: "bg-gradient-to-r from-violet-500 to-purple-600",
};

const GradientText: React.FC<GradientTextProps> = ({
  children,
  className,
  variant = "primary",
  as: Component = "span",
}) => {
  return (
    <Component
      className={cn(
        gradientVariants[variant],
        "bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </Component>
  );
};

export default GradientText;

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  variant?: "ghost" | "default" | "primary";
  className?: string;
  external?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({
  to,
  children,
  variant = "ghost",
  className,
  external = false,
}) => {
  const baseClasses = "hover:bg-violet-50 dark:hover:bg-violet-950/50";
  const primaryClasses = "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300";

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return primaryClasses;
      case "ghost":
        return baseClasses;
      default:
        return "";
    }
  };

  if (external) {
    return (
      <Button
        variant={variant === "primary" ? "default" : "ghost"}
        className={cn(getVariantClasses(), className)}
        asChild
      >
        <a href={to} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      </Button>
    );
  }

  return (
    <Button
      variant={variant === "primary" ? "default" : "ghost"}
      className={cn(getVariantClasses(), className)}
      asChild
    >
      <Link to={to}>{children}</Link>
    </Button>
  );
};

export default NavLink;

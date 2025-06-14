import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconWrapperProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gradient" | "solid" | "outline";
  className?: string;
  iconClassName?: string;
}

const sizeVariants = {
  sm: {
    wrapper: "w-8 h-8",
    icon: "h-4 w-4",
  },
  md: {
    wrapper: "w-12 h-12",
    icon: "h-6 w-6",
  },
  lg: {
    wrapper: "w-16 h-16",
    icon: "h-8 w-8",
  },
};

const variantClasses = {
  default: "bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-200/50 dark:border-violet-800/50",
  gradient: "bg-gradient-to-r from-violet-500 to-purple-600",
  solid: "bg-primary",
  outline: "border-2 border-violet-500",
};

const iconColorClasses = {
  default: "text-violet-600 dark:text-violet-400",
  gradient: "text-white",
  solid: "text-white",
  outline: "text-violet-600 dark:text-violet-400",
};

const IconWrapper: React.FC<IconWrapperProps> = ({
  icon: Icon,
  size = "md",
  variant = "default",
  className,
  iconClassName,
}) => {
  const sizeConfig = sizeVariants[size];

  return (
    <div
      className={cn(
        sizeConfig.wrapper,
        "rounded-xl flex items-center justify-center mb-4",
        variantClasses[variant],
        className
      )}
    >
      <Icon
        className={cn(
          sizeConfig.icon,
          iconColorClasses[variant],
          iconClassName
        )}
      />
    </div>
  );
};

export default IconWrapper;

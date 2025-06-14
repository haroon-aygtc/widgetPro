import React from "react";
import { MessageSquare } from "lucide-react";
import GradientText from "./GradientText";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
}

const sizeClasses = {
  sm: {
    icon: "h-6 w-6",
    text: "text-lg",
    spacing: "mr-2",
  },
  md: {
    icon: "h-8 w-8",
    text: "text-2xl",
    spacing: "mr-3",
  },
  lg: {
    icon: "h-10 w-10",
    text: "text-3xl",
    spacing: "mr-3",
  },
};

const Logo: React.FC<LogoProps> = ({
  size = "md",
  showText = true,
  className,
  textClassName,
  iconClassName,
}) => {
  const sizeConfig = sizeClasses[size];

  return (
    <div className={cn("flex items-center", className)}>
      <div className="relative">
        <MessageSquare 
          className={cn(
            sizeConfig.icon,
            sizeConfig.spacing,
            "text-transparent bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text",
            iconClassName
          )} 
        />
        <div className={cn(
          "absolute inset-0",
          sizeConfig.icon,
          sizeConfig.spacing,
          "bg-gradient-to-r from-violet-500 to-purple-600 rounded-sm blur-sm opacity-20"
        )}></div>
      </div>
      {showText && (
        <GradientText
          as="h1"
          variant="primary"
          className={cn(
            sizeConfig.text,
            "font-bold",
            textClassName
          )}
        >
          ChatWidget Pro
        </GradientText>
      )}
    </div>
  );
};

export default Logo;

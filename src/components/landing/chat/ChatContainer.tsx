import React from "react";
import { cn } from "@/lib/utils";

interface ChatContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "minimal";
}

const variantClasses = {
  default: "bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8",
  elevated: "bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 shadow-xl",
  minimal: "bg-muted/30 rounded-xl p-6",
};

const ChatContainer: React.FC<ChatContainerProps> = ({
  children,
  className,
  variant = "default",
}) => {
  return (
    <div className={cn("relative", className)}>
      <div className={variantClasses[variant]}>
        <div className="bg-card rounded-xl p-6 shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;

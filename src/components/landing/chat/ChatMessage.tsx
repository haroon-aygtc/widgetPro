import React from "react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  text: string;
  isUser?: boolean;
  className?: string;
  timestamp?: string;
  avatar?: React.ReactNode;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  text,
  isUser = false,
  className,
  timestamp,
  avatar,
}) => {
  return (
    <div
      className={cn(
        "rounded-lg p-3",
        isUser
          ? "bg-primary/10 ml-8"
          : "bg-muted/50",
        className
      )}
    >
      {avatar && !isUser && (
        <div className="flex items-center mb-2">
          {avatar}
        </div>
      )}
      <p className="text-sm">{text}</p>
      {timestamp && (
        <span className="text-xs text-muted-foreground mt-1 block">
          {timestamp}
        </span>
      )}
    </div>
  );
};

export default ChatMessage;

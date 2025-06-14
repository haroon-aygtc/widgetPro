import React from "react";
import { MessageSquare } from "lucide-react";
import IconWrapper from "../common/IconWrapper";

interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  className?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = "AI Assistant",
  subtitle,
  avatar,
  className,
}) => {
  return (
    <div className={`flex items-center mb-4 ${className || ""}`}>
      {avatar || (
        <IconWrapper
          icon={MessageSquare}
          size="sm"
          variant="solid"
          className="mb-0 mr-3"
        />
      )}
      <div>
        <span className="font-medium">{title}</span>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;

import React from "react";
import ChatContainer from "./chat/ChatContainer";
import ChatHeader from "./chat/ChatHeader";
import ChatMessage from "./chat/ChatMessage";

interface ChatMessageData {
  text: string;
  isUser?: boolean;
  timestamp?: string;
}

interface ChatDemoProps {
  messages?: ChatMessageData[];
  className?: string;
  variant?: "default" | "elevated" | "minimal";
  title?: string;
  subtitle?: string;
}

const defaultMessages: ChatMessageData[] = [
  { text: "Hello! How can I help you today?", isUser: false },
  { text: "I need help with your pricing plans.", isUser: true },
  { text: "I'd be happy to help! We offer flexible pricing plans starting at $29/month...", isUser: false },
];

const ChatDemo: React.FC<ChatDemoProps> = ({
  messages = defaultMessages,
  className,
  variant = "default",
  title = "AI Assistant",
  subtitle
}) => {
  return (
    <ChatContainer className={className} variant={variant}>
      <ChatHeader title={title} subtitle={subtitle} />
      <div className="space-y-3">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            text={message.text}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
      </div>
    </ChatContainer>
  );
};

export default ChatDemo;

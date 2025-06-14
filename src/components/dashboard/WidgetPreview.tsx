import React, { useState, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Smartphone,
  Monitor,
  MessageSquare,
  X,
  Minus,
  Maximize2,
  Send,
  Tablet,
} from "lucide-react";

interface WidgetPreviewProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  theme?: "light" | "dark";
  primaryColor?: string;
  welcomeMessage?: string;
  botName?: string;
  botAvatar?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  className?: string;
}

const WidgetPreview = ({
  position = "bottom-right",
  theme = "light",
  primaryColor = "#7C3AED",
  welcomeMessage = "Hello! How can I help you today?",
  botName = "AI Assistant",
  botAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=assistant",
  width = 350,
  height = 500,
  placeholder = "Type your message...",
  className = "",
}: WidgetPreviewProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ text: string; sender: "user" | "bot"; timestamp: Date }>
  >([
    {
      text: welcomeMessage,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = useCallback(() => {
    if (!currentMessage.trim()) return;

    const newMessages = [
      ...messages,
      {
        text: currentMessage,
        sender: "user" as const,
        timestamp: new Date(),
      },
    ];

    setMessages(newMessages);
    setCurrentMessage("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      setMessages([
        ...newMessages,
        {
          text: "This is a simulated response from the AI assistant. The widget is working perfectly!",
          sender: "bot" as const,
          timestamp: new Date(),
        },
      ]);
    }, 1500);
  }, [currentMessage, messages]);

  const getPositionClasses = useMemo(() => {
    if (isFullscreen) return "inset-0";

    switch (position) {
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "top-right":
        return "top-4 right-4";
      case "top-left":
        return "top-4 left-4";
      default:
        return "bottom-4 right-4";
    }
  }, [position, isFullscreen]);

  const getThemeClasses = useMemo(() => {
    return theme === "dark"
      ? "bg-gray-900 text-white border-gray-700"
      : "bg-white text-gray-900 border-gray-200";
  }, [theme]);

  const getDeviceClasses = useMemo(() => {
    switch (viewMode) {
      case "mobile":
        return "w-[375px] h-[667px]";
      case "tablet":
        return "w-[768px] h-[1024px]";
      case "desktop":
      default:
        return "w-full h-full";
    }
  }, [viewMode]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Widget Preview
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("desktop")}
              className={
                viewMode === "desktop"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("tablet")}
              className={
                viewMode === "tablet"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("mobile")}
              className={
                viewMode === "mobile"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription>Interactive preview - {viewMode} view</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[700px] bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden rounded-lg">
          <div
            className={`mx-auto ${getDeviceClasses} relative`}
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=20)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Widget Button */}
            {!isOpen && (
              <div
                className={`absolute ${getPositionClasses} cursor-pointer rounded-full p-3 shadow-lg hover:scale-110 transition-transform`}
                style={{ backgroundColor: primaryColor }}
                onClick={() => setIsOpen(true)}
              >
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            )}

            {/* Widget Container */}
            {isOpen && (
              <div
                className={`absolute ${getPositionClasses} ${getThemeClasses} rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${isMinimized ? "h-12" : ""}`}
                style={{
                  width: isFullscreen
                    ? "100%"
                    : viewMode === "tablet"
                      ? `min(${width}px, 320px)`
                      : viewMode === "mobile"
                        ? `min(${width}px, 280px)`
                        : `${width}px`,
                  height: isFullscreen
                    ? "100%"
                    : isMinimized
                      ? "48px"
                      : viewMode === "tablet"
                        ? `min(${height}px, 450px)`
                        : viewMode === "mobile"
                          ? `min(${height}px, 400px)`
                          : `${height}px`,
                }}
              >
                {/* Widget Header */}
                <div
                  className="p-3 flex justify-between items-center border-b"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={botAvatar} alt={botName} />
                      <AvatarFallback className="bg-white/20 text-white">
                        {botName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-white text-sm">
                        {botName}
                      </span>
                      <span className="text-white/80 text-xs">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
                      onClick={() => setIsMinimized(!isMinimized)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages Container */}
                {!isMinimized && (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                              message.sender === "user"
                                ? "bg-primary text-primary-foreground ml-4"
                                : theme === "dark"
                                  ? "bg-gray-700 text-white mr-4"
                                  : "bg-gray-100 text-gray-900 mr-4"
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <span className="text-xs opacity-70 mt-1 block">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div
                            className={`rounded-2xl px-4 py-2 mr-4 ${
                              theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                            }`}
                          >
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input Area */}
                    <div
                      className={`p-4 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleSendMessage()
                            }
                            className={`w-full rounded-full px-4 py-2 pr-12 outline-none transition-all focus:ring-2 focus:ring-primary/50 ${
                              theme === "dark"
                                ? "bg-gray-700 text-white placeholder-gray-400"
                                : "bg-gray-100 text-gray-900 placeholder-gray-500"
                            }`}
                            placeholder={placeholder}
                          />
                          <Button
                            onClick={handleSendMessage}
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full h-8 w-8 p-0"
                            style={{ backgroundColor: primaryColor }}
                            disabled={!currentMessage.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WidgetPreview;

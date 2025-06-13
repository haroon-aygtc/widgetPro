import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  MessageSquare,
  X,
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
}: WidgetPreviewProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentPosition, setCurrentPosition] = useState<string>(position);
  const [currentTheme, setCurrentTheme] = useState<string>(theme);
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [currentWidth, setCurrentWidth] = useState<number>(width);
  const [currentHeight, setCurrentHeight] = useState<number>(height);
  const [messages, setMessages] = useState<
    Array<{ text: string; sender: "user" | "bot"; timestamp: Date }>
  >([
    {
      text: welcomeMessage,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    // Add user message
    const newMessages = [
      ...messages,
      {
        text: currentMessage,
        sender: "user",
        timestamp: new Date(),
      },
    ];

    setMessages(newMessages);
    setCurrentMessage("");

    // Simulate bot response after a short delay
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          text: "This is a simulated response from the AI assistant.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  const getPositionClasses = () => {
    switch (currentPosition) {
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
  };

  const getThemeClasses = () => {
    return currentTheme === "dark"
      ? "bg-gray-800 text-white"
      : "bg-white text-gray-800";
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Widget Preview</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("desktop")}
            className={
              viewMode === "desktop" ? "bg-primary text-primary-foreground" : ""
            }
          >
            <Monitor className="h-4 w-4 mr-1" />
            Desktop
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("tablet")}
            className={
              viewMode === "tablet" ? "bg-primary text-primary-foreground" : ""
            }
          >
            <Monitor className="h-4 w-4 mr-1" />
            Tablet
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("mobile")}
            className={
              viewMode === "mobile" ? "bg-primary text-primary-foreground" : ""
            }
          >
            <Smartphone className="h-4 w-4 mr-1" />
            Mobile
          </Button>
        </div>
      </div>

      <Tabs defaultValue="preview" className="flex-1">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
        </TabsList>

        <TabsContent
          value="preview"
          className="flex-1 relative border rounded-md overflow-hidden"
        >
          <div
            className={`w-full h-full ${viewMode !== "desktop" ? "bg-gray-100 p-4" : "bg-gray-50"} relative`}
          >
            <div
              className={`${
                viewMode === "mobile"
                  ? "w-[375px] h-[667px] mx-auto border border-gray-300 rounded-xl overflow-hidden"
                  : viewMode === "tablet"
                    ? "w-full h-full max-w-[768px] max-h-[1024px] mx-auto border border-gray-300 rounded-xl overflow-hidden"
                    : "w-full h-full"
              } relative`}
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
                  className={`absolute ${getPositionClasses()} cursor-pointer rounded-full p-3`}
                  style={{ backgroundColor: primaryColor }}
                  onClick={() => setIsOpen(true)}
                >
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
              )}

              {/* Widget Container */}
              {isOpen && (
                <div
                  className={`absolute ${getPositionClasses()} ${getThemeClasses()} rounded-lg shadow-lg overflow-hidden flex flex-col`}
                  style={{
                    width:
                      viewMode === "tablet"
                        ? `min(${currentWidth}px, 320px)`
                        : viewMode === "mobile"
                          ? `min(${currentWidth}px, 280px)`
                          : `${currentWidth}px`,
                    height:
                      viewMode === "tablet"
                        ? `min(${currentHeight}px, 450px)`
                        : viewMode === "mobile"
                          ? `min(${currentHeight}px, 400px)`
                          : `${currentHeight}px`,
                    maxWidth:
                      viewMode === "tablet"
                        ? "320px"
                        : viewMode === "mobile"
                          ? "280px"
                          : "none",
                    maxHeight:
                      viewMode === "tablet"
                        ? "450px"
                        : viewMode === "mobile"
                          ? "400px"
                          : "none",
                  }}
                >
                  {/* Widget Header */}
                  <div
                    className="p-3 flex justify-between items-center"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={botAvatar} alt={botName} />
                        <AvatarFallback>
                          {botName.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-white">{botName}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Messages Container */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-2 ${
                            message.sender === "user"
                              ? `bg-primary text-primary-foreground`
                              : currentTheme === "dark"
                                ? "bg-gray-700"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input Area */}
                  <div
                    className={`p-3 border-t ${currentTheme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                  >
                    <div className="flex">
                      <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        className={`flex-1 rounded-l-md p-2 outline-none ${currentTheme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100"}`}
                        placeholder="Type your message..."
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="rounded-l-none"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <Card className="p-4">
            <h4 className="font-medium mb-3">Position</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className={
                  currentPosition === "top-left"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
                onClick={() => setCurrentPosition("top-left")}
              >
                <ArrowUp className="h-4 w-4 mr-1" />
                <ArrowLeft className="h-4 w-4" />
                Top Left
              </Button>
              <Button
                variant="outline"
                className={
                  currentPosition === "top-right"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
                onClick={() => setCurrentPosition("top-right")}
              >
                <ArrowUp className="h-4 w-4 mr-1" />
                <ArrowRight className="h-4 w-4" />
                Top Right
              </Button>
              <Button
                variant="outline"
                className={
                  currentPosition === "bottom-left"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
                onClick={() => setCurrentPosition("bottom-left")}
              >
                <ArrowDown className="h-4 w-4 mr-1" />
                <ArrowLeft className="h-4 w-4" />
                Bottom Left
              </Button>
              <Button
                variant="outline"
                className={
                  currentPosition === "bottom-right"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
                onClick={() => setCurrentPosition("bottom-right")}
              >
                <ArrowDown className="h-4 w-4 mr-1" />
                <ArrowRight className="h-4 w-4" />
                Bottom Right
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-3">Theme</h4>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className={
                    currentTheme === "light"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                  onClick={() => setCurrentTheme("light")}
                >
                  <Sun className="h-4 w-4 mr-1" />
                  Light
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className={
                    currentTheme === "dark"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                  onClick={() => setCurrentTheme("dark")}
                >
                  <Moon className="h-4 w-4 mr-1" />
                  Dark
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-3">Size</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Width: {currentWidth}px</Label>
                </div>
                <Slider
                  value={[currentWidth]}
                  min={250}
                  max={450}
                  step={10}
                  onValueChange={(value) => setCurrentWidth(value[0])}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Height: {currentHeight}px</Label>
                </div>
                <Slider
                  value={[currentHeight]}
                  min={400}
                  max={600}
                  step={10}
                  onValueChange={(value) => setCurrentHeight(value[0])}
                />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-3">Test Conversation</h4>
            <div className="space-y-2">
              <Label>
                Send a test message to see how it appears in the widget
              </Label>
              <div className="flex">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  className="flex-1 rounded-l-md border p-2"
                  placeholder="Type a test message..."
                />
                <Button onClick={handleSendMessage} className="rounded-l-none">
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WidgetPreview;

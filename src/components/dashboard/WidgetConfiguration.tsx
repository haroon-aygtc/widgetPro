import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronRight,
  Code,
  Palette,
  Settings,
  LayoutTemplate,
  Monitor,
  Smartphone,
  Tablet,
  MessageSquare,
  X,
  Minus,
  Maximize2,
  Send,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sun,
  Moon,
  Sliders,
} from "lucide-react";

interface WidgetConfigurationProps {
  widgetId?: string;
}

const WidgetConfiguration = ({ widgetId }: WidgetConfigurationProps = {}) => {
  const [activeTab, setActiveTab] = useState("templates");
  const [widgetName, setWidgetName] = useState("My Chat Widget");
  const [selectedTemplate, setSelectedTemplate] = useState("default");
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [widgetPosition, setWidgetPosition] = useState("bottom-right");
  const [autoOpen, setAutoOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [widgetTheme, setWidgetTheme] = useState<"light" | "dark">("light");
  const [widgetWidth, setWidgetWidth] = useState(350);
  const [widgetHeight, setWidgetHeight] = useState(500);
  const [botName, setBotName] = useState("AI Assistant");
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Hello! How can I help you today?",
  );
  const [botAvatar, setBotAvatar] = useState(
    "https://api.dicebear.com/7.x/avataaars/svg?seed=assistant",
  );
  const [isWidgetOpen, setIsWidgetOpen] = useState(true);
  const [isWidgetMinimized, setIsWidgetMinimized] = useState(false);
  const [isWidgetFullscreen, setIsWidgetFullscreen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
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

  const templates = [
    {
      id: "default",
      name: "Default",
      description: "Standard chat widget with clean design",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simplified interface with essential features only",
    },
    {
      id: "modern",
      name: "Modern",
      description: "Contemporary design with rounded corners and shadows",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Professional design for business websites",
    },
  ];

  const positions = [
    { value: "bottom-right", label: "Bottom Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "top-right", label: "Top Right" },
    { value: "top-left", label: "Top Left" },
  ];

  const handleSave = () => {
    // Placeholder for save functionality
    console.log("Saving widget configuration...");
  };

  const generateEmbedCode = () => {
    return `<script src="https://chatwidget.pro/widget/${widgetId || "demo"}.js"></script>`;
  };

  const handleSendMessage = () => {
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
  };

  const getDeviceClasses = () => {
    switch (viewMode) {
      case "mobile":
        return "w-[375px] h-[667px]";
      case "tablet":
        return "w-[768px] h-[1024px]";
      case "desktop":
      default:
        return "w-full h-full";
    }
  };

  const getPositionClasses = () => {
    if (isWidgetFullscreen) return "inset-0";

    switch (widgetPosition) {
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
    return widgetTheme === "dark"
      ? "bg-gray-900 text-white border-gray-700"
      : "bg-white text-gray-900 border-gray-200";
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="flex flex-col lg:flex-row gap-6 w-full bg-background p-6">
        <div className="flex-1 space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger
                value="templates"
                className="flex items-center gap-2"
              >
                <LayoutTemplate className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Design
              </TabsTrigger>
              <TabsTrigger value="behavior" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Behavior
              </TabsTrigger>
              <TabsTrigger value="controls" className="flex items-center gap-2">
                <Sliders className="h-4 w-4" />
                Controls
              </TabsTrigger>
              <TabsTrigger value="embed" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Embed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Widget Templates</CardTitle>
                  <CardDescription>
                    Choose a template as a starting point for your chat widget
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedTemplate === template.id ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="h-32 bg-muted rounded-md mb-4 flex items-center justify-center">
                          <span className="text-muted-foreground">Preview</span>
                        </div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="widget-name">Widget Name</Label>
                      <Input
                        id="widget-name"
                        value={widgetName}
                        onChange={(e) => setWidgetName(e.target.value)}
                        placeholder="Enter widget name"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize the look and feel of your chat widget
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="primary-color"
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-20 h-10 p-1"
                        />
                        <Input
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="widget-position">Widget Position</Label>
                      <Select
                        value={widgetPosition}
                        onValueChange={setWidgetPosition}
                      >
                        <SelectTrigger id="widget-position">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          {positions.map((position) => (
                            <SelectItem
                              key={position.value}
                              value={position.value}
                            >
                              {position.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Widget Behavior</CardTitle>
                  <CardDescription>
                    Configure how your chat widget behaves
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-open">Auto Open</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically open the chat widget when a visitor
                          arrives
                        </p>
                      </div>
                      <Switch
                        id="auto-open"
                        checked={autoOpen}
                        onCheckedChange={setAutoOpen}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="welcome-message">Welcome Message</Label>
                      <Input
                        id="welcome-message"
                        placeholder="Enter welcome message"
                        value={welcomeMessage}
                        onChange={(e) => setWelcomeMessage(e.target.value)}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="bot-name">Bot Name</Label>
                      <Input
                        id="bot-name"
                        placeholder="Enter bot name"
                        value={botName}
                        onChange={(e) => setBotName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bot-avatar">Bot Avatar URL</Label>
                      <Input
                        id="bot-avatar"
                        placeholder="Enter avatar URL"
                        value={botAvatar}
                        onChange={(e) => setBotAvatar(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="controls" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Widget Position</CardTitle>
                  <CardDescription>
                    Choose where the widget appears on your website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className={
                        widgetPosition === "top-left"
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }
                      onClick={() => setWidgetPosition("top-left")}
                    >
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <ArrowLeft className="h-4 w-4" />
                      Top Left
                    </Button>
                    <Button
                      variant="outline"
                      className={
                        widgetPosition === "top-right"
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }
                      onClick={() => setWidgetPosition("top-right")}
                    >
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <ArrowRight className="h-4 w-4" />
                      Top Right
                    </Button>
                    <Button
                      variant="outline"
                      className={
                        widgetPosition === "bottom-left"
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }
                      onClick={() => setWidgetPosition("bottom-left")}
                    >
                      <ArrowDown className="h-4 w-4 mr-1" />
                      <ArrowLeft className="h-4 w-4" />
                      Bottom Left
                    </Button>
                    <Button
                      variant="outline"
                      className={
                        widgetPosition === "bottom-right"
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }
                      onClick={() => setWidgetPosition("bottom-right")}
                    >
                      <ArrowDown className="h-4 w-4 mr-1" />
                      <ArrowRight className="h-4 w-4" />
                      Bottom Right
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Widget Theme</CardTitle>
                  <CardDescription>
                    Choose between light and dark themes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      className={
                        widgetTheme === "light"
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }
                      onClick={() => setWidgetTheme("light")}
                    >
                      <Sun className="h-4 w-4 mr-1" />
                      Light
                    </Button>
                    <Button
                      variant="outline"
                      className={
                        widgetTheme === "dark"
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }
                      onClick={() => setWidgetTheme("dark")}
                    >
                      <Moon className="h-4 w-4 mr-1" />
                      Dark
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Widget Size</CardTitle>
                  <CardDescription>
                    Adjust the dimensions of your chat widget
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Width: {widgetWidth}px</Label>
                    </div>
                    <Slider
                      value={[widgetWidth]}
                      min={250}
                      max={450}
                      step={10}
                      onValueChange={(value) => setWidgetWidth(value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Height: {widgetHeight}px</Label>
                    </div>
                    <Slider
                      value={[widgetHeight]}
                      min={400}
                      max={600}
                      step={10}
                      onValueChange={(value) => setWidgetHeight(value[0])}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="embed" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Embed Code</CardTitle>
                  <CardDescription>
                    Add this code to your website to display the chat widget
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-md">
                    <code className="text-sm">{generateEmbedCode()}</code>
                  </div>
                  <Button variant="outline" className="mt-4">
                    Copy Code
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Installation Guide</CardTitle>
                  <CardDescription>
                    Follow these steps to add the widget to your website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Copy the embed code above</li>
                    <li>
                      Paste it before the closing <code>&lt;/body&gt;</code> tag
                      on your website
                    </li>
                    <li>Save your changes and refresh your website</li>
                    <li>The chat widget should now appear on your website</li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-full lg:w-[500px] sticky top-6 self-start">
          <Card>
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
              <CardDescription>
                Interactive preview - {viewMode} view
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[700px] bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden rounded-lg">
                <div
                  className={`mx-auto ${getDeviceClasses()} relative`}
                  style={{
                    backgroundImage:
                      "url(https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=20)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Widget Button */}
                  {!isWidgetOpen && (
                    <div
                      className={`absolute ${getPositionClasses()} cursor-pointer rounded-full p-3 shadow-lg hover:scale-110 transition-transform`}
                      style={{ backgroundColor: primaryColor }}
                      onClick={() => setIsWidgetOpen(true)}
                    >
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                  )}

                  {/* Widget Container */}
                  {isWidgetOpen && (
                    <div
                      className={`absolute ${getPositionClasses()} ${getThemeClasses()} rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${isWidgetMinimized ? "h-12" : ""}`}
                      style={{
                        width: isWidgetFullscreen ? "100%" : `${widgetWidth}px`,
                        height: isWidgetFullscreen
                          ? "100%"
                          : isWidgetMinimized
                            ? "48px"
                            : `${widgetHeight}px`,
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
                            <span className="text-white/80 text-xs">
                              Online
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 h-8 w-8 p-0"
                            onClick={() =>
                              setIsWidgetMinimized(!isWidgetMinimized)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 h-8 w-8 p-0"
                            onClick={() =>
                              setIsWidgetFullscreen(!isWidgetFullscreen)
                            }
                          >
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 h-8 w-8 p-0"
                            onClick={() => setIsWidgetOpen(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Messages Container */}
                      {!isWidgetMinimized && (
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
                                      : widgetTheme === "dark"
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
                                    widgetTheme === "dark"
                                      ? "bg-gray-700"
                                      : "bg-gray-100"
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
                            className={`p-4 border-t ${widgetTheme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                          >
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 relative">
                                <input
                                  type="text"
                                  value={currentMessage}
                                  onChange={(e) =>
                                    setCurrentMessage(e.target.value)
                                  }
                                  onKeyPress={(e) =>
                                    e.key === "Enter" && handleSendMessage()
                                  }
                                  className={`w-full rounded-full px-4 py-2 pr-12 outline-none transition-all focus:ring-2 focus:ring-primary/50 ${
                                    widgetTheme === "dark"
                                      ? "bg-gray-700 text-white placeholder-gray-400"
                                      : "bg-gray-100 text-gray-900 placeholder-gray-500"
                                  }`}
                                  placeholder="Type your message..."
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
        </div>
      </div>
    </div>
  );
};

export default WidgetConfiguration;

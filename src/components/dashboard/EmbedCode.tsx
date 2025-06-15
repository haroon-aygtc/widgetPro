import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Check,
  Code,
  Globe,
  Settings,
  TestTube,
  Play,
  RefreshCw,
} from "lucide-react";

interface EmbedCodeProps {
  widgetId?: string;
  widgetConfig?: {
    name: string;
    primaryColor: string;
    position: string;
    autoOpen: boolean;
    welcomeMessage: string;
    botName: string;
    botAvatar: string;
    theme: string;
    width: number;
    height: number;
  };
}

const EmbedCode = ({
  widgetId = "demo-widget",
  widgetConfig = {
    name: "My Chat Widget",
    primaryColor: "#4f46e5",
    position: "bottom-right",
    autoOpen: false,
    welcomeMessage: "Hello! How can I help you today?",
    botName: "AI Assistant",
    botAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=assistant",
    theme: "light",
    width: 350,
    height: 500,
  },
}: EmbedCodeProps) => {
  const [copied, setCopied] = useState(false);
  const [testUrl, setTestUrl] = useState("https://example.com");
  const [embedMethod, setEmbedMethod] = useState<"script" | "iframe" | "npm">(
    "script",
  );
  const [customDomain, setCustomDomain] = useState("chatwidget.pro");
  const [enableAnalytics, setEnableAnalytics] = useState(true);
  const [enableCustomCSS, setEnableCustomCSS] = useState(false);
  const [customCSS, setCustomCSS] = useState("");
  const [isTestingMode, setIsTestingMode] = useState(false);

  const generateEmbedCode = () => {
    const config = {
      widgetId,
      ...widgetConfig,
      analytics: enableAnalytics,
      customCSS: enableCustomCSS ? customCSS : undefined,
    };

    const configString = JSON.stringify(config, null, 2);

    switch (embedMethod) {
      case "script":
        return `<!-- ChatWidget Pro Embed Code -->
<!-- Widget: ${widgetConfig.name} (ID: ${widgetId}) -->
<!-- Generated: ${new Date().toLocaleString()} -->
<script>
  window.ChatWidgetConfig = ${configString};
</script>
<script src="https://${customDomain}/widget/${widgetId}.js" async></script>

<!-- Optional: Custom styling -->
${
  enableCustomCSS
    ? `<style>
${customCSS}
</style>`
    : ""
}`;

      case "iframe":
        const iframeUrl = `https://${customDomain}/embed/${widgetId}?${new URLSearchParams(
          {
            theme: widgetConfig.theme,
            position: widgetConfig.position,
            color: widgetConfig.primaryColor.replace("#", ""),
            autoOpen: widgetConfig.autoOpen.toString(),
            analytics: enableAnalytics.toString(),
          },
        ).toString()}`;

        return `<!-- ChatWidget Pro iFrame Embed -->
<!-- Widget: ${widgetConfig.name} (ID: ${widgetId}) -->
<!-- Generated: ${new Date().toLocaleString()} -->
<iframe 
  src="${iframeUrl}"
  width="${widgetConfig.width}"
  height="${widgetConfig.height}"
  frameborder="0"
  style="position: fixed; ${widgetConfig.position.includes("bottom") ? "bottom" : "top"}: 20px; ${widgetConfig.position.includes("right") ? "right" : "left"}: 20px; z-index: 9999; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.12);"
  allow="microphone; camera; geolocation"
  title="${widgetConfig.name}">
</iframe>`;

      case "npm":
        return `// ChatWidget Pro React Component
// Widget: ${widgetConfig.name} (ID: ${widgetId})
// Generated: ${new Date().toLocaleString()}
// Install the ChatWidget Pro package
// npm install @chatwidget-pro/react

import { ChatWidget } from '@chatwidget-pro/react';
import '@chatwidget-pro/react/dist/styles.css';

function App() {
  return (
    <div>
      {/* Your app content */}
      
      <ChatWidget
        widgetId="${widgetId}"
        config={${configString}}
      />
    </div>
  );
}`;

      default:
        return "";
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateEmbedCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const generateTestHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChatWidget Test Page</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }
        h1 { margin-bottom: 20px; }
        p { margin-bottom: 30px; opacity: 0.9; }
        .demo-content {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 12px;
            margin: 20px 0;
            backdrop-filter: blur(10px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>ChatWidget Pro Test Page</h1>
        <p>This is a test page to demonstrate your chat widget integration.</p>
        
        <div class="demo-content">
            <h2>Welcome to our demo site!</h2>
            <p>The chat widget should appear in the ${widgetConfig.position.replace("-", " ")} corner of your screen.</p>
            <p>Try interacting with it to test the functionality.</p>
        </div>
    </div>
    
    ${generateEmbedCode()}
</body>
</html>`;
  };

  const openTestPage = () => {
    const testHTML = generateTestHTML();
    const blob = new Blob([testHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-violet-50/20 dark:to-violet-950/20">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Embed Code Generator
            </h1>
            <p className="text-muted-foreground mt-2">
              Generate and customize embed code for:{" "}
              <strong>{widgetConfig.name}</strong>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Widget ID: {widgetId}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-3">
              <button
                onClick={openTestPage}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 hover:border-border/80 hover:bg-muted/50 transition-all duration-200 hover:shadow-md"
              >
                <TestTube className="h-4 w-4 group-hover:animate-pulse text-blue-600" />
                <span className="font-medium">Test Widget</span>
              </button>
              <button
                onClick={copyToClipboard}
                className={`group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
                  copied
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    : "bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700"
                }`}
              >
                <div className="group-hover:animate-bounce">
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </div>
                <span className="font-medium">
                  {copied ? "Copied!" : "Copy Code"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="space-y-6">
          <Tabs defaultValue="generator" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger
                value="generator"
                className="flex items-center gap-2"
              >
                <Code className="h-4 w-4" />
                Code Generator
              </TabsTrigger>
              <TabsTrigger value="testing" className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Testing Environment
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Advanced Options
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-card to-card/80">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="h-5 w-5 mr-2" />
                        Embed Configuration
                      </CardTitle>
                      <CardDescription>
                        Customize how your widget will be embedded
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="embed-method">Embed Method</Label>
                        <Select
                          value={embedMethod}
                          onValueChange={(value: "script" | "iframe" | "npm") =>
                            setEmbedMethod(value)
                          }
                        >
                          <SelectTrigger id="embed-method">
                            <SelectValue placeholder="Select embed method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="script">
                              JavaScript (Recommended)
                            </SelectItem>
                            <SelectItem value="iframe">iFrame</SelectItem>
                            <SelectItem value="npm">
                              NPM Package (React)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="custom-domain">Custom Domain</Label>
                        <Input
                          id="custom-domain"
                          value={customDomain}
                          onChange={(e) => setCustomDomain(e.target.value)}
                          placeholder="chatwidget.pro"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="enable-analytics">
                            Enable Analytics
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Track widget interactions and performance
                          </p>
                        </div>
                        <Switch
                          id="enable-analytics"
                          checked={enableAnalytics}
                          onCheckedChange={setEnableAnalytics}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="enable-custom-css">Custom CSS</Label>
                          <p className="text-sm text-muted-foreground">
                            Add custom styling to your widget
                          </p>
                        </div>
                        <Switch
                          id="enable-custom-css"
                          checked={enableCustomCSS}
                          onCheckedChange={setEnableCustomCSS}
                        />
                      </div>

                      {enableCustomCSS && (
                        <div className="space-y-2">
                          <Label htmlFor="custom-css">Custom CSS Code</Label>
                          <Textarea
                            id="custom-css"
                            value={customCSS}
                            onChange={(e) => setCustomCSS(e.target.value)}
                            placeholder="/* Add your custom CSS here */\n.chat-widget {\n  /* Custom styles */\n}"
                            rows={6}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-card to-card/80">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Code className="h-5 w-5 mr-2" />
                          Generated Code
                        </div>
                        <Button onClick={copyToClipboard} size="sm">
                          {copied ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {copied ? "Copied!" : "Copy"}
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        Embed code for widget:{" "}
                        <strong>{widgetConfig.name}</strong> (ID: {widgetId})
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto max-h-96 overflow-y-auto">
                          <code>{generateEmbedCode()}</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-card to-card/80">
                    <CardHeader>
                      <CardTitle>Installation Instructions</CardTitle>
                      <CardDescription>
                        Follow these steps to add the widget to your website
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {embedMethod === "script" && (
                          <ol className="list-decimal list-inside space-y-2 text-sm">
                            <li>Copy the generated code above</li>
                            <li>
                              Paste it before the closing{" "}
                              <code>&lt;/body&gt;</code> tag on your website
                            </li>
                            <li>Save your changes and refresh your website</li>
                            <li>
                              The chat widget should now appear on your website
                            </li>
                          </ol>
                        )}
                        {embedMethod === "iframe" && (
                          <ol className="list-decimal list-inside space-y-2 text-sm">
                            <li>Copy the generated iframe code above</li>
                            <li>
                              Paste it anywhere in your HTML where you want the
                              widget to appear
                            </li>
                            <li>Adjust the positioning styles if needed</li>
                            <li>Save your changes and refresh your website</li>
                          </ol>
                        )}
                        {embedMethod === "npm" && (
                          <ol className="list-decimal list-inside space-y-2 text-sm">
                            <li>
                              Install the package:{" "}
                              <code>npm install @chatwidget-pro/react</code>
                            </li>
                            <li>Import the component in your React app</li>
                            <li>Add the ChatWidget component to your JSX</li>
                            <li>Configure the widget with your settings</li>
                          </ol>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="testing" className="space-y-6">
              <Card className="bg-gradient-to-br from-card to-card/80">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TestTube className="h-5 w-5 mr-2" />
                    Testing Environment
                  </CardTitle>
                  <CardDescription>
                    Test your widget integration before deploying to production
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-url">Test URL (Optional)</Label>
                    <Input
                      id="test-url"
                      value={testUrl}
                      onChange={(e) => setTestUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button onClick={openTestPage} className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Open Test Page
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.location.reload()}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Preview
                    </Button>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Testing Checklist:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>✓ Widget appears in the correct position</li>
                      <li>✓ Widget opens and closes properly</li>
                      <li>✓ Messages can be sent and received</li>
                      <li>✓ Styling matches your configuration</li>
                      <li>✓ Widget is responsive on different screen sizes</li>
                      <li>✓ No console errors in browser developer tools</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card className="bg-gradient-to-br from-card to-card/80">
                <CardHeader>
                  <CardTitle>Advanced Configuration</CardTitle>
                  <CardDescription>
                    Advanced options for power users and developers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">
                      Widget Configuration Object:
                    </h4>
                    <pre className="text-sm overflow-x-auto">
                      <code>{JSON.stringify(widgetConfig, null, 2)}</code>
                    </pre>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">
                      Available Customization Options:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <h5 className="font-medium">Appearance</h5>
                        <ul className="text-muted-foreground space-y-1">
                          <li>• Custom colors and themes</li>
                          <li>• Widget positioning</li>
                          <li>• Size customization</li>
                          <li>• Custom CSS injection</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium">Behavior</h5>
                        <ul className="text-muted-foreground space-y-1">
                          <li>• Auto-open settings</li>
                          <li>• Welcome messages</li>
                          <li>• Bot personality</li>
                          <li>• Analytics tracking</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EmbedCode;

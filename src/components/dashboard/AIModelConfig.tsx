import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Settings,
  Sparkles,
  TestTube,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ErrorBoundary from "@/components/ui/error-boundary";
import { toastUtils } from "@/components/ui/use-toast";
import { useOperationLoading } from "@/contexts/LoadingContext";

interface AIModelConfigProps {
  onSave?: (config: any) => void;
  initialConfig?: any;
}

const AIModelConfig = ({
  onSave = () => {},
  initialConfig = {},
}: AIModelConfigProps) => {
  const [activeTab, setActiveTab] = useState("providers");
  const [selectedProvider, setSelectedProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful AI assistant.",
  );
  const [testResponse, setTestResponse] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Use unified loading state management
  const connectLoading = useOperationLoading("provider-connect");
  const testLoading = useOperationLoading("model-test");
  const saveLoading = useOperationLoading("config-save");

  const providers = [
    { id: "openai", name: "OpenAI", logo: "🟢" },
    { id: "anthropic", name: "Anthropic", logo: "🟣" },
    { id: "google", name: "Google AI", logo: "🔵" },
    { id: "meta", name: "Meta AI", logo: "⚪" },
    { id: "groq", name: "Groq", logo: "🟠" },
  ];

  const models = {
    openai: [
      {
        id: "gpt-4o",
        name: "GPT-4o",
        description: "Most capable model for complex tasks",
      },
      {
        id: "gpt-4-turbo",
        name: "GPT-4 Turbo",
        description: "Fast and powerful for most use cases",
      },
      {
        id: "gpt-3.5-turbo",
        name: "GPT-3.5 Turbo",
        description: "Efficient and cost-effective",
      },
    ],
    anthropic: [
      {
        id: "claude-3-opus",
        name: "Claude 3 Opus",
        description: "Most powerful Claude model",
      },
      {
        id: "claude-3-sonnet",
        name: "Claude 3 Sonnet",
        description: "Balanced performance and cost",
      },
      {
        id: "claude-3-haiku",
        name: "Claude 3 Haiku",
        description: "Fast and efficient",
      },
    ],
    google: [
      {
        id: "gemini-pro",
        name: "Gemini Pro",
        description: "Advanced reasoning and understanding",
      },
      {
        id: "gemini-flash",
        name: "Gemini Flash",
        description: "Fast responses for real-time applications",
      },
    ],
    meta: [
      {
        id: "llama-3-70b",
        name: "Llama 3 (70B)",
        description: "Most capable Llama model",
      },
      {
        id: "llama-3-8b",
        name: "Llama 3 (8B)",
        description: "Efficient and compact",
      },
    ],
    groq: [
      {
        id: "llama-3-70b-groq",
        name: "Llama 3 (70B) on Groq",
        description: "Ultra-fast inference",
      },
      {
        id: "mixtral-8x7b-groq",
        name: "Mixtral 8x7B on Groq",
        description: "Balanced performance",
      },
    ],
  };

  const handleConnectProvider = async () => {
    connectLoading.start("Connecting to provider...");
    try {
      // Simulate API connection
      connectLoading.updateMessage("Verifying API key...");
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          connectLoading.updateProgress(50);
          connectLoading.updateMessage("Establishing connection...");
          setTimeout(() => {
            if (Math.random() > 0.1) {
              connectLoading.updateProgress(100);
              resolve(true);
            } else {
              reject(new Error("Failed to connect to provider"));
            }
          }, 750);
        }, 750);
      });

      setIsConnected(true);
      toastUtils.operationSuccess(
        `${providers.find((p) => p.id === selectedProvider)?.name} connection`,
      );
    } catch (error) {
      toastUtils.operationError(
        "Provider connection",
        error instanceof Error ? error.message : undefined,
      );
    } finally {
      connectLoading.stop();
    }
  };

  const handleTestModel = async () => {
    testLoading.start("Testing model...");
    setTestResponse("");
    try {
      // Simulate API response
      testLoading.updateMessage("Sending test prompt...");
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          testLoading.updateProgress(50);
          testLoading.updateMessage("Generating response...");
          setTimeout(() => {
            if (Math.random() > 0.1) {
              testLoading.updateProgress(100);
              resolve(true);
            } else {
              reject(new Error("Model test failed"));
            }
          }, 1000);
        }, 1000);
      });

      setTestResponse(
        "I'm a simulated AI response based on your configuration. In a real implementation, this would be an actual response from the selected AI model with the specified parameters.",
      );

      toastUtils.operationSuccess("Model test");
    } catch (error) {
      toastUtils.operationError(
        "Model test",
        error instanceof Error ? error.message : undefined,
      );
    } finally {
      testLoading.stop();
    }
  };

  const handleSaveConfig = async () => {
    const config = {
      provider: selectedProvider,
      model: selectedModel,
      temperature: temperature[0],
      maxTokens,
      systemPrompt,
    };

    saveLoading.start("Saving configuration...");
    try {
      saveLoading.updateMessage("Validating settings...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      saveLoading.updateProgress(50);
      saveLoading.updateMessage("Saving to server...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      saveLoading.updateProgress(100);

      onSave(config);
      toastUtils.configSaved();
    } catch (error) {
      toastUtils.operationError("Configuration save");
    } finally {
      saveLoading.stop();
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-violet-50/20 dark:to-violet-950/20">
        {/* Header */}
        <header className="border-b bg-card/80 backdrop-blur-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                AI Model Configuration
              </h1>
              <p className="text-muted-foreground mt-2">
                Connect and configure AI providers to power your chat widgets.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <TestTube className="h-4 w-4 mr-2" />
                Test Connection
              </Button>
            </div>
          </div>
        </header>

        <div className="bg-background w-full p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6">
              <TabsTrigger
                value="providers"
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                AI Providers
              </TabsTrigger>
              <TabsTrigger value="models" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Model Selection
              </TabsTrigger>
              <TabsTrigger
                value="parameters"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Parameters
              </TabsTrigger>
              <TabsTrigger value="prompts" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Prompt Templates
              </TabsTrigger>
              <TabsTrigger value="testing" className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Testing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="providers" className="space-y-6">
              <Card className="bg-gradient-to-br from-card to-card/80">
                <CardHeader>
                  <CardTitle>Connect AI Provider</CardTitle>
                  <CardDescription>
                    Select an AI provider and enter your API credentials to
                    connect.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Provider Comparison Table */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Provider Comparison
                      </CardTitle>
                      <CardDescription>
                        Compare AI providers to find the best fit for your needs
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Provider</th>
                              <th className="text-left p-2">Best For</th>
                              <th className="text-left p-2">Cost</th>
                              <th className="text-left p-2">Speed</th>
                              <th className="text-left p-2">Quality</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b hover:bg-muted/50">
                              <td className="p-2 font-medium">OpenAI GPT-4</td>
                              <td className="p-2">Complex reasoning</td>
                              <td className="p-2">$$</td>
                              <td className="p-2">⭐⭐⭐</td>
                              <td className="p-2">⭐⭐⭐⭐⭐</td>
                            </tr>
                            <tr className="border-b hover:bg-muted/50">
                              <td className="p-2 font-medium">Claude 3</td>
                              <td className="p-2">Long conversations</td>
                              <td className="p-2">$$</td>
                              <td className="p-2">⭐⭐⭐⭐</td>
                              <td className="p-2">⭐⭐⭐⭐⭐</td>
                            </tr>
                            <tr className="border-b hover:bg-muted/50">
                              <td className="p-2 font-medium">GPT-3.5 Turbo</td>
                              <td className="p-2">Cost-effective</td>
                              <td className="p-2">$</td>
                              <td className="p-2">⭐⭐⭐⭐⭐</td>
                              <td className="p-2">⭐⭐⭐⭐</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommended Suggestions */}
                  <Alert className="mb-6 bg-blue-50 border-blue-200">
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>Recommended for you</AlertTitle>
                    <AlertDescription>
                      Based on your widget type, we recommend{" "}
                      <strong>GPT-4</strong> for the best balance of quality and
                      performance.
                      <div className="mt-2">
                        <Button size="sm" variant="outline">
                          Use Recommended
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>

                  {/* Cost Calculator */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Cost Calculator</CardTitle>
                      <CardDescription>
                        Estimate your monthly costs based on usage
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Expected conversations/month</Label>
                            <Input
                              type="number"
                              defaultValue="1000"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Avg messages per conversation</Label>
                            <Input
                              type="number"
                              defaultValue="5"
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="flex justify-between items-center">
                            <span>Estimated monthly cost:</span>
                            <span className="text-2xl font-bold text-primary">
                              $24.50
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Based on GPT-4 pricing • 5,000 total messages
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Provider Selection */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {providers.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => setSelectedProvider(provider.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                          selectedProvider === provider.id
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border/60 hover:border-border/80"
                        }`}
                      >
                        <div className="text-2xl mb-2">{provider.logo}</div>
                        <div className="font-medium text-sm">
                          {provider.name}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="api-key"
                        className="text-base font-semibold"
                      >
                        API Key
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        {selectedProvider === "openai"
                          ? "OpenAI"
                          : selectedProvider === "anthropic"
                            ? "Anthropic"
                            : selectedProvider === "google"
                              ? "Google AI"
                              : selectedProvider === "meta"
                                ? "Meta AI"
                                : "Groq"}
                      </Badge>
                    </div>
                    <div className="relative">
                      <Input
                        id="api-key"
                        type="password"
                        placeholder={`Enter your ${providers.find((p) => p.id === selectedProvider)?.name} API key`}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="pr-12"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => {
                          const input = document.getElementById(
                            "api-key",
                          ) as HTMLInputElement;
                          input.type =
                            input.type === "password" ? "text" : "password";
                        }}
                      >
                        👁️
                      </button>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        🔒 Your API key is securely stored and encrypted. We
                        never share your credentials.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button
                    onClick={handleConnectProvider}
                    disabled={!apiKey || connectLoading.isLoading}
                  >
                    {connectLoading.isLoading && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    {connectLoading.isLoading
                      ? connectLoading.loadingState?.message || "Connecting..."
                      : isConnected
                        ? "Reconnect"
                        : "Connect Provider"}
                  </Button>
                </CardFooter>
              </Card>

              {isConnected && (
                <Alert
                  variant="default"
                  className="bg-green-50 text-green-800 border-green-200"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Successfully connected!</AlertTitle>
                  <AlertDescription>
                    Your{" "}
                    {providers.find((p) => p.id === selectedProvider)?.name}{" "}
                    account has been successfully connected.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="models" className="space-y-6">
              <Card className="bg-gradient-to-br from-card to-card/80">
                <CardHeader>
                  <CardTitle>Select AI Model</CardTitle>
                  <CardDescription>
                    Choose the AI model that best fits your needs from{" "}
                    {providers.find((p) => p.id === selectedProvider)?.name}.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!isConnected ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Provider not connected</AlertTitle>
                      <AlertDescription>
                        Please connect to your AI provider first before
                        selecting a model.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      {models[selectedProvider as keyof typeof models]?.map(
                        (model) => (
                          <div
                            key={model.id}
                            className={`p-4 rounded-lg border-2 cursor-pointer ${selectedModel === model.id ? "border-primary bg-primary/5" : "border-border"}`}
                            onClick={() => setSelectedModel(model.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">{model.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {model.description}
                                </p>
                              </div>
                              {selectedModel === model.id && (
                                <Badge
                                  variant="outline"
                                  className="bg-primary text-primary-foreground"
                                >
                                  Selected
                                </Badge>
                              )}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={() => setActiveTab("parameters")}
                    disabled={!isConnected}
                  >
                    Continue to Parameters
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="parameters" className="space-y-6">
              <Card className="bg-gradient-to-br from-card to-card/80">
                <CardHeader>
                  <CardTitle>Configure Model Parameters</CardTitle>
                  <CardDescription>
                    Adjust the parameters to control how the AI model generates
                    responses.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="temperature">
                          Temperature: {temperature[0]}
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          {temperature[0] < 0.3
                            ? "More deterministic"
                            : temperature[0] > 0.7
                              ? "More creative"
                              : "Balanced"}
                        </span>
                      </div>
                      <Slider
                        id="temperature"
                        min={0}
                        max={1}
                        step={0.1}
                        value={temperature}
                        onValueChange={setTemperature}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Controls randomness: Lower values are more
                        deterministic, higher values are more creative.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="max-tokens">Max Tokens</Label>
                      <Input
                        id="max-tokens"
                        type="number"
                        value={maxTokens}
                        onChange={(e) =>
                          setMaxTokens(parseInt(e.target.value) || 0)
                        }
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Maximum number of tokens to generate. One token is
                        roughly 4 characters.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="system-prompt">System Prompt</Label>
                      <Textarea
                        id="system-prompt"
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        className="mt-1 min-h-[100px]"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Instructions that define how the AI assistant should
                        behave.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="safe-mode" defaultChecked />
                      <Label htmlFor="safe-mode">
                        Enable content safety filters
                      </Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("models")}
                  >
                    Back
                  </Button>
                  <Button onClick={() => setActiveTab("prompts")}>
                    Continue to Prompts
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="prompts" className="space-y-6">
              <Card className="bg-gradient-to-br from-card to-card/80">
                <CardHeader>
                  <CardTitle>Prompt Templates</CardTitle>
                  <CardDescription>
                    Manage and customize AI prompt templates for consistent
                    responses.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Quick Access</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Prompt templates are managed in a dedicated module for
                      better organization and control.
                    </p>
                    <Button
                      onClick={() => window.open("/prompt-templates", "_blank")}
                      className="w-full"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Open Prompt Templates Manager
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-card/50">
                      <h4 className="font-medium mb-2">Active Templates</h4>
                      <p className="text-2xl font-bold text-primary">4</p>
                      <p className="text-xs text-muted-foreground">
                        Currently in use
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg bg-card/50">
                      <h4 className="font-medium mb-2">Total Templates</h4>
                      <p className="text-2xl font-bold text-primary">12</p>
                      <p className="text-xs text-muted-foreground">
                        Available templates
                      </p>
                    </div>
                  </div>

                  <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>Template Integration</AlertTitle>
                    <AlertDescription>
                      Prompt templates work seamlessly with your AI model
                      configuration. Templates override the system prompt when
                      active, providing specialized behavior for different use
                      cases.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("prompts")}
                  >
                    Back
                  </Button>
                  <Button onClick={() => setActiveTab("testing")}>
                    Continue to Testing
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="testing" className="space-y-6">
              <Card className="bg-gradient-to-br from-card to-card/80">
                <CardHeader>
                  <CardTitle>Test Your Configuration</CardTitle>
                  <CardDescription>
                    Send a test message to verify your AI model configuration
                    works as expected.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Configuration Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Provider:</span>
                        <span>
                          {
                            providers.find((p) => p.id === selectedProvider)
                              ?.name
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model:</span>
                        <span>
                          {
                            models[
                              selectedProvider as keyof typeof models
                            ]?.find((m) => m.id === selectedModel)?.name
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Temperature:
                        </span>
                        <span>{temperature[0]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Max Tokens:
                        </span>
                        <span>{maxTokens}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="test-message">Test Message</Label>
                    <Textarea
                      id="test-message"
                      placeholder="Enter a test message to send to the AI model"
                      defaultValue="Introduce yourself and explain what you can help with."
                    />

                    <Button
                      onClick={handleTestModel}
                      className="w-full"
                      disabled={testLoading.isLoading}
                    >
                      {testLoading.isLoading && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      {testLoading.isLoading
                        ? testLoading.loadingState?.message ||
                          "Testing model..."
                        : "Test Model"}
                    </Button>

                    {testResponse && (
                      <div className="p-4 bg-primary/5 border rounded-lg space-y-2">
                        <h3 className="font-medium">AI Response:</h3>
                        <p className="text-sm">{testResponse}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("parameters")}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSaveConfig}
                    disabled={saveLoading.isLoading}
                  >
                    {saveLoading.isLoading && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    {saveLoading.isLoading
                      ? saveLoading.loadingState?.message || "Saving..."
                      : "Save Configuration"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AIModelConfig;

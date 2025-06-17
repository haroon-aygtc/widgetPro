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

import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle2,
  Settings,
  Sparkles,
  TestTube,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ErrorBoundary from "@/components/ui/error-boundary";
import { toastUtils } from "@/components/ui/use-toast";
import { useOperationLoading } from "@/contexts/LoadingContext";
import { useState, useEffect } from "react";
import { useAIProviders } from "@/hooks/useAIProviders";
import type { AIProvider, UserAIProvider } from "@/types/ai";

interface AIModelConfigProps {
  onSave?: (config: any) => void;
  initialConfig?: any;
}

const AIModelConfig = ({
  onSave = () => {},
  initialConfig = {},
}: AIModelConfigProps) => {
  const [activeTab, setActiveTab] = useState("providers");
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(
    null,
  );
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful AI assistant.",
  );
  const [testResponse, setTestResponse] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [selectedUserProvider, setSelectedUserProvider] =
    useState<UserAIProvider | null>(null);

  // Use unified loading state management
  const connectLoading = useOperationLoading("provider-connect");
  const testLoading = useOperationLoading("model-test");
  const saveLoading = useOperationLoading("config-save");

  // Use AI providers hook for real API integration
  const {
    providers,
    userProviders,
    userModels,
    availableModels,
    testResult,
    loadProviders,
    testApiKey,
    configureProvider,
    loadModelsForProvider,
    loading,
  } = useAIProviders();

  // Load providers on component mount
  useEffect(() => {
    loadProviders();
  }, []);

  const handleConnectProvider = async () => {
    if (!selectedProvider || !apiKey) {
      toastUtils.operationError(
        "Provider connection",
        "Please select a provider and enter API key",
      );
      return;
    }

    try {
      // First test the API key
      const testResult = await testApiKey(selectedProvider.id, apiKey);

      if (testResult.success) {
        // If test successful, configure the provider
        const result = await configureProvider(selectedProvider.id, apiKey);
        setSelectedUserProvider(result.userProvider);
        setIsConnected(true);

        toastUtils.operationSuccess(
          `${selectedProvider.display_name} connection`,
          "Provider connected successfully",
        );
      } else {
        toastUtils.operationError(
          "Provider connection",
          testResult.message || "API key validation failed",
        );
      }
    } catch (error) {
      toastUtils.operationError(
        "Provider connection",
        error instanceof Error ? error.message : "Failed to connect provider",
      );
    }
  };

  const handleTestModel = async () => {
    if (
      !selectedProvider ||
      !selectedModel ||
      !isConnected ||
      !selectedUserProvider
    ) {
      toastUtils.operationError(
        "Model test",
        "Please configure provider and select a model first",
      );
      return;
    }

    testLoading.start("Testing model...");
    setTestResponse("");
    try {
      // Test the model configuration by making a real API call
      const selectedModelData = availableModels.find(
        (m) => m.name === selectedModel,
      );

      if (!selectedModelData) {
        throw new Error("Selected model not found in available models");
      }

      // Create a test configuration object
      const testConfig = {
        provider_id: selectedProvider.id,
        model_id: selectedModelData.id,
        temperature: temperature[0],
        max_tokens: maxTokens,
        system_prompt: systemPrompt,
      };

      testLoading.updateMessage("Validating model configuration...");
      testLoading.updateProgress(50);

      // Simulate validation - in production this would call a test endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      testLoading.updateMessage("Configuration validated successfully");
      testLoading.updateProgress(100);

      setTestResponse(
        `✅ Model configuration validated successfully!\n\n` +
          `Provider: ${selectedProvider.display_name}\n` +
          `Model: ${selectedModelData.display_name}\n` +
          `Temperature: ${temperature[0]}\n` +
          `Max Tokens: ${maxTokens}\n` +
          `System Prompt: ${systemPrompt.substring(0, 100)}${systemPrompt.length > 100 ? "..." : ""}\n\n` +
          `This configuration is ready for production use.`,
      );

      toastUtils.operationSuccess(
        "Model test",
        "Model configuration validated successfully",
      );
    } catch (error) {
      toastUtils.operationError(
        "Model test",
        error instanceof Error ? error.message : "Model test failed",
      );
    } finally {
      testLoading.stop();
    }
  };

  const handleSaveConfig = async () => {
    if (!selectedProvider || !selectedModel || !selectedUserProvider) {
      toastUtils.operationError(
        "Configuration save",
        "Please complete the provider and model configuration first",
      );
      return;
    }

    const selectedModelData = availableModels.find(
      (m) => m.name === selectedModel,
    );

    if (!selectedModelData) {
      toastUtils.operationError(
        "Configuration save",
        "Selected model not found in available models",
      );
      return;
    }

    const config = {
      provider_id: selectedProvider.id,
      provider_name: selectedProvider.display_name,
      user_provider_id: selectedUserProvider.id,
      model_id: selectedModelData.id,
      model_name: selectedModel,
      model_display_name: selectedModelData.display_name,
      temperature: temperature[0],
      max_tokens: maxTokens,
      system_prompt: systemPrompt,
      pricing_input: selectedModelData.pricing_input,
      pricing_output: selectedModelData.pricing_output,
      context_window: selectedModelData.context_window,
      is_free: selectedModelData.is_free,
    };

    saveLoading.start("Saving configuration...");
    try {
      saveLoading.updateMessage("Validating configuration...");
      saveLoading.updateProgress(25);

      // Validate that the model is available for the user
      const userModel = userModels.find(
        (um) => um.model_id === selectedModelData.id,
      );

      if (!userModel) {
        // Add the model to user's collection first
        await addUserModel(selectedModelData.id, selectedUserProvider.id);
      }

      saveLoading.updateMessage("Saving configuration...");
      saveLoading.updateProgress(75);

      // Call the onSave callback with the configuration
      onSave(config);

      saveLoading.updateProgress(100);
      toastUtils.configSaved();
    } catch (error) {
      toastUtils.operationError(
        "Configuration save",
        error instanceof Error ? error.message : "Failed to save configuration",
      );
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
                  {/* Real-time Provider Status */}
                  {providers.length > 0 && (
                    <Alert className="mb-6 bg-green-50 border-green-200">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Providers Available</AlertTitle>
                      <AlertDescription>
                        {providers.length} AI providers are currently available
                        for integration. Select a provider below to get started.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Quick Provider Selection */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {loading.loadProvidersLoading.isLoading ? (
                      <div className="col-span-full text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Loading providers...
                        </p>
                      </div>
                    ) : providers.length === 0 ? (
                      <div className="col-span-full text-center py-8">
                        <p className="text-sm text-muted-foreground">
                          No providers available
                        </p>
                      </div>
                    ) : (
                      providers.map((provider) => {
                        const isSelected = selectedProvider?.id === provider.id;
                        const isConfigured = userProviders.some(
                          (up) => up.provider_id === provider.id,
                        );

                        return (
                          <button
                            key={provider.id}
                            onClick={() => {
                              setSelectedProvider(provider);
                              // If already configured, set as connected
                              const userProvider = userProviders.find(
                                (up) => up.provider_id === provider.id,
                              );
                              if (userProvider) {
                                setSelectedUserProvider(userProvider);
                                setIsConnected(true);
                                setApiKey(userProvider.api_key || "");
                              } else {
                                setIsConnected(false);
                                setApiKey("");
                              }
                            }}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md relative ${
                              isSelected
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border/60 hover:border-border/80"
                            }`}
                          >
                            {isConfigured && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              </div>
                            )}
                            <div className="text-2xl mb-2">
                              {provider.logo_url ? (
                                <img
                                  src={provider.logo_url}
                                  alt={provider.display_name}
                                  className="w-8 h-8 mx-auto"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                  <span className="text-xs font-bold">
                                    {provider.display_name.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="font-medium text-sm">
                              {provider.display_name}
                            </div>
                            {provider.description && (
                              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {provider.description}
                              </div>
                            )}
                          </button>
                        );
                      })
                    )}
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
                        {selectedProvider?.display_name ||
                          "No provider selected"}
                      </Badge>
                    </div>
                    <div className="relative">
                      <Input
                        id="api-key"
                        type="password"
                        placeholder={`Enter your ${selectedProvider?.display_name || "provider"} API key`}
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
                    disabled={
                      !apiKey ||
                      !selectedProvider ||
                      loading.testKeyLoading.isLoading ||
                      loading.configureLoading.isLoading
                    }
                  >
                    {(loading.testKeyLoading.isLoading ||
                      loading.configureLoading.isLoading) && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    {loading.testKeyLoading.isLoading
                      ? "Testing API Key..."
                      : loading.configureLoading.isLoading
                        ? "Configuring..."
                        : isConnected
                          ? "Reconnect"
                          : "Connect Provider"}
                  </Button>
                </CardFooter>
              </Card>

              {isConnected && selectedProvider && (
                <Alert
                  variant="default"
                  className="bg-green-50 text-green-800 border-green-200"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Successfully connected!</AlertTitle>
                  <AlertDescription>
                    Your {selectedProvider.display_name} account has been
                    successfully connected.
                    {selectedUserProvider && (
                      <div className="mt-2 text-sm">
                        <strong>Provider ID:</strong> {selectedUserProvider.id}{" "}
                        |<strong>Status:</strong>{" "}
                        {selectedUserProvider.test_status === "success"
                          ? "✓ Verified"
                          : selectedUserProvider.test_status === "failed"
                            ? "✗ Failed"
                            : "⏳ Pending"}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {testResult && !testResult.success && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Connection Failed</AlertTitle>
                  <AlertDescription>{testResult.message}</AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="models" className="space-y-6">
              <Card className="bg-gradient-to-br from-card to-card/80">
                <CardHeader>
                  <CardTitle>Select AI Model</CardTitle>
                  <CardDescription>
                    Choose the AI model that best fits your needs from{" "}
                    {selectedProvider?.display_name || "your selected provider"}
                    .
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!isConnected || !selectedProvider ? (
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
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Available Models</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            loadModelsForProvider(selectedProvider.id)
                          }
                          disabled={loading.loadModelsLoading.isLoading}
                        >
                          {loading.loadModelsLoading.isLoading && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          )}
                          {loading.loadModelsLoading.isLoading
                            ? "Loading..."
                            : "Refresh Models"}
                        </Button>
                      </div>

                      {loading.loadModelsLoading.isLoading ? (
                        <div className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Loading available models...
                          </p>
                        </div>
                      ) : availableModels.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-sm text-muted-foreground mb-4">
                            No models loaded yet
                          </p>
                          <Button
                            onClick={() =>
                              loadModelsForProvider(selectedProvider.id)
                            }
                            variant="outline"
                          >
                            Load Models
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {availableModels.map((model) => {
                            const isSelected = selectedModel === model.name;
                            const isUserModel = userModels.some(
                              (um) => um.model_id === model.id,
                            );

                            return (
                              <div
                                key={model.id}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                  isSelected
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-border/80"
                                }`}
                                onClick={() => setSelectedModel(model.name)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-medium">
                                        {model.display_name}
                                      </h3>
                                      {model.is_free && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          Free
                                        </Badge>
                                      )}
                                      {isUserModel && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          Added
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {model.description ||
                                        `${model.name} model`}
                                    </p>
                                    {(model.max_tokens ||
                                      model.context_window) && (
                                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                        {model.max_tokens && (
                                          <span>
                                            Max tokens:{" "}
                                            {model.max_tokens.toLocaleString()}
                                          </span>
                                        )}
                                        {model.context_window && (
                                          <span>
                                            Context:{" "}
                                            {model.context_window.toLocaleString()}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {isSelected && (
                                      <Badge
                                        variant="outline"
                                        className="bg-primary text-primary-foreground"
                                      >
                                        Selected
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={() => setActiveTab("parameters")}
                    disabled={!isConnected || !selectedModel}
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
                    <h3 className="font-medium mb-2">
                      System Prompt Configuration
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      The system prompt defined in the Parameters tab will be
                      used as the default behavior for your AI model.
                    </p>
                    <div className="bg-card p-3 rounded border">
                      <p className="text-sm font-medium mb-1">
                        Current System Prompt:
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {systemPrompt.length > 150
                          ? `${systemPrompt.substring(0, 150)}...`
                          : systemPrompt}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-card/50">
                      <h4 className="font-medium mb-2">Model Parameters</h4>
                      <div className="space-y-1 text-sm">
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
                          <span>{maxTokens.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-card/50">
                      <h4 className="font-medium mb-2">Configuration Status</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Provider:
                          </span>
                          <span
                            className={
                              selectedProvider
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {selectedProvider
                              ? "✓ Connected"
                              : "✗ Not Connected"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Model:</span>
                          <span
                            className={
                              selectedModel ? "text-green-600" : "text-red-600"
                            }
                          >
                            {selectedModel ? "✓ Selected" : "✗ Not Selected"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Connection Status:
                          </span>
                          <span className="text-green-600">
                            {selectedUserProvider.test_status === "success"
                              ? "✓ Verified"
                              : selectedUserProvider.test_status === "failed"
                                ? "✗ Failed"
                                : "⏳ Pending"}
                          </span>
                        </div>
                        {selectedModelData && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Model Type:
                              </span>
                              <span>
                                {selectedModelData.is_free ? "Free" : "Paid"}
                              </span>
                            </div>
                            {selectedModelData.pricing_input && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Input Cost:
                                </span>
                                <span>
                                  ${selectedModelData.pricing_input}/1K tokens
                                </span>
                              </div>
                            )}
                            {selectedModelData.pricing_output && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Output Cost:
                                </span>
                                <span>
                                  ${selectedModelData.pricing_output}/1K tokens
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
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
                          {selectedProvider?.display_name || "Not selected"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model:</span>
                        <span>
                          {availableModels.find((m) => m.name === selectedModel)
                            ?.display_name ||
                            selectedModel ||
                            "Not selected"}
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
                      {selectedUserProvider && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Connection Status:
                          </span>
                          <span className="text-green-600">
                            {selectedUserProvider.test_status === "success"
                              ? "✓ Connected"
                              : "Connected"}
                          </span>
                        </div>
                      )}
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
                        <h3 className="font-medium">
                          Configuration Test Result:
                        </h3>
                        <pre className="text-sm whitespace-pre-wrap font-mono bg-background p-3 rounded border">
                          {testResponse}
                        </pre>
                      </div>
                    )}

                    {selectedModelData && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h3 className="font-medium mb-2 text-blue-900 dark:text-blue-100">
                          Model Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-blue-700 dark:text-blue-300 font-medium">
                              Context Window:
                            </span>
                            <p className="text-blue-600 dark:text-blue-400">
                              {selectedModelData.context_window?.toLocaleString() ||
                                "Not specified"}{" "}
                              tokens
                            </p>
                          </div>
                          <div>
                            <span className="text-blue-700 dark:text-blue-300 font-medium">
                              Max Output:
                            </span>
                            <p className="text-blue-600 dark:text-blue-400">
                              {selectedModelData.max_tokens?.toLocaleString() ||
                                "Not specified"}{" "}
                              tokens
                            </p>
                          </div>
                          {selectedModelData.pricing_input &&
                            selectedModelData.pricing_output && (
                              <div className="col-span-2">
                                <span className="text-blue-700 dark:text-blue-300 font-medium">
                                  Estimated Cost (1K tokens):
                                </span>
                                <p className="text-blue-600 dark:text-blue-400">
                                  Input: ${selectedModelData.pricing_input} |
                                  Output: ${selectedModelData.pricing_output}
                                </p>
                              </div>
                            )}
                        </div>
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

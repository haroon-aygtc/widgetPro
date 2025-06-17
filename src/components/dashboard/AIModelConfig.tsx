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
  Eye,
  EyeOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ErrorBoundary from "@/components/ui/error-boundary";
import { toastUtils } from "@/components/ui/use-toast";
import { useOperationLoading } from "@/contexts/LoadingContext";
import { useState, useEffect, useCallback } from "react";
import { useAIProviders } from "@/hooks/useAIProviders";
import type { AIModel, AIProvider, UserAIProvider } from "@/types/ai";

interface AIModelConfigProps {
  onSave?: (config: any) => void;
  initialConfig?: any;
}

const AIModelConfig = ({
  onSave = () => {},
  initialConfig = {},
}: AIModelConfigProps) => {
  const [activeTab, setActiveTab] = useState("providers");
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful AI assistant.");
  const [testResponse, setTestResponse] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [selectedUserProvider, setSelectedUserProvider] = useState<UserAIProvider | null>(null);

  const connectLoading = useOperationLoading("provider-connect");
  const testLoading = useOperationLoading("model-test");
  const saveLoading = useOperationLoading("config-save");

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
    addUserModel,
    loadUserModels,
  } = useAIProviders();

  useEffect(() => {
    loadProviders();
  }, []);

  const toggleShowApiKey = () => setShowApiKey((prev) => !prev);

  const refreshUserModels = useCallback(() => {
    loadUserModels();
  }, [loadUserModels]);

  return (
    <ErrorBoundary>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-violet-50/20 dark:to-violet-950/20">
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
          </div>
        </header>

        <div className="bg-background w-full p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="providers" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Providers
              </TabsTrigger>
              <TabsTrigger value="models" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Model Selection
              </TabsTrigger>
              <TabsTrigger value="parameters" className="flex items-center gap-2">
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
        Select a provider and enter your API key to connect.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {selectedProvider && (
        <div className="relative">
          <Label htmlFor="api-key">API Key for {selectedProvider.display_name}</Label>
          <Input
            id="api-key"
            type={showApiKey ? "text" : "password"}
            placeholder={`Enter API key`}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleShowApiKey}
            className="absolute right-2 top-[38px]"
            aria-label="Toggle API key visibility"
          >
            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {providers.map((provider) => {
          const isSelected = selectedProvider?.id === provider.id;
          const safeUserProviders = Array.isArray(userProviders) ? userProviders : [];
          const userProvider = safeUserProviders.find((up) => up.provider_id === provider.id);

          return (
            <button
              key={provider.id}
              onClick={() => {
                setSelectedProvider(provider);
                setApiKey(userProvider?.api_key || "");
                setIsConnected(!!userProvider);
              }}
              className={`rounded-xl border-2 p-4 text-left transition-all duration-200 relative shadow-sm hover:shadow-md ${
                isSelected ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-border hover:border-muted"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm">{provider.display_name}</h4>
                {userProvider && (
                  <Badge variant="outline" className="text-xs">
                    Connected
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {provider.description || `Connect to ${provider.name}`}
              </p>

              {userProvider && (
                <div className="mt-3 text-xs">
                  <span className="text-muted-foreground">Your API Key: </span>
                  <span className="font-mono">••••••••••••••••••</span>
                </div>
              )}

              {userProvider && (
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <span className="text-xs">Active:</span>
                  <Switch
                    checked={userProvider.is_active}
                    onCheckedChange={(checked) => {
                      // wire toggle API here if needed
                      toastUtils.operationError("Not Implemented", "This switch requires backend API.");
                    }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </CardContent>

    <CardFooter className="flex justify-between">
      <Button
        onClick={async () => {
          if (!selectedProvider || !apiKey) {
            toastUtils.operationError("Provider Connection", "Please select provider and enter API key.");
            return;
          }
          try {
            const testResult = await testApiKey(selectedProvider.id, apiKey);
            if (testResult.success) {
              const result = await configureProvider(selectedProvider.id, apiKey);
              setSelectedUserProvider(result.userProvider);
              setIsConnected(true);
              toastUtils.operationSuccess("Provider Connected", `${selectedProvider.display_name} connected successfully.`);
              if (result.availableModels?.length) {
                setSelectedModel(result.availableModels[0]);
                setActiveTab("models");
              }
            } else {
              toastUtils.operationError("API Key Invalid", testResult.message);
            }
          } catch (e) {
            toastUtils.operationError("Connection Failed", (e as Error).message);
          }
        }}
        disabled={!apiKey || !selectedProvider || loading.testKeyLoading.isLoading}
      >
        {loading.testKeyLoading.isLoading ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connecting...</>
        ) : (
          isConnected ? "Reconnect" : "Connect"
        )}
      </Button>
    </CardFooter>
  </Card>
</TabsContent>





<TabsContent value="models" className="space-y-6">
  <Card className="bg-gradient-to-br from-card to-card/80">
    <CardHeader>
      <CardTitle>Select AI Model</CardTitle>
      <CardDescription>
        Choose the AI model that best fits your needs from your connected provider.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {(!isConnected || !selectedProvider) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Provider not connected</AlertTitle>
          <AlertDescription>
            Please connect your AI provider before selecting a model.
          </AlertDescription>
        </Alert>
      )}

      {isConnected && (
        <>
          <div className="flex justify-between items-center">
            <Label className="text-base">Available Models</Label>
            <Button
              size="sm"
              variant="outline"
              onClick={() => loadModelsForProvider(selectedProvider!.id)}
              disabled={loading.loadModelsLoading.isLoading}
            >
              {loading.loadModelsLoading.isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading...</>
              ) : (
                "Refresh"
              )}
            </Button>
          </div>

          <div className="space-y-3">
            {availableModels.length === 0 && !loading.loadModelsLoading.isLoading && (
              <p className="text-muted-foreground text-sm">No models available yet. Click "Refresh" to load.</p>
            )}

            {loading.loadModelsLoading.isLoading ? (
              <div className="text-center py-6">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Fetching models from provider...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableModels.map((model) => {
                  const isSelected = selectedModel?.id === model.id;
                  const isUserModel = userModels.some(um => um.model_id === model.id);

                  return (
                    <div
                      key={model.id || `${model.name}-${model.context_window}-${model.max_tokens}`}
                      onClick={() => setSelectedModel(model)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                        isSelected ? "border-primary bg-primary/10" : "border-border hover:border-muted"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-sm mb-1">{model.display_name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {model.description || model.name}
                          </p>
                          <div className="text-xs text-muted-foreground mt-2 space-x-4">
                            {model.context_window && <span>Context: {model.context_window}</span>}
                            {model.max_tokens && <span>Max Tokens: {model.max_tokens}</span>}
                          </div>
                        </div>
                        <div className="space-y-1 text-right">
                          {model.is_free && <Badge variant="secondary">Free</Badge>}
                          {isUserModel && <Badge variant="outline">Added</Badge>}
                          {isSelected && <Badge className="bg-primary text-white">Selected</Badge>}
                        </div>
                      </div>

                      {isSelected && !isUserModel && (
                        <div className="mt-4 text-right">
                          <Button
                            size="sm"
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                const result = await addUserModel({
                                  model_id: Number(model.id),
                                  user_provider_id: Number(selectedUserProvider!.id),
                                  custom_name: model.display_name
                                });
                                toastUtils.operationSuccess("Model Added", `${model.display_name} stored successfully.`);
                                refreshUserModels();
                              } catch (err: any) {
                                toastUtils.operationError("Add Failed", err.message);
                              }
                            }}
                          >
                            Add to Database
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </CardContent>

    <CardFooter className="flex justify-end">
      <Button
        onClick={() => setActiveTab("parameters")}
        disabled={!selectedModel}
      >
        Continue to Parameters
      </Button>
    </CardFooter>
  </Card>
</TabsContent>

              {/* Parameters Tab */}

              <TabsContent value="parameters" className="space-y-6">
                <Card className="bg-gradient-to-br from-card to-card/80">
                  <CardHeader>
                    <CardTitle>Configure Model Parameters</CardTitle>
                    <CardDescription>
                      Fine-tune how your AI model behaves by adjusting generation settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {/* Temperature Control */}
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="temperature">Temperature</Label>
                          <span className="text-sm text-muted-foreground">
                            {temperature[0] < 0.3 ? "Deterministic" : temperature[0] > 0.7 ? "Creative" : "Balanced"}
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
                          Controls randomness: lower values result in more predictable output.
                        </p>
                      </div>

                      {/* Max Tokens */}
                      <div>
                        <Label htmlFor="max-tokens">Max Tokens</Label>
                        <Input
                          id="max-tokens"
                          type="number"
                          value={maxTokens}
                          onChange={(e) => setMaxTokens(parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Maximum length of generated response (in tokens).
                        </p>
                      </div>

                      {/* System Prompt */}
                      <div>
                        <Label htmlFor="system-prompt">System Prompt</Label>
                        <Textarea
                          id="system-prompt"
                          value={systemPrompt}
                          onChange={(e) => setSystemPrompt(e.target.value)}
                          className="mt-1 min-h-[100px]"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Provide instructions to guide the AI's behavior.
                        </p>
                      </div>

                      {/* Safe Mode Toggle */}
                      <div className="flex items-center gap-3">
                        <Switch id="safe-mode" defaultChecked />
                        <Label htmlFor="safe-mode">Enable content safety filters</Label>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setActiveTab("models")}>Back</Button>
                    <Button onClick={() => setActiveTab("prompts")}>Continue to Prompts</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Prompts Tab */}
              <TabsContent value="prompts" className="space-y-6">
                <Card className="bg-gradient-to-br from-card to-card/80">
                  <CardHeader>
                    <CardTitle>Prompt Templates</CardTitle>
                    <CardDescription>
                      Review and manage the default prompt your AI model uses for generating responses.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-medium mb-2">System Prompt Configuration</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        The following system prompt defines how your AI model behaves by default.
                      </p>
                      <div className="bg-card p-3 rounded border">
                        <p className="text-sm font-medium mb-1">Current System Prompt:</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {systemPrompt.length > 150 ? `${systemPrompt.slice(0, 150)}...` : systemPrompt}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg bg-card/50">
                        <h4 className="font-medium mb-2">Model Parameters</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Temperature:</span>
                            <span>{temperature[0]}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Max Tokens:</span>
                            <span>{maxTokens.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg bg-card/50">
                        <h4 className="font-medium mb-2">Configuration Status</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Provider:</span>
                            <span className={selectedProvider ? "text-green-600" : "text-red-600"}>
                              {selectedProvider ? "✓ Connected" : "✗ Not Connected"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Model:</span>
                            <span className={selectedModel ? "text-green-600" : "text-red-600"}>
                              {selectedModel ? "✓ Selected" : "✗ Not Selected"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Connection:</span>
                            <span className={selectedUserProvider?.is_active ? "text-green-600" : "text-red-600"}>
                              {selectedUserProvider?.is_active ? "✓ Active" : "✗ Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Alert>
                      <Sparkles className="h-4 w-4" />
                      <AlertTitle>Prompt Behavior</AlertTitle>
                      <AlertDescription>
                        Prompt templates can override the default system prompt to customize responses for specific use cases.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setActiveTab("parameters")}>Back</Button>
                    <Button onClick={() => setActiveTab("testing")}>Continue to Testing</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Testing Tab */}

              <TabsContent value="testing" className="space-y-6">
                <Card className="bg-gradient-to-br from-card to-card/80">
                  <CardHeader>
                    <CardTitle>Test Your Configuration</CardTitle>
                    <CardDescription>
                      Validate your selected provider and model using a sample input.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-medium mb-2">Configuration Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Provider:</span>
                          <span>{selectedProvider?.display_name || "Not selected"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Model:</span>
                          <span>{selectedModel?.display_name || "Not selected"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Temperature:</span>
                          <span>{temperature[0]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Max Tokens:</span>
                          <span>{maxTokens}</span>
                        </div>
                        {selectedUserProvider && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Connection Status:</span>
                            <span className={selectedUserProvider.is_active ? "text-green-600" : "text-red-600"}>
                              {selectedUserProvider.is_active ? "✓ Active" : "✗ Inactive"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="test-message">Test Message</Label>
                      <Textarea
                        id="test-message"
                        placeholder="Type a sample prompt to test your configuration."
                        defaultValue="Introduce yourself and explain what you can help with."
                      />

                      <Button
                        onClick={() => {
                          testLoading.start("Testing model...");
                          testApiKey(selectedProvider!.id, apiKey);
                          testLoading.stop();
                        }}
                        disabled={testLoading.isLoading}
                        className="w-full"
                      >
                        {testLoading.isLoading ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {testLoading.loadingState?.message || "Testing..."}</>
                        ) : (
                          "Run Test"
                        )}
                      </Button>

                      {testResponse && (
                        <div className="p-4 border rounded-lg bg-primary/5">
                          <h3 className="font-medium mb-2">Test Result</h3>
                          <pre className="text-sm whitespace-pre-wrap font-mono bg-background p-3 rounded">
                            {testResponse}
                          </pre>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("prompts")}>Back</Button>
                    <Button
  size="sm"
  onClick={async (e) => {
    e.stopPropagation();

    if (!selectedModel?.id || !selectedUserProvider?.id) {
      toastUtils.operationError("Missing Selection", "Select both a model and provider before adding.");
      return;
    }

    try {
      await addUserModel({
        model_id: Number(selectedModel.id),
        user_provider_id: Number(selectedUserProvider.id),
        custom_name: selectedModel.display_name
      });
      refreshUserModels();
    } catch (err) {
      console.error(err);
      toastUtils.operationError("Error", err.message || "Failed to add model.");
    }
  }}
>
  Add to Database
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
import React, { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle2,
  AlertCircle,
  Search,
  Key,
  Sparkles,
  Loader2,
  Plus,
  ExternalLink,
  Crown,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { aiProviderService } from "@/services/aiProviderService";
import { useOperationLoading } from "@/contexts/LoadingContext";
import { toastUtils } from "@/components/ui/use-toast";
import type {
  AIProvider,
  AIModel,
  UserAIProvider,
  UserAIModel,
} from "@/types/ai";

interface AIProvidersProps {
  className?: string;
}

const AIProviders = ({ className }: AIProvidersProps) => {
  const [activeTab, setActiveTab] = useState("providers");
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [userProviders, setUserProviders] = useState<UserAIProvider[]>([]);
  const [userModels, setUserModels] = useState<UserAIModel[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(
    null,
  );
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    models?: AIModel[];
  } | null>(null);

  // Loading states
  const loadProvidersLoading = useOperationLoading("load-providers");
  const testKeyLoading = useOperationLoading("test-api-key");
  const configureLoading = useOperationLoading("configure-provider");
  const loadModelsLoading = useOperationLoading("load-models");
  const addModelLoading = useOperationLoading("add-model");

  // Load initial data
  useEffect(() => {
    loadProviders();
    loadUserProviders();
    loadUserModels();
  }, []);

  const loadProviders = async () => {
    loadProvidersLoading.start("Loading AI providers...");
    try {
      const data = await aiProviderService.getProviders({
        search: searchTerm,
        freeOnly: showFreeOnly,
      });
      setProviders(data);
    } catch (error) {
      toastUtils.operationError("Loading providers");
    } finally {
      loadProvidersLoading.stop();
    }
  };

  const loadUserProviders = async () => {
    try {
      const data = await aiProviderService.getUserProviders();
      setUserProviders(data);
    } catch (error) {
      console.error("Failed to load user providers:", error);
    }
  };

  const loadUserModels = async () => {
    try {
      const data = await aiProviderService.getUserModels();
      setUserModels(data);
    } catch (error) {
      console.error("Failed to load user models:", error);
    }
  };

  const handleTestApiKey = async () => {
    if (!selectedProvider || !apiKey.trim()) {
      toastUtils.error("Please select a provider and enter an API key");
      return;
    }

    testKeyLoading.start("Testing API key...");
    try {
      const result = await aiProviderService.testApiKey(
        selectedProvider.id,
        apiKey,
      );
      setTestResult(result);

      if (result.success) {
        toastUtils.success("API key is valid!");
        if (result.models) {
          setAvailableModels(result.models);
        }
      } else {
        toastUtils.error(result.message);
      }
    } catch (error) {
      toastUtils.operationError("API key test");
      setTestResult({
        success: false,
        message: "Failed to test API key",
      });
    } finally {
      testKeyLoading.stop();
    }
  };

  const handleConfigureProvider = async () => {
    if (!selectedProvider || !apiKey.trim()) {
      toastUtils.error("Please test the API key first");
      return;
    }

    if (!testResult?.success) {
      toastUtils.error(
        "Please test the API key successfully before configuring",
      );
      return;
    }

    configureLoading.start("Configuring provider...");
    try {
      const { userProvider, availableModels } =
        await aiProviderService.configureProvider(selectedProvider.id, apiKey);

      setUserProviders((prev) => {
        const filtered = prev.filter(
          (p) => p.provider_id !== selectedProvider.id,
        );
        return [...filtered, userProvider];
      });

      setAvailableModels(availableModels);
      setApiKey("");
      setTestResult(null);
      setActiveTab("models");

      toastUtils.success(
        `${selectedProvider.display_name} configured successfully!`,
      );
    } catch (error) {
      toastUtils.operationError("Provider configuration");
    } finally {
      configureLoading.stop();
    }
  };

  const handleLoadModels = async (providerId: number) => {
    loadModelsLoading.start("Loading models...");
    try {
      const { models } = await aiProviderService.getModelsForProvider(
        providerId,
        modelSearchTerm,
      );
      setAvailableModels(models);
    } catch (error) {
      toastUtils.operationError("Loading models");
    } finally {
      loadModelsLoading.stop();
    }
  };

  const handleAddModel = async (model: AIModel) => {
    const userProvider = userProviders.find(
      (p) => p.provider_id === model.provider_id,
    );
    if (!userProvider) {
      toastUtils.error("Provider not configured");
      return;
    }

    addModelLoading.start("Adding model...");
    try {
      const userModel = await aiProviderService.addUserModel(
        model.id,
        userProvider.id,
      );

      setUserModels((prev) => {
        const filtered = prev.filter((m) => m.model_id !== model.id);
        return [...filtered, userModel];
      });

      toastUtils.success(`${model.display_name} added successfully!`);
    } catch (error) {
      toastUtils.operationError("Adding model");
    } finally {
      addModelLoading.stop();
    }
  };

  const isProviderConfigured = (providerId: number) => {
    return userProviders.some((p) => p.provider_id === providerId);
  };

  const isModelAdded = (modelId: number) => {
    return userModels.some((m) => m.model_id === modelId);
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      !searchTerm ||
      provider.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFree = !showFreeOnly || provider.is_free;
    return matchesSearch && matchesFree;
  });

  const filteredModels = availableModels.filter((model) => {
    return (
      !modelSearchTerm ||
      model.display_name
        .toLowerCase()
        .includes(modelSearchTerm.toLowerCase()) ||
      model.description?.toLowerCase().includes(modelSearchTerm.toLowerCase())
    );
  });

  // Sort models: free first, then by name
  const sortedModels = filteredModels.sort((a, b) => {
    if (a.is_free && !b.is_free) return -1;
    if (!a.is_free && b.is_free) return 1;
    return a.display_name.localeCompare(b.display_name);
  });

  return (
    <div
      className={cn(
        "flex-1 overflow-auto bg-gradient-to-br from-background via-background to-violet-50/20 dark:to-violet-950/20",
        className,
      )}
    >
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              AI Providers
            </h1>
            <p className="text-muted-foreground mt-2">
              Configure and manage your AI providers and models.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              {userProviders.length} Configured
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              {userModels.length} Models
            </Badge>
          </div>
        </div>
      </header>

      <div className="bg-background w-full p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="providers" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Providers
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Models
            </TabsTrigger>
            <TabsTrigger value="configured" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              My Setup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant={showFreeOnly ? "default" : "outline"}
                onClick={() => setShowFreeOnly(!showFreeOnly)}
                className="flex items-center gap-2"
              >
                <Crown className="h-4 w-4" />
                Free Only
              </Button>
            </div>

            {/* Providers Grid */}
            {loadProvidersLoading.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading providers...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map((provider) => {
                  const isConfigured = isProviderConfigured(provider.id);
                  const isSelected = selectedProvider?.id === provider.id;

                  return (
                    <Card
                      key={provider.id}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:shadow-lg",
                        isSelected && "ring-2 ring-primary",
                        isConfigured && "bg-green-50/50 border-green-200",
                      )}
                      onClick={() => setSelectedProvider(provider)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {provider.display_name.charAt(0)}
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {provider.display_name}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                {provider.is_free && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-green-100 text-green-800 text-xs"
                                  >
                                    Free
                                  </Badge>
                                )}
                                {isConfigured && (
                                  <Badge variant="default" className="text-xs">
                                    Configured
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          {provider.documentation_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  provider.documentation_url,
                                  "_blank",
                                );
                              }}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm leading-relaxed">
                          {provider.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* API Key Configuration */}
            {selectedProvider && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Configure {selectedProvider.display_name}
                  </CardTitle>
                  <CardDescription>
                    Enter your API key to test and configure this provider.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="api-key">API Key</Label>
                    <Input
                      id="api-key"
                      type="password"
                      placeholder={`Enter your ${selectedProvider.display_name} API key`}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {testResult && (
                    <Alert
                      variant={testResult.success ? "default" : "destructive"}
                    >
                      {testResult.success ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <AlertTitle>
                        {testResult.success ? "Success" : "Error"}
                      </AlertTitle>
                      <AlertDescription>{testResult.message}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleTestApiKey}
                    disabled={!apiKey.trim() || testKeyLoading.isLoading}
                  >
                    {testKeyLoading.isLoading && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Test API Key
                  </Button>
                  <Button
                    onClick={handleConfigureProvider}
                    disabled={
                      !testResult?.success || configureLoading.isLoading
                    }
                  >
                    {configureLoading.isLoading && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Configure Provider
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            {userProviders.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Providers Configured</AlertTitle>
                <AlertDescription>
                  Please configure at least one AI provider first to access
                  models.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {/* Provider Selection */}
                <div className="flex flex-wrap gap-2">
                  {userProviders.map((userProvider) => (
                    <Button
                      key={userProvider.id}
                      variant="outline"
                      onClick={() => handleLoadModels(userProvider.provider_id)}
                      className="flex items-center gap-2"
                    >
                      {userProvider.provider?.display_name}
                      <Badge variant="secondary" className="text-xs">
                        {userProvider.provider?.is_free ? "Free" : "Paid"}
                      </Badge>
                    </Button>
                  ))}
                </div>

                {/* Model Search */}
                {availableModels.length > 0 && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search models..."
                      value={modelSearchTerm}
                      onChange={(e) => setModelSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                )}

                {/* Models Grid */}
                {loadModelsLoading.isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading models...</span>
                  </div>
                ) : sortedModels.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedModels.map((model) => {
                      const isAdded = isModelAdded(model.id);

                      return (
                        <Card
                          key={model.id}
                          className={cn(
                            "transition-all duration-200",
                            model.is_free && "border-green-200 bg-green-50/30",
                            isAdded && "bg-blue-50/50 border-blue-200",
                          )}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-base">
                                  {model.display_name}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  {model.is_free && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-green-100 text-green-800 text-xs"
                                    >
                                      Free
                                    </Badge>
                                  )}
                                  {isAdded && (
                                    <Badge
                                      variant="default"
                                      className="text-xs"
                                    >
                                      Added
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-3">
                            <CardDescription className="text-sm">
                              {model.description}
                            </CardDescription>
                            {(model.max_tokens || model.context_window) && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                {model.max_tokens &&
                                  `Max tokens: ${model.max_tokens.toLocaleString()}`}
                                {model.context_window &&
                                  ` • Context: ${model.context_window.toLocaleString()}`}
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button
                              size="sm"
                              onClick={() => handleAddModel(model)}
                              disabled={isAdded || addModelLoading.isLoading}
                              className="w-full"
                            >
                              {addModelLoading.isLoading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : isAdded ? (
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                              ) : (
                                <Plus className="h-4 w-4 mr-2" />
                              )}
                              {isAdded ? "Added" : "Add Model"}
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                ) : availableModels.length === 0 && userProviders.length > 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Models Available</AlertTitle>
                    <AlertDescription>
                      Click on a provider above to load available models.
                    </AlertDescription>
                  </Alert>
                ) : null}
              </>
            )}
          </TabsContent>

          <TabsContent value="configured" className="space-y-6">
            {/* Configured Providers */}
            <Card>
              <CardHeader>
                <CardTitle>Configured Providers</CardTitle>
                <CardDescription>
                  Your active AI provider configurations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userProviders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No providers configured yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {userProviders.map((userProvider) => (
                      <div
                        key={userProvider.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            {userProvider.provider?.display_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">
                              {userProvider.provider?.display_name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant={
                                  userProvider.test_status === "success"
                                    ? "default"
                                    : "destructive"
                                }
                                className="text-xs"
                              >
                                {userProvider.test_status}
                              </Badge>
                              {userProvider.provider?.is_free && (
                                <Badge
                                  variant="secondary"
                                  className="bg-green-100 text-green-800 text-xs"
                                >
                                  Free
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {userProvider.last_tested_at && (
                            <p>
                              Last tested:{" "}
                              {new Date(
                                userProvider.last_tested_at,
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Configured Models */}
            <Card>
              <CardHeader>
                <CardTitle>My AI Models</CardTitle>
                <CardDescription>
                  Models you've added to your collection.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userModels.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No models added yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userModels.map((userModel) => (
                      <div key={userModel.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">
                              {userModel.custom_name ||
                                userModel.model?.display_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {userModel.model?.provider?.display_name}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              {userModel.model?.is_free && (
                                <Badge
                                  variant="secondary"
                                  className="bg-green-100 text-green-800 text-xs"
                                >
                                  Free
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                Active
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {userModel.model?.description && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {userModel.model.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIProviders;

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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle2,
  Settings,
  Sparkles,
  Loader2,
  Search,
  Bot,
  Brain,
  Cpu,
  Database,
  Zap,
  Globe,
  Shield,
  Activity,
  Star,
  DollarSign,
  Key,
  TestTube,
  Plus,
  ExternalLink,
} from "lucide-react";
import { useAIProviders } from "@/hooks/useAIProviders";
import { AIProviderCard } from "../ai-providers/AIProviderCard";
import { AIModelCard } from "../ai-providers/AIModelCard";
import { toastUtils } from "@/components/ui/use-toast";
import type {
  AIProvider,
  AIModel,
  UserAIModel,
  UserAIProvider,
} from "@/types/ai";

interface AIModelSelectionProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  errors?: Record<string, string>;
  onFieldValidation?: (fieldName: string, value: any) => Promise<boolean>;
}

const AIModelSelection: React.FC<AIModelSelectionProps> = ({
  selectedModel,
  onModelChange,
  errors = {},
  onFieldValidation,
}) => {
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
    addUserModel,
    loading,
  } = useAIProviders();

  const [selectedProviderId, setSelectedProviderId] = useState<
    number | undefined
  >();
  const [apiKey, setApiKey] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const [showProviderConfig, setShowProviderConfig] = useState(false);
  const [showModelSelection, setShowModelSelection] = useState(false);

  // Load providers on mount
  useEffect(() => {
    loadProviders();
  }, []);

  // Check if user has any configured providers
  const hasConfiguredProviders = userProviders.length > 0;
  const hasUserModels = userModels.length > 0;

  // Get available user models for selection
  const availableUserModels = userModels.filter((userModel) => {
    const model = userModel.model;
    if (!model) return false;

    const matchesSearch =
      !modelSearchTerm ||
      model.display_name
        .toLowerCase()
        .includes(modelSearchTerm.toLowerCase()) ||
      model.description?.toLowerCase().includes(modelSearchTerm.toLowerCase());

    return matchesSearch;
  });

  // Handle provider selection
  const handleProviderSelect = (provider: AIProvider) => {
    setSelectedProviderId(provider.id);
    setApiKey("");
  };

  // Handle API key test and configuration
  const handleTestAndConfigure = async () => {
    if (!selectedProviderId || !apiKey.trim()) return;

    try {
      const result = await testApiKey(selectedProviderId, apiKey);
      if (result.success) {
        await configureProvider(selectedProviderId, apiKey);
        setShowProviderConfig(false);
        setShowModelSelection(true);
        toastUtils.operationSuccess(
          "Provider Configured",
          "AI provider has been configured successfully. You can now select models.",
        );
      }
    } catch (error) {
      console.error("Error configuring provider:", error);
    }
  };

  // Handle model selection
  const handleModelSelect = async (userModel: UserAIModel) => {
    if (!userModel.model) return;

    const modelIdentifier = `${userModel.model.name}:${userModel.user_provider_id}`;
    onModelChange(modelIdentifier);

    if (onFieldValidation) {
      await onFieldValidation("aiModel", modelIdentifier);
    }

    toastUtils.operationSuccess(
      "AI Model Selected",
      `${userModel.model.display_name} has been selected for your widget.`,
    );
  };

  // Handle adding new model from available models
  const handleAddModel = async (model: AIModel, userProviderId: number) => {
    try {
      await addUserModel(model.id, userProviderId);
    } catch (error) {
      console.error("Error adding model:", error);
    }
  };

  // Get selected model info for display
  const getSelectedModelInfo = () => {
    if (!selectedModel) return null;

    const [modelName] = selectedModel.split(":");
    const userModel = userModels.find((um) => um.model?.name === modelName);
    return userModel;
  };

  const selectedModelInfo = getSelectedModelInfo();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-600" />
            AI Model Selection
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose the AI model that will power your chat widget
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasConfiguredProviders && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {userProviders.length} Provider
              {userProviders.length !== 1 ? "s" : ""}
            </Badge>
          )}
          {hasUserModels && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              <Bot className="h-3 w-3 mr-1" />
              {userModels.length} Model{userModels.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      {/* Current Selection Display */}
      {selectedModelInfo ? (
        <Card className="border-2 border-green-200 bg-green-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-green-800">
                    {selectedModelInfo.model?.display_name || "Selected Model"}
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Currently selected for your widget
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowModelSelection(true)}
                className="border-green-200 hover:bg-green-100"
              >
                Change Model
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Provider:</span>
                <span className="font-medium">
                  {selectedModelInfo.user_provider?.provider?.display_name}
                </span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">
                  {selectedModelInfo.model?.is_free ? "Free" : "Premium"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-dashed border-yellow-200 bg-yellow-50/50">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <h4 className="font-medium text-yellow-800 mb-2">
              No AI Model Selected
            </h4>
            <p className="text-sm text-yellow-700 text-center mb-4">
              Your widget needs an AI model to function. Configure a provider
              and select a model to get started.
            </p>
            <div className="flex gap-2">
              {!hasConfiguredProviders ? (
                <Button
                  onClick={() => setShowProviderConfig(true)}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Configure Provider
                </Button>
              ) : (
                <Button
                  onClick={() => setShowModelSelection(true)}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  Select Model
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Provider Configuration Section */}
      {(showProviderConfig || !hasConfiguredProviders) && (
        <Card className="border-2 border-violet-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configure AI Provider
            </CardTitle>
            <CardDescription>
              Connect to an AI provider to access their models
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Provider Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search AI providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Provider Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers
                .filter(
                  (provider) =>
                    !searchTerm ||
                    provider.display_name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    provider.description
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()),
                )
                .map((provider) => (
                  <AIProviderCard
                    key={provider.id}
                    provider={provider}
                    isSelected={selectedProviderId === provider.id}
                    isConfigured={userProviders.some(
                      (up) => up.provider_id === provider.id,
                    )}
                    onSelect={handleProviderSelect}
                  />
                ))}
            </div>

            {/* API Key Configuration */}
            {selectedProviderId && (
              <Card className="bg-violet-50/50 border-violet-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Key Configuration
                  </CardTitle>
                  <CardDescription>
                    Enter your API key for{" "}
                    {
                      providers.find((p) => p.id === selectedProviderId)
                        ?.display_name
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="api-key"
                        type="password"
                        placeholder="Enter your API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleTestAndConfigure}
                        disabled={
                          !apiKey.trim() || loading.testKeyLoading.isLoading
                        }
                      >
                        {loading.testKeyLoading.isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          <>
                            <TestTube className="h-4 w-4 mr-2" />
                            Test & Configure
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Test Result */}
                  {testResult && (
                    <Alert
                      className={
                        testResult.success
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }
                    >
                      {testResult.success ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <AlertTitle
                        className={
                          testResult.success ? "text-green-800" : "text-red-800"
                        }
                      >
                        {testResult.success
                          ? "Connection Successful"
                          : "Connection Failed"}
                      </AlertTitle>
                      <AlertDescription
                        className={
                          testResult.success ? "text-green-700" : "text-red-700"
                        }
                      >
                        {testResult.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}

      {/* Model Selection Section */}
      {(showModelSelection || (hasConfiguredProviders && !selectedModel)) && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Select AI Model
            </CardTitle>
            <CardDescription>
              Choose from your available AI models
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Model Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search AI models..."
                value={modelSearchTerm}
                onChange={(e) => setModelSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Available Models */}
            {availableUserModels.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Your Available Models</h4>
                  <Badge variant="outline">
                    {availableUserModels.length} model
                    {availableUserModels.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableUserModels.map((userModel) => {
                    if (!userModel.model) return null;

                    const isSelected =
                      selectedModel ===
                      `${userModel.model.name}:${userModel.user_provider_id}`;

                    return (
                      <Card
                        key={userModel.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          isSelected
                            ? "ring-2 ring-blue-500 border-blue-300"
                            : "hover:border-blue-200"
                        }`}
                        onClick={() => handleModelSelect(userModel)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h5 className="font-medium text-blue-700">
                                {userModel.model.display_name}
                              </h5>
                              <p className="text-sm text-muted-foreground mt-1">
                                {userModel.model.description ||
                                  "AI language model"}
                              </p>
                            </div>
                            {isSelected && (
                              <Badge className="bg-blue-100 text-blue-800">
                                Selected
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Badge variant="outline" className="text-xs">
                              {userModel.user_provider?.provider?.display_name}
                            </Badge>
                            {userModel.model.is_free && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-green-50 text-green-700 border-green-200"
                              >
                                <DollarSign className="h-3 w-3 mr-1" />
                                Free
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h4 className="font-medium text-muted-foreground mb-2">
                  No Models Available
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  You need to add models from your configured providers.
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.open("/dashboard/ai-models", "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Manage AI Models
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {hasConfiguredProviders && (
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => setShowProviderConfig(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Provider
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open("/dashboard/ai-models", "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Manage All Models
          </Button>
        </div>
      )}

      {/* Error Display */}
      {errors.aiModel && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>AI Model Error</AlertTitle>
          <AlertDescription>{errors.aiModel}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AIModelSelection;

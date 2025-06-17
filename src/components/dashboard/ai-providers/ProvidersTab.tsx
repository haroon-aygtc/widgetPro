import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AIModelCard } from "./AIModelCard";
import {
  Search,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Grid,
  List,
  Settings,
  Zap,
  Shield,
  Globe,
  DollarSign,
  Loader2,
  Filter,
  SortAsc,
  Sparkles,
  Bot,
  Brain,
  Cpu,
  Database,
  Plus,
  ArrowRight,
  Wand2,
  Activity,
  Clock,
  Star,
  Rocket,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toastUtils } from "@/components/ui/use-toast";
import type {
  AIProvider,
  AIModel,
  UserAIProvider,
  AIProviderTestResponse,
} from "@/types/ai";

interface ProvidersTabProps {
  providers: AIProvider[];
  userProviders: UserAIProvider[];
  selectedProviderId: number | undefined;
  onSelectProvider: (provider: AIProvider) => void;
  searchTerm: string;
  loading: boolean;
  onSearch: (value: string) => void;
  apiKey: string;
  setApiKey: (value: string) => void;
  testResult: AIProviderTestResponse | null;
  onTestApiKey: () => void;
  onConfigure: () => void;
  testKeyLoading?: boolean;
  configureLoading?: boolean;
  availableModels?: AIModel[];
  onLoadModels?: (providerId: number) => void;
  onAddModel?: (model: AIModel, userProviderId: number) => void;
  addModelLoading?: boolean;
  userModels?: UserAIModel[];
}

export const ProvidersTab: React.FC<ProvidersTabProps> = ({
  providers,
  userProviders,
  selectedProviderId,
  onSelectProvider,
  searchTerm,
  loading,
  onSearch,
  apiKey,
  setApiKey,
  testResult,
  onTestApiKey,
  onConfigure,
  testKeyLoading = false,
  configureLoading = false,
  availableModels = [],
  onLoadModels,
  onAddModel,
  addModelLoading = false,
  userModels = [],
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "free" | "configured">("name");
  const [filterType, setFilterType] = useState<
    "all" | "free" | "configured" | "unconfigured"
  >("all");
  const [configurationStep, setConfigurationStep] = useState<
    "idle" | "testing" | "success" | "models" | "error"
  >("idle");
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const [showModels, setShowModels] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);

  // Helper functions
  const getProviderIcon = (providerName: string) => {
    const name = providerName.toLowerCase();
    switch (name) {
      case "openai":
        return Bot;
      case "anthropic":
        return Brain;
      case "google":
      case "google ai":
        return Sparkles;
      case "groq":
        return Cpu;
      case "hugging face":
      case "huggingface":
        return Database;
      case "mistral":
      case "mistral ai":
        return Zap;
      case "cohere":
        return Globe;
      case "together":
      case "together ai":
        return Activity;
      case "replicate":
        return Settings;
      case "openrouter":
        return Shield;
      default:
        return Bot;
    }
  };

  const getProviderColor = (providerName: string) => {
    const name = providerName.toLowerCase();
    switch (name) {
      case "openai":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800";
      case "anthropic":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800";
      case "google":
      case "google ai":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800";
      case "groq":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800";
      case "mistral":
      case "mistral ai":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950/50 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const isConfigured = (id: number) =>
    userProviders.some((up) => up.provider_id === id);

  // Filter and sort providers
  const filteredAndSortedProviders = providers
    .filter((provider) => {
      const matchSearch =
        provider.display_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        provider.description?.toLowerCase().includes(searchTerm.toLowerCase());

      switch (filterType) {
        case "free":
          return matchSearch && provider.is_free;
        case "configured":
          return matchSearch && isConfigured(provider.id);
        case "unconfigured":
          return matchSearch && !isConfigured(provider.id);
        default:
          return matchSearch;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "free":
          if (a.is_free && !b.is_free) return -1;
          if (!a.is_free && b.is_free) return 1;
          return a.display_name.localeCompare(b.display_name);
        case "configured":
          const aConfigured = isConfigured(a.id);
          const bConfigured = isConfigured(b.id);
          if (aConfigured && !bConfigured) return -1;
          if (!aConfigured && bConfigured) return 1;
          return a.display_name.localeCompare(b.display_name);
        default:
          return a.display_name.localeCompare(b.display_name);
      }
    });

  const selectedProvider = providers.find((p) => p.id === selectedProviderId);

  // Filter available models based on search
  const filteredModels = availableModels.filter((model) => {
    return (
      !modelSearchTerm ||
      model.display_name
        .toLowerCase()
        .includes(modelSearchTerm.toLowerCase()) ||
      model.description?.toLowerCase().includes(modelSearchTerm.toLowerCase())
    );
  });

  // Sort models with free models first
  const sortedModels = filteredModels.sort((a, b) => {
    if (a.is_free && !b.is_free) return -1;
    if (!a.is_free && b.is_free) return 1;
    return a.display_name.localeCompare(b.display_name);
  });

  const isModelAdded = (modelId: number) =>
    userModels.some((m) => m.model_id === modelId);

  // Handle configuration flow
  useEffect(() => {
    if (testResult?.success && selectedProvider && !isConfiguring) {
      setConfigurationStep("success");
      setIsConfiguring(true);

      // Auto-configure the provider after a brief success display
      setTimeout(async () => {
        try {
          await onConfigure();
          setConfigurationStep("models");
          setShowModels(true);

          // Wait a bit for the provider to be configured before loading models
          setTimeout(async () => {
            if (onLoadModels) {
              try {
                await onLoadModels(selectedProvider.id);
              } catch (error) {
                console.error(
                  "Error loading models after configuration:",
                  error,
                );
              }
            }
          }, 500);
        } catch (error) {
          console.error("Error in configuration flow:", error);
          setConfigurationStep("error");
        } finally {
          setIsConfiguring(false);
        }
      }, 1500);
    } else if (testResult && !testResult.success) {
      setConfigurationStep("error");
      setIsConfiguring(false);
    }
  }, [testResult, selectedProvider, onConfigure, onLoadModels, isConfiguring]);

  const handleTestAndConfigure = async () => {
    if (!selectedProvider || !apiKey.trim()) return;
    setConfigurationStep("testing");
    setIsConfiguring(false);
    try {
      await onTestApiKey();
    } catch (error) {
      setConfigurationStep("error");
    }
  };

  const handleModelSelection = (model: AIModel) => {
    if (onAddModel && selectedProvider) {
      // Find the user provider for the selected provider
      const userProvidersArray = Array.isArray(userProviders)
        ? userProviders
        : [];
      const userProvider = userProvidersArray.find(
        (up) => up.provider_id === selectedProvider.id,
      );
      if (userProvider) {
        onAddModel(model, userProvider.id);
      } else {
        console.error(
          "User provider not found for selected provider:",
          selectedProvider.id,
          "Available user providers:",
          userProvidersArray,
        );
        toastUtils.operationError(
          "Adding model",
          "Provider not configured. Please configure the provider first.",
        );
      }
    }
  };

  const handleProviderSelect = (provider: AIProvider) => {
    onSelectProvider(provider);
    setConfigurationStep("idle");
    setShowModels(false);
    setModelSearchTerm("");
    setIsConfiguring(false);
    setApiKey(""); // Reset API key when switching providers
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        <span className="ml-2 text-muted-foreground">
          Loading AI providers...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* API Key Configuration Section - Prominently at Top */}
      {selectedProvider && (
        <Card className="border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-r from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 shadow-lg sticky top-0 z-10">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg">
                <Key className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl text-violet-700 dark:text-violet-300">
                  Configure {selectedProvider.display_name}
                </CardTitle>
                <CardDescription className="mt-1">
                  Enter your API key to connect and access models
                </CardDescription>
              </div>
              {isConfigured(selectedProvider.id) && (
                <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Already Configured
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label
                htmlFor="api-key"
                className="text-sm font-semibold text-violet-700 dark:text-violet-300 flex items-center gap-2"
              >
                <Key className="h-4 w-4" />
                API Key
              </Label>
              <div className="flex gap-3">
                <Input
                  id="api-key"
                  type="password"
                  placeholder={`Enter your ${selectedProvider.display_name} API key`}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 h-12 border-2 border-violet-200/60 dark:border-violet-800/60 focus:border-violet-400 dark:focus:border-violet-600"
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      apiKey.trim() &&
                      configurationStep !== "testing"
                    ) {
                      handleTestAndConfigure();
                    }
                  }}
                  disabled={configurationStep === "testing" || isConfiguring}
                />
                <Button
                  onClick={handleTestAndConfigure}
                  disabled={
                    !apiKey.trim() ||
                    configurationStep === "testing" ||
                    isConfiguring
                  }
                  className="h-12 px-6 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50"
                >
                  {configurationStep === "testing" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : isConfiguring ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Configuring...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4 mr-2" />
                      Test & Configure
                    </>
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between text-xs">
                <p className="text-muted-foreground flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Your API key is encrypted and stored securely
                </p>
                {selectedProvider.documentation_url && (
                  <a
                    href={selectedProvider.documentation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 underline inline-flex items-center gap-1 font-medium transition-colors"
                  >
                    Get API Key
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Enhanced Status Messages */}
            {configurationStep === "success" && (
              <Alert className="border-2 border-green-200 bg-green-50/50 dark:bg-green-950/20 animate-in slide-in-from-top-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800 dark:text-green-300 font-semibold">
                  🎉 Provider Connected Successfully!
                </AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400 mt-1">
                  {selectedProvider.display_name} has been configured and saved.
                  Loading available models...
                </AlertDescription>
              </Alert>
            )}

            {configurationStep === "error" &&
              testResult &&
              !testResult.success && (
                <Alert
                  variant="destructive"
                  className="border-2 border-red-200 bg-red-50/50 dark:bg-red-950/20 animate-in slide-in-from-top-2"
                >
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800 dark:text-red-300 font-semibold">
                    Connection Failed
                  </AlertTitle>
                  <AlertDescription className="text-red-700 dark:text-red-400 mt-1">
                    {testResult.message ||
                      "Please check your API key and try again."}
                  </AlertDescription>
                </Alert>
              )}
          </CardContent>
        </Card>
      )}

      {/* Enhanced Models Section */}
      {showModels && availableModels.length > 0 && (
        <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50/30 to-emerald-50/30 dark:from-green-950/10 dark:to-emerald-950/10 animate-in slide-in-from-bottom-4">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl text-green-700 dark:text-green-300">
                    Available Models
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Select models to add to your collection • Free models are
                    highlighted
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                >
                  {sortedModels.length} models
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                >
                  <Star className="h-3 w-3 mr-1" />
                  {sortedModels.filter((m) => m.is_free).length} free
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Enhanced Model Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search models by name, description, or capabilities..."
                value={modelSearchTerm}
                onChange={(e) => setModelSearchTerm(e.target.value)}
                className="pl-10 h-11 border-2 border-green-200/60 dark:border-green-800/60 focus:border-green-400 dark:focus:border-green-600 transition-colors"
              />
            </div>

            {/* Models Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Showing {sortedModels.length} models</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-green-600" />
                {sortedModels.filter((m) => m.is_free).length} free models
                available
              </span>
              <Separator orientation="vertical" className="h-4" />
              <span>
                {
                  userModels.filter((m) =>
                    sortedModels.some((sm) => sm.id === m.model_id),
                  ).length
                }{" "}
                already added
              </span>
            </div>

            {/* Enhanced Models Grid with Better Scrolling */}
            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedModels.map((model) => (
                  <AIModelCard
                    key={model.id}
                    model={model}
                    isAdded={isModelAdded(model.id)}
                    onAdd={() => handleModelSelection(model)}
                    isLoading={addModelLoading}
                  />
                ))}
              </div>
            </div>

            {/* Models Summary */}
            <div className="pt-4 border-t border-green-200/50 dark:border-green-800/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Click on models to add them to your collection
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowModels(false);
                    setModelSearchTerm("");
                  }}
                  className="border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-950/50"
                >
                  Hide Models
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Header with Search and Controls */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Enhanced Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search providers by name, description, or capabilities..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 h-11 border-2 border-violet-200/60 dark:border-violet-800/60 focus:border-violet-400 dark:focus:border-violet-600 transition-colors"
            />
          </div>

          {/* Enhanced Filters and Controls */}
          <div className="flex gap-2">
            <Select
              value={filterType}
              onValueChange={(value: any) => setFilterType(value)}
            >
              <SelectTrigger className="w-[140px] border-2 border-violet-200/60 dark:border-violet-800/60 transition-colors">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="free">Free Only</SelectItem>
                <SelectItem value="configured">Configured</SelectItem>
                <SelectItem value="unconfigured">Not Configured</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value: any) => setSortBy(value)}
            >
              <SelectTrigger className="w-[120px] border-2 border-violet-200/60 dark:border-violet-800/60 transition-colors">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="free">Free First</SelectItem>
                <SelectItem value="configured">Configured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Provider Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Showing {filteredAndSortedProviders.length} of {providers.length}{" "}
            providers
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 text-green-600" />
            {filteredAndSortedProviders.filter((p) => p.is_free).length} free
            providers
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-blue-600" />
            {
              filteredAndSortedProviders.filter((p) => isConfigured(p.id))
                .length
            }{" "}
            configured
          </span>
        </div>
      </div>

      {/* Enhanced View Mode Toggle */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {selectedProvider ? (
            <span className="flex items-center gap-2">
              <span>Selected: {selectedProvider.display_name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleProviderSelect(selectedProvider)}
                className="h-6 px-2 text-xs"
              >
                Clear Selection
              </Button>
            </span>
          ) : (
            "Click on a provider to configure"
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="border-2 transition-colors"
          >
            <Grid className="h-4 w-4 mr-1" /> Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="border-2 transition-colors"
          >
            <List className="h-4 w-4 mr-1" /> List
          </Button>
        </div>
      </div>

      {/* Providers Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProviders.map((provider) => {
            const IconComponent = getProviderIcon(provider.display_name);
            const configured = isConfigured(provider.id);
            const selected = selectedProviderId === provider.id;

            return (
              <Card
                key={provider.id}
                className={cn(
                  "group cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/10 border-2",
                  selected &&
                    "ring-2 ring-violet-500 border-violet-300 dark:border-violet-700",
                  configured &&
                    "bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800",
                  !configured &&
                    "hover:border-violet-200 dark:hover:border-violet-800",
                )}
                onClick={() => handleProviderSelect(provider)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-2 border-violet-200/50 dark:border-violet-800/50 group-hover:border-violet-300 dark:group-hover:border-violet-700 transition-colors">
                          <IconComponent className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                        </div>
                        {configured && (
                          <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-violet-700 dark:text-violet-300 group-hover:text-violet-800 dark:group-hover:text-violet-200 transition-colors">
                          {provider.display_name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={getProviderColor(provider.display_name)}
                          >
                            {provider.display_name}
                          </Badge>
                          {provider.is_free && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                            >
                              <DollarSign className="h-3 w-3 mr-1" />
                              Free
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={configured ? "outline" : "default"}
                      className={cn(
                        "opacity-0 group-hover:opacity-100 transition-all duration-200",
                        configured &&
                          "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProviderSelect(provider);
                      }}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      {configured ? "Reconfigure" : "Configure"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-sm leading-relaxed">
                    {provider.description ||
                      "AI provider for advanced language models and AI capabilities."}
                  </CardDescription>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Globe className="h-3 w-3" />
                        <span>API Available</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Active</span>
                      </div>
                    </div>

                    {configured && (
                      <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          Configured & Ready
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedProviders.map((provider) => {
            const IconComponent = getProviderIcon(provider.display_name);
            const configured = isConfigured(provider.id);
            const selected = selectedProviderId === provider.id;

            return (
              <Card
                key={provider.id}
                className={cn(
                  "group cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                  selected &&
                    "ring-2 ring-violet-500 border-violet-300 dark:border-violet-700",
                  configured &&
                    "bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800",
                  !configured &&
                    "hover:border-violet-200 dark:hover:border-violet-800",
                )}
                onClick={() => handleProviderSelect(provider)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-200/50 dark:border-violet-800/50">
                        <IconComponent className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      {configured && (
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-violet-700 dark:text-violet-300">
                          {provider.display_name}
                        </h3>
                        <Badge
                          className={getProviderColor(provider.display_name)}
                        >
                          {provider.display_name}
                        </Badge>
                        {provider.is_free && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                          >
                            <DollarSign className="h-3 w-3 mr-1" />
                            Free
                          </Badge>
                        )}
                        {configured && (
                          <Badge
                            variant="default"
                            className="text-xs bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Configured
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {provider.description ||
                          "AI provider for advanced language models and AI capabilities."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {provider.documentation_url && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(provider.documentation_url, "_blank");
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant={configured ? "outline" : "default"}
                      className={cn(
                        configured &&
                          "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProviderSelect(provider);
                      }}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      {configured ? "Reconfigure" : "Configure"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedProviders.length === 0 && (
        <Card className="border-2 border-dashed border-violet-200 dark:border-violet-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-4 rounded-full bg-violet-100 dark:bg-violet-950/50 mb-4">
              <Search className="h-8 w-8 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold text-violet-700 dark:text-violet-300 mb-2">
              No providers found
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              No AI providers match your current search and filter criteria. Try
              adjusting your filters or search terms.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

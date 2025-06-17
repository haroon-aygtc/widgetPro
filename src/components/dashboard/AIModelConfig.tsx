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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertCircle,
  CheckCircle2,
  Settings,
  Sparkles,
  TestTube,
  Loader2,
  Eye,
  EyeOff,
  Zap,
  Brain,
  Cpu,
  Globe,
  Shield,
  Star,
  TrendingUp,
  Filter,
  Search,
  Grid3X3,
  List,
  ChevronRight,
  ChevronDown,
  Wand2,
  Rocket,
  Target,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  HelpCircle,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Save,
  Download,
  Upload,
  Copy,
  ExternalLink,
  Plus,
  Minus,
  MoreHorizontal,
  Bot,
  Database,
  Activity,
} from "lucide-react";
import ErrorBoundary from "@/components/ui/error-boundary";
import { toastUtils } from "@/components/ui/use-toast";
import { useOperationLoading } from "@/contexts/LoadingContext";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAIProviders } from "@/hooks/useAIProviders";
import type { AIModel, AIProvider, UserAIProvider } from "@/types/ai";
import { cn } from "@/lib/utils";
import { aiProviderService } from "@/services/aiProviderService";

interface AIModelConfigProps {
  onSave?: (config: any) => void;
  initialConfig?: any;
}

// Modern UI state types
type ViewMode = "grid" | "list";
type ConfigStep = "providers" | "models" | "parameters" | "prompts" | "testing";

const AIModelConfig = ({
  onSave = () => { },
  initialConfig = {},
}: AIModelConfigProps) => {
  // Core state
  const [activeTab, setActiveTab] = useState<ConfigStep>("providers");
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

  // Modern UI state
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [configProgress, setConfigProgress] = useState(0);
  const [isQuickSetup, setIsQuickSetup] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [filterFreeOnly, setFilterFreeOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "popularity" | "performance">("name");

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
    loadUserProviders,
    testApiKey,
    configureProvider,
    loadModelsForProvider,
    loading,
    addUserModel,
    loadUserModels,
    updateUserProvider,
  } = useAIProviders();

  // Computed values for modern UI
  const filteredProviders = useMemo(() => {
    let filtered = providers.filter(provider =>
      provider.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterFreeOnly) {
      filtered = filtered.filter(provider => provider.is_free);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.display_name.localeCompare(b.display_name);
        case "popularity":
          return (b.is_free ? 1 : 0) - (a.is_free ? 1 : 0);
        case "performance":
          return a.display_name.localeCompare(b.display_name); // Placeholder
        default:
          return 0;
      }
    });
  }, [providers, searchQuery, filterFreeOnly, sortBy]);

  const configSteps: ConfigStep[] = ["providers", "models", "parameters", "prompts", "testing"];
  const currentStepIndex = configSteps.indexOf(activeTab);
  const progressPercentage = ((currentStepIndex + 1) / configSteps.length) * 100;

  useEffect(() => {
    loadProviders();
    setConfigProgress(progressPercentage);
  }, [progressPercentage]);

  // Helper functions
  const toggleShowApiKey = () => setShowApiKey((prev) => !prev);

  const refreshUserModels = useCallback(() => {
    loadUserModels();
  }, [loadUserModels]);

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const handleQuickSetup = async () => {
    setIsQuickSetup(true);
    // Auto-select first available free provider
    const freeProvider = providers.find(p => p.is_free);
    if (freeProvider) {
      setSelectedProvider(freeProvider);
      setActiveTab("models");
    }
  };

  const getStepIcon = (step: ConfigStep) => {
    switch (step) {
      case "providers": return <Globe className="h-4 w-4" />;
      case "models": return <Brain className="h-4 w-4" />;
      case "parameters": return <Settings className="h-4 w-4" />;
      case "prompts": return <Sparkles className="h-4 w-4" />;
      case "testing": return <TestTube className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  // Provider icon mapping function
  const getProviderIcon = (providerName: string) => {
    const name = providerName?.toLowerCase() || "";
    switch (name) {
      case "openai": return Bot;
      case "anthropic": return Brain;
      case "google": case "google ai": return Sparkles;
      case "groq": return Cpu;
      case "hugging face": case "huggingface": return Database;
      case "mistral": case "mistral ai": return Zap;
      case "cohere": return Globe;
      case "together": case "together ai": return Activity;
      case "replicate": return TestTube;
      case "openrouter": return Shield;
      default: return Bot;
    }
  };

  // Provider color mapping function
  const getProviderColor = (providerName: string) => {
    const name = providerName?.toLowerCase() || "";
    switch (name) {
      case "openai":
        return "from-green-500 to-emerald-600";
      case "anthropic":
        return "from-orange-500 to-red-600";
      case "google": case "google ai":
        return "from-blue-500 to-indigo-600";
      case "groq":
        return "from-purple-500 to-violet-600";
      case "mistral": case "mistral ai":
        return "from-yellow-500 to-orange-600";
      case "cohere":
        return "from-teal-500 to-cyan-600";
      case "together": case "together ai":
        return "from-pink-500 to-rose-600";
      case "replicate":
        return "from-gray-500 to-slate-600";
      case "openrouter":
        return "from-indigo-500 to-purple-600";
      default:
        return "from-violet-500 to-purple-600";
    }
  };

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-violet-50/20 dark:to-violet-950/20">
          {/* Modern Header with Progress */}
          <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    AI Model Configuration
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Connect and configure AI providers to power your chat widgets
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleQuickSetup}
                      className="btn-hover-lift"
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      Quick Setup
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Auto-configure with recommended settings</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View documentation</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Configuration Progress</span>
                <span className="font-medium">{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />

              {/* Step Indicators */}
              <div className="flex items-center justify-between mt-4">
                {configSteps.map((step, index) => {
                  const isActive = step === activeTab;
                  const isCompleted = index < currentStepIndex;
                  const stepNumber = index + 1;

                  return (
                    <div
                      key={step}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer transition-all duration-200",
                        isActive && "text-primary font-medium",
                        isCompleted && "text-green-600"
                      )}
                      onClick={() => setActiveTab(step)}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200",
                          isActive && "bg-primary text-primary-foreground shadow-lg scale-110",
                          isCompleted && "bg-green-500 text-white",
                          !isActive && !isCompleted && "bg-muted text-muted-foreground"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          getStepIcon(step)
                        )}
                      </div>
                      <span className="hidden sm:block text-sm capitalize">
                        {step.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      {index < configSteps.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </header>

          <div className="bg-background w-full p-6">
            <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as ConfigStep)} className="w-full">
              {/* Modern Content Area */}

              <TabsContent value="providers" className="space-y-6 animate-fade-in">
                {/* Search and Filter Controls */}
                <Card className="bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm border-2 border-border/60">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-violet-600" />
                          AI Providers
                        </CardTitle>
                        <CardDescription>
                          Connect to AI providers to power your chat widgets
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                              className="btn-hover-lift"
                            >
                              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Switch to {viewMode === "grid" ? "list" : "grid"} view</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* User's Configured Providers Summary */}
                    {userProviders && userProviders.length > 0 && (
                      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200/50 dark:border-green-800/50">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Your Configured Providers ({userProviders.length})
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-300">
                            <Settings className="h-3 w-3" />
                            <span>Use toggles to activate/deactivate providers</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {userProviders.map((userProvider) => {
                            const IconComponent = getProviderIcon(userProvider.provider?.display_name || "");
                            const providerGradient = getProviderColor(userProvider.provider?.display_name || "");

                            return (
                              <div
                                key={userProvider.id}
                                className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-green-200/30 dark:border-green-800/30 hover:shadow-md transition-all duration-200"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm",
                                    `bg-gradient-to-br ${providerGradient}`
                                  )}>
                                    <IconComponent className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium text-sm text-gray-900 dark:text-white">
                                      {userProvider.provider?.display_name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {userProvider.test_status === 'success' ? '✓ Verified' :
                                        userProvider.test_status === 'failed' ? '✗ Failed' : '⏳ Pending'}
                                    </div>
                                  </div>
                                </div>

                                {/* Quick Toggle Controls */}
                                <div className="flex items-center gap-3">
                                  {/* Active Status Toggle */}
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <div className={cn(
                                        "w-2 h-2 rounded-full transition-all duration-300",
                                        userProvider.is_active ? "bg-emerald-500" : "bg-gray-400"
                                      )} />
                                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        {userProvider.is_active ? "ON" : "OFF"}
                                      </span>
                                    </div>
                                    <Switch
                                      checked={userProvider.is_active}
                                      onCheckedChange={async (checked) => {
                                        try {
                                          await updateUserProvider(userProvider.id, {
                                            is_active: checked
                                          });
                                          toastUtils.operationSuccess(
                                            "Provider Status Updated",
                                            `${userProvider.provider?.display_name} ${checked ? 'activated' : 'deactivated'}`
                                          );
                                          await loadUserProviders();
                                        } catch (err: any) {
                                          toastUtils.operationError("Update Failed", err.message);
                                        }
                                      }}
                                      className="data-[state=checked]:bg-emerald-500 scale-75"
                                    />
                                  </div>

                                  {/* Default Status Indicator */}
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={userProvider.is_default}
                                      onCheckedChange={async (checked) => {
                                        try {
                                          await updateUserProvider(userProvider.id, {
                                            is_default: checked
                                          });
                                          toastUtils.operationSuccess(
                                            "Default Provider Updated",
                                            checked ? `${userProvider.provider?.display_name} set as default` : 'Default removed'
                                          );
                                          await loadUserProviders();
                                        } catch (err: any) {
                                          toastUtils.operationError("Update Failed", err.message);
                                        }
                                      }}
                                      className="data-[state=checked]:bg-amber-500 scale-75"
                                    />
                                    <Star className={cn(
                                      "h-3 w-3 transition-all duration-300",
                                      userProvider.is_default ? "text-amber-500" : "text-gray-400"
                                    )} />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Instructions for new users */}
                    {(!userProviders || userProviders.length === 0) && (
                      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                        <div className="flex items-start gap-3">
                          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                              Get Started with AI Providers
                            </h3>
                            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                              <p>1. <strong>Select a provider</strong> from the cards below</p>
                              <p>2. <strong>Enter your API key</strong> to connect</p>
                              <p>3. <strong>Use the toggles</strong> to activate/deactivate providers</p>
                              <p>4. <strong>Set a default provider</strong> for your AI models</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search providers..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 form-transition"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant={filterFreeOnly ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFilterFreeOnly(!filterFreeOnly)}
                          className="btn-hover-lift"
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Free Only
                        </Button>

                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="px-3 py-2 text-sm border border-border rounded-md bg-background"
                        >
                          <option value="name">Sort by Name</option>
                          <option value="popularity">Sort by Popularity</option>
                          <option value="performance">Sort by Performance</option>
                        </select>
                      </div>
                    </div>

                    {/* API Key Input for Selected Provider */}
                    {selectedProvider && (
                      <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-xl border border-violet-200 dark:border-violet-800 animate-slide-in-right">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold",
                            `bg-gradient-to-br ${getProviderColor(selectedProvider.display_name)}`
                          )}>
                            {React.createElement(getProviderIcon(selectedProvider.display_name), { className: "h-5 w-5" })}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">Configure {selectedProvider.display_name}</h4>
                            <p className="text-xs text-muted-foreground">Enter your API key to connect</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="api-key" className="text-sm font-medium">API Key</Label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Input
                                id="api-key"
                                type={showApiKey ? "text" : "password"}
                                placeholder="Enter your API key..."
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="pr-12 form-transition"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={toggleShowApiKey}
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                              >
                                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>

                            <Button
                              onClick={async () => {
                                if (!selectedProvider || !apiKey) {
                                  toastUtils.operationError("Provider Connection", "Please enter your API key.");
                                  return;
                                }
                                try {
                                  const testResult = await testApiKey(selectedProvider.id, apiKey);
                                  if (testResult.success) {
                                    const result = await configureProvider(selectedProvider.id, apiKey);
                                    setSelectedUserProvider(result.userProvider);
                                    setIsConnected(true);

                                    // Auto-navigate to models tab when models are fetched
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
                              className="btn-hover-lift whitespace-nowrap"
                            >
                              {loading.testKeyLoading.isLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Connecting...
                                </>
                              ) : (
                                <>
                                  <Zap className="w-4 h-4 mr-2" />
                                  {isConnected ? "Reconnect" : "Connect"}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Provider Grid/List */}
                    <div className={cn(
                      "gap-4",
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        : "space-y-3"
                    )}>
                      {filteredProviders.map((provider) => {
                        const isSelected = selectedProvider?.id === provider.id;
                        const safeUserProviders = Array.isArray(userProviders) ? userProviders : [];
                        const userProvider = safeUserProviders.find((up) => up.provider_id === provider.id);
                        const isExpanded = expandedCards.has(provider.id.toString());
                        const IconComponent = getProviderIcon(provider.display_name);
                        const providerGradient = getProviderColor(provider.display_name);

                        return (
                          <Card
                            key={provider.id}
                            className={cn(
                              "cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group",
                              "bg-gradient-to-br from-card to-card/80 backdrop-blur-sm",
                              isSelected && "ring-2 ring-violet-500 shadow-lg shadow-violet-500/20",
                              userProvider && "bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800",
                              viewMode === "list" && "flex items-center"
                            )}
                            onClick={() => {
                              setSelectedProvider(provider);
                              setApiKey(userProvider?.api_key || "");
                              setIsConnected(!!userProvider);
                            }}
                          >
                            <CardHeader className={cn("pb-3", viewMode === "list" && "flex-1")}>
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg transition-transform duration-200 group-hover:scale-110",
                                    `bg-gradient-to-br ${providerGradient}`
                                  )}>
                                    {userProvider ? (
                                      <CheckCircle2 className="h-6 w-6" />
                                    ) : (
                                      <IconComponent className="h-6 w-6" />
                                    )}
                                  </div>
                                  <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      {provider.display_name}
                                      {provider.is_free && (
                                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                          <Star className="h-3 w-3 mr-1" />
                                          Free
                                        </Badge>
                                      )}
                                    </CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                      {userProvider && (
                                        <>
                                          <Badge
                                            variant="default"
                                            className={cn(
                                              "text-xs",
                                              userProvider.is_active
                                                ? "bg-green-600 text-white"
                                                : "bg-gray-500 text-white"
                                            )}
                                          >
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            {userProvider.is_active ? "Active" : "Inactive"}
                                          </Badge>
                                          {userProvider.is_default && (
                                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                                              <Star className="h-3 w-3 mr-1" />
                                              Default
                                            </Badge>
                                          )}
                                        </>
                                      )}
                                      {isSelected && (
                                        <Badge variant="outline" className="text-xs border-violet-500 text-violet-600">
                                          Selected
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {/* Provider Toggle Controls - Visible for configured providers */}
                                  {userProvider && (
                                    <div className="flex items-center gap-2 mr-2">
                                      {/* Active/Inactive Toggle */}
                                      <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
                                        <div className="flex items-center gap-1">
                                          <div className={cn(
                                            "w-2 h-2 rounded-full transition-all duration-300",
                                            userProvider.is_active ? "bg-emerald-500" : "bg-gray-400"
                                          )} />
                                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                            {userProvider.is_active ? "ON" : "OFF"}
                                          </span>
                                        </div>
                                        <Switch
                                          checked={userProvider.is_active}
                                          onCheckedChange={async (checked) => {
                                            try {
                                              await updateUserProvider(userProvider.id, {
                                                is_active: checked
                                              });
                                              toastUtils.operationSuccess(
                                                "Provider Status Updated",
                                                `${provider.display_name} ${checked ? 'activated' : 'deactivated'}`
                                              );
                                              await loadUserProviders();
                                            } catch (err: any) {
                                              toastUtils.operationError("Update Failed", err.message);
                                            }
                                          }}
                                          className="data-[state=checked]:bg-emerald-500 scale-75"
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                      </div>

                                      {/* Default Provider Toggle */}
                                      <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
                                        <div className="flex items-center gap-1">
                                          <Star className={cn(
                                            "w-3 h-3 transition-all duration-300",
                                            userProvider.is_default ? "text-amber-500" : "text-gray-400"
                                          )} />
                                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                            Default
                                          </span>
                                        </div>
                                        <Switch
                                          checked={userProvider.is_default}
                                          onCheckedChange={async (checked) => {
                                            try {
                                              await updateUserProvider(userProvider.id, {
                                                is_default: checked
                                              });
                                              toastUtils.operationSuccess(
                                                "Default Provider Updated",
                                                checked ? `${provider.display_name} set as default` : 'Default removed'
                                              );
                                              await loadUserProviders();
                                            } catch (err: any) {
                                              toastUtils.operationError("Update Failed", err.message);
                                            }
                                          }}
                                          className="data-[state=checked]:bg-amber-500 scale-75"
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {/* Action Buttons */}
                                  <div className="flex items-center gap-1">
                                    {provider.documentation_url && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              window.open(provider.documentation_url, "_blank");
                                            }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            <ExternalLink className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>View documentation</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    )}

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCardExpansion(provider.id.toString());
                                      }}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      {isExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>

                            {viewMode === "grid" && (
                              <CardContent className="pt-0">
                                <CardDescription className="text-sm leading-relaxed line-clamp-2">
                                  {provider.description || `Connect to ${provider.name} for AI capabilities`}
                                </CardDescription>

                                {isExpanded && (
                                  <div className="mt-4 space-y-3 animate-fade-in">
                                    <Separator />
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                      <div className="flex items-center gap-2">
                                        <Cpu className="h-3 w-3 text-muted-foreground" />
                                        <span>High Performance</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Shield className="h-3 w-3 text-muted-foreground" />
                                        <span>Secure</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Globe className="h-3 w-3 text-muted-foreground" />
                                        <span>Global</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                                        <span>Reliable</span>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {userProvider && (
                                  <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200/50 dark:border-green-800/50">
                                    <div className="space-y-3">
                                      {/* API Key Display */}
                                      <div className="flex items-center justify-between">
                                        <div className="text-xs">
                                          <span className="text-muted-foreground">API Key: </span>
                                          <span className="font-mono">••••••••••••••••••</span>
                                        </div>
                                        <Badge
                                          variant="secondary"
                                          className={cn(
                                            "text-xs",
                                            userProvider.test_status === 'success'
                                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                              : userProvider.test_status === 'failed'
                                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                          )}
                                        >
                                          {userProvider.test_status === 'success' ? '✓ Verified' :
                                            userProvider.test_status === 'failed' ? '✗ Failed' : '⏳ Pending'}
                                        </Badge>
                                      </div>

                                      {/* Provider Controls */}
                                      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-green-200/30 dark:border-green-800/30">
                                        <div className="flex items-center gap-2">
                                          <div className={cn(
                                            "w-2 h-2 rounded-full transition-all duration-300",
                                            userProvider.is_active ? "bg-emerald-500 shadow-lg shadow-emerald-500/50" : "bg-gray-400"
                                          )} />
                                          <span className="text-sm font-medium text-gray-900 dark:text-white">Provider Active</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          {userProvider.is_default && (
                                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs">
                                              <Star className="h-3 w-3 mr-1" />
                                              Default
                                            </Badge>
                                          )}
                                          <Switch
                                            checked={userProvider.is_active}
                                            onCheckedChange={async (checked) => {
                                              try {
                                                await updateUserProvider(userProvider.id, {
                                                  is_active: checked
                                                });
                                                toastUtils.operationSuccess(
                                                  "Provider Status Updated",
                                                  `${provider.display_name} ${checked ? 'activated' : 'deactivated'}`
                                                );
                                                // Refresh user providers to update the UI
                                                await loadUserProviders();
                                              } catch (err: any) {
                                                toastUtils.operationError("Update Failed", err.message);
                                              }
                                            }}
                                            className="data-[state=checked]:bg-emerald-500"
                                          />
                                        </div>
                                      </div>

                                      {/* Default Provider Toggle */}
                                      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-green-200/30 dark:border-green-800/30">
                                        <div className="flex items-center gap-2">
                                          <div className={cn(
                                            "w-2 h-2 rounded-full transition-all duration-300",
                                            userProvider.is_default ? "bg-amber-500 shadow-lg shadow-amber-500/50" : "bg-gray-400"
                                          )} />
                                          <span className="text-sm font-medium text-gray-900 dark:text-white">Default Provider</span>
                                        </div>
                                        <Switch
                                          checked={userProvider.is_default}
                                          onCheckedChange={async (checked) => {
                                            try {
                                              await updateUserProvider(userProvider.id, {
                                                is_default: checked
                                              });
                                              toastUtils.operationSuccess(
                                                "Default Provider Updated",
                                                checked ? `${provider.display_name} set as default` : 'Default removed'
                                              );
                                              // Refresh user providers to update the UI
                                              await loadUserProviders();
                                            } catch (err: any) {
                                              toastUtils.operationError("Update Failed", err.message);
                                            }
                                          }}
                                          className="data-[state=checked]:bg-amber-500"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            )}
                          </Card>
                        );
                      })}
                    </div>

                    {filteredProviders.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                          <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No providers found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or filters</p>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4" />
                      <span>{filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} available</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("");
                          setFilterFreeOnly(false);
                          setSortBy("name");
                        }}
                        className="btn-hover-lift"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Filters
                      </Button>

                      {isConnected && (
                        <Button
                          onClick={() => setActiveTab("models")}
                          className="btn-hover-lift"
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Continue to Models
                        </Button>
                      )}
                    </div>
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
                    {/* User's Configured Models Summary */}
                    {userModels && userModels.length > 0 && (
                      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Your Configured Models ({userModels.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {userModels.map((userModel) => (
                            <div
                              key={userModel.id}
                              className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-blue-200/30 dark:border-blue-800/30"
                            >
                              <div className="flex-1">
                                <div className="font-medium text-sm text-gray-900 dark:text-white">
                                  {userModel.custom_name || userModel.model?.display_name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {userModel.user_provider?.provider?.display_name}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "w-2 h-2 rounded-full",
                                  userModel.is_active ? "bg-emerald-500" : "bg-gray-400"
                                )} />
                                {userModel.is_default && (
                                  <Star className="h-3 w-3 text-amber-500" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {availableModels.map((model) => {
                                const isSelected = selectedModel?.id === model.id;
                                const userModel = userModels.find(um => um.model_id === model.id);
                                const isUserModel = !!userModel;

                                return (
                                  <Card
                                    key={model.id || `${model.name}-${model.context_window}-${model.max_tokens}`}
                                    className={cn(
                                      "cursor-pointer transition-all duration-200 hover:shadow-lg",
                                      isSelected && "ring-2 ring-violet-500 shadow-lg shadow-violet-500/20",
                                      isUserModel && "bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800"
                                    )}
                                    onClick={() => setSelectedModel(model)}
                                  >
                                    <CardHeader className="pb-3">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-2">
                                            <CardTitle className="text-base">
                                              {model.display_name}
                                            </CardTitle>
                                            {model.is_free && (
                                              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                                <Star className="h-3 w-3 mr-1" />
                                                Free
                                              </Badge>
                                            )}
                                          </div>

                                          {/* Provider Information */}
                                          <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className="text-xs">
                                              {selectedProvider?.display_name || 'Unknown Provider'}
                                            </Badge>
                                            {selectedUserProvider?.is_active ? (
                                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                                ✓ Connected
                                              </Badge>
                                            ) : (
                                              <Badge variant="secondary" className="bg-gray-100 text-gray-800 text-xs">
                                                ⚠ Not Connected
                                              </Badge>
                                            )}
                                          </div>

                                          <CardDescription className="text-sm">
                                            {model.description || model.name}
                                          </CardDescription>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                          {isUserModel && (
                                            <>
                                              <Badge
                                                variant="default"
                                                className={cn(
                                                  "text-xs",
                                                  userModel?.is_active
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-gray-500 text-white"
                                                )}
                                              >
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                {userModel?.is_active ? "Active" : "Inactive"}
                                              </Badge>
                                              {userModel?.is_default && (
                                                <Badge variant="default" className="text-xs bg-amber-600 text-white">
                                                  <Star className="h-3 w-3 mr-1" />
                                                  Default
                                                </Badge>
                                              )}
                                            </>
                                          )}
                                          {isSelected && (
                                            <Badge variant="outline" className="text-xs border-violet-500 text-violet-600">
                                              Selected
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-4">
                                        {model.context_window && (
                                          <div className="flex items-center gap-1">
                                            <Brain className="h-3 w-3" />
                                            <span>Context: {model.context_window.toLocaleString()}</span>
                                          </div>
                                        )}
                                        {model.max_tokens && (
                                          <div className="flex items-center gap-1">
                                            <Target className="h-3 w-3" />
                                            <span>Max: {model.max_tokens.toLocaleString()}</span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Model Actions */}
                                      <div className="space-y-3">
                                        {!isUserModel ? (
                                          <Button
                                            size="sm"
                                            className="w-full btn-hover-lift"
                                            onClick={async (e) => {
                                              e.stopPropagation();
                                              try {
                                                await addUserModel({
                                                  model_id: Number(model.id),
                                                  user_provider_id: Number(selectedUserProvider!.id),
                                                  custom_name: model.display_name,
                                                  is_active: true,
                                                  is_default: false
                                                });
                                                refreshUserModels();
                                              } catch (err: any) {
                                                toastUtils.operationError("Add Failed", err.message);
                                              }
                                            }}
                                          >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add to My Models
                                          </Button>
                                        ) : (
                                          <div className="space-y-2">
                                            {/* Enhanced Model Status Controls */}
                                            <div className="space-y-3 p-3 bg-muted/30 rounded-lg border">
                                              {/* Active Status Control */}
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                  <div className={cn(
                                                    "w-2 h-2 rounded-full transition-all duration-300",
                                                    userModel?.is_active ? "bg-emerald-500 shadow-lg shadow-emerald-500/50" : "bg-gray-400"
                                                  )} />
                                                  <Label className="text-sm font-medium">Active Status</Label>
                                                </div>
                                                <Switch
                                                  checked={userModel?.is_active || false}
                                                  onCheckedChange={async (checked) => {
                                                    try {
                                                      await aiProviderService.updateUserModelStatus(userModel.id, {
                                                        is_active: checked
                                                      });
                                                      toastUtils.operationSuccess(
                                                        "Model Status Updated",
                                                        `${model.display_name} ${checked ? 'activated' : 'deactivated'}`
                                                      );
                                                      refreshUserModels();
                                                    } catch (err: any) {
                                                      toastUtils.operationError("Update Failed", err.message);
                                                    }
                                                  }}
                                                  className="data-[state=checked]:bg-emerald-500"
                                                />
                                              </div>

                                              {/* Default Status Control */}
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                  <div className={cn(
                                                    "w-2 h-2 rounded-full transition-all duration-300",
                                                    userModel?.is_default ? "bg-amber-500 shadow-lg shadow-amber-500/50" : "bg-gray-400"
                                                  )} />
                                                  <Label className="text-sm font-medium">Default Model</Label>
                                                </div>
                                                <Switch
                                                  checked={userModel?.is_default || false}
                                                  onCheckedChange={async (checked) => {
                                                    try {
                                                      await aiProviderService.updateUserModelStatus(userModel.id, {
                                                        is_default: checked
                                                      });
                                                      toastUtils.operationSuccess(
                                                        "Default Model Updated",
                                                        checked ? `${model.display_name} set as default` : 'Default removed'
                                                      );
                                                      refreshUserModels();
                                                    } catch (err: any) {
                                                      toastUtils.operationError("Update Failed", err.message);
                                                    }
                                                  }}
                                                  className="data-[state=checked]:bg-amber-500"
                                                />
                                              </div>
                                            </div>

                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="w-full"
                                              onClick={async (e) => {
                                                e.stopPropagation();
                                                try {
                                                  await aiProviderService.deleteUserModel(userModel.id);
                                                  toastUtils.operationSuccess("Model Removed", `${model.display_name} removed from your collection`);
                                                  refreshUserModels();
                                                } catch (err: any) {
                                                  toastUtils.operationError("Remove Failed", err.message);
                                                }
                                              }}
                                            >
                                              <Minus className="h-4 w-4 mr-2" />
                                              Remove Model
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
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
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default AIModelConfig;
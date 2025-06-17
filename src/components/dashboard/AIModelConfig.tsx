import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Brain,
  Settings,
  Sparkles,
  TestTube,
  Globe,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Wand2,
  Cpu,
} from "lucide-react";
import ErrorBoundary from "@/components/ui/error-boundary";
import { toastUtils } from "@/components/ui/use-toast";
import React, { useState, useEffect } from "react";
import { useAIProviders } from "@/hooks/useAIProviders";
import type { AIProvider, UserAIProvider } from "@/types/ai";
import { cn } from "@/lib/utils";
import { aiProviderService } from "@/services/aiProviderService";
import ConfiguredProvidersSection from "./ai-providers/ConfiguredProvidersSection";
import AvailableProvidersSection from "./ai-providers/AvailableProvidersSection";

interface AIModelConfigProps {
  onSave?: (config: any) => void;
  initialConfig?: any;
}

type ConfigStep = "my-providers" | "available-providers" | "models" | "parameters" | "prompts" | "testing";

const AIModelConfig = ({
  onSave = () => { },
  initialConfig = {},
}: AIModelConfigProps) => {
  const [activeTab, setActiveTab] = useState<ConfigStep>("my-providers");

  const {
    providers,
    userProviders,
    userModels,
    availableModels,
    loadProviders,
    loadUserProviders,
    loadUserModels,
    testApiKey,
    configureProvider,
    updateUserProvider,
    addUserModel,
    loadModelsForProvider,
    loading,
  } = useAIProviders();

  const configSteps: ConfigStep[] = ["my-providers", "available-providers", "models", "parameters", "prompts", "testing"];
  const currentStepIndex = configSteps.indexOf(activeTab);
  const progressPercentage = ((currentStepIndex + 1) / configSteps.length) * 100;

  useEffect(() => {
    loadProviders();
    loadUserProviders();
    loadUserModels();
  }, []);

  const handleConnectProvider = async (provider: AIProvider, apiKey: string) => {
    try {
      const testResult = await testApiKey(provider.id, apiKey);
      if (testResult.success) {
        const result = await configureProvider(provider.id, apiKey);
        toastUtils.operationSuccess(
          "Provider Connected",
          `${provider.display_name} has been successfully connected with ${result.availableModels?.length || 0} models`
        );
        await loadUserProviders();
        await loadUserModels();
        // Auto-navigate to models tab to show the user their new models
        if (result.availableModels?.length > 0) {
          setActiveTab("models");
        }
      } else {
        toastUtils.operationError("Connection Failed", testResult.message);
      }
    } catch (error: any) {
      toastUtils.operationError("Connection Failed", error.message);
    }
  };

  const handleUpdateProvider = async (id: number, updates: Partial<UserAIProvider>) => {
    await updateUserProvider(id, updates);
    await loadUserProviders();
  };

  const handleDeleteProvider = async (id: number) => {
    await aiProviderService.deleteUserProvider(id);
    await loadUserProviders();
  };

  const handleUpdateModel = async (id: number, updates: Partial<UserAIProvider>) => {
    await aiProviderService.updateUserModelStatus(id, updates);
    await loadUserModels();
  };

  const handleDeleteModel = async (id: number) => {
    await aiProviderService.deleteUserModel(id);
    await loadUserModels();
  };

  const handleAddModel = async (data: {
    model_id: number;
    user_provider_id: number;
    custom_name?: string;
  }) => {
    await addUserModel(data);
    await loadUserModels();
  };

  const getStepIcon = (step: ConfigStep) => {
    switch (step) {
      case "my-providers": return <CheckCircle className="h-4 w-4" />;
      case "available-providers": return <Globe className="h-4 w-4" />;
      case "models": return <Cpu className="h-4 w-4" />;
      case "parameters": return <Settings className="h-4 w-4" />;
      case "prompts": return <Sparkles className="h-4 w-4" />;
      case "testing": return <TestTube className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getStepLabel = (step: ConfigStep) => {
    switch (step) {
      case "my-providers": return "My Providers";
      case "available-providers": return "Available Providers";
      case "models": return "Models";
      case "parameters": return "Parameters";
      case "prompts": return "Prompts";
      case "testing": return "Testing";
      default: return step;
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
                      onClick={() => setActiveTab("available-providers")}
                      className="btn-hover-lift"
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      Quick Setup
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Jump to available providers to get started</p>
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
                      <span className="hidden sm:block text-sm">
                        {getStepLabel(step)}
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
              <TabsContent value="my-providers" className="space-y-6 animate-fade-in">
                <ConfiguredProvidersSection
                  userProviders={userProviders || []}
                  onUpdateProvider={handleUpdateProvider}
                  onDeleteProvider={handleDeleteProvider}
                  onRefresh={() => loadUserProviders()}
                  loading={loading.loadProvidersLoading.isLoading}
                />
              </TabsContent>

              <TabsContent value="available-providers" className="space-y-6 animate-fade-in">
                <AvailableProvidersSection
                  providers={providers || []}
                  onConnectProvider={handleConnectProvider}
                  loading={loading.loadProvidersLoading.isLoading}
                />
              </TabsContent>

              <TabsContent value="models" className="space-y-6 animate-fade-in">
                {!userModels?.length ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No Configured Models</h3>
                      <p className="text-muted-foreground mb-4">
                        Add AI models from your connected providers to start building intelligent chat widgets.
                      </p>
                      <Button
                        onClick={() => setActiveTab("available-providers")}
                        className="btn-hover-lift"
                      >
                        Connect Providers First
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          My AI Models
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Manage your configured AI models and their settings
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          {userModels.length} Model{userModels.length !== 1 ? 's' : ''}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => loadUserModels()}
                          disabled={loading.loadModelsLoading.isLoading}
                          className="btn-hover-lift"
                        >
                          <ChevronRight className="h-4 w-4 mr-2" />
                          Refresh
                        </Button>
                      </div>
                    </div>

                    {/* Models Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userModels.map((userModel) => {
                        const model = userModel.model;
                        if (!model) return null;

                        return (
                          <Card
                            key={userModel.id}
                            className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 backdrop-blur-sm border-2"
                          >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                                    <Brain className="h-5 w-5" />
                                  </div>

                                  <div className="flex-1">
                                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                                      {userModel.custom_name || model.display_name}
                                    </CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge
                                        variant="secondary"
                                        className={cn(
                                          "text-xs font-medium",
                                          userModel.is_active
                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                                        )}
                                      >
                                        {userModel.is_active ? (
                                          <>
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Active
                                          </>
                                        ) : (
                                          <>
                                            <Settings className="h-3 w-3 mr-1" />
                                            Inactive
                                          </>
                                        )}
                                      </Badge>
                                      {userModel.is_default && (
                                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs">
                                          <Sparkles className="h-3 w-3 mr-1" />
                                          Default
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
                                {model.context_window && (
                                  <div className="flex items-center gap-1">
                                    <Settings className="h-3 w-3" />
                                    <span>Context: {model.context_window.toLocaleString()}</span>
                                  </div>
                                )}
                                {model.max_tokens && (
                                  <div className="flex items-center gap-1">
                                    <TestTube className="h-3 w-3" />
                                    <span>Max: {model.max_tokens.toLocaleString()}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  <span>Provider: {userModel.user_provider?.provider?.display_name}</span>
                                </div>
                                {model.is_free && (
                                  <div className="flex items-center gap-1">
                                    <Sparkles className="h-3 w-3 text-green-600" />
                                    <span className="text-green-600">Free</span>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                                  <div className="flex items-center gap-2">
                                    <div className={cn(
                                      "w-2 h-2 rounded-full transition-all duration-300",
                                      userModel.is_active
                                        ? "bg-blue-500 shadow-lg shadow-blue-500/50"
                                        : "bg-gray-400"
                                    )} />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      Active Status
                                    </span>
                                  </div>
                                  <Switch
                                    checked={userModel.is_active}
                                    onCheckedChange={(checked) =>
                                      handleUpdateModel(userModel.id, { is_active: checked })
                                    }
                                    className="data-[state=checked]:bg-blue-500"
                                  />
                                </div>

                                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                                  <div className="flex items-center gap-2">
                                    <div className={cn(
                                      "w-2 h-2 rounded-full transition-all duration-300",
                                      userModel.is_default
                                        ? "bg-amber-500 shadow-lg shadow-amber-500/50"
                                        : "bg-gray-400"
                                    )} />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      Default Model
                                    </span>
                                  </div>
                                  <Switch
                                    checked={userModel.is_default}
                                    onCheckedChange={(checked) =>
                                      handleUpdateModel(userModel.id, { is_default: checked })
                                    }
                                    className="data-[state=checked]:bg-amber-500"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="parameters" className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Parameter Configuration</h3>
                    <p className="text-muted-foreground">
                      Model parameter tuning will be available here
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="prompts" className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Settings className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Prompt Management</h3>
                    <p className="text-muted-foreground">
                      Prompt management will be available here
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="testing" className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <TestTube className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Configuration Testing</h3>
                    <p className="text-muted-foreground">
                      Test your AI configuration here
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default AIModelConfig;
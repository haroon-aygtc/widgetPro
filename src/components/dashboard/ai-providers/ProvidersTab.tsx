import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdvancedProviderConfig from "./AdvancedProviderConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Grid,
  List,
  MoreHorizontal,
  Settings,
  Zap,
  Shield,
  Globe,
  DollarSign,
  Clock,
  Star,
  Loader2,
  Filter,
  SortAsc,
  Eye,
  TestTube,
  Link,
  Sparkles,
  Bot,
  Brain,
  Cpu,
  Database,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { AIProvider, AIModel, UserAIProvider, AIProviderTestResponse } from "@/types/ai";

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
  onProviderConfigured?: (userProvider: UserAIProvider, models: AIModel[]) => void;
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
  onProviderConfigured,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "free" | "configured">("name");
  const [filterType, setFilterType] = useState<"all" | "free" | "configured" | "unconfigured">("all");
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);
  const [selectedProviderForConfig, setSelectedProviderForConfig] = useState<AIProvider | null>(null);

  // Helper functions
  const getProviderIcon = (providerName: string) => {
    const name = providerName.toLowerCase();
    switch (name) {
      case "openai": return Bot;
      case "anthropic": return Brain;
      case "google": case "google ai": return Sparkles;
      case "groq": return Cpu;
      case "hugging face": case "huggingface": return Database;
      case "mistral": case "mistral ai": return Zap;
      case "cohere": return Globe;
      case "together": case "together ai": return Link;
      case "replicate": return TestTube;
      case "openrouter": return Shield;
      default: return Bot;
    }
  };

  const getProviderColor = (providerName: string) => {
    const name = providerName.toLowerCase();
    switch (name) {
      case "openai": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800";
      case "anthropic": return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800";
      case "google": case "google ai": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800";
      case "groq": return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800";
      case "mistral": case "mistral ai": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800";
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950/50 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const isConfigured = (id: number) => userProviders.some((up) => up.provider_id === id);

  // Filter and sort providers
  const filteredAndSortedProviders = providers
    .filter((provider) => {
      const matchSearch = provider.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.description?.toLowerCase().includes(searchTerm.toLowerCase());

      switch (filterType) {
        case "free": return matchSearch && provider.is_free;
        case "configured": return matchSearch && isConfigured(provider.id);
        case "unconfigured": return matchSearch && !isConfigured(provider.id);
        default: return matchSearch;
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

  const handleProviderAction = (provider: AIProvider, action: string) => {
    switch (action) {
      case "configure":
        onSelectProvider(provider);
        break;
      case "advanced-configure":
        setSelectedProviderForConfig(provider);
        setShowAdvancedConfig(true);
        break;
      case "documentation":
        if (provider.documentation_url) {
          window.open(provider.documentation_url, "_blank");
        }
        break;
      case "view":
        onSelectProvider(provider);
        break;
    }
  };

  const handleAdvancedConfigComplete = (userProvider: UserAIProvider, models: AIModel[]) => {
    setShowAdvancedConfig(false);
    setSelectedProviderForConfig(null);
    if (onProviderConfigured) {
      onProviderConfigured(userProvider, models);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        <span className="ml-2 text-muted-foreground">Loading AI providers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search providers by name or description..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 h-11 border-2 border-violet-200/60 dark:border-violet-800/60 focus:border-violet-400 dark:focus:border-violet-600"
          />
        </div>

        {/* Filters and Controls */}
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-[140px] border-2 border-violet-200/60 dark:border-violet-800/60">
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

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[120px] border-2 border-violet-200/60 dark:border-violet-800/60">
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

      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {filteredAndSortedProviders.length} of {providers.length} providers
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="border-2"
          >
            <Grid className="h-4 w-4 mr-1" /> Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="border-2"
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
                  selected && "ring-2 ring-violet-500 border-violet-300 dark:border-violet-700",
                  configured && "bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800",
                  !configured && "hover:border-violet-200 dark:hover:border-violet-800"
                )}
                onClick={() => onSelectProvider(provider)}
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
                          <Badge className={getProviderColor(provider.display_name)}>
                            {provider.display_name}
                          </Badge>
                          {provider.is_free && (
                            <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                              <DollarSign className="h-3 w-3 mr-1" />
                              Free
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleProviderAction(provider, "configure")}>
                          <Settings className="h-4 w-4 mr-2" />
                          {configured ? "Quick Reconfigure" : "Quick Configure"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleProviderAction(provider, "advanced-configure")}>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Advanced Setup
                        </DropdownMenuItem>
                        {provider.documentation_url && (
                          <DropdownMenuItem onClick={() => handleProviderAction(provider, "documentation")}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Documentation
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleProviderAction(provider, "view")}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-sm leading-relaxed">
                    {provider.description || "AI provider for advanced language models and AI capabilities."}
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
                  selected && "ring-2 ring-violet-500 border-violet-300 dark:border-violet-700",
                  configured && "bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800",
                  !configured && "hover:border-violet-200 dark:hover:border-violet-800"
                )}
                onClick={() => onSelectProvider(provider)}
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
                        <Badge className={getProviderColor(provider.display_name)}>
                          {provider.display_name}
                        </Badge>
                        {provider.is_free && (
                          <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                            <DollarSign className="h-3 w-3 mr-1" />
                            Free
                          </Badge>
                        )}
                        {configured && (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Configured
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {provider.description || "AI provider for advanced language models and AI capabilities."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {provider.documentation_url && (
                      <Button
                        size="sm"
                        variant="outline"
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
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProviderAction(provider, "advanced-configure");
                      }}
                      className="mr-2"
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      Advanced
                    </Button>
                    <Button
                      size="sm"
                      variant={configured ? "outline" : "default"}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProvider(provider);
                      }}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      {configured ? "Quick" : "Configure"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Configuration Panel */}
      {selectedProvider && (
        <Card className="mt-8 border-2 border-violet-200/60 dark:border-violet-800/60 bg-gradient-to-br from-white to-violet-50/30 dark:from-gray-900 dark:to-violet-950/30">
          <CardHeader className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-b border-violet-200/50 dark:border-violet-800/50">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg">
                <Key className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl text-violet-700 dark:text-violet-300">
                  Configure {selectedProvider.display_name}
                </CardTitle>
                <CardDescription className="mt-1">
                  Enter your API credentials to connect with {selectedProvider.display_name}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-sm font-semibold text-violet-700 dark:text-violet-300 flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Key
              </Label>
              <Input
                id="api-key"
                type="password"
                placeholder={`Enter your ${selectedProvider.display_name} API key`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="h-12 border-2 border-violet-200/60 dark:border-violet-800/60 focus:border-violet-400 dark:focus:border-violet-600 bg-white/50 dark:bg-gray-900/50"
              />
              <p className="text-xs text-muted-foreground">
                Your API key will be encrypted and stored securely.
                {selectedProvider.documentation_url && (
                  <>
                    {" "}
                    <a
                      href={selectedProvider.documentation_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 underline"
                    >
                      Get your API key here
                    </a>
                  </>
                )}
              </p>
            </div>

            {testResult && (
              <Alert variant={testResult.success ? "default" : "destructive"} className="border-2">
                {testResult.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle className="font-semibold">
                  {testResult.success ? "Connection Successful!" : "Connection Failed"}
                </AlertTitle>
                <AlertDescription className="mt-1">
                  {testResult.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-violet-200/50 dark:border-violet-800/50">
              <Button
                variant="outline"
                onClick={onTestApiKey}
                disabled={!apiKey.trim()}
                className="border-2 border-violet-200 hover:border-violet-300 dark:border-violet-800 dark:hover:border-violet-700"
              >
                <TestTube className="h-4 w-4 mr-2" />
                Test Connection
              </Button>
              <Button
                onClick={onConfigure}
                disabled={!testResult?.success}
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure Provider
              </Button>
            </div>
          </CardContent>
        </Card>
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
              No AI providers match your current search and filter criteria. Try adjusting your filters or search terms.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Advanced Provider Configuration Modal */}
      <AdvancedProviderConfig
        isOpen={showAdvancedConfig}
        onOpenChange={setShowAdvancedConfig}
        provider={selectedProviderForConfig}
        onConfigured={handleAdvancedConfigComplete}
        userProviders={userProviders}
      />
    </div>
  );
};

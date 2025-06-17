import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Star,
    ExternalLink,
    Eye,
    EyeOff,
    Zap,
    Loader2,
    Search,
    Filter,
    RotateCcw,
    Globe,
    Shield,
    TrendingUp,
    Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIProvider } from "@/types/ai";
import { toastUtils } from "@/components/ui/use-toast";
import { useOperationLoading } from "@/contexts/LoadingContext";

interface AvailableProvidersSectionProps {
    providers: AIProvider[];
    onConnectProvider: (provider: AIProvider, apiKey: string) => Promise<void>;
    loading?: boolean;
}

const getProviderIcon = (providerName: string) => {
    const name = providerName?.toLowerCase() || "";
    switch (name) {
        case "openai": return "🤖";
        case "anthropic": return "🧠";
        case "google": case "google ai": return "✨";
        case "groq": return "⚡";
        case "mistral": case "mistral ai": return "🔥";
        case "cohere": return "🌐";
        case "together": case "together ai": return "📊";
        case "replicate": return "🧪";
        case "openrouter": return "🛡️";
        default: return "🤖";
    }
};

const getProviderGradient = (providerName: string) => {
    const name = providerName?.toLowerCase() || "";
    switch (name) {
        case "openai": return "from-emerald-500 to-green-600";
        case "anthropic": return "from-orange-500 to-red-600";
        case "google": case "google ai": return "from-blue-500 to-indigo-600";
        case "groq": return "from-purple-500 to-violet-600";
        case "mistral": case "mistral ai": return "from-yellow-500 to-orange-600";
        case "cohere": return "from-teal-500 to-cyan-600";
        case "together": case "together ai": return "from-pink-500 to-rose-600";
        case "replicate": return "from-gray-500 to-slate-600";
        case "openrouter": return "from-indigo-500 to-purple-600";
        default: return "from-violet-500 to-purple-600";
    }
};

const AvailableProvidersSection: React.FC<AvailableProvidersSectionProps> = ({
    providers,
    onConnectProvider,
    loading = false
}) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [filterFreeOnly, setFilterFreeOnly] = React.useState(false);
    const [sortBy, setSortBy] = React.useState<"name" | "popularity" | "performance">("name");
    const [selectedProvider, setSelectedProvider] = React.useState<AIProvider | null>(null);
    const [apiKey, setApiKey] = React.useState("");
    const [showApiKey, setShowApiKey] = React.useState(false);
    const [connecting, setConnecting] = React.useState(false);
    const connectLoading = useOperationLoading("provider-connect");
    const testLoading = useOperationLoading("provider-test");

    
    const filteredProviders = React.useMemo(() => {
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
                    return a.display_name.localeCompare(b.display_name);
                default:
                    return 0;
            }
        });
    }, [providers, searchQuery, filterFreeOnly, sortBy]);

    const handleConnect = async () => {
        if (!selectedProvider || !apiKey.trim()) return;

        setConnecting(true);
        try {
            await onConnectProvider(selectedProvider, apiKey);
            setSelectedProvider(null);
            setApiKey("");
            toastUtils.operationSuccess("Provider Connected", `${selectedProvider.display_name} has been successfully connected`);
        } finally {
            setConnecting(false);
        }
    };

    const resetFilters = () => {
        setSearchQuery("");
        setFilterFreeOnly(false);
        setSortBy("name");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Available AI Providers
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Connect to AI providers to power your chat widgets
                    </p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {filteredProviders.length} Available
                </Badge>
            </div>

            {/* Search and Filter Controls */}
            <Card className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search providers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            />
                        </div>

                        {/* Filters */}
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
                                className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="popularity">Sort by Popularity</option>
                                <option value="performance">Sort by Performance</option>
                            </select>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={resetFilters}
                                className="btn-hover-lift"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Connection Modal */}
            {selectedProvider && (
                <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg",
                                `bg-gradient-to-br ${getProviderGradient(selectedProvider.display_name)}`
                            )}>
                                <span>{getProviderIcon(selectedProvider.display_name)}</span>
                            </div>
                            <div>
                                <CardTitle className="text-lg">Connect to {selectedProvider.display_name}</CardTitle>
                                <CardDescription>Enter your API key to connect this provider</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                                        className="pr-12"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                                    >
                                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSelectedProvider(null);
                                    setApiKey("");
                                }}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConnect}
                                disabled={!apiKey.trim() || connecting}
                                className="flex-1 btn-hover-lift"
                            >
                                {connecting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-4 h-4 mr-2" />
                                        Connect
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Provider Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProviders.map((provider) => {
                    const providerGradient = getProviderGradient(provider.display_name);
                    const providerIcon = getProviderIcon(provider.display_name);
                    const isSelected = selectedProvider?.id === provider.id;

                    return (
                        <Card
                            key={provider.id}
                            className={cn(
                                "group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
                                "bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50",
                                "backdrop-blur-sm border-2 hover:border-violet-200 dark:hover:border-violet-800",
                                isSelected && "ring-2 ring-violet-500 border-violet-300 dark:border-violet-700 shadow-lg shadow-violet-500/20"
                            )}
                            onClick={() => setSelectedProvider(provider)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        {/* Provider Icon */}
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transition-transform duration-200 group-hover:scale-110",
                                            `bg-gradient-to-br ${providerGradient}`
                                        )}>
                                            <span>{providerIcon}</span>
                                        </div>

                                        <div className="flex-1">
                                            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                                                {provider.display_name}
                                            </CardTitle>
                                            <div className="flex items-center gap-2 mt-1">
                                                {provider.is_free && (
                                                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
                                                        <Star className="h-3 w-3 mr-1" />
                                                        Free
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Documentation Link */}
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
                                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>View documentation</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <CardDescription className="text-sm leading-relaxed line-clamp-2 mb-4">
                                    {provider.description || `Connect to ${provider.name} for AI capabilities`}
                                </CardDescription>

                                {/* Provider Features */}
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Cpu className="h-3 w-3" />
                                        <span>High Performance</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Shield className="h-3 w-3" />
                                        <span>Secure</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Globe className="h-3 w-3" />
                                        <span>Global</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        <span>Reliable</span>
                                    </div>
                                </div>

                                {/* Connect Button */}
                                <Button
                                    size="sm"
                                    className="w-full btn-hover-lift"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedProvider(provider);
                                    }}
                                >
                                    <Zap className="h-4 w-4 mr-2" />
                                    Connect Provider
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredProviders.length === 0 && (
                <Card className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/50 dark:to-gray-900/50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center mb-4">
                            <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No providers found
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
                            Try adjusting your search query or filters to find the providers you're looking for.
                        </p>
                        <Button
                            onClick={resetFilters}
                            variant="outline"
                            className="btn-hover-lift"
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset Filters
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AvailableProvidersSection; 
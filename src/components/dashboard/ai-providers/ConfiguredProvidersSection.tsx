import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    CheckCircle,
    Star,
    Settings,
    Trash2,
    Eye,
    EyeOff,
    Zap,
    AlertCircle,
    Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toastUtils } from "@/components/ui/use-toast";
import type { UserAIProvider } from "@/types/ai";

interface ConfiguredProvidersSectionProps {
    userProviders: UserAIProvider[];
    onUpdateProvider: (id: number, updates: Partial<UserAIProvider>) => Promise<void>;
    onDeleteProvider: (id: number) => Promise<void>;
    onRefresh: () => Promise<void>;
    loading?: boolean;
}

const getProviderIcon = (providerName: string) => {
    // Same icon mapping logic as original
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

const ConfiguredProvidersSection: React.FC<ConfiguredProvidersSectionProps> = ({
    userProviders,
    onUpdateProvider,
    onDeleteProvider,
    onRefresh,
    loading = false
}) => {
    const [showApiKeys, setShowApiKeys] = React.useState<Set<number>>(new Set());

    const toggleApiKeyVisibility = (providerId: number) => {
        setShowApiKeys(prev => {
            const newSet = new Set(prev);
            if (newSet.has(providerId)) {
                newSet.delete(providerId);
            } else {
                newSet.add(providerId);
            }
            return newSet;
        });
    };

    const handleProviderUpdate = async (providerId: number, updates: Partial<UserAIProvider>) => {
        try {
            await onUpdateProvider(providerId, updates);
            toastUtils.operationSuccess(
                "Provider Updated",
                "Provider settings have been updated successfully"
            );
        } catch (error: any) {
            toastUtils.operationError("Update Failed", error.message);
        }
    };

    const handleProviderDelete = async (providerId: number, providerName: string) => {
        if (window.confirm(`Are you sure you want to remove ${providerName}?`)) {
            try {
                await onDeleteProvider(providerId);
                toastUtils.operationSuccess(
                    "Provider Removed",
                    `${providerName} has been removed from your account`
                );
            } catch (error: any) {
                toastUtils.operationError("Removal Failed", error.message);
            }
        }
    };

    if (!userProviders?.length) {
        return (
            <Card className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/50 dark:to-gray-900/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4">
                        <Settings className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No Configured Providers
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
                        Connect your first AI provider to start building powerful chat widgets with AI capabilities.
                    </p>
                    <Button
                        onClick={onRefresh}
                        variant="outline"
                        className="btn-hover-lift"
                    >
                        <Zap className="h-4 w-4 mr-2" />
                        Connect Provider
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        My AI Providers
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Manage your connected AI providers and their settings
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {userProviders.length} Connected
                    </Badge>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onRefresh}
                        disabled={loading}
                        className="btn-hover-lift"
                    >
                        <Activity className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Provider Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProviders.map((userProvider) => {
                    const provider = userProvider.provider;
                    const providerGradient = getProviderGradient(provider?.display_name || "");
                    const providerIcon = getProviderIcon(provider?.display_name || "");
                    const showApiKey = showApiKeys.has(userProvider.id);

                    return (
                        <Card
                            key={userProvider.id}
                            className={cn(
                                "group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
                                "bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50",
                                "backdrop-blur-sm border-2",
                                userProvider.is_active
                                    ? "border-green-200 dark:border-green-800 shadow-green-100/50 dark:shadow-green-900/50"
                                    : "border-gray-200 dark:border-gray-700"
                            )}
                        >
                            {/* Status Indicator */}
                            <div className={cn(
                                "absolute top-0 left-0 w-full h-1",
                                userProvider.is_active
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                    : "bg-gradient-to-r from-gray-400 to-gray-500"
                            )} />

                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* Provider Icon */}
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transition-transform duration-200 group-hover:scale-110",
                                            `bg-gradient-to-br ${providerGradient}`
                                        )}>
                                            <span>{providerIcon}</span>
                                        </div>

                                        <div>
                                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {provider?.display_name || 'Unknown Provider'}
                                            </CardTitle>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge
                                                    variant="secondary"
                                                    className={cn(
                                                        "text-xs font-medium",
                                                        userProvider.test_status === 'success'
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                            : userProvider.test_status === 'failed'
                                                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                    )}
                                                >
                                                    {userProvider.test_status === 'success' ? (
                                                        <>
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Verified
                                                        </>
                                                    ) : userProvider.test_status === 'failed' ? (
                                                        <>
                                                            <AlertCircle className="h-3 w-3 mr-1" />
                                                            Failed
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Activity className="h-3 w-3 mr-1" />
                                                            Pending
                                                        </>
                                                    )}
                                                </Badge>
                                                {userProvider.is_default && (
                                                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs">
                                                        <Star className="h-3 w-3 mr-1" />
                                                        Default
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => toggleApiKeyVisibility(userProvider.id)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{showApiKey ? 'Hide' : 'Show'} API Key</p>
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleProviderDelete(userProvider.id, provider?.display_name || 'Provider')}
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Remove Provider</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* API Key Display */}
                                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">API Key</span>
                                    </div>
                                    <div className="font-mono text-sm text-gray-900 dark:text-gray-100">
                                        {showApiKey
                                            ? userProvider.api_key || '••••••••••••••••••'
                                            : '••••••••••••••••••'
                                        }
                                    </div>
                                </div>

                                {/* Provider Controls */}
                                <div className="space-y-3">
                                    {/* Active Status */}
                                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full transition-all duration-300",
                                                userProvider.is_active
                                                    ? "bg-emerald-500 shadow-lg shadow-emerald-500/50"
                                                    : "bg-gray-400"
                                            )} />
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                Active Status
                                            </span>
                                        </div>
                                        <Switch
                                            checked={userProvider.is_active}
                                            onCheckedChange={(checked) =>
                                                handleProviderUpdate(userProvider.id, { is_active: checked })
                                            }
                                            className="data-[state=checked]:bg-emerald-500"
                                        />
                                    </div>

                                    {/* Default Provider */}
                                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full transition-all duration-300",
                                                userProvider.is_default
                                                    ? "bg-amber-500 shadow-lg shadow-amber-500/50"
                                                    : "bg-gray-400"
                                            )} />
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                Default Provider
                                            </span>
                                        </div>
                                        <Switch
                                            checked={userProvider.is_default}
                                            onCheckedChange={(checked) =>
                                                handleProviderUpdate(userProvider.id, { is_default: checked })
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
    );
};

export default ConfiguredProvidersSection; 
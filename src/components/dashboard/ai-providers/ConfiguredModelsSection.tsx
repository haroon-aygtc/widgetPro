import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Brain,
    Star,
    Trash2,
    Activity,
    AlertCircle,
    CheckCircle,
    Cpu,
    Target,
    Plus,
    RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toastUtils } from "@/components/ui/use-toast";
import type { UserAIModel, AIModel, UserAIProvider } from "@/types/ai";

interface ConfiguredModelsSectionProps {
    userModels: UserAIModel[];
    userProviders: UserAIProvider[];
    availableModels: AIModel[];
    onUpdateModel: (id: number, updates: Partial<UserAIModel>) => Promise<void>;
    onDeleteModel: (id: number) => Promise<void>;
    onAddModel: (data: {
        model_id: number;
        user_provider_id: number;
        custom_name?: string;
    }) => Promise<void>;
    onLoadModelsForProvider: (providerId: number) => Promise<void>;
    onRefresh: () => Promise<void>;
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

const ConfiguredModelsSection: React.FC<ConfiguredModelsSectionProps> = ({
    userModels,
    userProviders,
    availableModels,
    onUpdateModel,
    onDeleteModel,
    onAddModel,
    onLoadModelsForProvider,
    onRefresh,
    loading = false
}) => {
    const [loadingProviders, setLoadingProviders] = React.useState<Set<number>>(new Set());

    const handleModelUpdate = async (modelId: number, updates: Partial<UserAIModel>) => {
        try {
            await onUpdateModel(modelId, updates);
            toastUtils.operationSuccess(
                "Model Updated",
                "Model settings have been updated successfully"
            );
        } catch (error: any) {
            toastUtils.operationError("Update Failed", error.message);
        }
    };

    const handleModelDelete = async (modelId: number, modelName: string) => {
        if (window.confirm(`Are you sure you want to remove ${modelName}?`)) {
            try {
                await onDeleteModel(modelId);
                toastUtils.operationSuccess(
                    "Model Removed",
                    `${modelName} has been removed from your collection`
                );
            } catch (error: any) {
                toastUtils.operationError("Removal Failed", error.message);
            }
        }
    };

    const handleLoadModels = async (providerId: number) => {
        setLoadingProviders(prev => new Set(prev).add(providerId));
        try {
            await onLoadModelsForProvider(providerId);
        } finally {
            setLoadingProviders(prev => {
                const newSet = new Set(prev);
                newSet.delete(providerId);
                return newSet;
            });
        }
    };

    // Group models by provider
    const modelsByProvider = React.useMemo(() => {
        const grouped: Record<string, {
            provider: UserAIProvider;
            models: UserAIModel[];
        }> = {};

        userModels.forEach(userModel => {
            const userProvider = userModel.user_provider;
            if (userProvider?.provider) {
                const key = userProvider.provider.id.toString();
                if (!grouped[key]) {
                    grouped[key] = {
                        provider: userProvider,
                        models: []
                    };
                }
                grouped[key].models.push(userModel);
            }
        });

        return grouped;
    }, [userModels]);

    if (!userModels?.length) {
        return (
            <Card className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/50 dark:to-gray-900/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4">
                        <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No Configured Models
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
                        Add AI models from your connected providers to start building intelligent chat widgets.
                    </p>
                    <Button
                        onClick={onRefresh}
                        variant="outline"
                        className="btn-hover-lift"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Models
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
                        onClick={onRefresh}
                        disabled={loading}
                        className="btn-hover-lift"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Models by Provider */}
            <div className="space-y-8">
                {Object.entries(modelsByProvider).map(([providerId, { provider, models }]) => {
                    const providerGradient = getProviderGradient(provider.provider?.display_name || "");
                    const providerIcon = getProviderIcon(provider.provider?.display_name || "");
                    const isLoadingModels = loadingProviders.has(provider.provider_id);

                    return (
                        <div key={providerId} className="space-y-4">
                            {/* Provider Header */}
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md",
                                        `bg-gradient-to-br ${providerGradient}`
                                    )}>
                                        <span>{providerIcon}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {provider.provider?.display_name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {models.length} model{models.length !== 1 ? 's' : ''} configured
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="secondary"
                                        className={cn(
                                            "text-xs",
                                            provider.is_active
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                                        )}
                                    >
                                        {provider.is_active ? "Active" : "Inactive"}
                                    </Badge>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleLoadModels(provider.provider_id)}
                                        disabled={isLoadingModels}
                                        className="btn-hover-lift"
                                    >
                                        {isLoadingModels ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                Loading...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Models
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Models Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {models.map((userModel) => {
                                    const model = userModel.model;
                                    if (!model) return null;

                                    return (
                                        <Card
                                            key={userModel.id}
                                            className={cn(
                                                "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
                                                "bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50",
                                                "backdrop-blur-sm border-2",
                                                userModel.is_active
                                                    ? "border-blue-200 dark:border-blue-800 shadow-blue-100/50 dark:shadow-blue-900/50"
                                                    : "border-gray-200 dark:border-gray-700"
                                            )}
                                        >
                                            {/* Status Indicator */}
                                            <div className={cn(
                                                "absolute top-0 left-0 w-full h-1",
                                                userModel.is_active
                                                    ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                                                    : "bg-gradient-to-r from-gray-400 to-gray-500"
                                            )} />

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
                                                                            <AlertCircle className="h-3 w-3 mr-1" />
                                                                            Inactive
                                                                        </>
                                                                    )}
                                                                </Badge>
                                                                {userModel.is_default && (
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
                                                                    onClick={() => handleModelDelete(userModel.id, userModel.custom_name || model.display_name)}
                                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Remove Model</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="space-y-4">
                                                {/* Model Info */}
                                                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
                                                    {model.context_window && (
                                                        <div className="flex items-center gap-1">
                                                            <Cpu className="h-3 w-3" />
                                                            <span>Context: {model.context_window.toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                    {model.max_tokens && (
                                                        <div className="flex items-center gap-1">
                                                            <Target className="h-3 w-3" />
                                                            <span>Max: {model.max_tokens.toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        <Activity className="h-3 w-3" />
                                                        <span>Provider: {provider.provider?.display_name}</span>
                                                    </div>
                                                    {model.is_free && (
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-3 w-3 text-green-600" />
                                                            <span className="text-green-600">Free</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Model Controls */}
                                                <div className="space-y-3">
                                                    {/* Active Status */}
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
                                                                handleModelUpdate(userModel.id, { is_active: checked })
                                                            }
                                                            className="data-[state=checked]:bg-blue-500"
                                                        />
                                                    </div>

                                                    {/* Default Model */}
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
                                                                handleModelUpdate(userModel.id, { is_default: checked })
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

                            {/* Available Models for this Provider */}
                            {availableModels.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Available Models from {provider.provider?.display_name}
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                        {availableModels
                                            .filter(model => !models.some(um => um.model_id === model.id))
                                            .map((model) => (
                                                <Card
                                                    key={model.id}
                                                    className="p-3 hover:shadow-md transition-shadow cursor-pointer border-dashed"
                                                    onClick={() => onAddModel({
                                                        model_id: model.id,
                                                        user_provider_id: provider.id,
                                                        custom_name: model.display_name
                                                    })}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                                                            <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                {model.display_name}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                Click to add
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ConfiguredModelsSection;

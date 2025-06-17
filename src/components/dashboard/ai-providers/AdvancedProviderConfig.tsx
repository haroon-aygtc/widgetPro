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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { UnifiedModal } from "@/components/ui/unified-modal";
import {
    CheckCircle2,
    AlertCircle,
    Key,
    Sparkles,
    Loader2,
    ExternalLink,
    Crown,
    Zap,
    Brain,
    Bot,
    Cpu,
    Database,
    Globe,
    Shield,
    TestTube,
    Link,
    ArrowRight,
    ArrowLeft,
    Settings,
    Eye,
    EyeOff,
    Copy,
    Check,
    Info,
    Lightbulb,
    Star,
    TrendingUp,
    Clock,
    DollarSign,
    Users,
    Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useOperationLoading } from "@/contexts/LoadingContext";
import { toastUtils } from "@/components/ui/use-toast";
import type { AIProvider, AIModel, UserAIProvider } from "@/types/ai";
import { aiProviderService } from "@/services/aiProviderService";

interface AdvancedProviderConfigProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    provider: AIProvider | null;
    onConfigured: (userProvider: UserAIProvider, models: AIModel[]) => void;
    userProviders: UserAIProvider[];
}

interface ConfigStep {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    isCompleted: boolean;
    isActive: boolean;
}

const AdvancedProviderConfig: React.FC<AdvancedProviderConfigProps> = ({
    isOpen,
    onOpenChange,
    provider,
    onConfigured,
    userProviders,
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [apiKey, setApiKey] = useState("");
    const [showApiKey, setShowApiKey] = useState(false);
    const [testResult, setTestResult] = useState<{
        success: boolean;
        message: string;
        models?: AIModel[];
        performance?: {
            latency: number;
            reliability: number;
            cost: string;
        };
    } | null>(null);
    const [selectedModels, setSelectedModels] = useState<number[]>([]);
    const [customSettings, setCustomSettings] = useState({
        enableAutoRetry: true,
        maxRetries: 3,
        timeout: 30,
        rateLimitBuffer: 10,
        enableCaching: true,
        customEndpoint: "",
        notes: "",
    });
    const [copied, setCopied] = useState(false);

    // Loading states
    const testLoading = useOperationLoading("test-provider-advanced");
    const configureLoading = useOperationLoading("configure-provider-advanced");

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
            case "together": case "together ai": return Link;
            case "replicate": return TestTube;
            case "openrouter": return Shield;
            default: return Bot;
        }
    };

    const getProviderFeatures = (providerName: string) => {
        const name = providerName?.toLowerCase() || "";
        switch (name) {
            case "openai":
                return {
                    strengths: ["Most popular", "Great documentation", "Reliable API"],
                    pricing: "Pay-per-use",
                    latency: "Low",
                    reliability: "99.9%",
                    specialties: ["Text generation", "Code completion", "Chat"],
                };
            case "anthropic":
                return {
                    strengths: ["Safety-focused", "Long context", "Constitutional AI"],
                    pricing: "Pay-per-use",
                    latency: "Medium",
                    reliability: "99.8%",
                    specialties: ["Safe AI", "Analysis", "Reasoning"],
                };
            case "google":
                return {
                    strengths: ["Multimodal", "Fast inference", "Free tier"],
                    pricing: "Freemium",
                    latency: "Low",
                    reliability: "99.7%",
                    specialties: ["Multimodal", "Search", "Translation"],
                };
            default:
                return {
                    strengths: ["AI capabilities", "API access", "Scalable"],
                    pricing: "Varies",
                    latency: "Medium",
                    reliability: "99%+",
                    specialties: ["AI models", "Text processing"],
                };
        }
    };

    const steps: ConfigStep[] = [
        {
            id: "overview",
            title: "Provider Overview",
            description: "Learn about this provider's capabilities",
            icon: Info,
            isCompleted: currentStep > 0,
            isActive: currentStep === 0,
        },
        {
            id: "credentials",
            title: "API Credentials",
            description: "Enter and test your API key",
            icon: Key,
            isCompleted: currentStep > 1 && testResult?.success,
            isActive: currentStep === 1,
        },
        {
            id: "models",
            title: "Select Models",
            description: "Choose which models to enable",
            icon: Brain,
            isCompleted: currentStep > 2 && selectedModels.length > 0,
            isActive: currentStep === 2,
        },
        {
            id: "settings",
            title: "Advanced Settings",
            description: "Configure provider-specific options",
            icon: Settings,
            isCompleted: currentStep > 3,
            isActive: currentStep === 3,
        },
        {
            id: "review",
            title: "Review & Configure",
            description: "Review and finalize your configuration",
            icon: CheckCircle2,
            isCompleted: false,
            isActive: currentStep === 4,
        },
    ];

    const isConfigured = provider ? userProviders.some(up => up.provider_id === provider.id) : false;

    useEffect(() => {
        if (isOpen && provider) {
            setCurrentStep(0);
            setApiKey("");
            setTestResult(null);
            setSelectedModels([]);
            setShowApiKey(false);
        }
    }, [isOpen, provider]);

    const handleTestApiKey = async () => {
        if (!provider || !apiKey.trim()) return;

        testLoading.start("Testing API connection...");
        try {
            const result = await aiProviderService.testApiKey(provider.id, apiKey);
            setTestResult(result);
            toastUtils.operationSuccess("API Test", "Connection successful!");
        } catch (error) {
            const errorResult = {
                success: false,
                message: "Invalid API key or connection failed",
            };
            setTestResult(errorResult);
            toastUtils.operationError("API Test", "Connection failed");
        } finally {
            testLoading.stop();
        }
    };

    const handleConfigure = async () => {
        if (!provider || !testResult?.success) return;

        configureLoading.start("Configuring provider...");
        try {
            const result = await aiProviderService.configureProvider(provider.id, apiKey);

            onConfigured(result.userProvider, result.availableModels || []);
            onOpenChange(false);
            toastUtils.operationSuccess("Configuration", `${provider.display_name} configured successfully!`);
        } catch (error) {
            toastUtils.operationError("Configuration", error instanceof Error ? error.message : "Failed to configure provider");
        } finally {
            configureLoading.stop();
        }
    };

    const copyApiKey = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toastUtils.operationSuccess("Copied", "API key copied to clipboard");
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 0: return true;
            case 1: return testResult?.success;
            case 2: return selectedModels.length > 0;
            case 3: return true;
            case 4: return true;
            default: return false;
        }
    };

    if (!provider) return null;

    const IconComponent = getProviderIcon(provider.display_name);
    const features = getProviderFeatures(provider.display_name);
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <UnifiedModal
            open={isOpen}
            onOpenChange={onOpenChange}
            title={`Configure ${provider.display_name}`}
            description={`Set up ${provider.display_name} for your AI-powered widgets`}
            type="dialog"
            size="xl"
            className="max-w-4xl max-h-[90vh] overflow-hidden"
        >
            <div className="flex flex-col h-full">
                {/* Progress Header */}
                <div className="border-b border-violet-200/50 dark:border-violet-800/50 pb-4 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-200/50 dark:border-violet-800/50">
                            <IconComponent className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-violet-700 dark:text-violet-300">
                                    {steps[currentStep].title}
                                </h3>
                                <span className="text-sm text-muted-foreground">
                                    Step {currentStep + 1} of {steps.length}
                                </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    </div>

                    {/* Step indicators */}
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                                    step.isCompleted
                                        ? "bg-green-500 border-green-500 text-white"
                                        : step.isActive
                                            ? "border-violet-500 bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400"
                                            : "border-gray-300 dark:border-gray-600 text-gray-400"
                                )}>
                                    {step.isCompleted ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        <step.icon className="h-4 w-4" />
                                    )}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={cn(
                                        "w-12 h-0.5 mx-2",
                                        step.isCompleted ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                                    )} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 overflow-auto">
                    {/* Step 0: Overview */}
                    {currentStep === 0 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-violet-200/50 dark:border-violet-800/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                                            <Star className="h-5 w-5" />
                                            Key Features
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {features.strengths.map((strength, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                <span className="text-sm">{strength}</span>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                <Card className="border-violet-200/50 dark:border-violet-800/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                                            <TrendingUp className="h-5 w-5" />
                                            Performance
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Pricing:</span>
                                            <Badge variant="outline">{features.pricing}</Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Latency:</span>
                                            <Badge variant="outline">{features.latency}</Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Reliability:</span>
                                            <Badge variant="outline">{features.reliability}</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="border-violet-200/50 dark:border-violet-800/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                                        <Lightbulb className="h-5 w-5" />
                                        Specialties
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {features.specialties.map((specialty, index) => (
                                            <Badge key={index} variant="secondary" className="bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300">
                                                {specialty}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {provider.description && (
                                <Alert className="border-violet-200/50 dark:border-violet-800/50">
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>About {provider.display_name}</AlertTitle>
                                    <AlertDescription>{provider.description}</AlertDescription>
                                </Alert>
                            )}

                            {isConfigured && (
                                <Alert className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertTitle className="text-green-800 dark:text-green-300">Already Configured</AlertTitle>
                                    <AlertDescription className="text-green-700 dark:text-green-400">
                                        This provider is already configured. You can reconfigure it or update settings.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}

                    {/* Step 1: Credentials */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <Card className="border-violet-200/50 dark:border-violet-800/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                                        <Key className="h-5 w-5" />
                                        API Credentials
                                    </CardTitle>
                                    <CardDescription>
                                        Enter your {provider.display_name} API key to establish connection
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="api-key" className="text-sm font-medium">
                                            API Key
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="api-key"
                                                type={showApiKey ? "text" : "password"}
                                                placeholder={`Enter your ${provider.display_name} API key`}
                                                value={apiKey}
                                                onChange={(e) => setApiKey(e.target.value)}
                                                className="pr-20 border-violet-200/60 dark:border-violet-800/60 focus:border-violet-400 dark:focus:border-violet-600"
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setShowApiKey(!showApiKey)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                                {apiKey && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={copyApiKey}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Your API key will be encrypted and stored securely.
                                            {provider.documentation_url && (
                                                <>
                                                    {" "}
                                                    <a
                                                        href={provider.documentation_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 underline inline-flex items-center gap-1"
                                                    >
                                                        Get your API key here
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </>
                                            )}
                                        </p>
                                    </div>

                                    <Button
                                        onClick={handleTestApiKey}
                                        disabled={!apiKey.trim() || testLoading.isLoading}
                                        className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                                    >
                                        {testLoading.isLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Testing Connection...
                                            </>
                                        ) : (
                                            <>
                                                <TestTube className="h-4 w-4 mr-2" />
                                                Test API Key
                                            </>
                                        )}
                                    </Button>

                                    {testResult && (
                                        <Alert
                                            variant={testResult.success ? "default" : "destructive"}
                                            className={testResult.success ? "border-green-200 bg-green-50/50 dark:bg-green-950/20" : ""}
                                        >
                                            {testResult.success ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <AlertCircle className="h-4 w-4" />
                                            )}
                                            <AlertTitle className={testResult.success ? "text-green-800 dark:text-green-300" : ""}>
                                                {testResult.success ? "Connection Successful!" : "Connection Failed"}
                                            </AlertTitle>
                                            <AlertDescription className={testResult.success ? "text-green-700 dark:text-green-400" : ""}>
                                                {testResult.message}
                                            </AlertDescription>

                                            {testResult.success && testResult.performance && (
                                                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-green-600" />
                                                        <span>Latency: {testResult.performance.latency}ms</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Activity className="h-4 w-4 text-green-600" />
                                                        <span>Reliability: {testResult.performance.reliability.toFixed(1)}%</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4 text-green-600" />
                                                        <span>Cost: {testResult.performance.cost}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Step 2: Models */}
                    {currentStep === 2 && testResult?.models && (
                        <div className="space-y-6">
                            <Card className="border-violet-200/50 dark:border-violet-800/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                                        <Brain className="h-5 w-5" />
                                        Available Models
                                    </CardTitle>
                                    <CardDescription>
                                        Select which models you want to enable for your widgets
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {testResult.models.map((model) => (
                                            <Card
                                                key={model.id}
                                                className={cn(
                                                    "cursor-pointer transition-all border-2",
                                                    selectedModels.includes(model.id)
                                                        ? "border-violet-500 bg-violet-50/50 dark:bg-violet-950/20"
                                                        : "border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700"
                                                )}
                                                onClick={() => {
                                                    setSelectedModels(prev =>
                                                        prev.includes(model.id)
                                                            ? prev.filter(id => id !== model.id)
                                                            : [...prev, model.id]
                                                    );
                                                }}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-violet-700 dark:text-violet-300">
                                                                {model.display_name}
                                                            </h4>
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {model.description}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                {model.is_free && (
                                                                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300">
                                                                        <Crown className="h-3 w-3 mr-1" />
                                                                        Free
                                                                    </Badge>
                                                                )}
                                                                <Badge variant="outline" className="text-xs">
                                                                    {provider.display_name}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        {selectedModels.includes(model.id) && (
                                                            <CheckCircle2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    {selectedModels.length > 0 && (
                                        <Alert className="mt-4 border-violet-200/50 bg-violet-50/50 dark:bg-violet-950/20">
                                            <CheckCircle2 className="h-4 w-4 text-violet-600" />
                                            <AlertTitle className="text-violet-800 dark:text-violet-300">
                                                {selectedModels.length} model{selectedModels.length > 1 ? 's' : ''} selected
                                            </AlertTitle>
                                            <AlertDescription className="text-violet-700 dark:text-violet-400">
                                                These models will be available for your AI widgets
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Step 3: Advanced Settings */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <Card className="border-violet-200/50 dark:border-violet-800/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                                        <Settings className="h-5 w-5" />
                                        Advanced Configuration
                                    </CardTitle>
                                    <CardDescription>
                                        Fine-tune provider settings for optimal performance
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="auto-retry" className="text-sm font-medium">
                                                    Enable Auto-Retry
                                                </Label>
                                                <Switch
                                                    id="auto-retry"
                                                    checked={customSettings.enableAutoRetry}
                                                    onCheckedChange={(checked) =>
                                                        setCustomSettings(prev => ({ ...prev, enableAutoRetry: checked }))
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">
                                                    Max Retries: {customSettings.maxRetries}
                                                </Label>
                                                <Slider
                                                    value={[customSettings.maxRetries]}
                                                    onValueChange={([value]) =>
                                                        setCustomSettings(prev => ({ ...prev, maxRetries: value }))
                                                    }
                                                    max={10}
                                                    min={1}
                                                    step={1}
                                                    className="w-full"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">
                                                    Timeout: {customSettings.timeout}s
                                                </Label>
                                                <Slider
                                                    value={[customSettings.timeout]}
                                                    onValueChange={([value]) =>
                                                        setCustomSettings(prev => ({ ...prev, timeout: value }))
                                                    }
                                                    max={120}
                                                    min={5}
                                                    step={5}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="caching" className="text-sm font-medium">
                                                    Enable Response Caching
                                                </Label>
                                                <Switch
                                                    id="caching"
                                                    checked={customSettings.enableCaching}
                                                    onCheckedChange={(checked) =>
                                                        setCustomSettings(prev => ({ ...prev, enableCaching: checked }))
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">
                                                    Rate Limit Buffer: {customSettings.rateLimitBuffer}%
                                                </Label>
                                                <Slider
                                                    value={[customSettings.rateLimitBuffer]}
                                                    onValueChange={([value]) =>
                                                        setCustomSettings(prev => ({ ...prev, rateLimitBuffer: value }))
                                                    }
                                                    max={50}
                                                    min={0}
                                                    step={5}
                                                    className="w-full"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="custom-endpoint" className="text-sm font-medium">
                                                    Custom Endpoint (Optional)
                                                </Label>
                                                <Input
                                                    id="custom-endpoint"
                                                    placeholder="https://api.custom-endpoint.com"
                                                    value={customSettings.customEndpoint}
                                                    onChange={(e) =>
                                                        setCustomSettings(prev => ({ ...prev, customEndpoint: e.target.value }))
                                                    }
                                                    className="border-violet-200/60 dark:border-violet-800/60"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notes" className="text-sm font-medium">
                                            Configuration Notes
                                        </Label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Add any notes about this configuration..."
                                            value={customSettings.notes}
                                            onChange={(e) =>
                                                setCustomSettings(prev => ({ ...prev, notes: e.target.value }))
                                            }
                                            className="border-violet-200/60 dark:border-violet-800/60"
                                            rows={3}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <Card className="border-violet-200/50 dark:border-violet-800/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                                        <CheckCircle2 className="h-5 w-5" />
                                        Configuration Summary
                                    </CardTitle>
                                    <CardDescription>
                                        Review your configuration before finalizing
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div>
                                                <h4 className="font-medium text-violet-700 dark:text-violet-300">Provider</h4>
                                                <p className="text-sm text-muted-foreground">{provider.display_name}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-violet-700 dark:text-violet-300">API Status</h4>
                                                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    Connected
                                                </Badge>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-violet-700 dark:text-violet-300">Selected Models</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedModels.length} model{selectedModels.length > 1 ? 's' : ''} selected
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <h4 className="font-medium text-violet-700 dark:text-violet-300">Auto-Retry</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {customSettings.enableAutoRetry ? `Enabled (${customSettings.maxRetries} retries)` : 'Disabled'}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-violet-700 dark:text-violet-300">Timeout</h4>
                                                <p className="text-sm text-muted-foreground">{customSettings.timeout} seconds</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-violet-700 dark:text-violet-300">Caching</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {customSettings.enableCaching ? 'Enabled' : 'Disabled'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {testResult?.models && selectedModels.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-violet-700 dark:text-violet-300 mb-2">Models to Configure</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {testResult.models
                                                    .filter(model => selectedModels.includes(model.id))
                                                    .map(model => (
                                                        <Badge key={model.id} variant="outline" className="bg-violet-50 dark:bg-violet-950/50">
                                                            {model.display_name}
                                                        </Badge>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Footer Navigation */}
                <div className="border-t border-violet-200/50 dark:border-violet-800/50 pt-4 mt-6">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className="border-violet-200 hover:border-violet-300 dark:border-violet-800 dark:hover:border-violet-700"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Previous
                        </Button>

                        <div className="flex items-center gap-2">
                            {currentStep < steps.length - 1 ? (
                                <Button
                                    onClick={nextStep}
                                    disabled={!canProceed()}
                                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                                >
                                    Next
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleConfigure}
                                    disabled={!canProceed() || configureLoading.isLoading}
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                                >
                                    {configureLoading.isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Configuring...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                            Complete Configuration
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </UnifiedModal>
    );
};

export default AdvancedProviderConfig; 
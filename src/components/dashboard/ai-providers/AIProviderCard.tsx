import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIProvider } from "@/types/ai";

interface AIProviderCardProps {
    provider: AIProvider;
    isSelected: boolean;
    isConfigured: boolean;
    onSelect: (provider: AIProvider) => void;
}

export const AIProviderCard = ({
    provider,
    isSelected,
    isConfigured,
    onSelect,
}: AIProviderCardProps) => {
    return (
        <Card
            key={provider.id}
            className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-lg",
                isSelected && "ring-2 ring-primary",
                isConfigured && "bg-green-50/50 border-green-200"
            )}
            onClick={() => onSelect(provider)}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {provider.display_name.charAt(0)}
                        </div>
                        <div>
                            <CardTitle className="text-lg">{provider.display_name}</CardTitle>
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
                                window.open(provider.documentation_url, "_blank");
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
};

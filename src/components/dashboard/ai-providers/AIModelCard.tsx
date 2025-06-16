import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, CheckCircle2 } from "lucide-react";
import type { AIModel } from "@/types/ai";

interface AIModelCardProps {
    model: AIModel;
    isAdded: boolean;
    isLoading: boolean;
    onAdd: () => void;
}

export const AIModelCard = ({ model, isAdded, isLoading, onAdd }: AIModelCardProps) => {
    return (
        <Card
            key={model.id}
            className={
                (model.is_free ? "border-green-200 bg-green-50/30 " : "") +
                (isAdded ? "bg-blue-50/50 border-blue-200 " : "") +
                "transition-all duration-200"
            }
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-base">{model.display_name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                            {model.is_free && (
                                <Badge
                                    variant="secondary"
                                    className="bg-green-100 text-green-800 text-xs"
                                >
                                    Free
                                </Badge>
                            )}
                            {isAdded && (
                                <Badge variant="default" className="text-xs">
                                    Added
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <CardDescription className="text-sm">{model.description}</CardDescription>
                {(model.max_tokens || model.context_window) && (
                    <div className="mt-2 text-xs text-muted-foreground">
                        {model.max_tokens && `Max tokens: ${model.max_tokens.toLocaleString()}`}
                        {model.context_window && ` • Context: ${model.context_window.toLocaleString()}`}
                    </div>
                )}
            </CardContent>
            <CardFooter className="pt-0">
                <Button size="sm" onClick={onAdd} disabled={isAdded || isLoading} className="w-full">
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : isAdded ? (
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                    ) : (
                        <Plus className="h-4 w-4 mr-2" />
                    )}
                    {isAdded ? "Added" : "Add Model"}
                </Button>
            </CardFooter>
        </Card>
    );
};

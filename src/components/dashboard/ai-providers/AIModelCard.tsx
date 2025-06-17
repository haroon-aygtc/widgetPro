import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Plus,
  CheckCircle2,
  Star,
  Zap,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIModel } from "@/types/ai";

interface AIModelCardProps {
  model: AIModel;
  isAdded: boolean;
  isLoading: boolean;
  onAdd: () => void;
}

export const AIModelCard = ({
  model,
  isAdded,
  isLoading,
  onAdd,
}: AIModelCardProps) => {
  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-md border-2",
        model.is_free &&
          "border-green-200 bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10 hover:shadow-green-500/10",
        isAdded &&
          "bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/10 border-blue-200 dark:border-blue-800",
        !model.is_free &&
          !isAdded &&
          "hover:border-violet-200 dark:hover:border-violet-800 hover:shadow-violet-500/5",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {model.display_name}
              </CardTitle>
              {model.is_free && (
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {model.is_free && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 border-green-200 text-xs font-medium dark:bg-green-950/50 dark:text-green-300 dark:border-green-800"
                >
                  <DollarSign className="h-3 w-3 mr-1" />
                  Free
                </Badge>
              )}
              {isAdded && (
                <Badge
                  variant="default"
                  className="text-xs bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Added
                </Badge>
              )}
              {!model.is_free && (
                <Badge
                  variant="outline"
                  className="text-xs text-gray-600 dark:text-gray-400"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <CardDescription className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {model.description ||
            "Advanced AI model for various tasks and applications."}
        </CardDescription>
        {(model.max_tokens || model.context_window) && (
          <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <div className="text-xs text-muted-foreground space-y-1">
              {model.max_tokens && (
                <div className="flex items-center justify-between">
                  <span>Max tokens:</span>
                  <span className="font-medium">
                    {model.max_tokens.toLocaleString()}
                  </span>
                </div>
              )}
              {model.context_window && (
                <div className="flex items-center justify-between">
                  <span>Context window:</span>
                  <span className="font-medium">
                    {model.context_window.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          size="sm"
          onClick={onAdd}
          disabled={isAdded || isLoading}
          className={cn(
            "w-full transition-all duration-200",
            model.is_free &&
              !isAdded &&
              "bg-green-600 hover:bg-green-700 text-white",
            isAdded &&
              "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-950/70",
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : isAdded ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Added to Collection
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              {model.is_free ? "Add Free Model" : "Add Model"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, Search, AlertCircle } from "lucide-react";
import type { ModelsTabProps } from "@/types/ai";
import { AIModelCard } from "./AIModelCard";



export const ModelsTab = ({
  availableModels,
  userModels,
  userProviders,
  modelSearchTerm,
  loading,
  addModelLoading,
  onSearch,
  onLoadModels,
  onAddModel,
}: ModelsTabProps) => {
  const isModelAdded = (modelId: number) =>
    userModels.some((m) => m.model_id === modelId);

  const filteredModels = availableModels.filter((model) => {
    return (
      !modelSearchTerm ||
      model.display_name.toLowerCase().includes(modelSearchTerm.toLowerCase()) ||
      model.description?.toLowerCase().includes(modelSearchTerm.toLowerCase())
    );
  });

  const sortedModels = filteredModels.sort((a, b) => {
    if (a.is_free && !b.is_free) return -1;
    if (!a.is_free && b.is_free) return 1;
    return a.display_name.localeCompare(b.display_name);
  });

  return (
    <div className="space-y-6">
      {userProviders.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Providers Configured</AlertTitle>
          <AlertDescription>
            Please configure at least one AI provider first to access models.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Provider Selection */}
          <div className="flex flex-wrap gap-2">
            {userProviders.map((provider) => (
              <Button
                key={provider.id}
                variant="outline"
                onClick={() => onLoadModels(provider.provider_id)}
              >
                {provider.provider?.display_name}
                <Badge variant="secondary" className="text-xs ml-2">
                  {provider.provider?.is_free ? "Free" : "Paid"}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Model Search */}
          {availableModels.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search models..."
                value={modelSearchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {/* Models Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading models...</span>
            </div>
          ) : sortedModels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedModels.map((model) => (
                <AIModelCard
                  key={model.id}
                  model={model}
                  isAdded={isModelAdded(model.id)}
                  onAdd={() => onAddModel(model)}
                  isLoading={addModelLoading}
                />
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Models Available</AlertTitle>
              <AlertDescription>
                Click on a provider above to load available models.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

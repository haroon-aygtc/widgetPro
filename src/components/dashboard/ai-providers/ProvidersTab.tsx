import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Search, Key, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIProvider, UserAIProvider, AIProviderTestResponse } from "@/types/ai";

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
}) => {
  const filtered = providers.filter((provider) => {
    const matchSearch = provider.display_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const selectedProvider = providers.find((p) => p.id === selectedProviderId);
  const isConfigured = (id: number) => userProviders.some((up) => up.provider_id === id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search providers..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex-1">Search</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((provider) => {
          const configured = isConfigured(provider.id);
          const selected = selectedProviderId === provider.id;
          return (
            <Card
              key={provider.id}
              onClick={() => onSelectProvider(provider)}
              className={cn("cursor-pointer transition", selected && "ring-2 ring-primary", configured && "border-green-300 bg-green-50")}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{provider.display_name}</CardTitle>
                {provider.documentation_url && (
                  <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); window.open(provider.documentation_url, "_blank"); }}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{provider.description}</p>
                <div className="flex gap-2">
                  {configured && <Badge variant="default">Configured</Badge>}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedProvider && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Configure {selectedProvider.display_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder={`Enter your ${selectedProvider.display_name} API key`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            {testResult && (
              <Alert variant={testResult.success ? "default" : "destructive"}>
                {testResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{testResult.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{testResult.message}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end space-x-2">
              <Button onClick={onTestApiKey}>Test API Key</Button>
              <Button disabled={!testResult?.success} onClick={onConfigure}>
                Configure Provider
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

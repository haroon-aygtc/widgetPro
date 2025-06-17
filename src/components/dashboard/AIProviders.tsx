// File: components/ai/AIProviders/index.tsx

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAIProviders } from "@/hooks/useAIProviders";
import { ProvidersTab } from "@/components/dashboard/ai-providers/ProvidersTab";
import { ModelsTab } from "@/components/dashboard/ai-providers/AITabViews";
import { ConfiguredList } from "@/components/dashboard/ai-providers/ConfiguredList";
import { SkeletonGrid } from "@/components/ui/SkeletonCardGrid";
import type {
  AIProvider,
  AIModel,
  UserAIProvider,
  ConfiguredProvidersTabProps,
} from "@/types/ai";

const AIProviders = () => {
  const [activeTab, setActiveTab] = useState("providers");
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(
    null,
  );
  const [apiKey, setApiKey] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const {
    providers,
    userProviders,
    userModels,
    availableModels,
    testResult,
    loadProviders,
    testApiKey,
    configureProvider,
    loadModelsForProvider,
    addUserModel,
    loading,
    loadUserProviders,
    loadUserModels,
  } = useAIProviders();

  useEffect(() => {
    loadProviders(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    loadUserProviders();
  }, []);

  const handleTestApiKey = async () => {
    if (!selectedProvider || !apiKey.trim()) return;
    try {
      await testApiKey(selectedProvider.id, apiKey);
    } catch (error) {
      console.error("Error testing API key:", error);
    }
  };

  const handleConfigure = async () => {
    if (!selectedProvider || !testResult?.success) return;
    try {
      await configureProvider(selectedProvider.id, apiKey);
      // Reset API key after successful configuration
      setApiKey("");
      // Refresh user providers list
      await loadUserProviders();
    } catch (error) {
      console.error("Error configuring provider:", error);
      throw error; // Re-throw to handle in ProvidersTab
    }
  };

  const handleAddModel = async (model: AIModel) => {
    const userProvidersArray = Array.isArray(userProviders)
      ? userProviders
      : [];
    const provider = userProvidersArray.find(
      (p) => p.provider_id === model.provider_id,
    );
    if (!provider) {
      console.error("Provider not found for model:", model);
      return;
    }
    try {
      await addUserModel(model.id, provider.id);
      // Refresh user models list
      await loadUserModels();
    } catch (error) {
      console.error("Error adding model:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-violet-700 dark:text-violet-300 mb-2">
          AI Providers
        </h1>
        <p className="text-muted-foreground">
          Connect and manage AI providers to power your widgets with advanced
          language models
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-violet-50/50 dark:bg-violet-950/50 border border-violet-200/50 dark:border-violet-800/50">
          <TabsTrigger
            value="providers"
            className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
          >
            Providers
          </TabsTrigger>
          <TabsTrigger
            value="user-providers"
            className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
          >
            User Providers
          </TabsTrigger>
          <TabsTrigger
            value="models"
            className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
          >
            Models
          </TabsTrigger>
          <TabsTrigger
            value="configured"
            className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
          >
            My Setup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="providers">
          {loading.loadProvidersLoading.isLoading ? (
            <SkeletonGrid count={6} />
          ) : (
            <ProvidersTab
              providers={Array.isArray(providers) ? providers : []}
              userProviders={Array.isArray(userProviders) ? userProviders : []}
              selectedProviderId={selectedProvider?.id}
              onSelectProvider={setSelectedProvider}
              searchTerm={searchTerm}
              loading={loading.loadProvidersLoading.isLoading}
              onSearch={setSearchTerm}
              apiKey={apiKey}
              setApiKey={setApiKey}
              testResult={testResult}
              onTestApiKey={handleTestApiKey}
              onConfigure={handleConfigure}
              testKeyLoading={loading.testKeyLoading.isLoading}
              configureLoading={loading.configureLoading.isLoading}
              availableModels={availableModels}
              onLoadModels={loadModelsForProvider}
              onAddModel={handleAddModel}
              addModelLoading={loading.addModelLoading.isLoading}
              userModels={userModels}
            />
          )}
        </TabsContent>

        <TabsContent value="user-providers">
          {!Array.isArray(userProviders) || userProviders.length === 0 ? (
            <SkeletonGrid count={6} />
          ) : (
            <div>
              <h1>User Providers</h1>
              {userProviders.map((provider) => (
                <div key={provider.id}>
                  <h2>{provider.provider.name}</h2>
                  <p>{provider.provider.description}</p>
                  <p>{provider.provider.api_base_url}</p>
                  <p>{provider.provider.is_free ? "Free" : "Paid"}</p>
                  <p>{provider.provider.is_active ? "Active" : "Inactive"}</p>
                  <p>{provider.provider.logo_url}</p>
                  <p>{provider.provider.documentation_url}</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="models">
          {loading.loadModelsLoading.isLoading ? (
            <SkeletonGrid count={6} />
          ) : (
            <ModelsTab
              availableModels={availableModels}
              userModels={userModels}
              modelSearchTerm={modelSearchTerm}
              userProviders={Array.isArray(userProviders) ? userProviders : []}
              loading={loading.loadModelsLoading.isLoading}
              onSearch={setModelSearchTerm}
              onLoadModels={loadModelsForProvider}
              onAddModel={handleAddModel}
              addModelLoading={loading.addModelLoading.isLoading}
            />
          )}
        </TabsContent>

        <TabsContent value="configured">
          <ConfiguredList
            userProviders={Array.isArray(userProviders) ? userProviders : []}
            userModels={userModels}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIProviders;

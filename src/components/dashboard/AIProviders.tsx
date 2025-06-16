// File: components/ai/AIProviders/index.tsx

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAIProviders } from "@/hooks/useAIProviders";
import { ProvidersTab } from "@/components/dashboard/ai-providers/ProvidersTab";
import { ModelsTab } from "@/components/dashboard/ai-providers/AITabViews";
import { ConfiguredList } from "@/components/dashboard/ai-providers/ConfiguredList";
import { SkeletonGrid } from "@/components/ui/SkeletonCardGrid";
import type { AIProvider, AIModel, UserAIProvider, ConfiguredProvidersTabProps } from "@/types/ai";

const AIProviders = () => {
  const [activeTab, setActiveTab] = useState("providers");
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(null);
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
  } = useAIProviders();

  useEffect(() => {
    loadProviders(searchTerm);
  }, [searchTerm]);


  useEffect(() => {
    loadUserProviders();
  }, []);

  const handleTestApiKey = async () => {
    if (!selectedProvider || !apiKey.trim()) return;
    await testApiKey(selectedProvider.id, apiKey);
  };

  const handleConfigure = async () => {
    if (!selectedProvider || !testResult?.success) return;
    await configureProvider(selectedProvider.id, apiKey);
    setApiKey("");
    setSelectedProvider(null);
    setActiveTab("models");
  };

  const handleAddModel = async (model: AIModel) => {
    const provider = userProviders.find((p) => p.provider_id === model.provider_id);
    if (!provider) return;
    await addUserModel(model.id, provider.id);
  };

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="user-providers">User Providers</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="configured">My Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="providers">
          {loading.loadProvidersLoading.isLoading ? (
            <SkeletonGrid count={6} />
          ) : (
            <ProvidersTab
              providers={Array.isArray(providers) ? providers : []}
              userProviders={userProviders}
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
            />
          )}
        </TabsContent>

        <TabsContent value="user-providers">
          {userProviders.length === 0 ? (
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
              userProviders={userProviders}
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
            userProviders={userProviders}
            userModels={userModels}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIProviders;

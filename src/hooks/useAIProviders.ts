import { useEffect, useState } from "react";
import { aiProviderService } from "@/services/aiProviderService";
import { toastUtils } from "@/components/ui/use-toast";
import { useOperationLoading } from "@/contexts/LoadingContext";
import type {
  AIProvider,
  AIModel,
  UserAIModel,
  UserAIProvider,
} from "@/types/ai";

export function useAIProviders() {
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [userProviders, setUserProviders] = useState<UserAIProvider[]>([]);
  const [userModels, setUserModels] = useState<UserAIModel[]>([]);
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    models?: AIModel[];
  } | null>(null);

  const loadProvidersLoading = useOperationLoading("load-providers");
  const testKeyLoading = useOperationLoading("test-api-key");
  const configureLoading = useOperationLoading("configure-provider");
  const loadModelsLoading = useOperationLoading("load-models");
  const addModelLoading = useOperationLoading("add-model");
  const addProviderLoading = useOperationLoading("add-provider");
  const updateProviderLoading = useOperationLoading("update-provider");
  useEffect(() => {
    loadProviders();
    loadUserProviders();
    loadUserModels();
  }, []);

  const loadProviders = async (searchTerm = "") => {
    loadProvidersLoading.start("Loading AI providers...");
    try {
      const data = await aiProviderService.getProviders(searchTerm);
      setProviders(data);
    } catch {
      toastUtils.operationError("Loading providers", "Failed to load providers");
    } finally {
      loadProvidersLoading.stop();
    }
  };

  const loadUserProviders = async () => {
    try {
      const data = await aiProviderService.getUserProviders();
      setUserProviders(data);
    } catch {
      toastUtils.operationError(
        "Loading user providers",
        "Failed to load user providers",
      );
    }
  };

  const loadUserModels = async () => {
    try {
      const data = await aiProviderService.getUserModels();
      setUserModels(data);
    } catch {
      toastUtils.operationError(
        "Loading user models",
        "Failed to load user models",
      );
    }
  };

  const testApiKey = async (providerId: number, apiKey: string) => {
    testKeyLoading.start("Testing API key...");
    try {
      const result = await aiProviderService.testApiKey(providerId, apiKey);
      setTestResult(result);
      return result;
    } catch {
      toastUtils.operationError(
        "API key test",
        "Failed to test API key",
      );
      setTestResult({ success: false, message: "API key test failed" });
      return { success: false, message: "API key test failed" };
    } finally {
      testKeyLoading.stop();
    }
  };

  const configureProvider = async (providerId: number, apiKey: string) => {
    configureLoading.start("Configuring provider and fetching models...");
    try {
      const { userProvider, availableModels } =
        await aiProviderService.configureProvider(providerId, apiKey);

      // Update user providers state
      setUserProviders((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return [
          ...prevArray.filter((p) => p.provider_id !== providerId),
          userProvider,
        ];
      });

      // Set available models
      setAvailableModels(availableModels);
      setTestResult(null);

      toastUtils.operationSuccess(
        "Provider configured successfully!",
        `Found ${availableModels.length} available models.`,
      );

      // Return the configured provider and models for immediate use
      return { userProvider, availableModels };
    } catch (error) {
      console.error("Error configuring provider:", error);
      toastUtils.operationError(
        "Provider configuration",
        "Failed to configure provider",
      );
      throw error; // Re-throw to handle in component
    } finally {
      configureLoading.stop();
    }
  };

  const loadModelsForProvider = async (providerId: number) => {
    loadModelsLoading.start("Loading models...");
    try {
      // Use the new provider-specific method that validates user access
      const models = await aiProviderService.getAvailableModelsForProvider(providerId);
      setAvailableModels(models);
      toastUtils.operationSuccess(
        "Models loaded successfully!",
        `Found ${models.length} available models.`,
      );
    } catch (error: any) {
      console.error("Error loading models:", error);
      toastUtils.operationError(
        "Loading models",
        error.message || "Failed to load models",
      );
    } finally {
      loadModelsLoading.stop();
    }
  };

  const addUserModel = async (data: {
    model_id: number;
    user_provider_id: number;
    custom_name?: string;
    is_active?: boolean;
    is_default?: boolean;
  }) => {
    addModelLoading.start("Adding model...");
    try {
      const userModel = await aiProviderService.addUserModel(data);
      setUserModels((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return [...prevArray.filter((m) => m.model_id !== data.model_id), userModel];
      });

      // Find the model name for the toast
      const model = availableModels.find((m) => m.id === data.model_id);
      const modelName = model?.display_name || "Model";

      toastUtils.operationSuccess(
        "Model added successfully!",
        `${modelName} is now available in your collection.`,
      );

      return userModel;
    } catch (error: any) {
      console.error("Error adding model:", error);
      toastUtils.operationError(
        "Failed to add model",
        error.message || "Please try again.",
      );
      throw error;
    } finally {
      addModelLoading.stop();
    }
  };

  const addUserProvider = async (providerId: number, apiKey: string) => {
    addProviderLoading.start("Adding provider...");
    try {
      const userProvider = await aiProviderService.addUserProvider(
        providerId,
        apiKey,
      );
      setUserProviders((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return [...prevArray, userProvider];
      });
    } catch {
      toastUtils.operationError(
        "Adding provider",
        "Failed to add provider",
      );
    } finally {
      addProviderLoading.stop();
    }
  };

  const updateUserProvider = async (
    providerId: number,
    data: { api_key?: string; is_active?: boolean; is_default?: boolean },
  ) => {
    updateProviderLoading.start("Updating provider...");
    try {
      const updatedProvider = await aiProviderService.updateUserProvider(providerId, data);
      setUserProviders((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.map((p) =>
          p.id === providerId ? { ...p, ...updatedProvider } : p
        );
      });
      toastUtils.operationSuccess(
        "Provider updated successfully!",
        "Provider updated successfully!",
      );
      return updatedProvider;
    } catch (error: any) {
      toastUtils.operationError(
        "Updating provider",
        "Failed to update provider",
      );
      throw error;
    } finally {
      updateProviderLoading.stop();
    }
  };

  return {
    providers,
    userProviders,
    userModels,
    availableModels,
    testResult,
    loadProviders,
    loadUserProviders,
    loadUserModels,
    testApiKey,
    configureProvider,
    loadModelsForProvider,
    addUserModel,
    addUserProvider,
    updateUserProvider,
    loading: {
      loadProvidersLoading,
      testKeyLoading,
      configureLoading,
      loadModelsLoading,
      addModelLoading,
      addProviderLoading,
      updateProviderLoading,
    },
  };
}

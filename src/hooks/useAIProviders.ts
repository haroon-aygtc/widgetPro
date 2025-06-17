import { useEffect, useState } from "react";
import { aiProviderService } from "@/services/aiProviderService";
import { toastUtils } from "@/components/ui/use-toast";
import { useOperationLoading } from "@/contexts/LoadingContext";
import type {
  AIProvider,
  AIModel,
  UserAIModel,
  UserAIProvider,
  CreateUserModelRequest,
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
      toastUtils.operationError("Loading providers");
    } finally {
      loadProvidersLoading.stop();
    }
  };

  const loadUserProviders = async () => {
    try {
      const data = await aiProviderService.getUserProviders();
      setUserProviders(data);
    } catch {
      toastUtils.operationError("Loading user providers");
    }
  };

  const loadUserModels = async () => {
    try {
      const data = await aiProviderService.getUserModels();
      setUserModels(data);
    } catch {
      toastUtils.operationError("Loading user models");
    }
  };

  const testApiKey = async (providerId: number, apiKey: string) => {
    testKeyLoading.start("Testing API key...");
    try {
      const result = await aiProviderService.testApiKey(providerId, apiKey);
      setTestResult(result);
      return result;
    } catch {
      toastUtils.operationError("API key test");
      setTestResult({ success: false, message: "API key test failed" });
      return { success: false, message: "API key test failed" };
    } finally {
      testKeyLoading.stop();
    }
  };

  const configureProvider = async (providerId: number, apiKey: string) => {
    configureLoading.start("Configuring provider...");
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

      setAvailableModels(availableModels);
      setTestResult(null);

      toastUtils.operationSuccess(
        "Provider configured successfully!",
        "Available models loaded.",
      );

      // Return the configured provider for immediate use
      return { userProvider, availableModels };
    } catch (error) {
      console.error("Error configuring provider:", error);
      toastUtils.operationError("Provider configuration");
      throw error; // Re-throw to handle in component
    } finally {
      configureLoading.stop();
    }
  };

  const loadModelsForProvider = async (providerId: number, search = "") => {
    loadModelsLoading.start("Loading models...");
    try {
      // Find the user provider for this provider ID
      const userProvidersArray = Array.isArray(userProviders)
        ? userProviders
        : [];
      const userProvider = userProvidersArray.find(
        (p) => p.provider_id === providerId,
      );

      if (!userProvider) {
        throw new Error(
          "Provider not configured. Please configure the provider first.",
        );
      }

      const { models } = await aiProviderService.fetchModelsForProvider(
        providerId,
        userProvider.api_key,
        search,
      );
      setAvailableModels(models);
      toastUtils.operationSuccess(
        "Models loaded successfully!",
        `Found ${models.length} available models.`,
      );
    } catch (error: any) {
      console.error("Error loading models:", error);
      toastUtils.operationError("Loading models", error.message);
    } finally {
      loadModelsLoading.stop();
    }
  };

  const addUserModel = async (data: CreateUserModelRequest) => {
    addModelLoading.start("Adding model...");
    try {
      const response = await aiProviderService.addUserModel(data);
      toastUtils.operationSuccess("Model Added", "Model added successfully.");
    } catch (err: any) {
        toastUtils.operationError("Failed to Add Model", err.message);
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
      toastUtils.operationError("Adding provider");
    } finally {
      addProviderLoading.stop();
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
    loading: {
      loadProvidersLoading,
      testKeyLoading,
      configureLoading,
      loadModelsLoading,
      addModelLoading,
      addProviderLoading,
    },
  };
}

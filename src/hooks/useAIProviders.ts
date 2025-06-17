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
      setUserProviders((prev) => [
        ...prev.filter((p) => p.provider_id !== providerId),
        userProvider,
      ]);
      setAvailableModels(availableModels);
      setTestResult(null);
      toastUtils.success(
        "Provider configured successfully! Available models loaded.",
      );
    } catch (error) {
      toastUtils.operationError("Provider configuration");
      throw error; // Re-throw to handle in component
    } finally {
      configureLoading.stop();
    }
  };

  const loadModelsForProvider = async (providerId: number, search = "") => {
    loadModelsLoading.start("Loading models...");
    try {
      const { models } = await aiProviderService.fetchModelsForProvider(
        providerId,
        search,
      );
      setAvailableModels(models);
    } catch {
      toastUtils.operationError("Loading models");
    } finally {
      loadModelsLoading.stop();
    }
  };

  const addUserModel = async (modelId: number, userProviderId: number) => {
    addModelLoading.start("Adding model...");
    try {
      const userModel = await aiProviderService.addUserModel(
        modelId,
        userProviderId,
      );
      setUserModels((prev) => [
        ...prev.filter((m) => m.model_id !== modelId),
        userModel,
      ]);
      toastUtils.success("Model added to your collection!");
    } catch {
      toastUtils.operationError("Adding model");
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
      setUserProviders((prev) => [...prev, userProvider]);
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

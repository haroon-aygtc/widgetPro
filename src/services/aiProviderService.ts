import type {
  AIProvider,
  AIModel,
  UserAIProvider,
  UserAIModel,
} from "@/types/ai";
import { aiProviderApi } from "@/lib/api/aiproviderAPI";

class AIProviderService {
  async getProviders(search?: string): Promise<AIProvider[]> {
    const response = await aiProviderApi.getProviders(search);
    // Handle paginated response structure: response.data.data contains the actual providers array
    return response.data?.data || [];
  }

  async testApiKey(
    providerId: number,
    apiKey: string,
  ): Promise<{ success: boolean; message: string; models?: AIModel[] }> {
    try {
      const response = await aiProviderApi.testProvider({
        provider_id: providerId,
        api_key: apiKey,
      });
      return {
        success: response.data?.success || false,
        message: response.data?.message || "",
        models: response.data?.models,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "API key test failed",
      };
    }
  }

  async configureProvider(
    providerId: number,
    apiKey: string,
  ): Promise<{
    userProvider: UserAIProvider;
    availableModels: AIModel[];
  }> {
    const response = await aiProviderApi.configureProvider({
      provider_id: providerId,
      api_key: apiKey,
    });

    return {
      userProvider: response.data!.user_provider,
      availableModels: response.data!.available_models,
    };
  }

  async getUserProviders(): Promise<UserAIProvider[]> {
    const response = await aiProviderApi.getUserProviders();
    return response.data || [];
  }

  async getUserModels(): Promise<UserAIModel[]> {
    const response = await aiProviderApi.getUserModels();
    return response.data || [];
  }

  async fetchModelsForProvider(
    providerId: number,
    apiKey: string,
    search?: string,
  ): Promise<{ models: AIModel[]; provider: AIProvider }> {
    const response = await aiProviderApi.fetchModelsForProvider(providerId, {
      api_key: apiKey,
      search,
    });
    return response.data!;
  }

  async addUserModel(
    modelId: number,
    userProviderId: number,
    customName?: string,
  ): Promise<UserAIModel> {
    const response = await aiProviderApi.addUserModel({
      model_id: modelId,
      user_provider_id: userProviderId,
      custom_name: customName,
    });
    return response.data!;
  }

  async deleteUserProvider(providerId: number): Promise<void> {
    await aiProviderApi.deleteUserProvider(providerId);
  }

  async updateUserProvider(
    providerId: number,
    apiKey: string,
  ): Promise<UserAIProvider> {
    const response = await aiProviderApi.updateUserProvider(providerId, apiKey);
    return response;
  }

  async updateUserModel(
    modelId: number,
    customName?: string,
  ): Promise<UserAIModel> {
    const response = await aiProviderApi.updateUserModel(modelId, customName);
    return response;
  }

  async addUserProvider(
    providerId: number,
    apiKey: string,
  ): Promise<UserAIProvider> {
    const response = await aiProviderApi.addUserProvider(providerId, apiKey);
    return response;
  }
}

export const aiProviderService = new AIProviderService();

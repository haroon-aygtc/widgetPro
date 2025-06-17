import type {
  AIProvider,
  AIModel,
  UserAIProvider,
  UserAIModel,
  ConfiguredProviderResponse,
  CreateUserModelRequest,
} from "@/types/ai";
import { aiProviderApi } from "@/lib/api/aiproviderAPI";

class AIProviderService {
  async getProviders(search?: string): Promise<AIProvider[]> {
    const response = await aiProviderApi.getProviders(search);
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
        success: response.success || false,
        message: response.message || "",
        models: response.success ? response.data?.models : undefined,
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
  ): Promise<ConfiguredProviderResponse> {
    try {
      const response = await aiProviderApi.configureProvider({
        provider_id: providerId,
        api_key: apiKey,
      });

      console.log("Configure Provider Response:", response);

      if (response.success && response.data) {
        return {
          userProvider: response.data.user_provider,
          availableModels: response.data.available_models,
        };
      } else {
        throw new Error(response.message || "Failed to configure provider");
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to configure provider",
      );
    }
  }

  async getUserProviders(): Promise<UserAIProvider[]> {
    try {
      const response = await aiProviderApi.getUserProviders();
      return response.data || [];
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to get user providers",
      );
    }
  }

  async getUserModels(): Promise<UserAIModel[]> {
    try {
      const response = await aiProviderApi.getUserModels();
      return response.data || [];
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to get user models",
      );
    }
  }

  async fetchModelsForProvider(
    providerId: number,
    apiKey: string,
    search?: string,
  ): Promise<{ models: AIModel[]; provider: AIProvider }> {
    try {
      const response = await aiProviderApi.fetchModelsForProvider(providerId, {
        api_key: apiKey,
        search,
      });
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch models");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch models";
      console.error("Error fetching models:", errorMessage);
      throw new Error(errorMessage);
    }
  }

  async addUserModel(
    data: CreateUserModelRequest,
  ): Promise<UserAIModel> {
    try {
      const response = await aiProviderApi.addUserModel(data);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to add user model");
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || "Failed to add user model"
      );
    }
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
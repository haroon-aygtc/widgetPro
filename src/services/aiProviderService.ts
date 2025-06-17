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

      // Laravel controller returns: {success: boolean, message: string, data: {...}}
      // For success: data contains {models: [...], provider: {...}}
      // For failure: data contains the original service response {success: false, message: "..."}
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
  ): Promise<{
    userProvider: UserAIProvider;
    availableModels: AIModel[];
  }> {
    try {
      const response = await aiProviderApi.configureProvider({
        provider_id: providerId,
        api_key: apiKey,
      });

      // Laravel controller returns: {success: boolean, message: string, data: {...}}
      // For success: data contains {user_provider: {...}, available_models: [...]}
      if (response.success && response.data) {
        return {
          userProvider: response.data.user_provider,
          availableModels: response.data.available_models || [],
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
      // Laravel controller returns: {success: boolean, message: string, data: [...]}
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
      // Laravel controller returns: {success: boolean, message: string, data: [...]}
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

      // Laravel controller returns: {success: boolean, message: string, data: {...}}
      // For success: data contains {models: [...], provider: {...}}
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

  async getAvailableModelsForProvider(providerId: number): Promise<AIModel[]> {
    try {
      const response = await aiProviderApi.getAvailableModelsForProvider(providerId);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to get available models");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to get available models";
      console.error("Error getting available models:", errorMessage);
      throw new Error(errorMessage);
    }
  }

  async getUserConfiguredProviderModels(): Promise<{
    provider: AIProvider;
    user_provider: UserAIProvider;
    models: AIModel[];
  }[]> {
    try {
      const response = await aiProviderApi.getUserConfiguredProviderModels();

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to get configured provider models");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to get configured provider models";
      console.error("Error getting configured provider models:", errorMessage);
      throw new Error(errorMessage);
    }
  }

  async addUserModel(data: {
    model_id: number;
    user_provider_id: number;
    custom_name?: string;
    is_active?: boolean;
    is_default?: boolean;
  }): Promise<UserAIModel> {
    try {
      const response = await aiProviderApi.addUserModel(data);

      // Laravel controller returns: {success: boolean, message: string, data: {...}}
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to add user model");
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to add user model",
      );
    }
  }

  async deleteUserProvider(providerId: number): Promise<void> {
    await aiProviderApi.deleteUserProvider(providerId);
  }

  async updateUserProvider(
    providerId: number,
    data: { api_key?: string; is_active?: boolean; is_default?: boolean },
  ): Promise<UserAIProvider> {
    try {
      const response = await aiProviderApi.updateUserProvider(providerId, data);

      // Laravel controller returns: {success: boolean, message: string, data: {...}}
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to update user provider");
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to update user provider",
      );
    }
  }

  async updateUserModel(
    modelId: number,
    customName?: string,
  ): Promise<UserAIModel> {
    const response = await aiProviderApi.updateUserModel(modelId, customName);
    return response;
  }

  async updateUserModelStatus(
    modelId: number,
    data: { is_active?: boolean; is_default?: boolean }
  ): Promise<UserAIModel> {
    try {
      const response = await aiProviderApi.updateUserModelStatus(modelId, data);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to update model status");
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to update model status",
      );
    }
  }

  async deleteUserModel(modelId: number): Promise<void> {
    try {
      const response = await aiProviderApi.deleteUserModel(modelId);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete model");
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to delete model",
      );
    }
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

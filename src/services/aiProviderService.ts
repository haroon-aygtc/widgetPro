import { BaseApiClient } from "@/lib/api/config/BaseApiClient";
import type { ApiResponse } from "@/types/api";
import type {
  AIProvider,
  AIModel,
  UserAIProvider,
  UserAIModel,
  AIProviderTestRequest,
  AIProviderTestResponse,
  CreateUserProviderRequest,
  CreateUserModelRequest,
} from "@/types/ai";

class AIProviderApiClient extends BaseApiClient {
  // Get all available AI providers
  async getProviders(params?: {
    search?: string;
    free_only?: boolean;
  }): Promise<ApiResponse<AIProvider[]>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.free_only) searchParams.append("free_only", "true");
    const query = searchParams.toString();

    return super.request<ApiResponse<AIProvider[]>>(
      "GET",
      `/ai-providers${query ? `?${query}` : ""}`,
    );
  }

  // Test API key for a provider
  async testProvider(
    data: AIProviderTestRequest,
  ): Promise<AIProviderTestResponse> {
    const response = await super.request<AIProviderTestResponse>(
      "POST",
      "/ai-providers/test",
      data,
    );
    return response;
  }

  // Configure user provider (store API key)
  async configureProvider(data: CreateUserProviderRequest): Promise<
    ApiResponse<{
      user_provider: UserAIProvider;
      available_models: AIModel[];
    }>
  > {
    return super.request<
      ApiResponse<{
        user_provider: UserAIProvider;
        available_models: AIModel[];
      }>
    >("POST", "/ai-providers/configure", data);
  }

  // Get user's configured providers
  async getUserProviders(): Promise<ApiResponse<UserAIProvider[]>> {
    return super.request<ApiResponse<UserAIProvider[]>>(
      "GET",
      "/ai-providers/user-providers",
    );
  }

  // Get models for a specific provider
  async getModelsForProvider(
    providerId: number,
    params?: { search?: string },
  ): Promise<
    ApiResponse<{
      models: AIModel[];
      provider: AIProvider;
    }>
  > {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    const query = searchParams.toString();

    return super.request<
      ApiResponse<{
        models: AIModel[];
        provider: AIProvider;
      }>
    >("GET", `/ai-providers/${providerId}/models${query ? `?${query}` : ""}`);
  }

  // Add model to user's collection
  async addUserModel(
    data: CreateUserModelRequest,
  ): Promise<ApiResponse<UserAIModel>> {
    return super.request<ApiResponse<UserAIModel>>(
      "POST",
      "/ai-providers/models/add",
      data,
    );
  }

  // Get user's configured models
  async getUserModels(): Promise<ApiResponse<UserAIModel[]>> {
    return super.request<ApiResponse<UserAIModel[]>>(
      "GET",
      "/ai-providers/user-models",
    );
  }
}

export const aiProviderApi = new AIProviderApiClient();

// AI Provider service class
class AIProviderService {
  // Get all providers with optional filtering
  async getProviders(params?: {
    search?: string;
    freeOnly?: boolean;
  }): Promise<AIProvider[]> {
    const response = await aiProviderApi.getProviders({
      search: params?.search,
      free_only: params?.freeOnly,
    });
    return response.data || [];
  }

  // Test API key validity
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
        success: response.success,
        message: response.message,
        models: response.data?.models,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "API key test failed",
      };
    }
  }

  // Configure provider for user
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

  // Get user's configured providers
  async getUserProviders(): Promise<UserAIProvider[]> {
    const response = await aiProviderApi.getUserProviders();
    return response.data || [];
  }

  // Get models for provider
  async getModelsForProvider(
    providerId: number,
    search?: string,
  ): Promise<{ models: AIModel[]; provider: AIProvider }> {
    const response = await aiProviderApi.getModelsForProvider(providerId, {
      search,
    });
    return response.data!;
  }

  // Add model to user's collection
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

  // Get user's configured models
  async getUserModels(): Promise<UserAIModel[]> {
    const response = await aiProviderApi.getUserModels();
    return response.data || [];
  }
}

export const aiProviderService = new AIProviderService();

// Export error handler
export { handleApiError } from "@/lib/api/config/axios";

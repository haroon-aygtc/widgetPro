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
  private apiUrl: string;

  constructor() {
    super();
    this.apiUrl = "/ai-providers/provider";
  }

  async getProviders(search?: string): Promise<ApiResponse<AIProvider[]>> {
    const searchParams = new URLSearchParams();
    if (search) searchParams.append("search", search);
    const query = searchParams.toString();

    return super.request<ApiResponse<AIProvider[]>>(
      "GET",
        `${this.apiUrl}${query ? `?${query}` : ""}`
    );
  }

  async testProvider(data: AIProviderTestRequest): Promise<ApiResponse<AIProviderTestResponse>> {
    return super.request<ApiResponse<AIProviderTestResponse>>(
      "POST",
      `${this.apiUrl}/test`,
      data
    );
  }

  async configureProvider(data: CreateUserProviderRequest): Promise<ApiResponse<{
    user_provider: UserAIProvider;
    available_models: AIModel[];
  }>> {
    return super.request<ApiResponse<{
      user_provider: UserAIProvider;
      available_models: AIModel[];
    }>>(
      "POST",
      `${this.apiUrl}/provider/configure`,
      data
    );
  }

  async getUserProviders(): Promise<ApiResponse<UserAIProvider[]>> {
    return super.request<ApiResponse<UserAIProvider[]>>(
      "GET",
      `${this.apiUrl}/user-providers`
    );
  }

  async fetchModelsForProvider(providerId: number, params?: { search?: string }): Promise<ApiResponse<{
    models: AIModel[];
    provider: AIProvider;
  }>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    const query = searchParams.toString();

    return super.request<ApiResponse<{
      models: AIModel[];
      provider: AIProvider;
    }>>(
      "GET",
      `${this.apiUrl}/${providerId}/available-models${query ? `?${query}` : ""}`
    );
  }

  async addUserModel(data: CreateUserModelRequest): Promise<ApiResponse<UserAIModel>> {
    return super.request<ApiResponse<UserAIModel>>(
      "POST",
      `${this.apiUrl}/store-user-models`,
      data
    );
  }

  async getUserModels(): Promise<ApiResponse<UserAIModel[]>> {
    return super.request<ApiResponse<UserAIModel[]>>(
      "GET",
      `${this.apiUrl}/user-models`
    );
  }

  async deleteUserProvider(providerId: number): Promise<void> {
    return super.request<void>(
      "DELETE",
      `${this.apiUrl}/delete-user-providers/${providerId}`
    );
  }

  async updateUserProvider(providerId: number, apiKey: string): Promise<UserAIProvider> {
    return super.request<UserAIProvider>(
      "PUT",
      `${this.apiUrl}/update-user-providers/${providerId}`,
      { api_key: apiKey }
    );
  }

  async updateUserModel(modelId: number, customName?: string): Promise<UserAIModel> {
    return super.request<UserAIModel>(
      "PUT",
      `${this.apiUrl}/update-user-models/${modelId}`,
      { custom_name: customName }
    );
  }

  async addUserProvider(providerId: number, apiKey: string): Promise<UserAIProvider> {  
    return super.request<UserAIProvider>(
      "POST",
      `${this.apiUrl}/provider/configure`,
      { provider_id: providerId, api_key: apiKey }
    );
  }
}

export const aiProviderApi = new AIProviderApiClient();
export default aiProviderApi;

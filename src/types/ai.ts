export interface AIProvider {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  api_base_url: string;
  is_free: boolean;
  is_active: boolean;
  logo_url?: string;
  documentation_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AIModel {
  id: number;
  provider_id: number;
  name: string;
  display_name: string;
  description?: string;
  is_free: boolean;
  max_tokens?: number;
  context_window?: number;
  pricing_input?: number;
  pricing_output?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  provider?: AIProvider;
}

export interface UserAIProvider {
  id: number;
  user_id: number;
  provider_id: number;
  api_key: string;
  is_active: boolean;
  last_tested_at?: string;
  test_status?: "success" | "failed" | "pending";
  test_message?: string;
  created_at: string;
  updated_at: string;
  provider?: AIProvider;
}

export interface UserAIModel {
  id: number;
  user_id: number;
  model_id: number;
  user_provider_id: number;
  is_active: boolean;
  custom_name?: string;
  created_at: string;
  updated_at: string;
  model?: AIModel;
  user_provider?: UserAIProvider;
}

export interface AIProviderTestRequest {
  provider_id: number;
  api_key: string;
}

export interface AIProviderTestResponse {
  success: boolean;
  message: string;
  models?: AIModel[];
}

export interface CreateUserProviderRequest {
  provider_id: number;
  api_key: string;
}

export interface CreateUserModelRequest {
  model_id: number;
  user_provider_id: number;
  custom_name?: string;
}

export interface ModelsTabProps {
  availableModels: AIModel[];
  userModels: UserAIModel[];
  userProviders: UserAIProvider[];
  modelSearchTerm: string;
  loading: boolean;
  addModelLoading: boolean;
  onSearch: (term: string) => void;
  onLoadModels: (providerId: number) => void;
  onAddModel: (model: AIModel, userProviderId: number) => void;
}

export interface ConfiguredProvidersTabProps {
  userProviders: UserAIProvider[];
  loading: boolean;
  onDeleteProvider: (providerId: number) => void;
  onDeleteModel: (modelId: number) => void;
  onUpdateProvider: (providerId: number) => void;
  onUpdateModel: (modelId: number) => void;
  onAddProvider: (provider: UserAIProvider) => void;
  onAddModel: (model: UserAIModel) => void;
}

export interface ConfiguredProviderResponse {
  userProvider: UserAIProvider;
  availableModels: AIModel[];
}
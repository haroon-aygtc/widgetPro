import { userApi, handleApiError, type ApiResponse } from "@/lib/api";
import type { WidgetConfig } from "@/hooks/useWidgetConfiguration";

// Widget types for API communication
export interface WidgetApiData {
  id?: number;
  name: string;
  description?: string;
  template: string;
  primary_color: string;
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  welcome_message: string;
  placeholder: string;
  bot_name: string;
  bot_avatar?: string;
  auto_open: boolean;
  widget_theme: "light" | "dark";
  widget_width: number;
  widget_height: number;
  auto_trigger: {
    enabled: boolean;
    delay: number;
    message: string;
  };
  ai_model?: string;
  knowledge_base?: string[];
  is_active: boolean;
  embed_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WidgetListItem {
  id: number;
  name: string;
  template: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  total_conversations?: number;
  total_messages?: number;
}

export interface WidgetAnalytics {
  widget_id: number;
  total_conversations: number;
  total_messages: number;
  avg_response_time: number;
  satisfaction_score: number;
  daily_stats: Array<{
    date: string;
    conversations: number;
    messages: number;
  }>;
}

// Widget service class
class WidgetService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data: data,
          },
          message: data.message || "An error occurred",
        };
      }

      return data;
    } catch (error: any) {
      if (error.response) {
        throw error;
      }
      throw {
        message: "Network error occurred",
        response: { status: 500, data: {} },
      };
    }
  }

  // Convert frontend config to API format
  private configToApiData(
    config: WidgetConfig,
  ): Omit<WidgetApiData, "id" | "created_at" | "updated_at"> {
    return {
      name: config.widgetName,
      description: `Widget created with ${config.selectedTemplate} template`,
      template: config.selectedTemplate,
      primary_color: config.primaryColor,
      position: config.widgetPosition,
      welcome_message: config.welcomeMessage,
      placeholder: config.placeholder,
      bot_name: config.botName,
      bot_avatar: config.botAvatar,
      auto_open: config.autoOpen,
      widget_theme: config.widgetTheme,
      widget_width: config.widgetWidth,
      widget_height: config.widgetHeight,
      auto_trigger: config.autoTrigger,
      ai_model: config.aiModel,
      knowledge_base: config.knowledgeBase,
      is_active: true,
    };
  }

  // Convert API data to frontend config
  private apiDataToConfig(apiData: WidgetApiData): WidgetConfig {
    return {
      widgetName: apiData.name,
      selectedTemplate: apiData.template,
      primaryColor: apiData.primary_color,
      widgetPosition: apiData.position,
      autoOpen: apiData.auto_open,
      widgetTheme: apiData.widget_theme,
      widgetWidth: apiData.widget_width,
      widgetHeight: apiData.widget_height,
      botName: apiData.bot_name,
      welcomeMessage: apiData.welcome_message,
      botAvatar:
        apiData.bot_avatar ||
        "https://api.dicebear.com/7.x/avataaars/svg?seed=assistant",
      placeholder: apiData.placeholder,
      autoTrigger: apiData.auto_trigger,
      aiModel: apiData.ai_model || "",
      knowledgeBase: apiData.knowledge_base || [],
    };
  }

  // Get all widgets
  async getWidgets(params?: {
    search?: string;
    template?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<WidgetListItem[]>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.template) searchParams.append("template", params.template);
    if (params?.is_active !== undefined)
      searchParams.append("is_active", params.is_active.toString());
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.per_page)
      searchParams.append("per_page", params.per_page.toString());

    const query = searchParams.toString();
    return this.request<WidgetListItem[]>(
      `/widgets${query ? `?${query}` : ""}`,
    );
  }

  // Get single widget
  async getWidget(id: number): Promise<WidgetConfig> {
    const response = await this.request<WidgetApiData>(`/widgets/${id}`);
    return this.apiDataToConfig(response.data);
  }

  // Create new widget
  async createWidget(
    config: WidgetConfig,
  ): Promise<{ id: number; config: WidgetConfig }> {
    const apiData = this.configToApiData(config);
    const response = await this.request<WidgetApiData>("/widgets", {
      method: "POST",
      body: JSON.stringify(apiData),
    });

    return {
      id: response.data.id!,
      config: this.apiDataToConfig(response.data),
    };
  }

  // Update existing widget
  async updateWidget(id: number, config: WidgetConfig): Promise<WidgetConfig> {
    const apiData = this.configToApiData(config);
    const response = await this.request<WidgetApiData>(`/widgets/${id}`, {
      method: "PUT",
      body: JSON.stringify(apiData),
    });

    return this.apiDataToConfig(response.data);
  }

  // Delete widget
  async deleteWidget(id: number): Promise<void> {
    await this.request<void>(`/widgets/${id}`, {
      method: "DELETE",
    });
  }

  // Toggle widget active status
  async toggleWidgetStatus(id: number, isActive: boolean): Promise<void> {
    await this.request<void>(`/widgets/${id}/toggle`, {
      method: "PATCH",
      body: JSON.stringify({ is_active: isActive }),
    });
  }

  // Get widget embed code
  async getEmbedCode(id: number): Promise<string> {
    const response = await this.request<{ embed_code: string }>(
      `/widgets/${id}/embed`,
    );
    return response.data.embed_code;
  }

  // Get widget analytics
  async getWidgetAnalytics(
    id: number,
    params?: {
      date_from?: string;
      date_to?: string;
    },
  ): Promise<WidgetAnalytics> {
    const searchParams = new URLSearchParams();
    if (params?.date_from) searchParams.append("date_from", params.date_from);
    if (params?.date_to) searchParams.append("date_to", params.date_to);

    const query = searchParams.toString();
    const response = await this.request<WidgetAnalytics>(
      `/widgets/${id}/analytics${query ? `?${query}` : ""}`,
    );
    return response.data;
  }

  // Duplicate widget
  async duplicateWidget(
    id: number,
    newName: string,
  ): Promise<{ id: number; config: WidgetConfig }> {
    const response = await this.request<WidgetApiData>(
      `/widgets/${id}/duplicate`,
      {
        method: "POST",
        body: JSON.stringify({ name: newName }),
      },
    );

    return {
      id: response.data.id!,
      config: this.apiDataToConfig(response.data),
    };
  }

  // Export widget configuration
  async exportWidget(id: number): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/widgets/${id}/export`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to export widget");
    }

    return response.blob();
  }

  // Import widget configuration
  async importWidget(
    file: File,
  ): Promise<{ id: number; config: WidgetConfig }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${this.baseURL}/widgets/import`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        response: {
          status: response.status,
          data: errorData,
        },
        message: errorData.message || "Import failed",
      };
    }

    const data = await response.json();
    return {
      id: data.data.id,
      config: this.apiDataToConfig(data.data),
    };
  }

  // Validate widget configuration
  async validateConfig(
    config: WidgetConfig,
  ): Promise<{ isValid: boolean; errors: Record<string, string> }> {
    try {
      const apiData = this.configToApiData(config);
      await this.request<void>("/widgets/validate", {
        method: "POST",
        body: JSON.stringify(apiData),
      });
      return { isValid: true, errors: {} };
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errors: Record<string, string> = {};
        Object.entries(error.response.data.errors).forEach(
          ([key, messages]) => {
            if (Array.isArray(messages)) {
              errors[key] = messages[0];
            }
          },
        );
        return { isValid: false, errors };
      }
      return { isValid: false, errors: { general: handleApiError(error) } };
    }
  }

  // Test widget configuration with production validation
  async testWidget(
    config: WidgetConfig,
  ): Promise<{ success: boolean; message: string }> {
    const apiData = this.configToApiData(config);
    const response = await this.request<{ success: boolean; message: string }>(
      "/widgets/test",
      {
        method: "POST",
        body: JSON.stringify(apiData),
      },
    );
    return response.data;
  }
}

// Create widget service instance with environment-based URL
const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side: use current origin for production, localhost for development
    return window.location.hostname === "localhost"
      ? "http://localhost:8000/api"
      : `${window.location.protocol}//${window.location.host}/api`;
  }
  // Server-side fallback
  return "http://localhost:8000/api";
};

export const widgetService = new WidgetService(getApiBaseUrl());

// Widget error handler
export const handleWidgetError = (error: any): string => {
  return handleApiError(error);
};

// Widget validation helpers
export const widgetValidation = {
  isValidHexColor: (color: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(color);
  },

  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isValidWidgetName: (name: string): boolean => {
    return (
      name.length >= 2 && name.length <= 100 && /^[a-zA-Z0-9\s\-_]+$/.test(name)
    );
  },

  isValidMessage: (
    message: string,
    minLength: number = 5,
    maxLength: number = 200,
  ): boolean => {
    return message.length >= minLength && message.length <= maxLength;
  },
};

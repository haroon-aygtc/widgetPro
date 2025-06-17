import type { ApiResponse } from "@/types/api";
import {
  WidgetConfig,
  WidgetApiData,
  WidgetListItem,
  WidgetAnalytics,
} from "@/types/widget";
import { widgetApi } from "@/lib/api/widgetApi";
import { handleApiError } from "@/lib/api/config/axios";

// Field mapping configuration to eliminate duplication
const WIDGET_FIELD_MAPPINGS = {
  widgetName: "name",
  primaryColor: "primary_color",
  widgetPosition: "position",
  autoOpen: "auto_open",
  widgetTheme: "widget_theme",
  widgetWidth: "widget_width",
  widgetHeight: "widget_height",
  botName: "bot_name",
  welcomeMessage: "welcome_message",
  botAvatar: "bot_avatar",
  selectedTemplate: "template",
  placeholder: "placeholder",
  autoTrigger: "auto_trigger",
  aiModel: "ai_model",
  knowledgeBase: "knowledge_base",
} as const;

// Default values configuration
const API_DEFAULTS = {
  bot_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=assistant",
  ai_model: "",
  knowledge_base: [],
} as const;

// Widget service class
class WidgetService {
  // Generic transformation method - Frontend to API
  private configToApiData(
    config: WidgetConfig,
  ): Omit<WidgetApiData, "id" | "created_at" | "updated_at"> {
    const result: any = {
      description: `Widget created with ${config.selectedTemplate} template`,
      is_active: true,
    };

    // Transform fields using mapping
    Object.entries(WIDGET_FIELD_MAPPINGS).forEach(([frontendKey, apiKey]) => {
      const value = (config as any)[frontendKey];
      if (value !== undefined) {
        result[apiKey] = value;
      }
    });

    return result;
  }

  // Generic transformation method - API to Frontend
  private apiDataToConfig(apiData: WidgetApiData): WidgetConfig {
    const result: any = {};

    // Transform fields using reverse mapping
    Object.entries(WIDGET_FIELD_MAPPINGS).forEach(([frontendKey, apiKey]) => {
      const value = (apiData as any)[apiKey];
      if (value !== undefined) {
        result[frontendKey] = value;
      } else if (API_DEFAULTS[apiKey as keyof typeof API_DEFAULTS]) {
        result[frontendKey] = API_DEFAULTS[apiKey as keyof typeof API_DEFAULTS];
      }
    });

    // Apply specific defaults for frontend
    result.botAvatar = result.botAvatar || API_DEFAULTS.bot_avatar;
    result.aiModel = result.aiModel || API_DEFAULTS.ai_model;
    result.knowledgeBase = result.knowledgeBase || API_DEFAULTS.knowledge_base;

    return result as WidgetConfig;
  }

  // Get all widgets
  async getWidgets(params?: {
    search?: string;
    template?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<WidgetListItem[]>> {
    return widgetApi.getWidgets(params);
  }

  // Get single widget
  async getWidget(id: number): Promise<WidgetConfig> {
    const response = await widgetApi.getWidget(id);
    return this.apiDataToConfig(response.data);
  }

  // Create new widget
  async createWidget(
    config: WidgetConfig,
  ): Promise<{ id: number; config: WidgetConfig }> {
    const apiData = this.configToApiData(config);
    const response = await widgetApi.createWidget(apiData);
    return {
      id: response.data.id!,
      config: this.apiDataToConfig(response.data),
    };
  }

  // Update existing widget
  async updateWidget(id: number, config: WidgetConfig): Promise<WidgetConfig> {
    const apiData = this.configToApiData(config);
    const response = await widgetApi.updateWidget(id, apiData);
    return this.apiDataToConfig(response.data);
  }

  // Delete widget
  async deleteWidget(id: number): Promise<void> {
    await widgetApi.deleteWidget(id);
  }

  // Toggle widget active status
  async toggleWidgetStatus(id: number, isActive: boolean): Promise<void> {
    await widgetApi.toggleWidgetStatus(id, isActive);
  }

  // Get widget embed code
  async getEmbedCode(id: number): Promise<string> {
    const response = await widgetApi.getEmbedCode(id);
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
    const response = await widgetApi.getWidgetAnalytics(id, params);
    return response.data;
  }

  // Duplicate widget
  async duplicateWidget(
    id: number,
    newName: string,
  ): Promise<{ id: number; config: WidgetConfig }> {
    const response = await widgetApi.duplicateWidget(id, newName);
    return {
      id: response.data.id!,
      config: this.apiDataToConfig(response.data),
    };
  }

  // Export widget configuration
  async exportWidget(id: number): Promise<Blob> {
    return widgetApi.exportWidget(id);
  }

  // Import widget configuration
  async importWidget(
    file: File,
  ): Promise<{ id: number; config: WidgetConfig }> {
    const response = await widgetApi.importWidget(file);
    return {
      id: response.data.id!,
      config: this.apiDataToConfig(response.data),
    };
  }

  // Validate widget configuration
  async validateConfig(
    config: WidgetConfig,
  ): Promise<{ isValid: boolean; errors: Record<string, string> }> {
    try {
      const apiData = this.configToApiData(config);
      await widgetApi.validateConfig(apiData);
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

  // Test widget configuration with enhanced production validation
  async testWidget(
    config: WidgetConfig,
  ): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      // Pre-validation checks
      const preValidation = this.preValidateWidget(config);
      if (!preValidation.isValid) {
        return {
          success: false,
          message: preValidation.message,
          details: preValidation.errors,
        };
      }

      const apiData = this.configToApiData(config);
      const response = await widgetApi.testWidget(apiData);

      // Enhanced response with additional validation details
      return {
        success: response.data.success,
        message: response.data.message,
        details: {
          aiModelValidated: !!config.aiModel,
          knowledgeBaseCount: config.knowledgeBase?.length || 0,
          configurationComplete: this.isConfigurationComplete(config),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: handleApiError(error),
        details: { error: error.message },
      };
    }
  }
}

export const widgetService = new WidgetService();

// Widget error handler
export const handleWidgetError = (error: any): string => {
  return handleApiError(error);
};

// Enhanced widget validation helpers
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

  isValidAIModel: (model: string): boolean => {
    if (!model || model.trim() === "") return false;

    const validPatterns = [
      /^gpt-[34]/, // OpenAI GPT models
      /^claude-/, // Anthropic Claude models
      /^gemini-/, // Google Gemini models
      /^llama-/, // Meta LLaMA models
      /^mistral-/, // Mistral models
    ];

    return validPatterns.some((pattern) => pattern.test(model.toLowerCase()));
  },

  isValidPosition: (position: string): boolean => {
    const validPositions = [
      "bottom-right",
      "bottom-left",
      "top-right",
      "top-left",
      "center",
    ];
    return validPositions.includes(position);
  },

  isValidTheme: (theme: string): boolean => {
    const validThemes = ["light", "dark", "auto"];
    return validThemes.includes(theme);
  },
};

// Additional widget service methods
class WidgetServiceExtensions {
  // Pre-validation before API calls
  preValidateWidget(config: WidgetConfig): {
    isValid: boolean;
    message: string;
    errors?: string[];
  } {
    const errors: string[] = [];

    // Validate required fields
    if (!config.widgetName || config.widgetName.trim() === "") {
      errors.push("Widget name is required");
    }

    if (!widgetValidation.isValidWidgetName(config.widgetName)) {
      errors.push("Widget name contains invalid characters");
    }

    if (!widgetValidation.isValidHexColor(config.primaryColor)) {
      errors.push("Primary color must be a valid hex color");
    }

    if (!widgetValidation.isValidPosition(config.widgetPosition)) {
      errors.push("Widget position is invalid");
    }

    if (!widgetValidation.isValidTheme(config.widgetTheme)) {
      errors.push("Widget theme is invalid");
    }

    if (config.aiModel && !widgetValidation.isValidAIModel(config.aiModel)) {
      errors.push("AI model format is invalid");
    }

    if (!widgetValidation.isValidMessage(config.welcomeMessage)) {
      errors.push("Welcome message length is invalid");
    }

    if (config.botAvatar && !widgetValidation.isValidUrl(config.botAvatar)) {
      errors.push("Bot avatar URL is invalid");
    }

    return {
      isValid: errors.length === 0,
      message: errors.length > 0 ? errors[0] : "Configuration is valid",
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  // Check if configuration is complete for production
  isConfigurationComplete(config: WidgetConfig): boolean {
    const requiredFields = [
      config.widgetName,
      config.primaryColor,
      config.widgetPosition,
      config.welcomeMessage,
      config.botName,
    ];

    return requiredFields.every(
      (field) => field && field.toString().trim() !== "",
    );
  }
}

// Extend the main widget service with additional methods
Object.assign(WidgetService.prototype, WidgetServiceExtensions.prototype);

export interface AutoTriggerConfig {
  enabled: boolean;
  delay: number;
  message: string;
}

export interface WidgetConfig {
  widgetName: string;
  selectedTemplate: string;
  primaryColor: string;
  widgetPosition: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  welcomeMessage: string;
  placeholder: string;
  botName: string;
  botAvatar: string;
  autoOpen?: boolean;
  widgetTheme?: "light" | "dark";
  widgetWidth?: number;
  widgetHeight?: number;
  autoTrigger: AutoTriggerConfig;
  aiModel: string;
  knowledgeBase?: string[];
  description?: string;
}

export interface WidgetValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

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


export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  config: {
    widgetName: string;
    primaryColor: string;
    widgetPosition: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    welcomeMessage: string;
    botName: string;
    botAvatar: string;
    placeholder: string;
    widgetTheme: "light" | "dark";
    autoOpen: boolean;
    autoTrigger: {
      enabled: boolean;
      delay: number;
      message: string;
    };
  };
}

export interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  onTemplateApply?: (config: any) => void;
  widgetName: string;
  onWidgetNameChange: (name: string) => void;
  errors?: Record<string, string>;
  onFieldValidation?: (fieldName: string, value: any) => Promise<boolean>;
}
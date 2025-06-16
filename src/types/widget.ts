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
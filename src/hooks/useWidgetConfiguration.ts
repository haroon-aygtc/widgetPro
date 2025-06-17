import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { toastUtils } from "@/components/ui/use-toast";
import { useOperationLoading } from "@/contexts/LoadingContext";
import {
  widgetConfigSchema,
  type WidgetConfigFormData,
} from "@/lib/validation";
import { widgetService, handleWidgetError } from "@/services/widgetService";
import { z } from "zod";
import type { WidgetConfig } from "@/types/widget";
import { widgetFieldValidation } from "@/lib/validation";

const defaultConfig: WidgetConfig = {
  widgetName: "My Chat Widget",
  selectedTemplate: "default",
  primaryColor: "#4f46e5",
  widgetPosition: "bottom-right",
  autoOpen: false,
  widgetTheme: "light",
  widgetWidth: 350,
  widgetHeight: 500,
  botName: "AI Assistant",
  welcomeMessage: "Hello! How can I help you today?",
  botAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=assistant",
  placeholder: "Type your message...",
  autoTrigger: {
    enabled: false,
    delay: 5,
    message: "Need help? I'm here to assist you!",
  },
  aiModel: "",
  knowledgeBase: [],
};

export function useWidgetConfiguration(widgetId?: string) {
  const [config, setConfig] = useState<WidgetConfig>(defaultConfig);
  const [history, setHistory] = useState<WidgetConfig[]>([defaultConfig]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("templates");
  const [isLoading, setIsLoading] = useState(false);
  const [widgetIdState, setWidgetIdState] = useState<number | undefined>(
    widgetId ? parseInt(widgetId) : undefined,
  );
  const lastSavedConfig = useRef<WidgetConfig>(defaultConfig);

  // Use unified loading state management
  const saveLoading = useOperationLoading("widget-save");
  const loadLoading = useOperationLoading("widget-load");
  const validateLoading = useOperationLoading("widget-validate");
  const resetLoading = useOperationLoading("widget-reset");

  // Memoized config for performance optimization
  const memoizedConfig = useMemo(() => config, [config]);

  // Optimized config updates with efficient history management
  const updateConfig = useCallback(
    (updates: Partial<WidgetConfig>) => {
      const newConfig = {
        ...defaultConfig,
        ...memoizedConfig,
        ...updates,
      };

      // Prevent unnecessary updates if config hasn't changed
      if (JSON.stringify(newConfig) === JSON.stringify(memoizedConfig)) {
        return;
      }

      setConfig(newConfig);

      // Efficient history management with size limit
      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, historyIndex + 1);
        newHistory.push(newConfig);
        return newHistory.slice(-20); // Reduced history size for better performance
      });

      setHistoryIndex((prev) => Math.min(prev + 1, 19)); // Cap at 19 for 20 total items
      setHasUnsavedChanges(true);
    },
    [memoizedConfig, historyIndex],
  );

  // Enhanced undo functionality
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const targetConfig = history[newIndex];

      if (targetConfig) {
        // Set config directly without triggering updateConfig
        setConfig(targetConfig);
        setHistoryIndex(newIndex);

        const hasChanges =
          JSON.stringify(targetConfig) !==
          JSON.stringify(lastSavedConfig.current);
        setHasUnsavedChanges(hasChanges);

        toastUtils.operationSuccess("Undo", "Configuration has been undone");
      }
    } else {
      toastUtils.operationError("Undo", "Nothing to undo");
    }
  }, [historyIndex, history, lastSavedConfig]);

  // Enhanced redo functionality
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const targetConfig = history[newIndex];

      if (targetConfig) {
        // Set config directly without triggering updateConfig
        setConfig(targetConfig);
        setHistoryIndex(newIndex);

        const hasChanges =
          JSON.stringify(targetConfig) !==
          JSON.stringify(lastSavedConfig.current);
        setHasUnsavedChanges(hasChanges);

        toastUtils.operationSuccess("Redo", "Configuration has been redone");
      }
    } else {
      toastUtils.operationError("Redo", "Nothing to redo");
    }
  }, [historyIndex, history, lastSavedConfig]);

  // Optimized real-time validation with debouncing
  const validateField = useCallback(async (fieldName: string, value: any) => {
    try {
      // Client-side validation first for immediate feedback
      const fieldSchema =
        widgetFieldValidation[fieldName as keyof typeof widgetFieldValidation];
      if (fieldSchema) {
        const result = fieldSchema.safeParse(value);
        if (!result.success) {
          const errorMessage =
            result.error.errors[0]?.message || "Invalid value";
          setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
          return false;
        }
      }

      // Clear error immediately for valid values
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });

      return true;
    } catch (error) {
      console.warn(`Validation failed for ${fieldName}:`, error);
      return true; // Don't block on validation errors
    }
  }, []);

  // Enhanced real-time field validation with improved error handling
  const validateFieldRealTime = useCallback(
    async (fieldName: string, value: any): Promise<boolean> => {
      try {
        // Clear errors immediately for non-empty values
        if (value && value.toString().trim()) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
          });
        }

        // Client-side validation for immediate feedback
        const fieldSchema =
          widgetFieldValidation[
            fieldName as keyof typeof widgetFieldValidation
          ];
        if (fieldSchema) {
          const result = fieldSchema.safeParse(value);
          if (!result.success) {
            const errorMessage =
              result.error.errors[0]?.message || "Invalid value";
            setErrors((prev) => ({
              ...prev,
              [fieldName]: errorMessage,
            }));

            // Show user-friendly toast for validation errors
            toastUtils.validationError(1, [errorMessage]);
            return false;
          }
        }

        return true;
      } catch (error) {
        console.warn(`Real-time validation failed for ${fieldName}:`, error);
        return true; // Don't block on validation errors
      }
    },
    [],
  );

  // Validation
  const validateConfig = useCallback(() => {
    try {
      const validationData: WidgetConfigFormData = {
        name: config.widgetName,
        description: "",
        template: config.selectedTemplate,
        primaryColor: config.primaryColor,
        position: config.widgetPosition,
        welcomeMessage: config.welcomeMessage,
        placeholder: config.placeholder,
        autoTrigger: config.autoTrigger,
      };

      widgetConfigSchema.parse(validationData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });
        setErrors(newErrors);

        // Focus on first error tab
        const firstErrorPath = error.errors[0]?.path[0];
        if (firstErrorPath) {
          focusErrorField(firstErrorPath as string);
        }

        toastUtils.validationError(error.errors.length);
      }
      return false;
    }
  }, [config]);

  // Focus error field and switch to appropriate tab
  const focusErrorField = useCallback((fieldPath: string) => {
    const tabMapping: Record<string, string> = {
      // Templates tab
      name: "templates",
      widgetName: "templates",
      template: "templates",
      selectedTemplate: "templates",

      // Design tab
      primaryColor: "design",
      widgetPosition: "design",
      position: "design",

      // Behavior tab
      welcomeMessage: "behavior",
      placeholder: "behavior",
      botName: "behavior",
      botAvatar: "behavior",
      autoTrigger: "behavior",
      autoTriggerMessage: "behavior",
      autoOpen: "behavior",

      // Controls tab
      widgetTheme: "controls",
      widgetWidth: "controls",
      widgetHeight: "controls",
    };

    const targetTab = tabMapping[fieldPath] || "templates";
    setActiveTab(targetTab);

    // Focus the field after tab switch
    setTimeout(() => {
      const selectors = [
        `[data-field="${fieldPath}"]`,
        `#${fieldPath}`,
        `[name="${fieldPath}"]`,
        `input[placeholder*="${fieldPath}"]`,
      ];

      let fieldElement: HTMLElement | null = null;
      for (const selector of selectors) {
        fieldElement = document.querySelector(selector) as HTMLElement;
        if (fieldElement) {
          break;
        }
      }

      if (fieldElement) {
        fieldElement.focus();
        fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });

        // Add visual highlight
        fieldElement.classList.add(
          "ring-2",
          "ring-destructive",
          "ring-offset-2",
        );
        setTimeout(() => {
          fieldElement?.classList.remove(
            "ring-2",
            "ring-destructive",
            "ring-offset-2",
          );
        }, 3000);
      }
    }, 150);
  }, []);

  // Load widget configuration
  const loadConfig = useCallback(async (id: number) => {
    loadLoading.start("Loading widget configuration...");
    try {
      const loadedConfig = await widgetService.getWidget(id);
      setConfig(loadedConfig);
      lastSavedConfig.current = { ...loadedConfig };

      // Initialize history properly - keep current history and add loaded config
      setHistory((prevHistory) => {
        // If we have existing history, preserve it and add the loaded config
        const newHistory =
          prevHistory.length > 1
            ? [...prevHistory, loadedConfig]
            : [defaultConfig, loadedConfig];
        return newHistory.slice(-50); // Keep last 50 changes
      });
      setHistoryIndex((prevIndex) => prevIndex + 1);

      setHasUnsavedChanges(false);
      setErrors({});
      setWidgetIdState(id);

      toastUtils.operationSuccess(
        "Widget loaded",
        "Widget configuration has been loaded",
      );
      return true;
    } catch (error) {
      const errorMessage = handleWidgetError(error);
      toastUtils.operationError("Load widget", errorMessage);
      return false;
    } finally {
      loadLoading.stop();
    }
  }, []);

  // Save configuration with enhanced error handling and user feedback
  const saveConfig = useCallback(async () => {
    if (!validateConfig()) {
      return false;
    }

    saveLoading.start("Saving configuration...");
    try {
      saveLoading.updateMessage("Validating configuration...");
      const validation = await widgetService.validateConfig(config);

      if (!validation.isValid) {
        setErrors(validation.errors);

        // Auto-focus first error field and switch to appropriate tab
        const firstErrorField = Object.keys(validation.errors)[0];
        if (firstErrorField) {
          focusErrorField(firstErrorField);
        }

        // Show specific validation errors with user-friendly messages
        const errorFields = Object.keys(validation.errors);
        const errorMessages = Object.values(validation.errors);

        // Check for specific error types and show appropriate messages
        if (errorMessages.some((msg) => msg.includes("already exists"))) {
          toastUtils.operationError(
            "Save Failed",
            "Widget name already exists. Please choose another name.",
          );
        } else if (errorMessages.some((msg) => msg.includes("required"))) {
          toastUtils.operationError(
            "Save Failed",
            "Please fill in all required fields before saving.",
          );
        } else {
          toastUtils.validationError(errorFields.length, errorMessages);
        }
        return false;
      }

      saveLoading.updateProgress(30);
      saveLoading.updateMessage("Saving to server...");

      let result;
      if (widgetIdState) {
        // Update existing widget
        saveLoading.updateMessage("Updating widget configuration...");
        const updatedConfig = await widgetService.updateWidget(
          widgetIdState,
          config,
        );
        result = { id: widgetIdState, config: updatedConfig };
      } else {
        // Create new widget
        saveLoading.updateMessage("Creating new widget...");
        result = await widgetService.createWidget(config);
        setWidgetIdState(result.id);
      }

      saveLoading.updateProgress(80);
      saveLoading.updateMessage("Finalizing changes...");

      lastSavedConfig.current = { ...result.config };
      setConfig(result.config);
      setHasUnsavedChanges(false);
      setErrors({});

      saveLoading.updateProgress(100);

      // Show success message with widget name
      toastUtils.operationSuccess(
        "Widget Saved",
        `"${config.widgetName}" has been saved successfully.`,
      );
      return true;
    } catch (error: any) {
      // Handle backend validation errors with enhanced user feedback
      if (error.response?.data?.errors) {
        const backendErrors: Record<string, string> = {};
        Object.entries(error.response.data.errors).forEach(
          ([key, messages]) => {
            if (Array.isArray(messages)) {
              backendErrors[key] = messages[0];
            }
          },
        );
        setErrors(backendErrors);

        // Auto-focus first error field
        const firstErrorField = Object.keys(backendErrors)[0];
        if (firstErrorField) {
          focusErrorField(firstErrorField);
        }

        // Show user-friendly error messages
        const errorMessages = Object.values(backendErrors);
        if (
          errorMessages.some(
            (msg) => msg.includes("name") && msg.includes("taken"),
          )
        ) {
          toastUtils.operationError(
            "Save Failed",
            "Widget name already exists. Please choose another name.",
          );
        } else if (errorMessages.some((msg) => msg.includes("invalid"))) {
          toastUtils.operationError(
            "Save Failed",
            "Please check your input values and try again.",
          );
        } else {
          toastUtils.validationError(
            Object.keys(backendErrors).length,
            errorMessages,
          );
        }
      } else if (error.response?.status === 422) {
        toastUtils.operationError(
          "Save Failed",
          "Please check your input and try again.",
        );
      } else if (error.response?.status === 409) {
        toastUtils.operationError(
          "Save Failed",
          "Widget name already exists. Please choose another name.",
        );
      } else {
        const errorMessage = handleWidgetError(error);
        toastUtils.operationError("Save Failed", errorMessage);
      }
      return false;
    } finally {
      saveLoading.stop();
    }
  }, [config, validateConfig, widgetIdState]);

  // Reset to Factory Defaults
  const resetConfig = useCallback(async () => {
    resetLoading.start("Resetting to factory defaults...");

    try {
      // Create fresh factory defaults
      const factoryDefaults = { ...defaultConfig };

      // Progressive loading with micro-interactions
      resetLoading.updateMessage("Clearing current configuration...");
      resetLoading.updateProgress(20);
      await new Promise((resolve) => setTimeout(resolve, 200));

      resetLoading.updateMessage("Applying factory defaults...");
      resetLoading.updateProgress(50);

      // Set configuration to factory defaults
      setConfig(factoryDefaults);
      await new Promise((resolve) => setTimeout(resolve, 200));

      resetLoading.updateMessage("Resetting history...");
      resetLoading.updateProgress(70);

      // Reset history to factory defaults only
      setHistory([factoryDefaults]);
      setHistoryIndex(0);
      await new Promise((resolve) => setTimeout(resolve, 200));

      resetLoading.updateMessage("Clearing validation errors...");
      resetLoading.updateProgress(90);

      // Clear all unsaved changes and errors
      setHasUnsavedChanges(false);
      setErrors({});
      await new Promise((resolve) => setTimeout(resolve, 200));

      resetLoading.updateMessage("Reset completed successfully!");
      resetLoading.updateProgress(100);

      // Show success message with details
      toastUtils.operationSuccess(
        "Reset Complete",
        "Widget configuration has been reset to factory defaults.",
      );

      return true;
    } catch (error) {
      toastUtils.operationError(
        "Reset Failed",
        "Failed to reset widget configuration. Please try again.",
      );
      return false;
    } finally {
      resetLoading.stop();
    }
  }, [resetLoading]);

  // Load widget on mount if widgetId is provided
  useEffect(() => {
    if (widgetId && !isNaN(parseInt(widgetId))) {
      loadConfig(parseInt(widgetId));
    }
  }, [widgetId, loadConfig]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
          e.preventDefault();
          redo();
        } else if (e.key === "s") {
          e.preventDefault();
          saveConfig();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, saveConfig]);

  // Test widget configuration with enhanced AI model validation
  const testConfig = useCallback(async () => {
    if (!validateConfig()) {
      return false;
    }

    try {
      // Enhanced AI model validation
      const aiModelStatus = getAIModelStatus();
      if (!aiModelStatus.configured) {
        toastUtils.operationError(
          "Widget Test",
          "⚠️ No AI model configured. The widget will show fallback messages instead of AI responses. Please configure an AI model for full functionality.",
        );
        return false;
      }

      // Validate AI model format and availability
      if (!isValidAIModelFormat(config.aiModel)) {
        toastUtils.operationError(
          "Widget Test",
          "❌ Invalid AI model format. Please select a valid AI model from the available options.",
        );
        return false;
      }

      const result = await widgetService.testWidget(config);
      if (result.success) {
        toastUtils.operationSuccess(
          "Widget Test",
          "✅ Widget is properly configured and ready to use! AI model is responding correctly.",
        );
      } else {
        toastUtils.operationError("Widget Test", result.message);
      }
      return result.success;
    } catch (error) {
      const errorMessage = handleWidgetError(error);
      toastUtils.operationError("Widget Test", errorMessage);
      return false;
    }
  }, [config, validateConfig]);

  // Duplicate widget
  const duplicateConfig = useCallback(
    async (newName: string) => {
      if (!widgetIdState) {
        toastUtils.operationError("Duplicate widget", "No widget to duplicate");
        return false;
      }

      try {
        const result = await widgetService.duplicateWidget(
          widgetIdState,
          newName,
        );
        toastUtils.operationSuccess(
          "Widget duplicated",
          "Widget has been duplicated",
        );
        return result;
      } catch (error) {
        const errorMessage = handleWidgetError(error);
        toastUtils.operationError("Duplicate widget", errorMessage);
        return false;
      }
    },
    [widgetIdState],
  );

  // Check if AI model is properly configured
  const hasAIModel = useCallback(() => {
    return config.aiModel && config.aiModel.trim() !== "";
  }, [config.aiModel]);

  // Enhanced AI model validation helper
  const isValidAIModelFormat = useCallback((model: string): boolean => {
    if (!model || model.trim() === "") return false;

    // Check for valid AI model patterns
    const validPatterns = [
      /^gpt-[34]/, // OpenAI GPT models
      /^claude-/, // Anthropic Claude models
      /^gemini-/, // Google Gemini models
      /^llama-/, // Meta LLaMA models
      /^mistral-/, // Mistral models
    ];

    return validPatterns.some((pattern) => pattern.test(model.toLowerCase()));
  }, []);

  // Get AI model status for UI feedback with enhanced validation
  const getAIModelStatus = useCallback(() => {
    if (!config.aiModel || config.aiModel.trim() === "") {
      return {
        configured: false,
        status: "not_configured",
        message: "No AI model configured. Widget will show fallback messages.",
        severity: "warning",
        icon: "⚠️",
      };
    }

    if (!isValidAIModelFormat(config.aiModel)) {
      return {
        configured: false,
        status: "invalid_format",
        message: `Invalid AI model format: "${config.aiModel}". Please select a supported model.`,
        severity: "error",
        icon: "❌",
      };
    }

    return {
      configured: true,
      status: "configured",
      message: `AI model "${config.aiModel}" is configured and ready.`,
      severity: "success",
      icon: "✅",
    };
  }, [config.aiModel, isValidAIModelFormat]);

  return {
    config,
    updateConfig,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    hasUnsavedChanges,
    isSaving: saveLoading.isLoading,
    isLoading: loadLoading.isLoading || isLoading,
    isResetting: resetLoading.isLoading,
    errors,
    activeTab,
    setActiveTab,
    validateConfig,
    validateField,
    validateFieldRealTime,
    saveConfig,
    loadConfig,
    resetConfig,
    testConfig,
    duplicateConfig,
    focusErrorField,
    widgetId: widgetIdState,
    hasAIModel,
    getAIModelStatus,
    isValidAIModelFormat,
  };
}

// Re-export for backward compatibility
export type { WidgetConfig } from "@/types/widget";

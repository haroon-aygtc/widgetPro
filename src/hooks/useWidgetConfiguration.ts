import { useState, useCallback, useRef, useEffect } from "react";
import { toastUtils } from "@/components/ui/use-toast";
import { useOperationLoading } from "@/contexts/LoadingContext";
import {
  widgetConfigSchema,
  type WidgetConfigFormData,
} from "@/lib/validation";
import { widgetService, handleWidgetError } from "@/services/widgetService";
import { z } from "zod";

export interface WidgetConfig {
  widgetName: string;
  selectedTemplate: string;
  primaryColor: string;
  widgetPosition: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  autoOpen: boolean;
  widgetTheme: "light" | "dark";
  widgetWidth: number;
  widgetHeight: number;
  botName: string;
  welcomeMessage: string;
  botAvatar: string;
  placeholder: string;
  autoTrigger: {
    enabled: boolean;
    delay: number;
    message: string;
  };
  aiModel: string;
  knowledgeBase: string[];
}

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

  // Track changes for undo/redo
  const updateConfig = useCallback(
    (updates: Partial<WidgetConfig>) => {
      setConfig((prev) => {
        const newConfig = { ...prev, ...updates };

        // Add to history for undo/redo
        setHistory((prevHistory) => {
          const newHistory = prevHistory.slice(0, historyIndex + 1);
          newHistory.push(newConfig);
          return newHistory.slice(-50); // Keep last 50 changes
        });
        setHistoryIndex((prev) => prev + 1);

        // Check if there are unsaved changes
        const hasChanges =
          JSON.stringify(newConfig) !== JSON.stringify(lastSavedConfig.current);
        setHasUnsavedChanges(hasChanges);

        return newConfig;
      });
    },
    [historyIndex],
  );

  // Undo functionality
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setConfig(history[newIndex]);

      const hasChanges =
        JSON.stringify(history[newIndex]) !==
        JSON.stringify(lastSavedConfig.current);
      setHasUnsavedChanges(hasChanges);

      toastUtils.operationSuccess("Undo");
    }
  }, [historyIndex, history]);

  // Redo functionality
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setConfig(history[newIndex]);

      const hasChanges =
        JSON.stringify(history[newIndex]) !==
        JSON.stringify(lastSavedConfig.current);
      setHasUnsavedChanges(hasChanges);

      toastUtils.operationSuccess("Redo");
    }
  }, [historyIndex, history]);

  // Real-time validation
  const validateField = useCallback(
    async (fieldName: string, value: any) => {
      validateLoading.start(`Validating ${fieldName}...`);
      try {
        // Create a temporary config with the updated field
        const tempConfig = { ...config, [fieldName]: value };
        const validation = await widgetService.validateConfig(tempConfig);

        setErrors((prev) => {
          const newErrors = { ...prev };
          if (validation.errors[fieldName]) {
            newErrors[fieldName] = validation.errors[fieldName];
          } else {
            delete newErrors[fieldName];
          }
          return newErrors;
        });

        return !validation.errors[fieldName];
      } catch (error) {
        return true; // Don't block on validation errors
      } finally {
        validateLoading.stop();
      }
    },
    [config],
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
        aiModel: config.aiModel || "default",
        knowledgeBase: config.knowledgeBase,
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
      name: "templates",
      template: "templates",
      primaryColor: "design",
      position: "design",
      welcomeMessage: "behavior",
      placeholder: "behavior",
      autoTrigger: "behavior",
      aiModel: "behavior",
    };

    const targetTab = tabMapping[fieldPath] || "templates";
    setActiveTab(targetTab);

    // Focus the field after tab switch
    setTimeout(() => {
      const fieldElement = document.querySelector(
        `[data-field="${fieldPath}"]`,
      ) as HTMLElement;
      if (fieldElement) {
        fieldElement.focus();
        fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  }, []);

  // Load widget configuration
  const loadConfig = useCallback(async (id: number) => {
    loadLoading.start("Loading widget configuration...");
    try {
      const loadedConfig = await widgetService.getWidget(id);
      setConfig(loadedConfig);
      lastSavedConfig.current = { ...loadedConfig };
      setHistory([loadedConfig]);
      setHistoryIndex(0);
      setHasUnsavedChanges(false);
      setErrors({});
      setWidgetIdState(id);

      toastUtils.operationSuccess("Widget loaded");
      return true;
    } catch (error) {
      const errorMessage = handleWidgetError(error);
      toastUtils.operationError("Load widget", errorMessage);
      return false;
    } finally {
      loadLoading.stop();
    }
  }, []);

  // Save configuration
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
        toastUtils.validationError(Object.keys(validation.errors).length);
        return false;
      }

      saveLoading.updateProgress(50);
      saveLoading.updateMessage("Saving to server...");

      let result;
      if (widgetIdState) {
        // Update existing widget
        const updatedConfig = await widgetService.updateWidget(
          widgetIdState,
          config,
        );
        result = { id: widgetIdState, config: updatedConfig };
      } else {
        // Create new widget
        result = await widgetService.createWidget(config);
        setWidgetIdState(result.id);
      }

      saveLoading.updateProgress(100);

      lastSavedConfig.current = { ...result.config };
      setConfig(result.config);
      setHasUnsavedChanges(false);
      setErrors({});

      toastUtils.configSaved();
      return true;
    } catch (error) {
      const errorMessage = handleWidgetError(error);
      toastUtils.operationError("Save configuration", errorMessage);
      return false;
    } finally {
      saveLoading.stop();
    }
  }, [config, validateConfig, widgetIdState]);

  // Reset to last saved state
  const resetConfig = useCallback(() => {
    setConfig(lastSavedConfig.current);
    setHasUnsavedChanges(false);
    setErrors({});

    toastUtils.configReset();
  }, []);

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

  // Test widget configuration
  const testConfig = useCallback(async () => {
    if (!validateConfig()) {
      return false;
    }

    try {
      const result = await widgetService.testWidget(config);
      if (result.success) {
        toastUtils.operationSuccess("Widget test");
      } else {
        toastUtils.operationError("Widget test", result.message);
      }
      return result.success;
    } catch (error) {
      const errorMessage = handleWidgetError(error);
      toastUtils.operationError("Widget test", errorMessage);
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
        toastUtils.operationSuccess("Widget duplicated");
        return result;
      } catch (error) {
        const errorMessage = handleWidgetError(error);
        toastUtils.operationError("Duplicate widget", errorMessage);
        return false;
      }
    },
    [widgetIdState],
  );

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
    errors,
    activeTab,
    setActiveTab,
    validateConfig,
    validateField,
    saveConfig,
    loadConfig,
    resetConfig,
    testConfig,
    duplicateConfig,
    focusErrorField,
    widgetId: widgetIdState,
  };
}

import { useState, useCallback, useRef, useEffect } from "react";
import { toastUtils } from "@/components/ui/use-toast";
import { useOperationLoading } from "@/contexts/LoadingContext";
import {
  widgetConfigSchema,
  type WidgetConfigFormData,
} from "@/lib/validation";
import { widgetService, handleWidgetError } from "@/services/widgetService";
import { z } from "zod";
import type { WidgetConfig } from "@/types/widget";

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

  // Track changes for undo/redo - ENHANCED WITH TEMPLATE DEBUGGING
  const updateConfig = useCallback(
    (updates: Partial<WidgetConfig>) => {
      console.log("🔄 updateConfig called with:", updates);
      console.log("📊 Current historyIndex:", historyIndex, "History length:", history.length);

      // Special logging for template changes
      if (updates.selectedTemplate) {
        console.log("🎨 Template change detected:", updates.selectedTemplate);
        console.log("🔧 Full template update:", updates);
      }

      const newConfig = {
        ...defaultConfig,
        ...config,
        ...updates
      };

      console.log("📋 New config created:", {
        selectedTemplate: newConfig.selectedTemplate,
        widgetName: newConfig.widgetName,
        primaryColor: newConfig.primaryColor,
        botName: newConfig.botName
      });

      setConfig(newConfig);

      // Simple history management
      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, historyIndex + 1);
        newHistory.push(newConfig);
        console.log("📝 Added to history. New length:", newHistory.length);
        console.log("📚 History preview:", newHistory.map((h, i) => ({
          index: i,
          template: h.selectedTemplate,
          name: h.widgetName
        })));
        return newHistory.slice(-50);
      });

      setHistoryIndex((prev) => {
        const newIndex = prev + 1;
        console.log("📈 History index changed from", prev, "to", newIndex);
        return newIndex;
      });
      setHasUnsavedChanges(true);
    },
    [config, historyIndex]
  );

  // Enhanced undo functionality with template debugging
  const undo = useCallback(() => {
    console.log("⏪ Undo called. Current index:", historyIndex, "History length:", history.length);
    console.log("📚 Current history:", history.map((h, i) => ({
      index: i,
      template: h.selectedTemplate,
      name: h.widgetName,
      isCurrent: i === historyIndex
    })));

    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const targetConfig = history[newIndex];
      const currentConfig = history[historyIndex];

      console.log("🎯 Undoing from:", {
        template: currentConfig?.selectedTemplate,
        name: currentConfig?.widgetName
      });
      console.log("🎯 Undoing to:", {
        template: targetConfig?.selectedTemplate,
        name: targetConfig?.widgetName
      });

      if (targetConfig) {
        // Set config directly without triggering updateConfig
        setConfig(targetConfig);
        setHistoryIndex(newIndex);

        const hasChanges =
          JSON.stringify(targetConfig) !==
          JSON.stringify(lastSavedConfig.current);
        setHasUnsavedChanges(hasChanges);

        console.log("✅ Undo successful. New index:", newIndex);
        console.log("📋 Config after undo:", {
          selectedTemplate: targetConfig.selectedTemplate,
          widgetName: targetConfig.widgetName
        });
        toastUtils.operationSuccess("Undo");
      } else {
        console.log("❌ Target config is null/undefined");
      }
    } else {
      console.log("❌ Nothing to undo");
      toastUtils.operationError("Undo", "Nothing to undo");
    }
  }, [historyIndex, history, lastSavedConfig]);

  // Enhanced redo functionality with template debugging
  const redo = useCallback(() => {
    console.log("⏩ Redo called. Current index:", historyIndex, "History length:", history.length);
    console.log("📚 Current history:", history.map((h, i) => ({
      index: i,
      template: h.selectedTemplate,
      name: h.widgetName,
      isCurrent: i === historyIndex
    })));

    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const targetConfig = history[newIndex];
      const currentConfig = history[historyIndex];

      console.log("🎯 Redoing from:", {
        template: currentConfig?.selectedTemplate,
        name: currentConfig?.widgetName
      });
      console.log("🎯 Redoing to:", {
        template: targetConfig?.selectedTemplate,
        name: targetConfig?.widgetName
      });

      if (targetConfig) {
        // Set config directly without triggering updateConfig
        setConfig(targetConfig);
        setHistoryIndex(newIndex);

        const hasChanges =
          JSON.stringify(targetConfig) !==
          JSON.stringify(lastSavedConfig.current);
        setHasUnsavedChanges(hasChanges);

        console.log("✅ Redo successful. New index:", newIndex);
        console.log("📋 Config after redo:", {
          selectedTemplate: targetConfig.selectedTemplate,
          widgetName: targetConfig.widgetName
        });
        toastUtils.operationSuccess("Redo");
      } else {
        console.log("❌ Target config is null/undefined");
      }
    } else {
      console.log("❌ Nothing to redo");
      toastUtils.operationError("Redo", "Nothing to redo");
    }
  }, [historyIndex, history, lastSavedConfig]);

  // Real-time validation with proper error handling
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
            // Immediately clear error when field becomes valid
            delete newErrors[fieldName];
          }
          return newErrors;
        });

        // Auto-focus and highlight field if validation fails
        if (validation.errors[fieldName]) {
          focusErrorField(fieldName);
        }

        return !validation.errors[fieldName];
      } catch (error) {
        console.warn(`Validation failed for ${fieldName}:`, error);
        return true; // Don't block on validation errors
      } finally {
        validateLoading.stop();
      }
    },
    [config],
  );

  // Enhanced real-time field validation - SIMPLIFIED
  const validateFieldRealTime = useCallback(
    async (fieldName: string, value: any): Promise<boolean> => {
      // Only clear errors immediately, don't trigger API validation on every change
      if (value && value.toString().trim()) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }

      // No API calls on every change - only validate on save
      return true;
    },
    []
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

  // Focus error field and switch to appropriate tab with enhanced mapping
  const focusErrorField = useCallback((fieldPath: string) => {
    console.log(`🎯 Focusing error field: ${fieldPath}`);

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
      aiModel: "behavior",
      autoOpen: "behavior",

      // Controls tab
      widgetTheme: "controls",
      widgetWidth: "controls",
      widgetHeight: "controls",
    };

    const targetTab = tabMapping[fieldPath] || "templates";
    console.log(`📂 Switching to tab: ${targetTab}`);
    setActiveTab(targetTab);

    // Focus the field after tab switch with enhanced selector
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
          console.log(`✅ Found field element with selector: ${selector}`);
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

        console.log(`🎯 Successfully focused and highlighted field: ${fieldPath}`);
      } else {
        console.warn(`❌ Could not find field element for: ${fieldPath}`);
        console.warn(`Tried selectors:`, selectors);
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
        const newHistory = prevHistory.length > 1 ? [...prevHistory, loadedConfig] : [defaultConfig, loadedConfig];
        return newHistory.slice(-50); // Keep last 50 changes
      });
      setHistoryIndex((prevIndex) => prevIndex + 1);

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

  // Save configuration with enhanced error handling
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

        // Show specific validation errors
        const errorFields = Object.keys(validation.errors);
        toastUtils.validationError(errorFields.length, errorFields);
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
    } catch (error: any) {
      // Handle backend validation errors
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

        toastUtils.validationError(Object.keys(backendErrors).length);
      } else {
        const errorMessage = handleWidgetError(error);
        toastUtils.operationError("Save configuration", errorMessage);
      }
      return false;
    } finally {
      saveLoading.stop();
    }
  }, [config, validateConfig, widgetIdState]);

  // Professional Reset to Factory Defaults - COMPLETELY REWRITTEN
  const resetConfig = useCallback(async () => {
    console.log("🏭 PROFESSIONAL RESET TO FACTORY DEFAULTS INITIATED");

    resetLoading.start("Resetting to factory defaults...");

    try {
      // ALWAYS reset to defaultConfig - this is what "reset to default" means
      // Not to last saved state, not to anything else - FACTORY DEFAULTS
      const factoryDefaults = { ...defaultConfig };

      console.log("🎯 Resetting to factory defaults:", {
        widgetName: factoryDefaults.widgetName,
        selectedTemplate: factoryDefaults.selectedTemplate,
        primaryColor: factoryDefaults.primaryColor,
        botName: factoryDefaults.botName
      });

      resetLoading.updateMessage("Applying factory defaults...");

      // Set configuration to factory defaults
      setConfig(factoryDefaults);

      resetLoading.updateMessage("Resetting history...");

      // Reset history to factory defaults only
      setHistory([factoryDefaults]);
      setHistoryIndex(0);

      resetLoading.updateMessage("Clearing unsaved changes...");

      // Clear all unsaved changes and errors
      setHasUnsavedChanges(false);
      setErrors({});

      resetLoading.updateMessage("Reset completed successfully!");

      console.log("✅ Factory reset completed successfully");
      console.log("📋 New config state:", {
        widgetName: factoryDefaults.widgetName,
        selectedTemplate: factoryDefaults.selectedTemplate,
        primaryColor: factoryDefaults.primaryColor
      });

      // Show success message
      toastUtils.operationSuccess("Reset to factory defaults");

      return true;

    } catch (error) {
      console.error("❌ Reset failed:", error);
      toastUtils.apiError("Failed to reset widget configuration");
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
  };
}

// Re-export for backward compatibility
export type { WidgetConfig } from "@/types/widget";

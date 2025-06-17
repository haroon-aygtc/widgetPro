import React, { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  LayoutTemplate,
  Palette,
  Settings,
  Sliders,
  Code,
  Zap,
  Loader2,
  Save,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import QuickSetupWizard from "@/components/onboarding/QuickSetupWizard";
import ErrorBoundary from "@/components/ui/error-boundary";
import { useWidgetConfiguration } from "@/hooks/useWidgetConfiguration";
import { useModal } from "@/hooks/useModal";
import { UnifiedModal } from "@/components/ui/unified-modal";
import TemplateSelector from "./widget-config/TemplateSelector";
import DesignControls from "./widget-config/DesignControls";
import BehaviorControls from "./widget-config/BehaviorControls";
import PositionControls from "./widget-config/PositionControls";
import EmbedCodeGenerator from "./widget-config/EmbedCodeGenerator";
import SaveStateIndicator from "./widget-config/SaveStateIndicator";
import WidgetPreview from "./WidgetPreview";
import AIModelSelection from "./widget-config/AIModelSelection";

interface WidgetConfigurationProps {
  widgetId?: string;
}

const WidgetConfiguration: React.FC<WidgetConfigurationProps> = ({
  widgetId,
}) => {
  const [showQuickSetup, setShowQuickSetup] = useState(false);
  const {
    config,
    updateConfig,
    undo,
    redo,
    canUndo,
    canRedo,
    hasUnsavedChanges,
    isSaving,
    isLoading,
    isResetting,
    errors,
    activeTab,
    setActiveTab,
    validateField,
    validateFieldRealTime,
    saveConfig,
    resetConfig,
    testConfig,
    duplicateConfig,
    widgetId: currentWidgetId,
    hasAIModel,
    getAIModelStatus,
  } = useWidgetConfiguration(widgetId);

  const modal = useModal();

  // Simplified modal state management
  const [resetModal, setResetModal] = useState({
    isOpen: false,
    isLoading: false,
    message: "",
    action: null as (() => Promise<void>) | null,
  });

  const handleReset = async () => {
    if (hasUnsavedChanges) {
      setResetModal({
        isOpen: true,
        isLoading: false,
        message:
          "You have unsaved changes that will be lost if you reset to factory defaults.",
        action: null,
      });
    } else {
      await resetConfig();
      setActiveTab("templates");
    }
  };

  const handleModalSave = async () => {
    setResetModal((prev) => ({
      ...prev,
      isLoading: true,
      message: "Saving changes...",
    }));

    try {
      const saveResult = await saveConfig();

      if (saveResult) {
        // Save successful, now reset
        setResetModal((prev) => ({
          ...prev,
          message: "Resetting to factory defaults...",
        }));

        // Add a small delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 500));
        await resetConfig();
        setActiveTab("templates");

        // Close modal with success feedback
        setResetModal({
          isOpen: false,
          isLoading: false,
          message: "",
          action: null,
        });
      } else {
        // Save failed, keep modal open and show error state
        setResetModal((prev) => ({
          ...prev,
          isLoading: false,
          message: "Save failed. Please try again.",
        }));

        // Auto-hide error message after 3 seconds
        setTimeout(() => {
          setResetModal((prev) => ({
            ...prev,
            message: "",
          }));
        }, 3000);
      }
    } catch (error) {
      setResetModal((prev) => ({
        ...prev,
        isLoading: false,
        message: "Save failed. Please check your input and try again.",
      }));

      // Auto-hide error message after 3 seconds
      setTimeout(() => {
        setResetModal((prev) => ({
          ...prev,
          message: "",
        }));
      }, 3000);
    }
  };

  const handleModalReset = async () => {
    setResetModal((prev) => ({
      ...prev,
      isLoading: true,
      message: "Resetting to factory defaults...",
    }));

    try {
      const resetResult = await resetConfig();
      if (resetResult) {
        setActiveTab("templates");

        // Close modal with success feedback
        setResetModal({
          isOpen: false,
          isLoading: false,
          message: "",
          action: null,
        });
      } else {
        // Reset failed, show error state
        setResetModal((prev) => ({
          ...prev,
          isLoading: false,
          message: "Reset failed. Please try again.",
        }));

        // Auto-hide error message after 3 seconds
        setTimeout(() => {
          setResetModal((prev) => ({
            ...prev,
            message: "",
          }));
        }, 3000);
      }
    } catch (error) {
      setResetModal((prev) => ({
        ...prev,
        isLoading: false,
        message: "Reset failed. Please try again.",
      }));

      // Auto-hide error message after 3 seconds
      setTimeout(() => {
        setResetModal((prev) => ({
          ...prev,
          message: "",
        }));
      }, 3000);
    }
  };

  const handleModalCancel = () => {
    setResetModal({
      isOpen: false,
      isLoading: false,
      message: "",
      action: null,
    });
  };

  const errorCount = Object.keys(errors).length;

  const handleQuickSetupComplete = (data: any) => {
    updateConfig({
      widgetName: data.widgetName,
      primaryColor: data.primaryColor,
      widgetPosition: data.position,
      welcomeMessage: data.welcomeMessage,
      botName: data.botName,
      selectedTemplate: data.template,
    });
    setShowQuickSetup(false);
  };

  return (
    <>
      {showQuickSetup && (
        <QuickSetupWizard
          onComplete={handleQuickSetupComplete}
          onCancel={() => setShowQuickSetup(false)}
        />
      )}

      {/* Modal for confirmations */}
      <UnifiedModal
        open={modal.isOpen}
        onOpenChange={modal.closeModal}
        title={modal.modalState.title}
        description={modal.modalState.description}
        type={modal.modalState.type}
        variant={modal.modalState.variant}
        size={modal.modalState.size}
        confirmText={modal.modalState.confirmText}
        cancelText={modal.modalState.cancelText}
        onConfirm={modal.modalState.onConfirm}
        onCancel={modal.modalState.onCancel}
      />

      {/* Enhanced Reset Modal with Modern Design and Micro-interactions */}
      <UnifiedModal
        open={resetModal.isOpen}
        onOpenChange={(open) =>
          !resetModal.isLoading && !open && handleModalCancel()
        }
        title="Unsaved Changes Detected"
        description={
          resetModal.isLoading
            ? resetModal.message
            : "You have unsaved changes that will be lost if you reset to factory defaults. What would you like to do?"
        }
        type="dialog"
        variant="warning"
        size="md"
        className="backdrop-blur-sm"
      >
        <div className="space-y-4">
          {/* Progress indicator for loading states */}
          {resetModal.isLoading && (
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse transition-all duration-300"
                style={{ width: "100%" }}
              ></div>
            </div>
          )}

          {/* Action buttons with enhanced styling */}
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              variant="outline"
              onClick={handleModalCancel}
              disabled={resetModal.isLoading}
              className="transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            >
              Cancel
            </Button>

            <Button
              variant="outline"
              onClick={handleModalReset}
              disabled={resetModal.isLoading}
              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            >
              {resetModal.isLoading &&
              resetModal.message.includes("Resetting") ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span className="animate-pulse">Resetting...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Without Saving
                </>
              )}
            </Button>

            <Button
              onClick={handleModalSave}
              disabled={resetModal.isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
            >
              {resetModal.isLoading && resetModal.message.includes("Saving") ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span className="animate-pulse">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save & Reset
                </>
              )}
            </Button>
          </div>

          {/* Error message display */}
          {resetModal.message && resetModal.message.includes("failed") && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 animate-fade-in">
              {resetModal.message}
            </div>
          )}
        </div>
      </UnifiedModal>

      <ErrorBoundary>
        <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-teal-50/20 dark:to-teal-950/20">
          {/* Header */}
          <header className="border-b bg-card/80 backdrop-blur-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  Widget Configuration
                </h1>
                <p className="text-muted-foreground mt-2">
                  Customize your AI chat widget appearance and behavior
                </p>
              </div>
              <SaveStateIndicator
                hasUnsavedChanges={hasUnsavedChanges}
                isSaving={isSaving}
                isResetting={isResetting}
                canUndo={canUndo}
                canRedo={canRedo}
                onSave={saveConfig}
                onUndo={undo}
                onRedo={redo}
                onReset={handleReset}
                errorCount={errorCount}
              />
              <div className="flex items-center gap-3">
                {/* AI Model Status Indicator */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border">
                  {hasAIModel() ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-700">AI Ready</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-yellow-700">No AI Model</span>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={testConfig}
                  disabled={isSaving || isLoading || errorCount > 0}
                  className="transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test Widget"
                  )}
                </Button>
                <button
                  onClick={() => setShowQuickSetup(true)}
                  disabled={isSaving || isLoading}
                  className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:from-teal-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Zap className="h-4 w-4 group-hover:animate-pulse" />
                  <span className="font-medium">Quick Setup</span>
                </button>
              </div>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row gap-6 w-full bg-background p-6">
            <div className="flex-1 space-y-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-6">
                  <TabsTrigger
                    value="templates"
                    className="flex items-center gap-2"
                  >
                    <LayoutTemplate className="h-4 w-4" />
                    Templates
                  </TabsTrigger>
                  <TabsTrigger
                    value="design"
                    className="flex items-center gap-2"
                  >
                    <Palette className="h-4 w-4" />
                    Design
                  </TabsTrigger>
                  <TabsTrigger
                    value="behavior"
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Behavior
                  </TabsTrigger>
                  <TabsTrigger
                    value="controls"
                    className="flex items-center gap-2"
                  >
                    <Sliders className="h-4 w-4" />
                    Controls
                  </TabsTrigger>
                  <TabsTrigger
                    value="ai-model"
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    AI Model
                  </TabsTrigger>
                  <TabsTrigger
                    value="embed"
                    className="flex items-center gap-2"
                  >
                    <Code className="h-4 w-4" />
                    Embed
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="templates" className="space-y-6">
                  <TemplateSelector
                    selectedTemplate={config.selectedTemplate}
                    onTemplateChange={(template) =>
                      updateConfig({ selectedTemplate: template })
                    }
                    onTemplateApply={(templateConfig) =>
                      updateConfig(templateConfig)
                    }
                    widgetName={config.widgetName}
                    onWidgetNameChange={(name) =>
                      updateConfig({ widgetName: name })
                    }
                    errors={errors}
                    onFieldValidation={validateFieldRealTime}
                  />
                </TabsContent>

                <TabsContent value="design" className="space-y-6">
                  <DesignControls
                    primaryColor={config.primaryColor}
                    onPrimaryColorChange={(color) =>
                      updateConfig({ primaryColor: color })
                    }
                    widgetPosition={config.widgetPosition}
                    onPositionChange={(position) =>
                      updateConfig({ widgetPosition: position })
                    }
                    errors={errors}
                    onFieldValidation={validateFieldRealTime}
                  />
                </TabsContent>

                <TabsContent value="behavior" className="space-y-6">
                  <BehaviorControls
                    autoOpen={config.autoOpen}
                    onAutoOpenChange={(autoOpen) => updateConfig({ autoOpen })}
                    welcomeMessage={config.welcomeMessage}
                    onWelcomeMessageChange={(message) =>
                      updateConfig({ welcomeMessage: message })
                    }
                    botName={config.botName}
                    onBotNameChange={(name) => updateConfig({ botName: name })}
                    botAvatar={config.botAvatar}
                    onBotAvatarChange={(avatar) =>
                      updateConfig({ botAvatar: avatar })
                    }
                    placeholder={config.placeholder}
                    onPlaceholderChange={(placeholder) =>
                      updateConfig({ placeholder })
                    }
                    autoTrigger={config.autoTrigger}
                    onAutoTriggerChange={(autoTrigger) =>
                      updateConfig({ autoTrigger })
                    }
                    errors={errors}
                    onFieldValidation={validateFieldRealTime}
                  />
                </TabsContent>

                <TabsContent value="ai-model" className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          AI Model Selection
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Choose the AI model that will power your chat widget
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() =>
                          window.open("/dashboard/ai-models", "_blank")
                        }
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Manage AI Models
                      </Button>
                    </div>

                    {!hasAIModel() ? (
                      <div className="p-6 border-2 border-dashed border-yellow-200 rounded-lg bg-yellow-50/50">
                        <div className="text-center space-y-3">
                          <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-yellow-600" />
                          </div>
                          <h4 className="font-medium text-yellow-800">
                            No AI Model Selected
                          </h4>
                          <p className="text-sm text-yellow-700">
                            Your widget needs an AI model to function. Please
                            configure an AI provider and select a model.
                          </p>
                          <Button
                            onClick={() =>
                              window.open("/dashboard/ai-models", "_blank")
                            }
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Configure AI Model
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 border border-green-200 rounded-lg bg-green-50/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-green-800">
                              AI Model Configured
                            </h4>
                            <p className="text-sm text-green-700">
                              Your widget is ready to use AI-powered
                              conversations
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="controls" className="space-y-6">
                  <PositionControls
                    widgetPosition={config.widgetPosition}
                    onPositionChange={(position) =>
                      updateConfig({ widgetPosition: position })
                    }
                    widgetTheme={config.widgetTheme}
                    onThemeChange={(theme) =>
                      updateConfig({ widgetTheme: theme })
                    }
                    widgetWidth={config.widgetWidth}
                    onWidthChange={(width) =>
                      updateConfig({ widgetWidth: width })
                    }
                    widgetHeight={config.widgetHeight}
                    onHeightChange={(height) =>
                      updateConfig({ widgetHeight: height })
                    }
                  />
                </TabsContent>

                <TabsContent value="embed" className="space-y-6">
                  <EmbedCodeGenerator widgetId={currentWidgetId?.toString()} />
                </TabsContent>
              </Tabs>
            </div>

            <div className="w-full lg:w-[500px] sticky top-6 self-start">
              <WidgetPreview
                position={config.widgetPosition}
                theme={config.widgetTheme}
                primaryColor={config.primaryColor}
                welcomeMessage={config.welcomeMessage}
                botName={config.botName}
                botAvatar={config.botAvatar}
                width={config.widgetWidth}
                height={config.widgetHeight}
                placeholder={config.placeholder}
              />
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </>
  );
};

export default WidgetConfiguration;

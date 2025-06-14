import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  LayoutTemplate,
  Palette,
  Settings,
  Sliders,
  Code,
  Zap,
} from "lucide-react";
import QuickSetupWizard from "@/components/onboarding/QuickSetupWizard";
import ErrorBoundary from "@/components/ui/error-boundary";
import { useWidgetConfiguration } from "@/hooks/useWidgetConfiguration";
import { useModal } from "@/hooks/useModal";
import TemplateSelector from "./widget-config/TemplateSelector";
import DesignControls from "./widget-config/DesignControls";
import BehaviorControls from "./widget-config/BehaviorControls";
import PositionControls from "./widget-config/PositionControls";
import EmbedCodeGenerator from "./widget-config/EmbedCodeGenerator";
import SaveStateIndicator from "./widget-config/SaveStateIndicator";
import WidgetPreview from "./WidgetPreview";

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
    errors,
    activeTab,
    setActiveTab,
    validateField,
    saveConfig,
    resetConfig,
    testConfig,
    duplicateConfig,
    widgetId: currentWidgetId,
  } = useWidgetConfiguration(widgetId);

  const modal = useModal();

  const handleReset = async () => {
    if (hasUnsavedChanges) {
      const confirmed = await modal.confirmReset("configuration");
      if (confirmed) {
        resetConfig();
      }
    }
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

      <ErrorBoundary>
        <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-violet-50/20 dark:to-violet-950/20">
          {/* Header */}
          <header className="border-b bg-card/80 backdrop-blur-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Widget Configuration
                </h1>
                <p className="text-muted-foreground mt-2">
                  Customize your AI chat widget appearance and behavior
                </p>
              </div>
              <SaveStateIndicator
                hasUnsavedChanges={hasUnsavedChanges}
                isSaving={isSaving}
                canUndo={canUndo}
                canRedo={canRedo}
                onSave={saveConfig}
                onUndo={undo}
                onRedo={redo}
                onReset={handleReset}
                errorCount={errorCount}
              />
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testConfig}
                  disabled={
                    isSaving || isLoading || Object.keys(errors).length > 0
                  }
                >
                  Test Widget
                </Button>
                <button
                  onClick={() => setShowQuickSetup(true)}
                  className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
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
                    widgetName={config.widgetName}
                    onWidgetNameChange={(name) =>
                      updateConfig({ widgetName: name })
                    }
                    errors={errors}
                    onFieldValidation={validateField}
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
                    onFieldValidation={validateField}
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
                    onFieldValidation={validateField}
                  />
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

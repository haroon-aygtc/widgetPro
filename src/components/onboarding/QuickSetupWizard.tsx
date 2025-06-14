import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Palette,
  MessageSquare,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickSetupData {
  widgetName: string;
  primaryColor: string;
  position: string;
  welcomeMessage: string;
  botName: string;
  template: string;
}

interface QuickSetupWizardProps {
  onComplete: (data: QuickSetupData) => void;
  onCancel: () => void;
  className?: string;
}

const QuickSetupWizard: React.FC<QuickSetupWizardProps> = ({
  onComplete,
  onCancel,
  className = "",
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<QuickSetupData>({
    widgetName: "My Chat Widget",
    primaryColor: "#4f46e5",
    position: "bottom-right",
    welcomeMessage: "Hello! How can I help you today?",
    botName: "AI Assistant",
    template: "modern",
  });

  const steps = [
    {
      id: "basics",
      title: "Widget Basics",
      description: "Give your widget a name and choose a template",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      id: "design",
      title: "Design & Style",
      description: "Customize colors and positioning",
      icon: <Palette className="h-5 w-5" />,
    },
    {
      id: "behavior",
      title: "Bot Personality",
      description: "Set up your AI assistant's personality",
      icon: <Bot className="h-5 w-5" />,
    },
  ];

  const templates = [
    { id: "modern", name: "Modern", description: "Clean and contemporary" },
    { id: "minimal", name: "Minimal", description: "Simple and focused" },
    { id: "enterprise", name: "Enterprise", description: "Professional look" },
  ];

  const positions = [
    { id: "bottom-right", name: "Bottom Right", popular: true },
    { id: "bottom-left", name: "Bottom Left" },
    { id: "top-right", name: "Top Right" },
    { id: "top-left", name: "Top Left" },
  ];

  const colorPresets = [
    { color: "#4f46e5", name: "Indigo" },
    { color: "#7c3aed", name: "Purple" },
    { color: "#2563eb", name: "Blue" },
    { color: "#059669", name: "Green" },
    { color: "#dc2626", name: "Red" },
    { color: "#ea580c", name: "Orange" },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (updates: Partial<QuickSetupData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="widget-name">Widget Name</Label>
              <Input
                id="widget-name"
                value={formData.widgetName}
                onChange={(e) => updateFormData({ widgetName: e.target.value })}
                placeholder="Enter widget name"
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-3">
              <Label>Choose Template</Label>
              <div className="grid grid-cols-1 gap-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => updateFormData({ template: template.id })}
                    className={cn(
                      "p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md",
                      formData.template === template.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      </div>
                      {formData.template === template.id && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Primary Color</Label>
              <div className="grid grid-cols-3 gap-3">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.color}
                    onClick={() =>
                      updateFormData({ primaryColor: preset.color })
                    }
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all hover:scale-105",
                      formData.primaryColor === preset.color
                        ? "border-primary shadow-lg"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <div
                      className="w-full h-8 rounded-lg mb-2"
                      style={{ backgroundColor: preset.color }}
                    />
                    <p className="text-sm font-medium">{preset.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Widget Position</Label>
              <div className="grid grid-cols-2 gap-3">
                {positions.map((position) => (
                  <button
                    key={position.id}
                    onClick={() => updateFormData({ position: position.id })}
                    className={cn(
                      "p-4 border-2 rounded-xl transition-all hover:shadow-md text-left",
                      formData.position === position.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{position.name}</span>
                      <div className="flex items-center gap-2">
                        {position.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                        {formData.position === position.id && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bot-name">Bot Name</Label>
              <Input
                id="bot-name"
                value={formData.botName}
                onChange={(e) => updateFormData({ botName: e.target.value })}
                placeholder="Enter bot name"
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome-message">Welcome Message</Label>
              <Input
                id="welcome-message"
                value={formData.welcomeMessage}
                onChange={(e) =>
                  updateFormData({ welcomeMessage: e.target.value })
                }
                placeholder="Enter welcome message"
                className="h-12 text-base"
              />
            </div>

            <div className="p-4 bg-muted/50 rounded-xl">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Preview
              </h4>
              <div className="bg-card p-3 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs text-white font-bold">
                      {formData.botName.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium text-sm">
                    {formData.botName}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formData.welcomeMessage}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",
        className,
      )}
    >
      <Card className="w-full max-w-2xl bg-gradient-to-br from-card to-card/80 shadow-2xl border-0">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Quick Setup
              </CardTitle>
              <CardDescription className="text-base">
                Get your widget ready in under 2 minutes
              </CardDescription>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>
                Step {currentStep + 1} of {steps.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />

            <div className="flex items-center gap-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    index === currentStep
                      ? "text-primary font-medium"
                      : index < currentStep
                        ? "text-green-600"
                        : "text-muted-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "p-1.5 rounded-full",
                      index === currentStep
                        ? "bg-primary text-white"
                        : index < currentStep
                          ? "bg-green-500 text-white"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className="hidden sm:inline">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="min-h-[300px]">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                {steps[currentStep].title}
              </h3>
              <p className="text-muted-foreground">
                {steps[currentStep].description}
              </p>
            </div>

            {renderStepContent()}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={currentStep === 0 ? onCancel : handlePrevious}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {currentStep === 0 ? "Cancel" : "Previous"}
            </Button>

            <Button
              onClick={handleNext}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Create Widget
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickSetupWizard;

import React, { useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Template, TemplateSelectorProps } from "@/types/widget";

const templates: Template[] = [
  {
    id: "default",
    name: "Default",
    description: "Standard chat widget with clean design",
    preview: "💬",
    config: {
      widgetName: "Customer Support Chat",
      primaryColor: "#4f46e5",
      widgetPosition: "bottom-right",
      welcomeMessage: "Hello! How can I help you today?",
      botName: "Support Assistant",
      botAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=support",
      placeholder: "Type your message...",
      widgetTheme: "light",
      autoOpen: false,
      autoTrigger: {
        enabled: false,
        delay: 5,
        message: "Need help? I'm here to assist you!",
      },
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simplified interface with essential features only",
    preview: "⚡",
    config: {
      widgetName: "Quick Chat",
      primaryColor: "#6b7280",
      widgetPosition: "bottom-right",
      welcomeMessage: "Hi there! 👋",
      botName: "Assistant",
      botAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=minimal",
      placeholder: "Ask me anything...",
      widgetTheme: "light",
      autoOpen: false,
      autoTrigger: {
        enabled: false,
        delay: 3,
        message: "Quick question?",
      },
    },
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with rounded corners and shadows",
    preview: "🎨",
    config: {
      widgetName: "Modern Chat Experience",
      primaryColor: "#06b6d4",
      widgetPosition: "bottom-right",
      welcomeMessage: "Welcome! Let's start a conversation 🚀",
      botName: "AI Helper",
      botAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=modern",
      placeholder: "What's on your mind?",
      widgetTheme: "light",
      autoOpen: false,
      autoTrigger: {
        enabled: true,
        delay: 8,
        message: "👋 I'm here if you need any help!",
      },
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Professional design for business websites",
    preview: "🏢",
    config: {
      widgetName: "Enterprise Support Portal",
      primaryColor: "#1f2937",
      widgetPosition: "bottom-right",
      welcomeMessage: "Welcome to our support center. How may we assist you today?",
      botName: "Business Assistant",
      botAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=enterprise",
      placeholder: "Describe your inquiry...",
      widgetTheme: "light",
      autoOpen: false,
      autoTrigger: {
        enabled: true,
        delay: 10,
        message: "Need assistance with our services?",
      },
    },
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Perfect for online stores and shopping sites",
    preview: "🛒",
    config: {
      widgetName: "Shopping Assistant",
      primaryColor: "#f59e0b",
      widgetPosition: "bottom-right",
      welcomeMessage: "Hi! Looking for something specific? I can help you find it! 🛍️",
      botName: "Shopping Helper",
      botAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=shopping",
      placeholder: "What are you looking for?",
      widgetTheme: "light",
      autoOpen: false,
      autoTrigger: {
        enabled: true,
        delay: 15,
        message: "Need help finding the perfect product? 🛒",
      },
    },
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Designed for medical and healthcare websites",
    preview: "🏥",
    config: {
      widgetName: "Patient Support Chat",
      primaryColor: "#10b981",
      widgetPosition: "bottom-right",
      welcomeMessage: "Hello! I'm here to help with your healthcare questions and appointments.",
      botName: "Health Assistant",
      botAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=healthcare",
      placeholder: "How can I help with your health needs?",
      widgetTheme: "light",
      autoOpen: false,
      autoTrigger: {
        enabled: true,
        delay: 12,
        message: "Need help with appointments or health questions? 🏥",
      },
    },
  },
  {
    id: "education",
    name: "Education",
    description: "Perfect for schools, universities, and learning platforms",
    preview: "🎓",
    config: {
      widgetName: "Learning Support Chat",
      primaryColor: "#8b5cf6",
      widgetPosition: "bottom-right",
      welcomeMessage: "Welcome, student! I'm here to help with your learning journey 📚",
      botName: "Study Buddy",
      botAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=education",
      placeholder: "Ask about courses, assignments, or anything!",
      widgetTheme: "light",
      autoOpen: false,
      autoTrigger: {
        enabled: true,
        delay: 7,
        message: "Need help with your studies? 📖",
      },
    },
  },
  {
    id: "dark-mode",
    name: "Dark Mode",
    description: "Sleek dark theme for modern websites",
    preview: "🌙",
    config: {
      widgetName: "Dark Chat Widget",
      primaryColor: "#3b82f6",
      widgetPosition: "bottom-right",
      welcomeMessage: "Hey there! Ready to chat in style? ✨",
      botName: "Night Assistant",
      botAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dark",
      placeholder: "Message me...",
      widgetTheme: "dark",
      autoOpen: false,
      autoTrigger: {
        enabled: true,
        delay: 6,
        message: "Working late? I'm here to help! 🌙",
      },
    },
  },
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange,
  onTemplateApply,
  widgetName,
  onWidgetNameChange,
  errors = {},
  onFieldValidation,
}) => {
  // Handle widget name change with enhanced validation
  const handleWidgetNameChange = useCallback(
    async (name: string) => {
      // Always update the value first for real-time feedback
      onWidgetNameChange(name);

      // Trigger real-time validation for immediate error clearing
      if (onFieldValidation) {
        try {
          await onFieldValidation("name", name);
        } catch (error) {
          console.warn("Field validation error:", error);
        }
      }
    },
    [onWidgetNameChange, onFieldValidation],
  );

  // Handle template change with validation and auto-apply
  const handleTemplateChange = useCallback(
    async (templateId: string) => {
      console.log("🎨 Template change initiated:", templateId);

      // Find the selected template
      const template = templates.find(t => t.id === templateId);
      if (!template) {
        console.warn("Template not found:", templateId);
        return;
      }

      // FIXED: Combine both selectedTemplate and template config into single update
      // This prevents double history entries that break undo/redo
      const combinedUpdate = {
        selectedTemplate: templateId,
        ...template.config
      };

      console.log("🔄 Applying combined template update:", combinedUpdate);

      // Use onTemplateApply with combined update if available, otherwise fallback to separate calls
      if (onTemplateApply) {
        onTemplateApply(combinedUpdate);
      } else {
        onTemplateChange(templateId);
      }

      // Trigger field validation if provided
      if (onFieldValidation) {
        try {
          await onFieldValidation("template", templateId);
        } catch (error) {
          console.warn("Template validation error:", error);
        }
      }
    },
    [onTemplateChange, onTemplateApply, onFieldValidation],
  );

  const selectedTemplateConfig = templates.find(t => t.id === selectedTemplate);

  return (
    <Card className="bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <CardTitle>Widget Templates</CardTitle>
        <CardDescription>
          Choose a pre-configured template to get started quickly. Each template includes optimized settings for different use cases.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg relative group",
                selectedTemplate === template.id
                  ? "border-primary bg-primary/10 shadow-lg ring-2 ring-primary/30 scale-[1.02] transform"
                  : "hover:border-primary/50 hover:shadow-md hover:scale-[1.01] transform",
              )}
              onClick={() => handleTemplateChange(template.id)}
            >
              {/* Enhanced Selection Indicator */}
              {selectedTemplate === template.id && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg animate-pulse">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Enhanced Preview Area */}
              <div className={cn(
                "h-24 bg-gradient-to-br from-muted to-muted/50 rounded-md mb-3 flex items-center justify-center text-2xl transition-all duration-300",
                selectedTemplate === template.id
                  ? "bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20"
                  : "group-hover:from-primary/10 group-hover:to-primary/5"
              )}>
                {template.preview}
              </div>

              {/* Template Title with Selection Highlight */}
              <h3 className={cn(
                "font-medium text-sm mb-1 transition-colors duration-300",
                selectedTemplate === template.id
                  ? "text-primary font-semibold"
                  : "group-hover:text-primary"
              )}>
                {template.name}
                {selectedTemplate === template.id && (
                  <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    SELECTED
                  </span>
                )}
              </h3>

              <p className="text-xs text-muted-foreground mb-2">
                {template.description}
              </p>

              {/* Enhanced Template Preview Details */}
              <div className={cn(
                "text-xs space-y-1 transition-opacity duration-300",
                selectedTemplate === template.id ? "opacity-100" : "opacity-75"
              )}>
                <div className="flex items-center gap-1">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full border transition-all duration-300",
                      selectedTemplate === template.id ? "ring-1 ring-primary/30" : ""
                    )}
                    style={{ backgroundColor: template.config.primaryColor }}
                  />
                  <span className={cn(
                    selectedTemplate === template.id ? "font-medium" : ""
                  )}>
                    {template.config.botName}
                  </span>
                </div>
                <div className={cn(
                  "truncate transition-colors duration-300",
                  selectedTemplate === template.id ? "text-foreground" : ""
                )}>
                  "{template.config.welcomeMessage}"
                </div>
              </div>

              {/* Subtle Border Glow for Selected */}
              {selectedTemplate === template.id && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-transparent to-primary/20 pointer-events-none" />
              )}
            </div>
          ))}
        </div>

        {/* Selected Template Info */}
        {selectedTemplateConfig && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h4 className="font-medium text-sm mb-2">
              ✨ {selectedTemplateConfig.name} Template Applied
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              This template has been automatically configured with optimized settings. You can customize any field below.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium">Bot Name:</span> {selectedTemplateConfig.config.botName}
              </div>
              <div>
                <span className="font-medium">Theme:</span> {selectedTemplateConfig.config.widgetTheme}
              </div>
              <div>
                <span className="font-medium">Position:</span> {selectedTemplateConfig.config.widgetPosition}
              </div>
              <div>
                <span className="font-medium">Auto-trigger:</span> {selectedTemplateConfig.config.autoTrigger.enabled ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label
            htmlFor="widget-name"
            className={cn(errors.name && "text-destructive")}
          >
            Widget Name {errors.name && "*"}
          </Label>
          <Input
            id="widget-name"
            data-field="name"
            value={widgetName}
            onChange={(e) => handleWidgetNameChange(e.target.value)}
            placeholder="Enter widget name"
            className={cn(
              errors.name &&
              "border-destructive focus-visible:ring-destructive",
            )}
            maxLength={100}
          />
          <div className="text-xs text-muted-foreground mt-1">
            {widgetName.length}/100 characters
          </div>
          {errors.name && (
            <p className="text-xs text-destructive mt-1">{errors.name}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;

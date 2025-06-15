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
import { widgetValidation } from "@/services/widgetService";
import { toastUtils } from "@/components/ui/use-toast";

interface Template {
  id: string;
  name: string;
  description: string;
}

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  widgetName: string;
  onWidgetNameChange: (name: string) => void;
  errors?: Record<string, string>;
  onFieldValidation?: (fieldName: string, value: any) => Promise<boolean>;
}

const templates: Template[] = [
  {
    id: "default",
    name: "Default",
    description: "Standard chat widget with clean design",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simplified interface with essential features only",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with rounded corners and shadows",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Professional design for business websites",
  },
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange,
  widgetName,
  onWidgetNameChange,
  errors = {},
  onFieldValidation,
}) => {
  // Handle widget name change with validation
  const handleWidgetNameChange = useCallback(
    async (name: string) => {
      // Real-time validation
      if (name.length > 100) {
        toastUtils.formError("Widget name must be less than 100 characters");
        return;
      }

      if (name.length >= 2 && !widgetValidation.isValidWidgetName(name)) {
        toastUtils.formError(
          "Widget name can only contain letters, numbers, spaces, hyphens, and underscores",
        );
        return;
      }

      onWidgetNameChange(name);

      // Trigger field validation if provided
      if (onFieldValidation && name.length >= 2) {
        await onFieldValidation("name", name);
      }
    },
    [onWidgetNameChange, onFieldValidation],
  );

  // Handle template change with validation
  const handleTemplateChange = useCallback(
    async (templateId: string) => {
      onTemplateChange(templateId);

      // Trigger field validation if provided
      if (onFieldValidation) {
        await onFieldValidation("template", templateId);
      }
    },
    [onTemplateChange, onFieldValidation],
  );
  return (
    <Card className="bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <CardTitle>Widget Templates</CardTitle>
        <CardDescription>
          Choose a template as a starting point for your chat widget
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
                selectedTemplate === template.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "hover:border-primary/50",
              )}
              onClick={() => handleTemplateChange(template.id)}
            >
              <div className="h-32 bg-muted rounded-md mb-4 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">
                  {template.name} Preview
                </span>
              </div>
              <h3 className="font-medium text-sm">{template.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {template.description}
              </p>
            </div>
          ))}
        </div>

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

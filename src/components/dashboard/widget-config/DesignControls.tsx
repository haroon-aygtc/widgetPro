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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DesignControlsProps {
  primaryColor: string;
  onPrimaryColorChange: (color: string) => void;
  widgetPosition: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  onPositionChange: (
    position: "bottom-right" | "bottom-left" | "top-right" | "top-left",
  ) => void;
  errors?: Record<string, string>;
  onFieldValidation?: (fieldName: string, value: any) => Promise<boolean>;
}

const positions = [
  { value: "bottom-right", label: "Bottom Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "top-right", label: "Top Right" },
  { value: "top-left", label: "Top Left" },
];

const DesignControls: React.FC<DesignControlsProps> = ({
  primaryColor,
  onPrimaryColorChange,
  widgetPosition,
  onPositionChange,
  errors = {},
  onFieldValidation,
}) => {
  // Handle color change with enhanced validation
  const handleColorChange = useCallback(
    async (color: string) => {
      // Always update the value first for real-time feedback
      onPrimaryColorChange(color);

      // Trigger real-time validation for immediate error clearing
      if (onFieldValidation) {
        try {
          await onFieldValidation("primaryColor", color);
        } catch (error) {
          console.warn("Color validation error:", error);
        }
      }
    },
    [onPrimaryColorChange, onFieldValidation],
  );

  // Handle position change with validation
  const handlePositionChange = useCallback(
    async (
      position: "bottom-right" | "bottom-left" | "top-right" | "top-left",
    ) => {
      onPositionChange(position);

      // Trigger real-time validation
      if (onFieldValidation) {
        try {
          await onFieldValidation("position", position);
        } catch (error) {
          console.warn("Position validation error:", error);
        }
      }
    },
    [onPositionChange, onFieldValidation],
  );
  return (
    <Card className="bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the look and feel of your chat widget
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="primary-color"
              className={cn(errors.primaryColor && "text-destructive")}
            >
              Primary Color {errors.primaryColor && "*"}
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="primary-color"
                data-field="primaryColor"
                type="color"
                value={primaryColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className={cn(
                  "w-20 h-10 p-1 cursor-pointer",
                  errors.primaryColor && "border-destructive",
                )}
              />
              <Input
                value={primaryColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className={cn(
                  "flex-1",
                  errors.primaryColor &&
                  "border-destructive focus-visible:ring-destructive",
                )}
                placeholder="#000000"
                maxLength={7}
              />
            </div>
            {errors.primaryColor && (
              <p className="text-xs text-destructive mt-1">
                {errors.primaryColor}
              </p>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label
              htmlFor="widget-position"
              className={cn(errors.position && "text-destructive")}
            >
              Widget Position {errors.position && "*"}
            </Label>
            <Select value={widgetPosition} onValueChange={handlePositionChange}>
              <SelectTrigger
                id="widget-position"
                data-field="position"
                className={cn(
                  errors.position &&
                  "border-destructive focus:ring-destructive",
                )}
              >
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((position) => (
                  <SelectItem key={position.value} value={position.value}>
                    {position.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.position && (
              <p className="text-xs text-destructive mt-1">{errors.position}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignControls;

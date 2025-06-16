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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { WidgetConfig } from "@/types/widget";
import { widgetValidation } from "@/services/widgetService";
import { toastUtils } from "@/components/ui/use-toast";

interface BehaviorControlsProps {
  autoOpen: boolean;
  onAutoOpenChange: (enabled: boolean) => void;
  welcomeMessage: string;
  onWelcomeMessageChange: (message: string) => void;
  botName: string;
  onBotNameChange: (name: string) => void;
  botAvatar: string;
  onBotAvatarChange: (avatar: string) => void;
  placeholder: string;
  onPlaceholderChange: (placeholder: string) => void;
  autoTrigger: WidgetConfig["autoTrigger"];
  onAutoTriggerChange: (autoTrigger: WidgetConfig["autoTrigger"]) => void;
  errors?: Record<string, string>;
  onFieldValidation?: (fieldName: string, value: any) => Promise<boolean>;
}

const BehaviorControls: React.FC<BehaviorControlsProps> = ({
  autoOpen,
  onAutoOpenChange,
  welcomeMessage,
  onWelcomeMessageChange,
  botName,
  onBotNameChange,
  botAvatar,
  onBotAvatarChange,
  placeholder,
  onPlaceholderChange,
  autoTrigger,
  onAutoTriggerChange,
  errors = {},
  onFieldValidation,
}) => {
  // Handle welcome message change with enhanced validation
  const handleWelcomeMessageChange = useCallback(
    async (message: string) => {
      // Always update the value first for real-time feedback
      onWelcomeMessageChange(message);

      // Trigger real-time validation for immediate error clearing
      if (onFieldValidation) {
        try {
          await onFieldValidation("welcomeMessage", message);
        } catch (error) {
          console.warn("Welcome message validation error:", error);
        }
      }
    },
    [onWelcomeMessageChange, onFieldValidation],
  );

  // Handle placeholder change with enhanced validation
  const handlePlaceholderChange = useCallback(
    async (placeholderText: string) => {
      // Always update the value first for real-time feedback
      onPlaceholderChange(placeholderText);

      // Trigger real-time validation for immediate error clearing
      if (onFieldValidation) {
        try {
          await onFieldValidation("placeholder", placeholderText);
        } catch (error) {
          console.warn("Placeholder validation error:", error);
        }
      }
    },
    [onPlaceholderChange, onFieldValidation],
  );

  // Handle bot avatar change with enhanced validation
  const handleBotAvatarChange = useCallback(
    async (avatar: string) => {
      // Always update the value first for real-time feedback
      onBotAvatarChange(avatar);

      // Trigger real-time validation for immediate error clearing
      if (onFieldValidation) {
        try {
          await onFieldValidation("botAvatar", avatar);
        } catch (error) {
          console.warn("Bot avatar validation error:", error);
        }
      }
    },
    [onBotAvatarChange, onFieldValidation],
  );

  // Handle bot name change with validation
  const handleBotNameChange = useCallback(
    async (name: string) => {
      onBotNameChange(name);

      // Trigger real-time validation
      if (onFieldValidation) {
        try {
          await onFieldValidation("botName", name);
        } catch (error) {
          console.warn("Bot name validation error:", error);
        }
      }
    },
    [onBotNameChange, onFieldValidation],
  );

  return (
    <Card className="bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <CardTitle>Widget Behavior</CardTitle>
        <CardDescription>
          Configure how your chat widget behaves
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-open">Auto Open</Label>
              <p className="text-sm text-muted-foreground">
                Automatically open the chat widget when a visitor arrives
              </p>
            </div>
            <Switch
              id="auto-open"
              checked={autoOpen}
              onCheckedChange={onAutoOpenChange}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label
              htmlFor="welcome-message"
              className={cn(errors.welcomeMessage && "text-destructive")}
            >
              Welcome Message {errors.welcomeMessage && "*"}
            </Label>
            <Input
              id="welcome-message"
              data-field="welcomeMessage"
              placeholder="Enter welcome message"
              value={welcomeMessage}
              onChange={(e) => handleWelcomeMessageChange(e.target.value)}
              className={cn(
                errors.welcomeMessage &&
                "border-destructive focus-visible:ring-destructive",
              )}
              maxLength={200}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {welcomeMessage.length}/200 characters
            </div>
            {errors.welcomeMessage && (
              <p className="text-xs text-destructive mt-1">
                {errors.welcomeMessage}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="placeholder">
              Input Placeholder {errors.placeholder && "*"}
            </Label>
            <Input
              id="placeholder"
              data-field="placeholder"
              placeholder="Enter placeholder text"
              value={placeholder}
              onChange={(e) => handlePlaceholderChange(e.target.value)}
              className={cn(
                errors.placeholder &&
                "border-destructive focus-visible:ring-destructive",
              )}
              maxLength={50}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {placeholder.length}/50 characters
            </div>
            {errors.placeholder && (
              <p className="text-xs text-destructive mt-1">
                {errors.placeholder}
              </p>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="bot-name">Bot Name</Label>
            <Input
              id="bot-name"
              data-field="botName"
              placeholder="Enter bot name"
              value={botName}
              onChange={(e) => handleBotNameChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-avatar">Bot Avatar URL</Label>
            <Input
              id="bot-avatar"
              data-field="botAvatar"
              placeholder="Enter avatar URL"
              value={botAvatar}
              onChange={(e) => handleBotAvatarChange(e.target.value)}
              className={cn(
                errors.botAvatar &&
                "border-destructive focus-visible:ring-destructive",
              )}
            />
            {errors.botAvatar && (
              <p className="text-xs text-destructive mt-1">
                {errors.botAvatar}
              </p>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-trigger">Auto Trigger</Label>
                <p className="text-sm text-muted-foreground">
                  Show a proactive message after a delay
                </p>
              </div>
              <Switch
                id="auto-trigger"
                checked={autoTrigger.enabled}
                onCheckedChange={(enabled) =>
                  onAutoTriggerChange({ ...autoTrigger, enabled })
                }
              />
            </div>

            {autoTrigger.enabled && (
              <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                <div className="space-y-2">
                  <Label>Delay: {autoTrigger.delay} seconds</Label>
                  <Slider
                    value={[autoTrigger.delay]}
                    min={1}
                    max={60}
                    step={1}
                    onValueChange={(value) =>
                      onAutoTriggerChange({ ...autoTrigger, delay: value[0] })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auto-trigger-message">Trigger Message</Label>
                  <Input
                    id="auto-trigger-message"
                    data-field="autoTriggerMessage"
                    placeholder="Enter trigger message"
                    value={autoTrigger.message}
                    onChange={(e) =>
                      onAutoTriggerChange({
                        ...autoTrigger,
                        message: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BehaviorControls;

import React from "react";
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
import type { WidgetConfig } from "@/hooks/useWidgetConfiguration";

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
}) => {
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
              onChange={(e) => onWelcomeMessageChange(e.target.value)}
              className={cn(
                errors.welcomeMessage &&
                  "border-destructive focus-visible:ring-destructive",
              )}
            />
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
              onChange={(e) => onPlaceholderChange(e.target.value)}
              className={cn(
                errors.placeholder &&
                  "border-destructive focus-visible:ring-destructive",
              )}
            />
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
              placeholder="Enter bot name"
              value={botName}
              onChange={(e) => onBotNameChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-avatar">Bot Avatar URL</Label>
            <Input
              id="bot-avatar"
              placeholder="Enter avatar URL"
              value={botAvatar}
              onChange={(e) => onBotAvatarChange(e.target.value)}
            />
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

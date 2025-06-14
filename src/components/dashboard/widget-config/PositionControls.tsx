import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";

interface PositionControlsProps {
  widgetPosition: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  onPositionChange: (
    position: "bottom-right" | "bottom-left" | "top-right" | "top-left",
  ) => void;
  widgetTheme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
  widgetWidth: number;
  onWidthChange: (width: number) => void;
  widgetHeight: number;
  onHeightChange: (height: number) => void;
}

const PositionControls: React.FC<PositionControlsProps> = ({
  widgetPosition,
  onPositionChange,
  widgetTheme,
  onThemeChange,
  widgetWidth,
  onWidthChange,
  widgetHeight,
  onHeightChange,
}) => {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-card to-card/80">
        <CardHeader>
          <CardTitle>Widget Position</CardTitle>
          <CardDescription>
            Choose where the widget appears on your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className={
                widgetPosition === "top-left"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }
              onClick={() => onPositionChange("top-left")}
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              <ArrowLeft className="h-4 w-4" />
              Top Left
            </Button>
            <Button
              variant="outline"
              className={
                widgetPosition === "top-right"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }
              onClick={() => onPositionChange("top-right")}
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              <ArrowRight className="h-4 w-4" />
              Top Right
            </Button>
            <Button
              variant="outline"
              className={
                widgetPosition === "bottom-left"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }
              onClick={() => onPositionChange("bottom-left")}
            >
              <ArrowDown className="h-4 w-4 mr-1" />
              <ArrowLeft className="h-4 w-4" />
              Bottom Left
            </Button>
            <Button
              variant="outline"
              className={
                widgetPosition === "bottom-right"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }
              onClick={() => onPositionChange("bottom-right")}
            >
              <ArrowDown className="h-4 w-4 mr-1" />
              <ArrowRight className="h-4 w-4" />
              Bottom Right
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Widget Theme</CardTitle>
          <CardDescription>
            Choose between light and dark themes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              className={
                widgetTheme === "light"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }
              onClick={() => onThemeChange("light")}
            >
              <Sun className="h-4 w-4 mr-1" />
              Light
            </Button>
            <Button
              variant="outline"
              className={
                widgetTheme === "dark"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }
              onClick={() => onThemeChange("dark")}
            >
              <Moon className="h-4 w-4 mr-1" />
              Dark
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Widget Size</CardTitle>
          <CardDescription>
            Adjust the dimensions of your chat widget
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Width: {widgetWidth}px</Label>
            </div>
            <Slider
              value={[widgetWidth]}
              min={250}
              max={450}
              step={10}
              onValueChange={(value) => onWidthChange(value[0])}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Height: {widgetHeight}px</Label>
            </div>
            <Slider
              value={[widgetHeight]}
              min={400}
              max={600}
              step={10}
              onValueChange={(value) => onHeightChange(value[0])}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PositionControls;

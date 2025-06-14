import React from "react";
import { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import IconWrapper from "./common/IconWrapper";
import GradientText from "./common/GradientText";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  variant?: "default" | "elevated" | "minimal";
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className,
  variant = "default",
}) => {
  const getCardClasses = () => {
    switch (variant) {
      case "elevated":
        return "border-0 shadow-2xl shadow-violet-500/20 hover:shadow-3xl hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105 bg-card/90 backdrop-blur-sm";
      case "minimal":
        return "border border-violet-200/50 dark:border-violet-800/50 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-300 bg-card/50";
      default:
        return "border-0 shadow-xl shadow-violet-500/10 hover:shadow-2xl hover:shadow-violet-500/15 transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm";
    }
  };

  return (
    <Card className={`${getCardClasses()} ${className || ""}`}>
      <CardHeader>
        <IconWrapper icon={icon} size="md" variant="default" />
        <CardTitle className="text-xl">
          <GradientText variant="primary">{title}</GradientText>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;

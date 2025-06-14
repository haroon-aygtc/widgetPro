import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Play,
  Trophy,
  Target,
  Zap,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  action: string;
  target?: string;
  completed: boolean;
}

interface InteractiveTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
  className?: string;
}

const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({
  onComplete,
  onSkip,
  className = "",
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(true);

  const tutorialSteps: TutorialStep[] = [
    {
      id: "welcome",
      title: "Welcome to ChatWidget Pro!",
      description:
        "Let's get you started with a quick 3-minute tour of the platform.",
      action: "Get Started",
      completed: false,
    },
    {
      id: "create-widget",
      title: "Create Your First Widget",
      description:
        "Click the 'New Widget' button to create your first AI chat widget.",
      action: "Create Widget",
      target: "[data-tutorial='new-widget']",
      completed: false,
    },
    {
      id: "customize-design",
      title: "Customize Your Design",
      description: "Choose colors, position, and theme to match your brand.",
      action: "Customize Design",
      target: "[data-tutorial='design-tab']",
      completed: false,
    },
    {
      id: "setup-ai",
      title: "Connect AI Provider",
      description:
        "Connect your preferred AI provider for intelligent responses.",
      action: "Setup AI",
      target: "[data-tutorial='ai-models']",
      completed: false,
    },
    {
      id: "embed-code",
      title: "Get Your Embed Code",
      description: "Copy the embed code and add it to your website.",
      action: "Get Code",
      target: "[data-tutorial='embed-code']",
      completed: false,
    },
  ];

  const progress = (completedSteps.size / tutorialSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps((prev) => new Set([...prev, stepId]));
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    onSkip();
  };

  const currentStepData = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",
        className,
      )}
    >
      <Card className="w-full max-w-2xl bg-gradient-to-br from-card to-card/80 shadow-2xl border-0">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="absolute top-4 right-4 h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Play className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Interactive Tutorial
              </CardTitle>
              <CardDescription className="text-base">
                Step {currentStep + 1} of {tutorialSteps.length}
              </CardDescription>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current Step */}
          <div className="text-center space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <h3 className="text-xl font-semibold mb-2">
                {currentStepData.title}
              </h3>
              <p className="text-muted-foreground">
                {currentStepData.description}
              </p>
            </div>

            {/* Achievement Badges */}
            {completedSteps.size > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {Array.from(completedSteps).map((stepId) => {
                  const step = tutorialSteps.find((s) => s.id === stepId);
                  return (
                    <Badge
                      key={stepId}
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {step?.title}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-2">
            {tutorialSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-200",
                  index === currentStep
                    ? "bg-primary scale-125"
                    : completedSteps.has(step.id)
                      ? "bg-green-500"
                      : "bg-muted hover:bg-muted-foreground/20",
                )}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                Skip Tutorial
              </Button>

              <Button
                onClick={handleNext}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
              >
                {isLastStep ? (
                  <>
                    <Trophy className="h-4 w-4" />
                    Complete
                  </>
                ) : (
                  <>
                    {currentStepData.action}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveTutorial;

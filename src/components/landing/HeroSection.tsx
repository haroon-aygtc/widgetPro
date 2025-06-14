import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionContainer from "./common/SectionContainer";
import GradientText from "./common/GradientText";
import GradientButton from "./common/GradientButton";

interface HeroSectionProps {
  className?: string;
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonLink?: string;
  onSecondaryButtonClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  className,
  title = "AI-Powered Chat Widgets for Your Website",
  subtitle = "Deploy intelligent chat widgets in minutes. Connect multiple AI providers, integrate your knowledge base, and provide exceptional customer support 24/7.",
  primaryButtonText = "Start Building Now",
  secondaryButtonText = "Watch Demo",
  primaryButtonLink = "/register",
  onSecondaryButtonClick,
}) => {
  return (
    <SectionContainer padding="lg" className={className}>
      <div className="text-center">
        <div className="max-w-4xl mx-auto">
          <GradientText
            as="h1"
            variant="secondary"
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            {title}
          </GradientText>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GradientButton
              size="lg"
              variant="primary"
              className="text-lg px-8 py-6 hover:scale-105"
              asChild
            >
              <Link to={primaryButtonLink}>
                {primaryButtonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </GradientButton>
            <GradientButton
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={onSecondaryButtonClick}
            >
              {secondaryButtonText}
            </GradientButton>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default HeroSection;

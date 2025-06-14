import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionContainer from "./common/SectionContainer";
import GradientButton from "./common/GradientButton";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  className?: string;
  onButtonClick?: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({
  title = "Ready to Transform Your Customer Support?",
  subtitle = "Start building your AI-powered chat widget today. No credit card required for the free trial.",
  buttonText = "Get Started Free",
  buttonLink = "/register",
  className,
  onButtonClick,
}) => {
  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <SectionContainer
      background="cta"
      padding="lg"
      className={className}
    >
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-6">{title}</h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">{subtitle}</p>
        <GradientButton
          size="lg"
          variant="secondary"
          className="text-lg px-8 py-6 hover:scale-105"
          asChild={!onButtonClick}
          onClick={onButtonClick ? handleClick : undefined}
        >
          {onButtonClick ? (
            <>
              {buttonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          ) : (
            <Link to={buttonLink}>
              {buttonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </GradientButton>
      </div>
    </SectionContainer>
  );
};

export default CTASection;

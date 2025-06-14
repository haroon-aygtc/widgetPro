import React from "react";
import BenefitItem from "./BenefitItem";
import ChatDemo from "./ChatDemo";
import SectionContainer from "./common/SectionContainer";
import SectionHeader from "./common/SectionHeader";

interface BenefitsSectionProps {
  benefits: string[];
  title?: string;
  subtitle?: string;
  className?: string;
  showDemo?: boolean;
  demoVariant?: "default" | "elevated" | "minimal";
  layout?: "side-by-side" | "stacked";
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({
  benefits,
  title = "Why Choose ChatWidget Pro?",
  subtitle = "Join thousands of businesses that trust ChatWidget Pro to power their customer conversations with AI.",
  className,
  showDemo = true,
  demoVariant = "default",
  layout = "side-by-side",
}) => {
  const gridClasses = layout === "side-by-side"
    ? "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
    : "space-y-12";

  return (
    <SectionContainer padding="lg" className={className}>
      <div className={gridClasses}>
        <div>
          <SectionHeader
            title={title}
            subtitle={subtitle}
            centered={false}
            className="mb-8"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <BenefitItem key={index} text={benefit} />
            ))}
          </div>
        </div>
        {showDemo && <ChatDemo variant={demoVariant} />}
      </div>
    </SectionContainer>
  );
};

export default BenefitsSection;

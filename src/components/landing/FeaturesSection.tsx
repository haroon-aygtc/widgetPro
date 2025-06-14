import React from "react";
import { LucideIcon } from "lucide-react";
import FeatureCard from "./FeatureCard";
import SectionContainer from "./common/SectionContainer";
import SectionHeader from "./common/SectionHeader";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  features: Feature[];
  title?: string;
  subtitle?: string;
  className?: string;
  sectionId?: string;
  columns?: 1 | 2 | 3 | 4;
  cardVariant?: "default" | "elevated" | "minimal";
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  features,
  title = "Everything You Need",
  subtitle = "Powerful features to create, customize, and deploy AI chat widgets that convert visitors into customers.",
  className,
  sectionId = "features",
  columns = 3,
  cardVariant = "default",
}) => {
  const getGridClasses = () => {
    switch (columns) {
      case 1:
        return "grid grid-cols-1 gap-8";
      case 2:
        return "grid grid-cols-1 md:grid-cols-2 gap-8";
      case 4:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8";
      default:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
    }
  };

  return (
    <SectionContainer
      id={sectionId}
      background="gradient"
      padding="lg"
      className={className}
    >
      <SectionHeader title={title} subtitle={subtitle} />
      <div className={getGridClasses()}>
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            variant={cardVariant}
          />
        ))}
      </div>
    </SectionContainer>
  );
};

export default FeaturesSection;

import React from "react";
import Logo from "./common/Logo";
import NavigationMenu from "./navigation/NavigationMenu";

interface LandingHeaderProps {
  className?: string;
  navigationItems?: Array<{
    label: string;
    href: string;
    variant?: "ghost" | "default" | "primary";
    external?: boolean;
  }>;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({
  className,
  navigationItems
}) => {
  return (
    <header className={`border-b bg-card/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm shadow-violet-500/5 ${className || ""}`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Logo size="md" />
        <NavigationMenu items={navigationItems} />
      </div>
    </header>
  );
};

export default LandingHeader;

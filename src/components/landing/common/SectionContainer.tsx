import React from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  background?: "default" | "gradient" | "accent" | "cta";
  padding?: "sm" | "md" | "lg" | "xl";
  id?: string;
}

const backgroundVariants = {
  default: "",
  gradient: "bg-gradient-to-r from-violet-50/50 via-purple-50/30 to-indigo-50/50 dark:from-violet-950/20 dark:via-purple-950/10 dark:to-indigo-950/20",
  accent: "bg-card/80 backdrop-blur-xl",
  cta: "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden",
};

const paddingVariants = {
  sm: "py-12 px-4",
  md: "py-16 px-4",
  lg: "py-20 px-4",
  xl: "py-24 px-4",
};

const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  className,
  containerClassName,
  background = "default",
  padding = "lg",
  id,
}) => {
  return (
    <section
      id={id}
      className={cn(
        paddingVariants[padding],
        backgroundVariants[background],
        className
      )}
    >
      {background === "cta" && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/90 via-purple-600/90 to-indigo-600/90"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23ffffff fill-opacity=0.05%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        </>
      )}
      <div className={cn(
        "container mx-auto",
        background === "cta" && "relative z-10",
        containerClassName
      )}>
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;

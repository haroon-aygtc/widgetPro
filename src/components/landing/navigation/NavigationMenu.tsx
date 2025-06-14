import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import NavLink from "./NavLink";

interface NavigationItem {
  label: string;
  href: string;
  variant?: "ghost" | "default" | "primary";
  external?: boolean;
}

interface NavigationMenuProps {
  items?: NavigationItem[];
  showThemeToggle?: boolean;
  className?: string;
}

const defaultItems: NavigationItem[] = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Sign In", href: "/login" },
  { label: "Get Started", href: "/register", variant: "primary" },
];

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  items = defaultItems,
  showThemeToggle = true,
  className,
}) => {
  return (
    <div className={`flex items-center space-x-4 ${className || ""}`}>
      {items.map((item, index) => (
        <NavLink
          key={index}
          to={item.href}
          variant={item.variant}
          external={item.external}
        >
          {item.label}
        </NavLink>
      ))}
      {showThemeToggle && <ThemeToggle />}
    </div>
  );
};

export default NavigationMenu;

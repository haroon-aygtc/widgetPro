# Landing Page Components

This directory contains a comprehensive set of reusable components for building landing pages. All components are broken down into small, focused pieces that maintain consistency with the existing codebase and design system.

## Architecture

The components are organized into logical groups:

- **Main Components**: Complete sections (Header, Hero, Features, etc.)
- **Common Components**: Shared utilities (GradientText, Logo, SectionContainer, etc.)
- **Navigation Components**: Navigation-specific elements
- **Chat Components**: Chat demo related components

## Main Components

### LandingHeader
Header component with navigation, logo, and action buttons.

**Props:**
- `className?: string` - Additional CSS classes
- `navigationItems?: NavigationItem[]` - Custom navigation items

**Features:**
- Uses Logo and NavigationMenu components
- Responsive navigation
- Theme toggle integration
- Sticky positioning

### HeroSection
Main hero section with title, subtitle, and call-to-action buttons.

**Props:**
- `className?: string` - Additional CSS classes
- `title?: string` - Main headline (default: "AI-Powered Chat Widgets for Your Website")
- `subtitle?: string` - Subtitle text
- `primaryButtonText?: string` - Primary button text (default: "Start Building Now")
- `secondaryButtonText?: string` - Secondary button text (default: "Watch Demo")
- `primaryButtonLink?: string` - Primary button link (default: "/register")
- `onSecondaryButtonClick?: () => void` - Secondary button click handler

### FeatureCard
Individual feature card component.

**Props:**
- `icon: LucideIcon` - Lucide icon component
- `title: string` - Feature title
- `description: string` - Feature description
- `className?: string` - Additional CSS classes

### FeaturesSection
Section displaying multiple feature cards in a grid.

**Props:**
- `features: Feature[]` - Array of feature objects
- `title?: string` - Section title (default: "Everything You Need")
- `subtitle?: string` - Section subtitle
- `className?: string` - Additional CSS classes
- `sectionId?: string` - HTML id attribute (default: "features")

### BenefitItem
Individual benefit item with checkmark icon.

**Props:**
- `text: string` - Benefit text
- `className?: string` - Additional CSS classes

### BenefitsSection
Section displaying benefits list and optional chat demo.

**Props:**
- `benefits: string[]` - Array of benefit strings
- `title?: string` - Section title (default: "Why Choose ChatWidget Pro?")
- `subtitle?: string` - Section subtitle
- `className?: string` - Additional CSS classes
- `showDemo?: boolean` - Whether to show chat demo (default: true)

### ChatDemo
Interactive chat demo component.

**Props:**
- `messages?: ChatMessage[]` - Array of chat messages
- `className?: string` - Additional CSS classes

**ChatMessage Interface:**
```typescript
interface ChatMessage {
  text: string;
  isUser?: boolean;
}
```

### CTASection
Call-to-action section with gradient background.

**Props:**
- `title?: string` - Section title (default: "Ready to Transform Your Customer Support?")
- `subtitle?: string` - Section subtitle
- `buttonText?: string` - Button text (default: "Get Started Free")
- `buttonLink?: string` - Button link (default: "/register")
- `className?: string` - Additional CSS classes
- `onButtonClick?: () => void` - Button click handler

### FooterSection
Footer with company info and navigation links.

**Props:**
- `columns?: FooterColumn[]` - Array of footer columns
- `companyName?: string` - Company name (default: "ChatWidget Pro")
- `companyDescription?: string` - Company description
- `copyrightText?: string` - Copyright text
- `className?: string` - Additional CSS classes

**FooterColumn Interface:**
```typescript
interface FooterColumn {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}
```

### FooterLink
Individual footer link component.

**Props:**
- `to: string` - Link destination
- `children: React.ReactNode` - Link content
- `className?: string` - Additional CSS classes

## Usage Example

```tsx
import React from "react";
import {
  LandingHeader,
  HeroSection,
  FeaturesSection,
  BenefitsSection,
  CTASection,
  FooterSection,
} from "@/components/landing";

const MyLandingPage = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Feature Title",
      description: "Feature description",
    },
    // ... more features
  ];

  const benefits = [
    "Benefit 1",
    "Benefit 2",
    // ... more benefits
  ];

  return (
    <div>
      <LandingHeader />
      <HeroSection />
      <FeaturesSection features={features} />
      <BenefitsSection benefits={benefits} />
      <CTASection />
      <FooterSection />
    </div>
  );
};
```

## Design Consistency

All components maintain consistency with the existing codebase:

- **Color Scheme**: Uses violet/purple gradient theme
- **Typography**: Follows existing font hierarchy
- **Spacing**: Uses consistent padding and margins
- **Animations**: Hover effects and transitions
- **Responsive**: Mobile-first responsive design
- **Accessibility**: Proper ARIA attributes and semantic HTML

## Customization

Components are highly customizable through props while maintaining design consistency. You can:

- Override default text content
- Add custom CSS classes
- Provide custom click handlers
- Customize data arrays (features, benefits, etc.)
- Show/hide optional elements

## Common Components

### GradientText
Reusable component for gradient text styling.

**Props:**
- `children: React.ReactNode` - Text content
- `variant?: "primary" | "secondary" | "accent"` - Gradient variant
- `as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"` - HTML element

### GradientButton
Enhanced button component with gradient styling.

**Props:**
- Extends Button props
- `variant?: "primary" | "secondary" | "outline"` - Button variant
- `gradient?: boolean` - Enable gradient styling

### Logo
Reusable logo component with icon and text.

**Props:**
- `size?: "sm" | "md" | "lg"` - Logo size
- `showText?: boolean` - Show company name

### SectionContainer
Wrapper component for consistent section styling.

**Props:**
- `background?: "default" | "gradient" | "accent" | "cta"` - Background variant
- `padding?: "sm" | "md" | "lg" | "xl"` - Padding size

### Enhanced Features

- **Atomic Design**: Components broken down to smallest reusable pieces
- **Variant System**: Consistent styling variants across components
- **Better Customization**: Multiple layout and style options
- **Enhanced Reusability**: Shared components across sections

## Dependencies

- React Router DOM (for navigation)
- Lucide React (for icons)
- Existing UI components (Button, Card, etc.)
- Tailwind CSS (for styling)

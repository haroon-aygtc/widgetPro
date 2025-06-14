import React from "react";
import {
  MessageSquare,
  Bot,
  Database,
  BarChart3,
  Zap,
  Shield,
  Globe,
  Users,
  Clock,
  Star,
} from "lucide-react";
import {
  LandingHeader,
  HeroSection,
  FeaturesSection,
  BenefitsSection,
  CTASection,
  FooterSection,
  // Import granular components for advanced customization
  SectionContainer,
  SectionHeader,
  GradientText,
  IconWrapper,
  FeatureCard,
} from "@/components/landing";

const LandingPage = () => {
  // Feature data for the features section
  const features = [
    {
      icon: MessageSquare,
      title: "Customizable Chat Widgets",
      description:
        "Create beautiful, responsive chat widgets that match your brand perfectly.",
    },
    {
      icon: Bot,
      title: "Multiple AI Providers",
      description:
        "Connect with OpenAI, Anthropic, Google AI, and more for the best AI responses.",
    },
    {
      icon: Database,
      title: "Knowledge Base Integration",
      description:
        "Enhance AI responses with your custom knowledge from documents and websites.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Track conversations, user engagement, and AI performance with detailed insights.",
    },
    {
      icon: Zap,
      title: "Real-time Responses",
      description:
        "Lightning-fast AI responses that keep your customers engaged.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-level security with encrypted data and secure API connections.",
    },
  ];

  // Benefits data for the benefits section
  const benefits = [
    "Easy 5-minute setup",
    "No coding required",
    "24/7 customer support",
    "Unlimited conversations",
    "Custom branding",
    "Multi-language support",
  ];

  // Additional stats data for custom section
  const stats = [
    {
      icon: Users,
      number: "10,000+",
      label: "Active Users",
      description: "Businesses trust our platform",
    },
    {
      icon: Globe,
      number: "50+",
      label: "Countries",
      description: "Worldwide coverage",
    },
    {
      icon: Clock,
      number: "24/7",
      label: "Support",
      description: "Always here to help",
    },
    {
      icon: Star,
      number: "4.9/5",
      label: "Rating",
      description: "Customer satisfaction",
    },
  ];

  // Testimonials data for custom section
  const testimonials = [
    {
      quote: "ChatWidget Pro transformed our customer support. Response times improved by 80% and customer satisfaction is at an all-time high.",
      author: "Sarah Johnson",
      role: "Customer Success Manager",
      company: "TechCorp Inc.",
    },
    {
      quote: "The AI integration is seamless and the customization options are incredible. Our chat widget perfectly matches our brand.",
      author: "Michael Chen",
      role: "Head of Product",
      company: "StartupXYZ",
    },
    {
      quote: "Implementation was incredibly easy. We were up and running in minutes, not hours. The ROI has been fantastic.",
      author: "Emily Rodriguez",
      role: "Operations Director",
      company: "GrowthCo",
    },
  ];

  // Custom navigation items
  const navigationItems = [
    { label: "Features", href: "#features" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Pricing", href: "#pricing" },
    { label: "Documentation", href: "/docs", external: true },
    { label: "Sign In", href: "/login" },
    { label: "Get Started", href: "/register", variant: "primary" as const },
  ];

  // Custom footer columns
  const footerColumns = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Documentation", href: "/docs" },
        { label: "API Reference", href: "/api" },
        { label: "Integrations", href: "/integrations" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
        { label: "Press Kit", href: "/press" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Community", href: "/community" },
        { label: "Status", href: "/status" },
        { label: "Security", href: "/security" },
        { label: "Privacy", href: "/privacy" },
      ],
    },
  ];

  // Handle demo button click
  const handleWatchDemo = () => {
    // Add demo functionality here
    console.log("Watch demo clicked");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-violet-50/30 dark:to-violet-950/30">
      {/* Header */}
      <LandingHeader navigationItems={navigationItems} />

      {/* Hero Section */}
      <HeroSection
        onSecondaryButtonClick={handleWatchDemo}
        title="AI-Powered Chat Widgets for Your Website"
        subtitle="Deploy intelligent chat widgets in minutes. Connect multiple AI providers, integrate your knowledge base, and provide exceptional customer support 24/7."
        primaryButtonText="Start Building Now"
        secondaryButtonText="Watch Demo"
      />

      {/* Features Section */}
      <FeaturesSection
        features={features}
        cardVariant="elevated"
        title="Everything You Need to Succeed"
        subtitle="Powerful features designed to transform your customer support experience with AI-powered conversations."
      />

      {/* Stats Section - Custom section using granular components */}
      <SectionContainer background="accent" padding="lg">
        <SectionHeader
          title="Trusted by Businesses Worldwide"
          subtitle="Join thousands of companies that have transformed their customer support with our platform"
          maxWidth="2xl"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <IconWrapper
                icon={stat.icon}
                variant="gradient"
                size="lg"
                className="mx-auto"
              />
              <GradientText
                variant="primary"
                as="h3"
                className="text-3xl font-bold mb-2"
              >
                {stat.number}
              </GradientText>
              <h4 className="text-lg font-semibold mb-1">{stat.label}</h4>
              <p className="text-muted-foreground text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Benefits Section */}
      <BenefitsSection
        benefits={benefits}
        demoVariant="elevated"
        title="Why Choose ChatWidget Pro?"
        subtitle="Join thousands of businesses that trust ChatWidget Pro to power their customer conversations with AI."
      />

      {/* Testimonials Section - Custom section using granular components */}
      <SectionContainer background="gradient" padding="lg" id="testimonials">
        <SectionHeader
          title="What Our Customers Say"
          subtitle="Don't just take our word for it. Here's what real customers have to say about their experience."
          maxWidth="2xl"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-xl shadow-violet-500/10 hover:shadow-2xl hover:shadow-violet-500/15 transition-all duration-300 border border-violet-200/20 dark:border-violet-800/20"
            >
              <div className="mb-4">
                <IconWrapper
                  icon={Star}
                  variant="gradient"
                  size="sm"
                  className="mb-3"
                />
                <blockquote className="text-muted-foreground italic">
                  "{testimonial.quote}"
                </blockquote>
              </div>
              <div className="border-t border-violet-200/20 dark:border-violet-800/20 pt-4">
                <GradientText variant="primary" className="font-semibold">
                  {testimonial.author}
                </GradientText>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* CTA Section */}
      <CTASection
        title="Ready to Transform Your Customer Support?"
        subtitle="Join thousands of businesses already using ChatWidget Pro. Start your free trial today - no credit card required."
        buttonText="Start Free Trial"
      />

      {/* Footer */}
      <FooterSection
        columns={footerColumns}
        companyDescription="The most powerful AI chat widget platform for modern businesses. Transform your customer support with intelligent conversations."
        copyrightText="© 2024 ChatWidget Pro. All rights reserved. Built with ❤️ for amazing customer experiences."
      />
    </div>
  );
};

export default LandingPage;

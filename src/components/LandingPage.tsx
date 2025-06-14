import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InteractiveTutorial from "@/components/onboarding/InteractiveTutorial";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
  ArrowRight,
  CheckCircle,
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
  const [showTutorial, setShowTutorial] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("chatwidget-visited");
    if (!hasVisited) {
      setIsFirstVisit(true);
      setShowTutorial(true);
      localStorage.setItem("chatwidget-visited", "true");
    }
  }, []);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    localStorage.setItem("chatwidget-tutorial-completed", "true");
  };

  const handleTutorialSkip = () => {
    setShowTutorial(false);
  };
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
    <>
      {showTutorial && (
        <InteractiveTutorial
          onComplete={handleTutorialComplete}
          onSkip={handleTutorialSkip}
        />
      )}
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-violet-50/30 dark:to-violet-950/30">
        {/* Header */}
        <header className="border-b bg-card/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm shadow-violet-500/5">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <MessageSquare className="h-8 w-8 mr-3 text-transparent bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text" />
                <div className="absolute inset-0 h-8 w-8 mr-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-sm blur-sm opacity-20"></div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                ChatWidget Pro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                asChild
                className="hover:bg-violet-50 dark:hover:bg-violet-950/50"
              >
                <Link to="#features">Features</Link>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="hover:bg-violet-50 dark:hover:bg-violet-950/50"
              >
                <Link to="#pricing">Pricing</Link>
              </Button>
              <ThemeToggle />
              <Button
                asChild
                variant="ghost"
                className="hover:bg-violet-50 dark:hover:bg-violet-950/50"
              >
                <Link to="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300"
              >
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                AI-Powered Chat Widgets for Your Website
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Deploy intelligent chat widgets in minutes. Connect multiple AI
                providers, integrate your knowledge base, and provide
                exceptional customer support 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-xl shadow-violet-500/25 hover:shadow-2xl hover:shadow-violet-500/30 transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link to="/register">
                    Start Building Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-950/50 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-300"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-20 px-4 bg-gradient-to-r from-violet-50/50 via-purple-50/30 to-indigo-50/50 dark:from-violet-950/20 dark:via-purple-950/10 dark:to-indigo-950/20"
        >
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful features to create, customize, and deploy AI chat
                widgets that convert visitors into customers.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className="border-0 shadow-xl shadow-violet-500/10 hover:shadow-2xl hover:shadow-violet-500/15 transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm"
                  >
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl flex items-center justify-center mb-4 border border-violet-200/50 dark:border-violet-800/50">
                        <Icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                      </div>
                      <CardTitle className="text-xl text-violet-700 dark:text-violet-300">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  Why Choose ChatWidget Pro?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join thousands of businesses that trust ChatWidget Pro to
                  power their customer conversations with AI.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8">
                  <div className="bg-card rounded-xl p-6 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-white" />
                      </div>
                      <span className="ml-3 font-medium">AI Assistant</span>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm">
                          Hello! How can I help you today?
                        </p>
                      </div>
                      <div className="bg-primary/10 rounded-lg p-3 ml-8">
                        <p className="text-sm">
                          I need help with your pricing plans.
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm">
                          I'd be happy to help! We offer flexible pricing plans
                          starting at $29/month...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/90 via-purple-600/90 to-indigo-600/90"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23ffffff fill-opacity=0.05%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          <div className="container mx-auto text-center relative z-10">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Customer Support?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Start building your AI-powered chat widget today. No credit card
              required for the free trial.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 bg-white/95 text-violet-600 hover:bg-white hover:text-violet-700 shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              asChild
            >
              <Link to="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-card py-12 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <MessageSquare className="h-6 w-6 mr-2 text-primary" />
                  <span className="text-lg font-bold">ChatWidget Pro</span>
                </div>
                <p className="text-muted-foreground">
                  The most powerful AI chat widget platform for modern
                  businesses.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link to="#" className="hover:text-foreground">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-foreground">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-foreground">
                      Documentation
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link to="#" className="hover:text-foreground">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-foreground">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-foreground">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link to="#" className="hover:text-foreground">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-foreground">
                      Community
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-foreground">
                      Status
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
              <p>&copy; 2024 ChatWidget Pro. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;

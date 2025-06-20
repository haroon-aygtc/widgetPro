import React from "react";
import { Link } from "react-router-dom";
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
  Sparkles,
  TrendingUp,
  Award,
  Target,
  Rocket,
  Heart,
  Play,
  Menu,
  X,
  ChevronRight,
  Monitor,
  Smartphone,
  Palette,
  Settings,
  BarChart,
  MessageCircle,
  Headphones,
  Lock,
  Gauge,
  Lightbulb,
  Layers,
  Code,
  Workflow,
} from "lucide-react";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const features = [
    {
      icon: MessageCircle,
      title: "Smart Chat Widgets",
      description:
        "Beautiful, responsive chat widgets that adapt to your brand and engage visitors instantly.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Bot,
      title: "Multi-AI Integration",
      description:
        "Connect with OpenAI, Anthropic, Google AI, and more for intelligent conversations.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Database,
      title: "Knowledge Base",
      description:
        "Enhance AI responses with your custom knowledge from documents and websites.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: BarChart,
      title: "Advanced Analytics",
      description:
        "Track conversations, user engagement, and performance with detailed insights.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Palette,
      title: "Custom Branding",
      description:
        "Match your brand perfectly with extensive customization options.",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-level security with encrypted data and secure API connections.",
      color: "from-indigo-500 to-blue-500",
    },
  ];

  const testimonials = [
    {
      quote:
        "HelixChat transformed our customer support. Response times improved by 80% and satisfaction is at an all-time high.",
      author: "Sarah Johnson",
      role: "Customer Success Manager",
      company: "TechCorp Inc.",
      avatar: "SJ",
    },
    {
      quote:
        "The AI integration is seamless and the customization options are incredible. Our chat widget perfectly matches our brand.",
      author: "Michael Chen",
      role: "Head of Product",
      company: "StartupXYZ",
      avatar: "MC",
    },
    {
      quote:
        "Implementation was incredibly easy. We were up and running in minutes, not hours. The ROI has been fantastic.",
      author: "Emily Rodriguez",
      role: "Operations Director",
      company: "GrowthCo",
      avatar: "ER",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for trying out HelixChat",
      features: [
        "1 Widget",
        "100 Conversations/month",
        "Basic AI Models",
        "Email Support",
      ],
      popular: false,
      cta: "Get Started",
    },
    {
      name: "Professional",
      price: "$29",
      description: "Best for growing businesses",
      features: [
        "5 Widgets",
        "Unlimited Conversations",
        "All AI Models",
        "Knowledge Base",
        "Priority Support",
        "Custom Branding",
      ],
      popular: true,
      cta: "Choose Plan",
    },
    {
      name: "Enterprise",
      price: "$99",
      description: "For large organizations",
      features: [
        "Unlimited Widgets",
        "Unlimited Conversations",
        "All AI Models",
        "Advanced Analytics",
        "24/7 Phone Support",
        "Custom Integration",
        "SLA Guarantee",
      ],
      popular: false,
      cta: "Contact Sales",
    },
  ];

  const stats = [
    { icon: Users, number: "10,000+", label: "Active Users" },
    { icon: Globe, number: "50+", label: "Countries" },
    { icon: Clock, number: "24/7", label: "Support" },
    { icon: Star, number: "4.9/5", label: "Rating" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-600/25 group-hover:shadow-xl group-hover:shadow-teal-600/30 transition-all duration-300">
                <MessageSquare className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full animate-pulse shadow-sm"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
              HelixChat
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-600 to-emerald-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 relative group"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-600 to-emerald-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 relative group"
            >
              Reviews
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-600 to-emerald-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30 transition-all duration-300 px-6">
                Get Started
              </Button>
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-background/95 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-6 space-y-4">
              <a
                href="#features"
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Reviews
              </a>
              <Link
                to="/login"
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link to="/register" className="block pt-4">
                <Button className="w-full bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/40 via-teal-50/20 to-emerald-50/20 dark:from-slate-950/40 dark:via-teal-950/20 dark:to-emerald-950/20"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-teal-500/8 to-emerald-600/8 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-gradient-to-br from-cyan-500/6 to-teal-600/6 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-slate-100 to-teal-100 dark:from-slate-900/40 dark:to-teal-900/40 text-slate-700 dark:text-slate-300 text-sm font-medium mb-8 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Trusted by 10,000+ businesses worldwide
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                AI-Powered Chat
              </span>
              <br />
              <span className="bg-gradient-to-r from-teal-700 via-emerald-700 to-slate-700 bg-clip-text text-transparent">
                Widgets for Your Website
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Deploy intelligent chat widgets in minutes. Connect multiple AI
              providers, integrate your knowledge base, and provide exceptional
              customer support 24/7 with enterprise-grade security.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-lg px-10 py-6 h-auto shadow-xl shadow-teal-600/25 hover:shadow-2xl hover:shadow-teal-600/30 transition-all duration-300 hover:scale-105"
                >
                  <Rocket className="mr-3 h-5 w-5" />
                  Start Building Now
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-6 h-auto border-2 hover:bg-accent/50 transition-all duration-300 hover:scale-105"
              >
                <Play className="mr-3 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center border border-teal-200/50 dark:border-teal-800/50 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <Icon className="h-7 w-7 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/30 text-cyan-700 dark:text-cyan-300 text-sm font-medium mb-8 border border-cyan-200/50 dark:border-cyan-800/50 shadow-sm">
              <Target className="w-4 h-4 mr-2" />
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
              Everything You Need to
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                {" "}
                Succeed
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Comprehensive features designed to create, customize, and deploy AI chat widgets
              that convert visitors into customers and provide exceptional support experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative p-8 bg-card border rounded-3xl hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 hover:-translate-y-2"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-24 md:py-32 bg-gradient-to-br from-teal-50/30 via-emerald-50/20 to-cyan-50/20 dark:from-teal-950/20 dark:via-emerald-950/10 dark:to-cyan-950/10"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 text-rose-700 dark:text-rose-300 text-sm font-medium mb-8 border border-rose-200/50 dark:border-rose-800/50 shadow-sm">
              <Heart className="w-4 h-4 mr-2" />
              Customer Love
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
              What Our
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                {" "}
                Customers Say
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Don't just take our word for it. Here's what real customers have
              to say about their experience with HelixChat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card border rounded-3xl p-8 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <blockquote className="text-lg mb-8 leading-relaxed text-muted-foreground">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-lg">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-teal-600 dark:text-teal-400 font-medium">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-8 border border-green-200/50 dark:border-green-800/50 shadow-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Simple Pricing
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
              Choose Your
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                {" "}
                Perfect Plan
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Start free and scale as you grow. No hidden fees, no surprises.
              All plans include our core features with varying limits and support levels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-card border rounded-3xl p-8 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 hover:-translate-y-2 ${plan.popular ? "ring-2 ring-teal-500 scale-105" : ""
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-3 text-foreground">
                    {plan.name}
                  </h3>
                  <div className="text-5xl font-bold mb-3 text-foreground">
                    {plan.price}
                    {plan.price !== "Free" && (
                      <span className="text-xl text-muted-foreground">
                        /month
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-lg">{plan.description}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full py-6 text-lg ${plan.popular
                    ? "bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 shadow-lg"
                    : ""
                    }`}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/95 via-emerald-600/95 to-cyan-600/95"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23ffffff fill-opacity=0.05%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center px-8 py-4 rounded-full bg-white/20 text-white text-sm font-medium mb-8 backdrop-blur-sm border border-white/20 shadow-lg">
              <Rocket className="w-4 h-4 mr-2" />
              Join 10,000+ Happy Customers
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight">
              Ready to Transform Your Customer Support?
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed">
              Start building your AI-powered chat widget today. No credit card
              required for the free trial. Setup takes less than 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-12 py-6 h-auto bg-white/95 text-teal-700 hover:bg-white hover:text-teal-800 shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 hover:scale-105"
                >
                  <Rocket className="mr-3 h-5 w-5" />
                  Get Started Free
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-12 py-6 h-auto border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                <Play className="mr-3 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-80">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span className="text-sm">Enterprise Security</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span className="text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                <span className="text-sm">99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-full animate-pulse"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  HelixChat
                </span>
              </Link>
              <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md">
                Transform your website visitors into qualified leads with
                AI-powered chat widgets. Boost conversions and accelerate your
                marketing funnel.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors cursor-pointer">
                  <Globe className="h-5 w-5 text-muted-foreground hover:text-violet-600" />
                </div>
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors cursor-pointer">
                  <MessageSquare className="h-5 w-5 text-muted-foreground hover:text-violet-600" />
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
                Product
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#features"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Integrations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    API Docs
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
                Company
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
                Support
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Status
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="border-t mt-16 pt-12">
            <div className="max-w-md mx-auto text-center">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Stay in the loop
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Get product updates, marketing tips, and lead generation
                insights.
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 text-sm border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
                <Button className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground text-sm">
                &copy; 2024 HelixChat. All rights reserved.
              </p>
              <div className="flex items-center gap-8">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Terms
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

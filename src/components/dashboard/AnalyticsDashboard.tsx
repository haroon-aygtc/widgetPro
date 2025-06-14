import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Clock,
  Star,
  Download,
  Calendar,
  Filter,
  RefreshCw,
} from "lucide-react";

// Reusable Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  description?: string;
}

const MetricCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  description,
}: MetricCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600 dark:text-green-400";
      case "negative":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case "positive":
        return <TrendingUp className="h-3 w-3" />;
      case "negative":
        return <TrendingDown className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card to-card/80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          {change && (
            <div
              className={`flex items-center space-x-1 text-xs ${getChangeColor()}`}
            >
              {getChangeIcon()}
              <span>{change}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground/70">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Reusable Chart Placeholder Component
interface ChartPlaceholderProps {
  title: string;
  height?: string;
  description?: string;
}

const ChartPlaceholder = ({
  title,
  height = "h-64",
  description,
}: ChartPlaceholderProps) => (
  <div
    className={`${height} bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center space-y-2`}
  >
    <BarChart3 className="h-8 w-8 text-muted-foreground/50" />
    <p className="text-sm font-medium text-muted-foreground">{title}</p>
    {description && (
      <p className="text-xs text-muted-foreground/70 text-center max-w-xs">
        {description}
      </p>
    )}
  </div>
);

// Reusable Activity Item Component
interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  type: "conversation" | "widget" | "user" | "system";
  status?: "success" | "warning" | "error";
}

const ActivityItem = ({
  title,
  description,
  time,
  type,
  status = "success",
}: ActivityItemProps) => {
  const getTypeIcon = () => {
    switch (type) {
      case "conversation":
        return <MessageSquare className="h-4 w-4" />;
      case "widget":
        return <BarChart3 className="h-4 w-4" />;
      case "user":
        return <Users className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-600 dark:text-green-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "error":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-blue-600 dark:text-blue-400";
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
      <div className={`p-1.5 rounded-full ${getStatusColor()} bg-current/10`}>
        {getTypeIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground/70 mt-1">{time}</p>
      </div>
    </div>
  );
};

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("7d");
  const [selectedWidget, setSelectedWidget] = useState("all");

  // Mock data
  const metrics = {
    totalConversations: 1247,
    activeUsers: 892,
    avgResponseTime: "2.3s",
    satisfactionRate: "94%",
  };

  const widgets = [
    { id: "all", name: "All Widgets" },
    { id: "support", name: "Customer Support" },
    { id: "sales", name: "Sales Assistant" },
    { id: "faq", name: "Product FAQ" },
  ];

  const recentActivity = [
    {
      title: "High conversation volume",
      description:
        "Customer Support widget received 45 conversations in the last hour",
      time: "5 minutes ago",
      type: "conversation" as const,
      status: "success" as const,
    },
    {
      title: "New user engagement",
      description: "15 new users started conversations today",
      time: "1 hour ago",
      type: "user" as const,
      status: "success" as const,
    },
    {
      title: "Widget performance alert",
      description: "Sales Assistant response time increased by 12%",
      time: "2 hours ago",
      type: "widget" as const,
      status: "warning" as const,
    },
    {
      title: "System update completed",
      description: "Analytics system updated with new features",
      time: "4 hours ago",
      type: "system" as const,
      status: "success" as const,
    },
  ];

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-violet-50/20 dark:to-violet-950/20">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor your chat widget performance and user engagement
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="conversations"
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Conversations
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            {/* Executive Summary */}
            <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Executive Summary
                </CardTitle>
                <CardDescription>
                  Key insights and automated recommendations for your chat
                  widgets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">📈 Key Insights</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">↗️</span>
                        <span>Conversation volume increased 24% this week</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">💬</span>
                        <span>Peak activity: 2-4 PM (consider staffing)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600">⚡</span>
                        <span>
                          Response time improved by 15% with new AI model
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">🎯 Recommendations</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">🔧</span>
                        <span>Add more FAQ content for billing questions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">📱</span>
                        <span>Optimize widget for mobile (40% of traffic)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">🎨</span>
                        <span>
                          A/B test welcome message for better engagement
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goal Setting */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Goals & Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        Monthly Conversations
                      </span>
                      <span className="text-sm text-muted-foreground">
                        1,247 / 1,500
                      </span>
                    </div>
                    <Progress value={83} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        Customer Satisfaction
                      </span>
                      <span className="text-sm text-muted-foreground">
                        94% / 95%
                      </span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Response Time</span>
                      <span className="text-sm text-muted-foreground">
                        2.3s / 3.0s ✅
                      </span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Conversations"
                value={metrics.totalConversations.toLocaleString()}
                change="+12.5%"
                changeType="positive"
                icon={<MessageSquare className="h-5 w-5" />}
                description="vs last period"
              />
              <MetricCard
                title="Active Users"
                value={metrics.activeUsers.toLocaleString()}
                change="+8.2%"
                changeType="positive"
                icon={<Users className="h-5 w-5" />}
                description="unique visitors"
              />
              <MetricCard
                title="Avg Response Time"
                value={metrics.avgResponseTime}
                change="-0.3s"
                changeType="positive"
                icon={<Clock className="h-5 w-5" />}
                description="faster responses"
              />
              <MetricCard
                title="Satisfaction Rate"
                value={metrics.satisfactionRate}
                change="+2.1%"
                changeType="positive"
                icon={<Star className="h-5 w-5" />}
                description="user ratings"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conversation Trends</CardTitle>
                  <CardDescription>
                    Daily conversation volume over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartPlaceholder
                    title="Conversation Volume Chart"
                    description="Interactive chart showing daily conversation trends"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                  <CardDescription>
                    User interaction patterns and engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartPlaceholder
                    title="Engagement Metrics Chart"
                    description="Visual representation of user engagement data"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest events and system notifications
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {recentActivity.map((activity, index) => (
                    <ActivityItem key={index} {...activity} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Conversation Analytics</h2>
              <Select value={selectedWidget} onValueChange={setSelectedWidget}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {widgets.map((widget) => (
                    <SelectItem key={widget.id} value={widget.id}>
                      {widget.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Conversation Volume</CardTitle>
                  <CardDescription>
                    Hourly conversation distribution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartPlaceholder
                    title="Hourly Conversation Chart"
                    height="h-80"
                    description="Detailed breakdown of conversation patterns throughout the day"
                  />
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Topics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { topic: "Product Support", count: 156, percentage: 35 },
                      { topic: "Billing Questions", count: 89, percentage: 20 },
                      { topic: "Technical Issues", count: 67, percentage: 15 },
                      { topic: "General Inquiry", count: 45, percentage: 10 },
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{item.topic}</span>
                          <span className="text-muted-foreground">
                            {item.count}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Response Quality</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Avg Rating</span>
                        <Badge variant="outline">4.7/5.0</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Resolution Rate</span>
                        <Badge variant="outline">87%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">First Response</span>
                        <Badge variant="outline">92%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <h2 className="text-xl font-semibold">User Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>
                    New vs returning users over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartPlaceholder
                    title="User Growth Chart"
                    description="Track user acquisition and retention patterns"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Demographics</CardTitle>
                  <CardDescription>
                    Geographic and device distribution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartPlaceholder
                    title="Demographics Chart"
                    description="Visual breakdown of user demographics and device usage"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <h2 className="text-xl font-semibold">Performance Metrics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Response Times</CardTitle>
                  <CardDescription>
                    AI model performance and latency metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartPlaceholder
                    title="Response Time Chart"
                    description="Monitor AI response times and performance trends"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>
                    Uptime, errors, and system reliability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartPlaceholder
                    title="System Health Chart"
                    description="Track system uptime and error rates"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

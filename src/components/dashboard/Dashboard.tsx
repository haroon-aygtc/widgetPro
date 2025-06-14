import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  MessageSquare,
  Settings,
  PlusCircle,
  Database,
  Bot,
  LineChart,
  Trophy,
  Target,
  Zap,
  CheckCircle2,
  Star,
  TrendingUp,
} from "lucide-react";

const Dashboard = () => {
  const [achievements, setAchievements] = useState([
    {
      id: "first-widget",
      name: "First Widget Created",
      completed: true,
      points: 100,
    },
    {
      id: "ai-connected",
      name: "AI Provider Connected",
      completed: false,
      points: 150,
    },
    {
      id: "knowledge-base",
      name: "Knowledge Base Added",
      completed: false,
      points: 200,
    },
    {
      id: "first-conversation",
      name: "First Conversation",
      completed: true,
      points: 50,
    },
  ]);

  const [setupProgress, setSetupProgress] = useState({
    widgetCreated: true,
    aiConnected: false,
    knowledgeAdded: false,
    embedded: false,
  });

  const completedAchievements = achievements.filter((a) => a.completed);
  const totalPoints = completedAchievements.reduce(
    (sum, a) => sum + a.points,
    0,
  );
  const progressPercentage =
    (Object.values(setupProgress).filter(Boolean).length /
      Object.keys(setupProgress).length) *
    100;
  // Mock data for widgets
  const widgets = [
    {
      id: 1,
      name: "Customer Support",
      status: "active",
      conversations: 245,
      model: "GPT-4",
      lastUpdated: "2 hours ago",
    },
    {
      id: 2,
      name: "Sales Assistant",
      status: "active",
      conversations: 128,
      model: "Claude 3",
      lastUpdated: "1 day ago",
    },
    {
      id: 3,
      name: "Product FAQ",
      status: "draft",
      conversations: 0,
      model: "GPT-3.5",
      lastUpdated: "5 days ago",
    },
  ];

  // Mock data for recent activity
  const recentActivity = [
    {
      id: 1,
      type: "conversation",
      widget: "Customer Support",
      time: "10 minutes ago",
      user: "john@example.com",
    },
    {
      id: 2,
      type: "config",
      widget: "Sales Assistant",
      time: "2 hours ago",
      user: "admin@company.com",
    },
    {
      id: 3,
      type: "knowledge",
      widget: "Product FAQ",
      time: "1 day ago",
      user: "sarah@example.com",
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <header className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button size="sm" asChild>
              <Link to="/admin/widgets">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Widget
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-6">
        {/* Progress Tracking */}
        {progressPercentage < 100 && (
          <Alert className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <Target className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <strong>Setup Progress:</strong>{" "}
                {Math.round(progressPercentage)}% complete
                <div className="mt-2">
                  <Progress value={progressPercentage} className="h-2 w-64" />
                </div>
              </div>
              <Button size="sm" variant="outline">
                Continue Setup
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Achievement System */}
        {completedAchievements.length > 0 && (
          <Card className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <CardTitle className="text-yellow-800">
                    Achievements
                  </CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800 border-yellow-300"
                >
                  {totalPoints} Points
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {completedAchievements.map((achievement) => (
                  <Badge
                    key={achievement.id}
                    className="bg-yellow-500 text-white"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    {achievement.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Widgets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{widgets.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +1 from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">373</div>
              <p className="text-xs text-muted-foreground mt-1">
                +24% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active AI Models
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">
                GPT-4, Claude 3, GPT-3.5
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Widgets and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Widgets List */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Your Widgets</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/widgets">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New
                  </Link>
                </Button>
              </div>
              <CardDescription>
                Manage and monitor your chat widgets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {widgets.map((widget) => (
                  <div
                    key={widget.id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9 mr-3">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${widget.name}`}
                          alt={widget.name}
                        />
                        <AvatarFallback>
                          {widget.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{widget.name}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Badge
                            variant={
                              widget.status === "active" ? "default" : "outline"
                            }
                            className="mr-2"
                          >
                            {widget.status}
                          </Badge>
                          <span>{widget.conversations} conversations</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{widget.model}</p>
                      <p className="text-xs text-muted-foreground">
                        Updated {widget.lastUpdated}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin/widgets">View All Widgets</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      {activity.type === "conversation" ? (
                        <MessageSquare className="h-5 w-5 text-blue-500" />
                      ) : activity.type === "config" ? (
                        <Settings className="h-5 w-5 text-amber-500" />
                      ) : (
                        <Database className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {activity.type === "conversation"
                          ? "New conversation"
                          : activity.type === "config"
                            ? "Widget configured"
                            : "Knowledge base updated"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.widget}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <span>{activity.time}</span>
                        <Separator
                          orientation="vertical"
                          className="mx-2 h-3"
                        />
                        <span>{activity.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 justify-start"
              asChild
            >
              <Link to="/admin/widgets">
                <div className="flex flex-col items-start text-left">
                  <div className="flex items-center mb-2">
                    <PlusCircle className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-medium">Create New Widget</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Set up a new AI chat widget for your website
                  </p>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 justify-start"
              asChild
            >
              <Link to="/admin/ai-models">
                <div className="flex flex-col items-start text-left">
                  <div className="flex items-center mb-2">
                    <Bot className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-medium">Connect AI Provider</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add a new AI model provider to your account
                  </p>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 justify-start"
              asChild
            >
              <Link to="/admin/knowledge-base">
                <div className="flex flex-col items-start text-left">
                  <div className="flex items-center mb-2">
                    <Database className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-medium">Upload Knowledge Base</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enhance AI responses with custom knowledge
                  </p>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

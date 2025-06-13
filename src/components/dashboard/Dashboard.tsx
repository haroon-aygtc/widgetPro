import React from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";

const Dashboard = () => {
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
      {/* Dashboard Content */}
      <div className="p-6">
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

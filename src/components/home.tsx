import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  PlusCircle,
  Database,
  Bot,
  Grid3X3,
  List,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Copy,
  Settings,
} from "lucide-react";

const Home = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "draft">(
    "all",
  );

  // Mock data for widgets
  const widgets = [
    {
      id: 1,
      name: "Customer Support",
      status: "active",
      conversations: 245,
      model: "GPT-4",
      lastUpdated: "2 hours ago",
      description: "24/7 customer support chat widget",
      website: "support.company.com",
    },
    {
      id: 2,
      name: "Sales Assistant",
      status: "active",
      conversations: 128,
      model: "Claude 3",
      lastUpdated: "1 day ago",
      description: "AI-powered sales assistant for lead generation",
      website: "sales.company.com",
    },
    {
      id: 3,
      name: "Product FAQ",
      status: "draft",
      conversations: 0,
      model: "GPT-3.5",
      lastUpdated: "5 days ago",
      description: "Automated FAQ responses for product inquiries",
      website: "products.company.com",
    },
    {
      id: 4,
      name: "Technical Support",
      status: "active",
      conversations: 89,
      model: "GPT-4",
      lastUpdated: "3 hours ago",
      description: "Technical support and troubleshooting assistant",
      website: "tech.company.com",
    },
    {
      id: 5,
      name: "Onboarding Helper",
      status: "draft",
      conversations: 0,
      model: "Claude 3",
      lastUpdated: "1 week ago",
      description: "Guide new users through the onboarding process",
      website: "onboard.company.com",
    },
    {
      id: 6,
      name: "Billing Support",
      status: "active",
      conversations: 156,
      model: "GPT-3.5",
      lastUpdated: "6 hours ago",
      description: "Handle billing inquiries and payment issues",
      website: "billing.company.com",
    },
  ];

  // Filter widgets based on search and status
  const filteredWidgets = widgets.filter((widget) => {
    const matchesSearch =
      widget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      widget.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || widget.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
    <div className="bg-gradient-to-br from-background via-background to-violet-50/30 dark:to-violet-950/30">
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
                <div className="flex items-center space-x-2">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none border-l"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </div>
              </div>
              <CardDescription>
                Manage and monitor your chat widgets
              </CardDescription>

              {/* Search and Filter */}
              <div className="flex items-center space-x-4 pt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search widgets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("active")}
                  >
                    Active
                  </Button>
                  <Button
                    variant={filterStatus === "draft" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("draft")}
                  >
                    Draft
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredWidgets.map((widget) => (
                    <Card
                      key={widget.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${widget.name}`}
                                alt={widget.name}
                              />
                              <AvatarFallback>
                                {widget.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-sm">
                                {widget.name}
                              </h3>
                              <Badge
                                variant={
                                  widget.status === "active"
                                    ? "default"
                                    : "outline"
                                }
                                className="mt-1"
                              >
                                {widget.status}
                              </Badge>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground mb-3">
                          {widget.description}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              Conversations:
                            </span>
                            <span className="font-medium">
                              {widget.conversations}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              AI Model:
                            </span>
                            <span className="font-medium">{widget.model}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              Website:
                            </span>
                            <span className="font-medium text-primary">
                              {widget.website}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              Updated:
                            </span>
                            <span className="font-medium">
                              {widget.lastUpdated}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <div className="flex space-x-2 w-full">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredWidgets.map((widget) => (
                    <div
                      key={widget.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center flex-1">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${widget.name}`}
                            alt={widget.name}
                          />
                          <AvatarFallback>
                            {widget.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-semibold">{widget.name}</h3>
                            <Badge
                              variant={
                                widget.status === "active"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {widget.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {widget.description}
                          </p>
                          <div className="flex items-center space-x-6 text-xs text-muted-foreground">
                            <span>{widget.conversations} conversations</span>
                            <span>Model: {widget.model}</span>
                            <span>Website: {widget.website}</span>
                            <span>Updated {widget.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredWidgets.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No widgets found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || filterStatus !== "all"
                      ? "Try adjusting your search or filter criteria."
                      : "Create your first chat widget to get started."}
                  </p>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Widget
                  </Button>
                </div>
              )}
            </CardContent>
            {filteredWidgets.length > 0 && (
              <CardFooter>
                <div className="flex items-center justify-between w-full">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredWidgets.length} of {widgets.length} widgets
                  </p>
                  <Button variant="outline">Load More</Button>
                </div>
              </CardFooter>
            )}
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
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex flex-col items-start text-left">
                <div className="flex items-center mb-2">
                  <PlusCircle className="h-5 w-5 mr-2 text-primary" />
                  <span className="font-medium">Create New Widget</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Set up a new AI chat widget for your website
                </p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex flex-col items-start text-left">
                <div className="flex items-center mb-2">
                  <Bot className="h-5 w-5 mr-2 text-primary" />
                  <span className="font-medium">Connect AI Provider</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add a new AI model provider to your account
                </p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex flex-col items-start text-left">
                <div className="flex items-center mb-2">
                  <Database className="h-5 w-5 mr-2 text-primary" />
                  <span className="font-medium">Upload Knowledge Base</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enhance AI responses with custom knowledge
                </p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Save,
  Search,
  Filter,
  Star,
  Clock,
  User,
  Globe,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

// Reusable Template Card Component
interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    description: string;
    category: string;
    content: string;
    isDefault: boolean;
    isActive: boolean;
    lastModified: string;
    usage: number;
  };
  onEdit: (template: any) => void;
  onDelete: (id: string) => void;
  onDuplicate: (template: any) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

const TemplateCard = ({
  template,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleActive,
}: TemplateCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "customer-service":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "sales":
        return "bg-green-100 text-green-800 border-green-200";
      case "support":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "general":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card to-card/80 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              {template.isDefault && (
                <Badge variant="outline" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Default
                </Badge>
              )}
              <Badge
                variant="outline"
                className={`text-xs ${getCategoryColor(template.category)}`}
              >
                {template.category.replace("-", " ").toUpperCase()}
              </Badge>
            </div>
            <CardDescription className="text-sm">
              {template.description}
            </CardDescription>
          </div>
          <Switch
            checked={template.isActive}
            onCheckedChange={(checked) => onToggleActive(template.id, checked)}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {template.content}
          </p>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {template.lastModified}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {template.usage} uses
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDuplicate(template)}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(template)}>
          <Edit3 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(template.id)}
          disabled={template.isDefault}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Reusable Section Card Component
interface SectionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const SectionCard = ({
  title,
  description,
  icon,
  children,
  actions,
}: SectionCardProps) => (
  <Card className="bg-gradient-to-br from-card to-card/80">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        {actions}
      </div>
    </CardHeader>
    <CardContent className="space-y-4">{children}</CardContent>
  </Card>
);

interface PromptTemplatesProps {
  onSave?: (templates: any[]) => void;
  initialTemplates?: any[];
}

const PromptTemplates = ({
  onSave = () => {},
  initialTemplates = [],
}: PromptTemplatesProps) => {
  const [activeTab, setActiveTab] = useState("templates");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const [templates, setTemplates] = useState([
    {
      id: "1",
      name: "Customer Service Assistant",
      description: "Helpful and professional customer service responses",
      category: "customer-service",
      content:
        "You are a helpful customer service assistant. Always be polite, professional, and aim to resolve customer issues efficiently. If you cannot solve a problem, escalate it appropriately.",
      isDefault: true,
      isActive: true,
      lastModified: "2 days ago",
      usage: 245,
    },
    {
      id: "2",
      name: "Sales Support Bot",
      description: "Engaging sales assistant to help with product inquiries",
      category: "sales",
      content:
        "You are a knowledgeable sales assistant. Help customers understand our products, answer questions about features and pricing, and guide them toward making informed purchasing decisions. Be enthusiastic but not pushy.",
      isDefault: false,
      isActive: true,
      lastModified: "1 week ago",
      usage: 156,
    },
    {
      id: "3",
      name: "Technical Support",
      description: "Technical troubleshooting and support guidance",
      category: "support",
      content:
        "You are a technical support specialist. Help users troubleshoot issues, provide step-by-step solutions, and explain technical concepts in simple terms. Always ask clarifying questions to better understand the problem.",
      isDefault: false,
      isActive: false,
      lastModified: "3 days ago",
      usage: 89,
    },
    {
      id: "4",
      name: "General Assistant",
      description: "Versatile assistant for general inquiries",
      category: "general",
      content:
        "You are a helpful AI assistant. Provide accurate, helpful information and assist users with their questions and tasks. Be friendly, professional, and concise in your responses.",
      isDefault: false,
      isActive: true,
      lastModified: "5 days ago",
      usage: 312,
    },
  ]);

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    category: "general",
    content: "",
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "customer-service", label: "Customer Service" },
    { value: "sales", label: "Sales" },
    { value: "support", label: "Technical Support" },
    { value: "general", label: "General" },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditTemplate = (template: any) => {
    setEditingTemplate(template);
    setNewTemplate({
      name: template.name,
      description: template.description,
      category: template.category,
      content: template.content,
    });
    setIsEditing(true);
    setActiveTab("editor");
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  const handleDuplicateTemplate = (template: any) => {
    const newId = Date.now().toString();
    const duplicatedTemplate = {
      ...template,
      id: newId,
      name: `${template.name} (Copy)`,
      isDefault: false,
      isActive: false,
      lastModified: "Just now",
      usage: 0,
    };
    setTemplates([...templates, duplicatedTemplate]);
  };

  const handleToggleActive = (id: string, active: boolean) => {
    setTemplates(
      templates.map((t) => (t.id === id ? { ...t, isActive: active } : t)),
    );
  };

  const handleSaveTemplate = () => {
    setSaveStatus("saving");
    setIsLoading(true);

    setTimeout(() => {
      if (isEditing && editingTemplate) {
        // Update existing template
        setTemplates(
          templates.map((t) =>
            t.id === editingTemplate.id
              ? {
                  ...t,
                  ...newTemplate,
                  lastModified: "Just now",
                }
              : t,
          ),
        );
      } else {
        // Create new template
        const newId = Date.now().toString();
        const template = {
          id: newId,
          ...newTemplate,
          isDefault: false,
          isActive: true,
          lastModified: "Just now",
          usage: 0,
        };
        setTemplates([...templates, template]);
      }

      // Reset form
      setNewTemplate({
        name: "",
        description: "",
        category: "general",
        content: "",
      });
      setIsEditing(false);
      setEditingTemplate(null);
      setSaveStatus("saved");
      setIsLoading(false);

      // Switch back to templates tab
      setActiveTab("templates");

      // Reset status after 2 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    }, 1000);
  };

  const handleNewTemplate = () => {
    setNewTemplate({
      name: "",
      description: "",
      category: "general",
      content: "",
    });
    setIsEditing(false);
    setEditingTemplate(null);
    setActiveTab("editor");
  };

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case "saving":
        return "Saving...";
      case "saved":
        return "Saved!";
      case "error":
        return "Error - Retry";
      default:
        return isEditing ? "Update Template" : "Save Template";
    }
  };

  const getSaveButtonIcon = () => {
    switch (saveStatus) {
      case "saved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Save className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-violet-50/20 dark:to-violet-950/20">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Prompt Templates
            </h1>
            <p className="text-muted-foreground mt-2">
              Create and manage AI prompt templates for consistent responses
              across your chat widgets.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleNewTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>
        </div>
      </header>

      <div className="bg-background w-full p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              {isEditing ? "Edit Template" : "New Template"}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            {/* Search and Filter */}
            <Card className="bg-gradient-to-br from-card to-card/80">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Templates Grid */}
            {filteredTemplates.length === 0 ? (
              <Card className="bg-gradient-to-br from-card to-card/80">
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No templates found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || selectedCategory !== "all"
                      ? "Try adjusting your search or filter criteria."
                      : "Create your first prompt template to get started."}
                  </p>
                  <Button onClick={handleNewTemplate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onEdit={handleEditTemplate}
                    onDelete={handleDeleteTemplate}
                    onDuplicate={handleDuplicateTemplate}
                    onToggleActive={handleToggleActive}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            <SectionCard
              title={isEditing ? "Edit Template" : "Create New Template"}
              description={
                isEditing
                  ? "Modify the existing prompt template"
                  : "Design a new prompt template for your AI assistant"
              }
              icon={<Edit3 className="h-5 w-5" />}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      placeholder="Enter template name"
                      value={newTemplate.name}
                      onChange={(e) =>
                        setNewTemplate({ ...newTemplate, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-category">Category</Label>
                    <Select
                      value={newTemplate.category}
                      onValueChange={(value) =>
                        setNewTemplate({ ...newTemplate, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer-service">
                          Customer Service
                        </SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="support">
                          Technical Support
                        </SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Input
                    id="template-description"
                    placeholder="Brief description of the template's purpose"
                    value={newTemplate.description}
                    onChange={(e) =>
                      setNewTemplate({
                        ...newTemplate,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-content">Prompt Content</Label>
                  <Textarea
                    id="template-content"
                    placeholder="Enter the AI prompt instructions..."
                    value={newTemplate.content}
                    onChange={(e) =>
                      setNewTemplate({
                        ...newTemplate,
                        content: e.target.value,
                      })
                    }
                    className="min-h-[200px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    This prompt will be used to instruct the AI on how to behave
                    and respond to user messages.
                  </p>
                </div>

                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertTitle>Template Tips</AlertTitle>
                  <AlertDescription>
                    • Be specific about the AI's role and behavior
                    <br />
                    • Include examples of desired responses when helpful
                    <br />
                    • Consider the context and audience for your chat widget
                    <br />• Test your template thoroughly before deploying
                  </AlertDescription>
                </Alert>
              </div>
            </SectionCard>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setActiveTab("templates");
                  setIsEditing(false);
                  setEditingTemplate(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveTemplate}
                disabled={
                  isLoading ||
                  !newTemplate.name ||
                  !newTemplate.description ||
                  !newTemplate.content
                }
              >
                {getSaveButtonIcon()}
                <span className="ml-2">{getSaveButtonText()}</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SectionCard
              title="Template Settings"
              description="Configure global settings for prompt templates"
              icon={<Sparkles className="h-5 w-5" />}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4">
                  <div className="space-y-1 flex-1">
                    <Label className="text-sm font-medium">
                      Auto-activate new templates
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically activate newly created templates
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-4">
                  <div className="space-y-1 flex-1">
                    <Label className="text-sm font-medium">
                      Template versioning
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Keep history of template changes
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-4">
                  <div className="space-y-1 flex-1">
                    <Label className="text-sm font-medium">
                      Usage analytics
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Track template usage and performance
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Import & Export"
              description="Manage template data and backups"
              icon={<FileText className="h-5 w-5" />}
            >
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Export Templates
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Import Templates
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Export your templates as JSON for backup or sharing. Import
                  templates from other ChatWidget Pro instances.
                </p>
              </div>
            </SectionCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PromptTemplates;

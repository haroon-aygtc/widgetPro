import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DataTable from "@/components/ui/data-table";
import {
  Upload,
  FileText,
  Globe,
  Database,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  RefreshCw,
  HelpCircle,
  Zap,
  Clock,
  BarChart3,
  Settings,
  Download,
  Loader2,
} from "lucide-react";
import ErrorBoundary from "@/components/ui/error-boundary";
import {
  toastSuccess,
  toastError,
  toastInfo,
  toastWarning,
} from "@/components/ui/use-toast";

interface KnowledgeBaseConfigProps {
  knowledgeBaseId?: string;
  onSave?: (data: any) => void;
  onTest?: (data: any) => void;
}

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: string;
  status: string;
  uploadDate: string;
  chunks: number;
}

interface WebsiteItem {
  id: string;
  url: string;
  status: string;
  lastCrawled: string;
  pages: number;
  depth: number;
}

interface ApiItem {
  id: string;
  name: string;
  type: string;
  endpoint: string;
  status: string;
  lastSync: string;
}

const KnowledgeBaseConfig: React.FC<KnowledgeBaseConfigProps> = ({
  knowledgeBaseId = "",
  onSave = () => {},
  onTest = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("documents");
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [testQuery, setTestQuery] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Sample data for demonstration
  const [documents] = useState<DocumentItem[]>([
    {
      id: "1",
      name: "company-faq.pdf",
      type: "PDF",
      size: "2.4 MB",
      status: "processed",
      uploadDate: "2024-01-15",
      chunks: 45,
    },
    {
      id: "2",
      name: "product-manual.docx",
      type: "DOCX",
      size: "1.8 MB",
      status: "processing",
      uploadDate: "2024-01-16",
      chunks: 32,
    },
    {
      id: "3",
      name: "support-guide.txt",
      type: "TXT",
      size: "0.5 MB",
      status: "failed",
      uploadDate: "2024-01-14",
      chunks: 0,
    },
  ]);

  const [websites] = useState<WebsiteItem[]>([
    {
      id: "1",
      url: "https://yourcompany.com/support",
      status: "active",
      lastCrawled: "2 days ago",
      pages: 24,
      depth: 2,
    },
    {
      id: "2",
      url: "https://yourcompany.com/faq",
      status: "crawling",
      lastCrawled: "5 days ago",
      pages: 12,
      depth: 1,
    },
  ]);

  const [apis] = useState<ApiItem[]>([
    {
      id: "1",
      name: "Customer Support API",
      type: "REST",
      endpoint: "https://api.example.com/v1/support",
      status: "connected",
      lastSync: "1 hour ago",
    },
    {
      id: "2",
      name: "Knowledge Base API",
      type: "GraphQL",
      endpoint: "https://api.example.com/graphql",
      status: "error",
      lastSync: "3 days ago",
    },
  ]);

  const documentColumns = [
    {
      key: "name",
      header: "Document",
      render: (item: DocumentItem) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-muted-foreground">
              {item.type} • {item.size}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: DocumentItem) => (
        <Badge
          variant={
            item.status === "processed"
              ? "default"
              : item.status === "processing"
                ? "secondary"
                : "destructive"
          }
        >
          {item.status === "processed" && (
            <CheckCircle className="h-3 w-3 mr-1" />
          )}
          {item.status === "processing" && (
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          )}
          {item.status === "failed" && <AlertCircle className="h-3 w-3 mr-1" />}
          {item.status}
        </Badge>
      ),
    },
    {
      key: "chunks",
      header: "Chunks",
      render: (item: DocumentItem) => (
        <div className="text-center">
          <div className="font-medium">{item.chunks}</div>
          <div className="text-xs text-muted-foreground">text chunks</div>
        </div>
      ),
    },
    {
      key: "uploadDate",
      header: "Upload Date",
      render: (item: DocumentItem) => (
        <div className="text-sm text-muted-foreground">{item.uploadDate}</div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: DocumentItem) => (
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Preview document</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download document</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete document</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  const websiteColumns = [
    {
      key: "url",
      header: "Website",
      render: (item: WebsiteItem) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <Globe className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <div className="font-medium">{item.url}</div>
            <div className="text-sm text-muted-foreground">
              {item.pages} pages • Depth {item.depth}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: WebsiteItem) => (
        <Badge
          variant={
            item.status === "active"
              ? "default"
              : item.status === "crawling"
                ? "secondary"
                : "destructive"
          }
        >
          {item.status === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
          {item.status === "crawling" && (
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          )}
          {item.status}
        </Badge>
      ),
    },
    {
      key: "lastCrawled",
      header: "Last Crawled",
      render: (item: WebsiteItem) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{item.lastCrawled}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: WebsiteItem) => (
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Recrawl website</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Configure crawling</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove website</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  const apiColumns = [
    {
      key: "name",
      header: "API",
      render: (item: ApiItem) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Database className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-muted-foreground">
              {item.type} • {item.endpoint}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: ApiItem) => (
        <Badge
          variant={
            item.status === "connected"
              ? "default"
              : item.status === "syncing"
                ? "secondary"
                : "destructive"
          }
        >
          {item.status === "connected" && (
            <CheckCircle className="h-3 w-3 mr-1" />
          )}
          {item.status === "syncing" && (
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          )}
          {item.status === "error" && <AlertCircle className="h-3 w-3 mr-1" />}
          {item.status}
        </Badge>
      ),
    },
    {
      key: "lastSync",
      header: "Last Sync",
      render: (item: ApiItem) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{item.lastSync}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: ApiItem) => (
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sync API data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Configure API</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove API</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  const handleTest = async () => {
    if (!testQuery.trim()) {
      toastWarning({
        title: "Empty Query",
        description: "Please enter a test query before testing.",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) {
            resolve(true);
          } else {
            reject(new Error("Knowledge base connection failed"));
          }
        }, 1500);
      });

      setTestResult({
        success: true,
        message:
          "Knowledge base integration test successful! Found 3 relevant documents.",
      });

      toastSuccess({
        title: "Test Successful",
        description:
          "Knowledge base is working correctly and found relevant content!",
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : "Test failed",
      });

      toastError({
        title: "Test Failed",
        description:
          "Knowledge base test failed. Please check your configuration.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async () => {
    setUploadProgress(0);
    setIsUploading(true);

    try {
      // Simulate file upload progress
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            const newProgress = prev + 10;
            if (newProgress >= 100) {
              clearInterval(interval);
              setTimeout(() => resolve(true), 500);
              return 100;
            }
            return newProgress;
          });
        }, 200);
      });

      toastSuccess({
        title: "Files Uploaded",
        description:
          "Your files have been uploaded and processed successfully.",
      });
    } catch (error) {
      toastError({
        title: "Upload Failed",
        description: "Failed to upload files. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-violet-50/20 dark:to-violet-950/20">
        {/* Header */}
        <header className="border-b bg-card/80 backdrop-blur-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Knowledge Base
              </h1>
              <p className="text-muted-foreground mt-2">
                Enhance AI responses with custom knowledge sources
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
                <BarChart3 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">89 sources active</span>
              </div>
              <Button variant="outline" size="sm">
                <Database className="h-4 w-4 mr-2" />
                Sync All
              </Button>
            </div>
          </div>
        </header>

        <div className="bg-background w-full p-6 rounded-lg">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-700">24</div>
                    <div className="text-sm text-blue-600">Documents</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-700">8</div>
                    <div className="text-sm text-green-600">Websites</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Database className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-700">5</div>
                    <div className="text-sm text-purple-600">APIs</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-700">
                      1.2k
                    </div>
                    <div className="text-sm text-orange-600">Chunks</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs
            defaultValue="documents"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6 bg-muted/50">
              <TabsTrigger
                value="documents"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="websites" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Websites
              </TabsTrigger>
              <TabsTrigger value="apis" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                APIs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="space-y-6">
              {/* Upload Section */}
              <Card className="bg-gradient-to-br from-card to-card/80">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Upload Documents
                      </CardTitle>
                      <CardDescription>
                        Drag & drop or click to upload PDF, DOCX, TXT, or CSV
                        files
                      </CardDescription>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Supported formats: PDF, DOCX, TXT, CSV (max 10MB
                            each)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* One-Click Upload - Enhanced */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <button
                      onClick={handleFileUpload}
                      disabled={isUploading}
                      className="group relative h-32 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/60 transition-all duration-200 hover:shadow-lg hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                        <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-sm mb-1">
                          Upload Files
                        </div>
                        <div className="text-xs text-muted-foreground">
                          PDF, DOCX, TXT, CSV
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Click to browse
                        </div>
                      </div>
                      {isUploading && (
                        <div className="absolute inset-0 bg-background/80 rounded-xl flex items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      )}
                    </button>

                    <button
                      onClick={() => setActiveTab("websites")}
                      className="group h-32 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/60 transition-all duration-200 hover:shadow-lg hover:bg-primary/5"
                    >
                      <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition-colors">
                        <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-sm mb-1">
                          Crawl Website
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Auto-extract content
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Configure crawling
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab("apis")}
                      className="group h-32 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/60 transition-all duration-200 hover:shadow-lg hover:bg-primary/5"
                    >
                      <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40 transition-colors">
                        <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-sm mb-1">
                          Connect API
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Live data sync
                        </div>
                        <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                          Setup integration
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-primary/10 rounded-full">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-medium mb-2">
                          Drop files here or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Support for PDF, DOCX, TXT, CSV files up to 10MB each
                        </p>
                      </div>
                      <Button onClick={handleFileUpload} disabled={isUploading}>
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Select Files
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Content Quality Scoring */}
                  <Alert className="mt-6">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Content Quality Score</AlertTitle>
                    <AlertDescription>
                      Your knowledge base has a quality score of{" "}
                      <strong>92/100</strong>.
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>✅ Well-structured content</span>
                          <span>✅ Good coverage</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          💡 Suggestion: Add more FAQ content to improve
                          coverage
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>

                  {isUploading && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Uploading files...
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {uploadProgress}%
                        </span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Documents Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Documents</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Document
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={documents}
                    columns={documentColumns}
                    searchable
                    searchPlaceholder="Search documents..."
                    emptyMessage="No documents uploaded yet. Upload your first document to get started!"
                  />
                </CardContent>
              </Card>

              {/* Processing Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Processing Settings
                  </CardTitle>
                  <CardDescription>
                    Configure how documents are processed and indexed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="chunk-size"
                        className="flex items-center gap-2"
                      >
                        Chunk Size
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Size of text chunks for processing (smaller =
                                more precise, larger = more context)
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Select defaultValue="1024">
                        <SelectTrigger id="chunk-size">
                          <SelectValue placeholder="Select chunk size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="512">
                            512 tokens (Precise)
                          </SelectItem>
                          <SelectItem value="1024">
                            1024 tokens (Balanced)
                          </SelectItem>
                          <SelectItem value="2048">
                            2048 tokens (Contextual)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="overlap-size"
                        className="flex items-center gap-2"
                      >
                        Chunk Overlap
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Overlap between consecutive chunks to maintain
                                context
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Select defaultValue="200">
                        <SelectTrigger id="overlap-size">
                          <SelectValue placeholder="Select overlap size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100">
                            100 tokens (Minimal)
                          </SelectItem>
                          <SelectItem value="200">
                            200 tokens (Standard)
                          </SelectItem>
                          <SelectItem value="300">300 tokens (High)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <Switch id="auto-process" defaultChecked />
                    <Label htmlFor="auto-process">
                      Automatically process new uploads
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="websites" className="space-y-6">
              {/* Add Website */}
              <Card className="bg-gradient-to-br from-card to-card/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Website
                  </CardTitle>
                  <CardDescription>
                    Add website URLs to crawl and index content automatically
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        placeholder="https://example.com/support"
                        className="text-base"
                      />
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Website
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="follow-links" defaultChecked />
                      <Label htmlFor="follow-links">
                        Follow internal links
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="crawl-depth">Max Depth:</Label>
                      <Select defaultValue="2">
                        <SelectTrigger id="crawl-depth" className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 level</SelectItem>
                          <SelectItem value="2">2 levels</SelectItem>
                          <SelectItem value="3">3 levels</SelectItem>
                          <SelectItem value="4">4 levels</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Websites Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Crawled Websites</CardTitle>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={websites}
                    columns={websiteColumns}
                    searchable
                    searchPlaceholder="Search websites..."
                    emptyMessage="No websites added yet. Add your first website to start crawling!"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="apis" className="space-y-6">
              {/* Add API */}
              <Card className="bg-gradient-to-br from-card to-card/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Connect API
                  </CardTitle>
                  <CardDescription>
                    Connect external APIs to enhance your knowledge base
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-name">API Name</Label>
                      <Input id="api-name" placeholder="Customer Support API" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="api-type">API Type</Label>
                      <Select defaultValue="rest">
                        <SelectTrigger id="api-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rest">REST API</SelectItem>
                          <SelectItem value="graphql">GraphQL</SelectItem>
                          <SelectItem value="soap">SOAP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api-endpoint">API Endpoint</Label>
                    <Input
                      id="api-endpoint"
                      placeholder="https://api.example.com/v1/knowledge"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-auth">Authentication</Label>
                      <Select defaultValue="bearer">
                        <SelectTrigger id="api-auth">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="basic">Basic Auth</SelectItem>
                          <SelectItem value="bearer">Bearer Token</SelectItem>
                          <SelectItem value="apikey">API Key</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="api-token">API Token/Key</Label>
                      <Input
                        id="api-token"
                        type="password"
                        placeholder="Enter your API token"
                      />
                    </div>
                  </div>

                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Connect API
                  </Button>
                </CardContent>
              </Card>

              {/* APIs Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Connected APIs</CardTitle>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={apis}
                    columns={apiColumns}
                    searchable
                    searchPlaceholder="Search APIs..."
                    emptyMessage="No APIs connected yet. Connect your first API to enhance your knowledge base!"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Test Section */}
          <Card className="mt-8 bg-gradient-to-br from-card to-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Test Knowledge Base
              </CardTitle>
              <CardDescription>
                Test your knowledge base integration with a sample query
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-query">Test Query</Label>
                  <Input
                    id="test-query"
                    placeholder="What are your return policies?"
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    className="text-base"
                  />
                </div>

                {testResult && (
                  <Alert
                    variant={testResult.success ? "default" : "destructive"}
                  >
                    <div className="flex items-center gap-2">
                      {testResult.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <AlertDescription className="font-medium">
                        {testResult.message}
                      </AlertDescription>
                    </div>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <Switch id="use-knowledge-base" defaultChecked />
                <Label htmlFor="use-knowledge-base">
                  Enable knowledge base for AI responses
                </Label>
              </div>
              <Button
                onClick={handleTest}
                disabled={isProcessing || !testQuery.trim()}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Test Integration
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <Button variant="outline">Cancel</Button>
            <Button
              onClick={async () => {
                try {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  onSave({});
                  toastSuccess({
                    title: "Knowledge Base Saved",
                    description:
                      "Your knowledge base configuration has been saved successfully!",
                  });
                } catch (error) {
                  toastError({
                    title: "Save Failed",
                    description: "Failed to save knowledge base configuration.",
                  });
                }
              }}
              className="bg-gradient-to-r from-violet-600 to-purple-600"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Knowledge Base
            </Button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default KnowledgeBaseConfig;

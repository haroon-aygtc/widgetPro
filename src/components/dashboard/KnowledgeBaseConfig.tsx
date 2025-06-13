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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileText,
  Globe,
  Database,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface KnowledgeBaseConfigProps {
  knowledgeBaseId?: string;
  onSave?: (data: any) => void;
  onTest?: (data: any) => void;
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

  const handleTest = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setTestResult({
        success: true,
        message: "Knowledge base integration test successful!",
      });
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="bg-background w-full p-6 rounded-lg">
        <Tabs
          defaultValue="documents"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="documents" className="flex items-center gap-2">
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

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Upload</CardTitle>
                <CardDescription>
                  Upload PDF, DOCX, TXT, or CSV files to enhance your AI's
                  knowledge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-10 text-center">
                  <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    Drag and drop files here or click to browse
                  </p>
                  <Button variant="outline" size="sm">
                    Select Files
                  </Button>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">
                    Uploaded Documents
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>company-faq.pdf</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Remove
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>product-manual.docx</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Switch id="process-immediately" />
                  <Label htmlFor="process-immediately">
                    Process immediately
                  </Label>
                </div>
                <Button>Upload & Process</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Document Processing Options</CardTitle>
                <CardDescription>
                  Configure how documents are processed and indexed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chunk-size">Chunk Size</Label>
                    <Select defaultValue="1024">
                      <SelectTrigger id="chunk-size">
                        <SelectValue placeholder="Select chunk size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="512">512 tokens</SelectItem>
                        <SelectItem value="1024">1024 tokens</SelectItem>
                        <SelectItem value="2048">2048 tokens</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Size of text chunks for processing
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="overlap-size">Chunk Overlap</Label>
                    <Select defaultValue="200">
                      <SelectTrigger id="overlap-size">
                        <SelectValue placeholder="Select overlap size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 tokens</SelectItem>
                        <SelectItem value="200">200 tokens</SelectItem>
                        <SelectItem value="300">300 tokens</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Overlap between consecutive chunks
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="websites" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Website Crawling</CardTitle>
                <CardDescription>
                  Add website URLs to crawl and index content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website-url">Website URL</Label>
                  <div className="flex gap-2">
                    <Input id="website-url" placeholder="https://example.com" />
                    <Button>Add</Button>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Added Websites</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>https://yourcompany.com/support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Last crawled: 2 days ago
                        </span>
                        <Button variant="ghost" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>https://yourcompany.com/faq</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Last crawled: 5 days ago
                        </span>
                        <Button variant="ghost" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch id="follow-links" />
                      <Label htmlFor="follow-links">
                        Follow internal links
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="crawl-depth">Crawl Depth:</Label>
                      <Select defaultValue="2">
                        <SelectTrigger id="crawl-depth" className="w-24">
                          <SelectValue placeholder="Depth" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 level</SelectItem>
                          <SelectItem value="2">2 levels</SelectItem>
                          <SelectItem value="3">3 levels</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full">Start Crawling</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="apis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Integration</CardTitle>
                <CardDescription>
                  Connect external APIs to enhance knowledge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-name">API Name</Label>
                    <Input id="api-name" placeholder="Customer Support API" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-type">API Type</Label>
                    <Select defaultValue="rest">
                      <SelectTrigger id="api-type">
                        <SelectValue placeholder="Select API type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rest">REST</SelectItem>
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

                <div className="space-y-2">
                  <Label htmlFor="api-auth">Authentication</Label>
                  <Select defaultValue="bearer">
                    <SelectTrigger id="api-auth">
                      <SelectValue placeholder="Select authentication type" />
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

                <div className="space-y-2">
                  <Label htmlFor="request-body">
                    Request Body Template (JSON)
                  </Label>
                  <Textarea
                    id="request-body"
                    placeholder='{"query": "QUERY_PLACEHOLDER", "limit": 5}'
                    className="font-mono h-24"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use QUERY_PLACEHOLDER as placeholder for search queries
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save API Configuration</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Integration Test</CardTitle>
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
                      <AlertDescription>{testResult.message}</AlertDescription>
                    </div>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <Switch id="use-knowledge-base" defaultChecked />
                <Label htmlFor="use-knowledge-base">
                  Enable knowledge base for responses
                </Label>
              </div>
              <Button onClick={handleTest} disabled={isProcessing}>
                {isProcessing ? "Testing..." : "Test Integration"}
              </Button>
            </CardFooter>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button onClick={() => onSave({})}>Save Knowledge Base</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseConfig;

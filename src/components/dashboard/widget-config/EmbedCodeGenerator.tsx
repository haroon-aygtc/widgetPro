import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toastSuccess } from "@/components/ui/use-toast";

interface EmbedCodeGeneratorProps {
  widgetId?: string;
}

const EmbedCodeGenerator: React.FC<EmbedCodeGeneratorProps> = ({
  widgetId,
}) => {
  const [copied, setCopied] = useState(false);

  const generateEmbedCode = () => {
    return `<script src="https://chatwidget.pro/widget/${widgetId || "demo"}.js"></script>`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateEmbedCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      toastSuccess({
        title: "Code Copied",
        description: "Embed code has been copied to clipboard",
      });
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-card to-card/80">
        <CardHeader>
          <CardTitle>Embed Code</CardTitle>
          <CardDescription>
            Add this code to your website to display the chat widget
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md relative">
            <code className="text-sm font-mono break-all">
              {generateEmbedCode()}
            </code>
          </div>
          <Button variant="outline" className="mt-4" onClick={copyToClipboard}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Installation Guide</CardTitle>
          <CardDescription>
            Follow these steps to add the widget to your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-3 text-sm">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>Copy the embed code above</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>
                Paste it before the closing{" "}
                <code className="bg-muted px-1 rounded">&lt;/body&gt;</code> tag
                on your website
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>Save your changes and refresh your website</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4.</span>
              <span>The chat widget should now appear on your website</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Configuration</CardTitle>
          <CardDescription>Additional options for developers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Custom Initialization</h4>
              <div className="bg-muted p-4 rounded-md">
                <code className="text-sm font-mono whitespace-pre-wrap">
                  {`<script>
  window.ChatWidgetConfig = {
    autoOpen: false,
    position: 'bottom-right',
    theme: 'light'
  };
</script>
<script src="https://chatwidget.pro/widget/${widgetId || "demo"}.js"></script>`}
                </code>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Event Listeners</h4>
              <div className="bg-muted p-4 rounded-md">
                <code className="text-sm font-mono whitespace-pre-wrap">
                  {`<script>
  window.addEventListener('chatwidget:ready', function() {
    console.log('Chat widget is ready');
  });
  
  window.addEventListener('chatwidget:message', function(event) {
    console.log('New message:', event.detail);
  });
</script>`}
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmbedCodeGenerator;

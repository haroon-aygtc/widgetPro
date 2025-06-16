import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useWidgetConfiguration } from "@/hooks/useWidgetConfiguration";

interface QuickSetupWizardProps {
    onComplete: (data: any) => void;
    onCancel: () => void;
}

export const QuickSetupWizard: React.FC<QuickSetupWizardProps> = ({
    onComplete,
    onCancel,
}) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        widgetName: "",
        primaryColor: "#4f46e5",
        widgetPosition: "bottom-right",
        welcomeMessage: "Hello! How can I help you today?",
        botName: "AI Assistant",
        selectedTemplate: "default",
    });

    const { config, updateConfig } = useWidgetConfiguration();

    const handleNext = () => {
        setStep(step + 1);
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    const handleTabChange = (value: string) => {
        setStep(parseInt(value));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onComplete(formData);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Quick Setup Wizard</CardTitle>
                <CardDescription>
                    Welcome to the Quick Setup Wizard! Please fill out the following
                    information to get started.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <Tabs value={step.toString()} onValueChange={handleTabChange}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="1">Basic Info</TabsTrigger>
                            <TabsTrigger value="2">Appearance</TabsTrigger>
                            <TabsTrigger value="3">Messages</TabsTrigger>
                        </TabsList>

                        <TabsContent value="1" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="widgetName">Widget Name</Label>
                                <Input
                                    id="widgetName"
                                    value={formData.widgetName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, widgetName: e.target.value }))}
                                    placeholder="Enter widget name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="template">Template</Label>
                                <Select
                                    value={formData.selectedTemplate}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, selectedTemplate: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">Default</SelectItem>
                                        <SelectItem value="minimal">Minimal</SelectItem>
                                        <SelectItem value="modern">Modern</SelectItem>
                                        <SelectItem value="enterprise">Enterprise</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>

                        <TabsContent value="2" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="primaryColor">Primary Color</Label>
                                <Input
                                    id="primaryColor"
                                    type="color"
                                    value={formData.primaryColor}
                                    onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="position">Widget Position</Label>
                                <Select
                                    value={formData.widgetPosition}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, widgetPosition: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select position" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                                        <SelectItem value="top-right">Top Right</SelectItem>
                                        <SelectItem value="top-left">Top Left</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>

                        <TabsContent value="3" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                                <Input
                                    id="welcomeMessage"
                                    value={formData.welcomeMessage}
                                    onChange={(e) => setFormData(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                                    placeholder="Hello! How can I help you today?"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="botName">Bot Name</Label>
                                <Input
                                    id="botName"
                                    value={formData.botName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, botName: e.target.value }))}
                                    placeholder="AI Assistant"
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-between mt-6">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <div className="space-x-2">
                            {step > 1 && (
                                <Button type="button" variant="outline" onClick={handlePrevious}>
                                    Previous
                                </Button>
                            )}
                            {step < 3 ? (
                                <Button type="button" onClick={handleNext}>
                                    Next
                                </Button>
                            ) : (
                                <Button type="submit">
                                    Complete Setup
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
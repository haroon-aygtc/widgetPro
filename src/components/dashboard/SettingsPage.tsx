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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Key,
  Database,
  Mail,
  Smartphone,
  Save,
  AlertTriangle,
  CheckCircle2,
  Settings,
  CreditCard,
  Users,
  Lock,
} from "lucide-react";
import { toastUtils } from "@/components/ui/use-toast";
import { useOperationLoading } from "@/contexts/LoadingContext";

// Reusable Setting Item Component
interface SettingItemProps {
  title: string;
  description: string;
  children: React.ReactNode;
  badge?: string;
}

const SettingItem = ({
  title,
  description,
  children,
  badge,
}: SettingItemProps) => (
  <div className="flex items-center justify-between py-4">
    <div className="space-y-1 flex-1">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">{title}</Label>
        {badge && (
          <Badge variant="outline" className="text-xs">
            {badge}
          </Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <div className="ml-4">{children}</div>
  </div>
);

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

// Reusable Notification Item Component
interface NotificationItemProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  type?: "email" | "push" | "sms";
}

const NotificationItem = ({
  title,
  description,
  enabled,
  onToggle,
  type = "email",
}: NotificationItemProps) => {
  const getTypeIcon = () => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "push":
        return <Bell className="h-4 w-4" />;
      case "sms":
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
      <div className="flex items-center space-x-3">
        <div className="p-1.5 rounded bg-muted text-muted-foreground">
          {getTypeIcon()}
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  );
};

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  // Use unified loading state management
  const saveLoading = useOperationLoading("settings-save");

  // Profile settings state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    company: "",
    timezone: "UTC",
    language: "en",
  });

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: "24",
    passwordExpiry: "90",
    loginNotifications: true,
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      newConversations: true,
      systemAlerts: true,
      weeklyReports: false,
      securityAlerts: true,
    },
    pushNotifications: {
      newConversations: false,
      systemAlerts: true,
      weeklyReports: false,
      securityAlerts: true,
    },
  });

  // API settings state
  const [apiSettings, setApiSettings] = useState({
    rateLimitEnabled: true,
    maxRequestsPerHour: "1000",
    webhookUrl: "",
    apiVersion: "v1",
  });

  const handleSave = async (section: string) => {
    setSaveStatus("saving");
    saveLoading.start(`Saving ${section} settings...`);

    // Simulate API call
    setTimeout(() => {
      setSaveStatus("saved");
      saveLoading.stop();
      toastUtils.operationSuccess(
        `${section.charAt(0).toUpperCase() + section.slice(1)} settings save`,
      );

      // Reset status after 2 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    }, 1000);
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
        return "Save Changes";
    }
  };

  const getSaveButtonIcon = () => {
    switch (saveStatus) {
      case "saved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "error":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Save className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-teal-50/20 dark:to-teal-950/20">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your account, security, and application preferences
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleSave(activeTab)}
              disabled={saveLoading.isLoading}
              className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              <div className="group-hover:animate-pulse">
                {getSaveButtonIcon()}
              </div>
              <span className="font-medium">{getSaveButtonText()}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API & Integrations
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <SectionCard
              title="Profile Information"
              description="Update your personal information and preferences"
              icon={<User className="h-5 w-5" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        company: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={profileData.timezone}
                    onValueChange={(value) =>
                      setProfileData({ ...profileData, timezone: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-12">
                        UTC-12 (Baker Island)
                      </SelectItem>
                      <SelectItem value="UTC-8">
                        UTC-8 (Pacific Time)
                      </SelectItem>
                      <SelectItem value="UTC-5">
                        UTC-5 (Eastern Time)
                      </SelectItem>
                      <SelectItem value="UTC+0">
                        UTC+0 (Greenwich Mean Time)
                      </SelectItem>
                      <SelectItem value="UTC+1">
                        UTC+1 (Central European Time)
                      </SelectItem>
                      <SelectItem value="UTC+8">
                        UTC+8 (China Standard Time)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Preferences"
              description="Customize your application experience"
              icon={<Palette className="h-5 w-5" />}
            >
              <div className="space-y-4">
                <SettingItem
                  title="Language"
                  description="Choose your preferred language for the interface"
                >
                  <Select
                    value={profileData.language}
                    onValueChange={(value) =>
                      setProfileData({ ...profileData, language: value })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingItem>
                <Separator />
                <SettingItem
                  title="Theme"
                  description="Choose between light and dark mode"
                >
                  <Select defaultValue="system">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingItem>
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SectionCard
              title="Authentication"
              description="Manage your login security and authentication methods"
              icon={<Lock className="h-5 w-5" />}
            >
              <div className="space-y-4">
                <SettingItem
                  title="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                  badge={
                    securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"
                  }
                >
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({
                        ...securitySettings,
                        twoFactorEnabled: checked,
                      })
                    }
                  />
                </SettingItem>
                <Separator />
                <SettingItem
                  title="Session Timeout"
                  description="Automatically log out after period of inactivity"
                >
                  <Select
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) =>
                      setSecuritySettings({
                        ...securitySettings,
                        sessionTimeout: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="168">1 week</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingItem>
                <Separator />
                <SettingItem
                  title="Login Notifications"
                  description="Get notified when someone logs into your account"
                >
                  <Switch
                    checked={securitySettings.loginNotifications}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({
                        ...securitySettings,
                        loginNotifications: checked,
                      })
                    }
                  />
                </SettingItem>
              </div>
            </SectionCard>

            <SectionCard
              title="Password Policy"
              description="Configure password requirements and policies"
              icon={<Key className="h-5 w-5" />}
            >
              <div className="space-y-4">
                <SettingItem
                  title="Password Expiry"
                  description="Require password changes after specified days"
                >
                  <Select
                    value={securitySettings.passwordExpiry}
                    onValueChange={(value) =>
                      setSecuritySettings({
                        ...securitySettings,
                        passwordExpiry: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingItem>
                <Separator />
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="text-sm font-medium">
                      Change Password
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Update your account password
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <SectionCard
              title="Email Notifications"
              description="Configure which email notifications you want to receive"
              icon={<Mail className="h-5 w-5" />}
            >
              <div className="space-y-3">
                <NotificationItem
                  title="New Conversations"
                  description="Get notified when new conversations start"
                  type="email"
                  enabled={
                    notificationSettings.emailNotifications.newConversations
                  }
                  onToggle={(enabled) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: {
                        ...notificationSettings.emailNotifications,
                        newConversations: enabled,
                      },
                    })
                  }
                />
                <NotificationItem
                  title="System Alerts"
                  description="Important system updates and maintenance notices"
                  type="email"
                  enabled={notificationSettings.emailNotifications.systemAlerts}
                  onToggle={(enabled) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: {
                        ...notificationSettings.emailNotifications,
                        systemAlerts: enabled,
                      },
                    })
                  }
                />
                <NotificationItem
                  title="Weekly Reports"
                  description="Weekly analytics and performance summaries"
                  type="email"
                  enabled={
                    notificationSettings.emailNotifications.weeklyReports
                  }
                  onToggle={(enabled) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: {
                        ...notificationSettings.emailNotifications,
                        weeklyReports: enabled,
                      },
                    })
                  }
                />
                <NotificationItem
                  title="Security Alerts"
                  description="Login attempts and security-related notifications"
                  type="email"
                  enabled={
                    notificationSettings.emailNotifications.securityAlerts
                  }
                  onToggle={(enabled) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: {
                        ...notificationSettings.emailNotifications,
                        securityAlerts: enabled,
                      },
                    })
                  }
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Push Notifications"
              description="Configure browser and mobile push notifications"
              icon={<Smartphone className="h-5 w-5" />}
            >
              <div className="space-y-3">
                <NotificationItem
                  title="New Conversations"
                  description="Real-time notifications for new conversations"
                  type="push"
                  enabled={
                    notificationSettings.pushNotifications.newConversations
                  }
                  onToggle={(enabled) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      pushNotifications: {
                        ...notificationSettings.pushNotifications,
                        newConversations: enabled,
                      },
                    })
                  }
                />
                <NotificationItem
                  title="System Alerts"
                  description="Critical system notifications"
                  type="push"
                  enabled={notificationSettings.pushNotifications.systemAlerts}
                  onToggle={(enabled) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      pushNotifications: {
                        ...notificationSettings.pushNotifications,
                        systemAlerts: enabled,
                      },
                    })
                  }
                />
                <NotificationItem
                  title="Security Alerts"
                  description="Immediate security notifications"
                  type="push"
                  enabled={
                    notificationSettings.pushNotifications.securityAlerts
                  }
                  onToggle={(enabled) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      pushNotifications: {
                        ...notificationSettings.pushNotifications,
                        securityAlerts: enabled,
                      },
                    })
                  }
                />
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <SectionCard
              title="API Configuration"
              description="Manage API access and rate limiting settings"
              icon={<Key className="h-5 w-5" />}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-version">API Version</Label>
                    <Select
                      value={apiSettings.apiVersion}
                      onValueChange={(value) =>
                        setApiSettings({ ...apiSettings, apiVersion: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="v1">Version 1.0</SelectItem>
                        <SelectItem value="v2">Version 2.0 (Beta)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate-limit">Rate Limit (per hour)</Label>
                    <Input
                      id="rate-limit"
                      type="number"
                      value={apiSettings.maxRequestsPerHour}
                      onChange={(e) =>
                        setApiSettings({
                          ...apiSettings,
                          maxRequestsPerHour: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <Separator />
                <SettingItem
                  title="Rate Limiting"
                  description="Enable API rate limiting to prevent abuse"
                >
                  <Switch
                    checked={apiSettings.rateLimitEnabled}
                    onCheckedChange={(checked) =>
                      setApiSettings({
                        ...apiSettings,
                        rateLimitEnabled: checked,
                      })
                    }
                  />
                </SettingItem>
              </div>
            </SectionCard>

            <SectionCard
              title="Webhooks"
              description="Configure webhook endpoints for real-time notifications"
              icon={<Globe className="h-5 w-5" />}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://your-domain.com/webhook"
                    value={apiSettings.webhookUrl}
                    onChange={(e) =>
                      setApiSettings({
                        ...apiSettings,
                        webhookUrl: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Receive real-time notifications about conversations and
                    system events
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Test Webhook
                  </Button>
                  <Button variant="outline" size="sm">
                    View Logs
                  </Button>
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <SectionCard
              title="Current Plan"
              description="Manage your subscription and billing information"
              icon={<CreditCard className="h-5 w-5" />}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
                  <div>
                    <h3 className="font-semibold">Professional Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      $49/month • Billed monthly
                    </p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-3 border rounded-lg">
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-xs text-muted-foreground">
                      Active Widgets
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-2xl font-bold">2.5K</p>
                    <p className="text-xs text-muted-foreground">
                      Monthly Conversations
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-2xl font-bold">∞</p>
                    <p className="text-xs text-muted-foreground">
                      API Requests
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="outline">View Usage</Button>
                  <Button variant="outline">Download Invoice</Button>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Payment Method"
              description="Manage your payment information"
              icon={<CreditCard className="h-5 w-5" />}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-400 rounded text-white text-xs flex items-center justify-center font-bold">
                      VISA
                    </div>
                    <div>
                      <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                      <p className="text-xs text-muted-foreground">
                        Expires 12/25
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
                <Button variant="outline">Add Payment Method</Button>
              </div>
            </SectionCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;

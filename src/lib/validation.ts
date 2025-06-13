import { z } from "zod";

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Widget Configuration Schema
export const widgetConfigSchema = z.object({
  name: z.string().min(1, "Widget name is required"),
  description: z.string().optional(),
  template: z.string().min(1, "Please select a template"),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Please enter a valid hex color"),
  position: z.enum(["bottom-right", "bottom-left", "top-right", "top-left"]),
  welcomeMessage: z.string().min(1, "Welcome message is required"),
  placeholder: z.string().min(1, "Placeholder text is required"),
  autoTrigger: z.object({
    enabled: z.boolean(),
    delay: z.number().min(0).max(60),
    message: z.string().optional(),
  }),
  aiModel: z.string().min(1, "Please select an AI model"),
  knowledgeBase: z.array(z.string()).optional(),
});

// AI Model Configuration Schema
export const aiModelConfigSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  provider: z.string().min(1, "Please select a provider"),
  model: z.string().min(1, "Please select a model"),
  apiKey: z.string().min(1, "API key is required"),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().min(1).max(4000),
  systemPrompt: z.string().optional(),
});

// Knowledge Base Schema
export const knowledgeBaseSchema = z.object({
  name: z.string().min(1, "Knowledge base name is required"),
  description: z.string().optional(),
  sources: z
    .array(
      z.object({
        type: z.enum(["document", "website", "api", "database"]),
        name: z.string().min(1, "Source name is required"),
        content: z.string().min(1, "Source content is required"),
      }),
    )
    .min(1, "At least one source is required"),
});

// Settings Schema
export const settingsSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  timezone: z.string().min(1, "Please select a timezone"),
  language: z.string().min(1, "Please select a language"),
  notifications: z.object({
    email: z.boolean(),
    browser: z.boolean(),
    slack: z.boolean(),
  }),
  security: z.object({
    twoFactorAuth: z.boolean(),
    sessionTimeout: z.number().min(15).max(480),
  }),
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type WidgetConfigFormData = z.infer<typeof widgetConfigSchema>;
export type AIModelConfigFormData = z.infer<typeof aiModelConfigSchema>;
export type KnowledgeBaseFormData = z.infer<typeof knowledgeBaseSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;

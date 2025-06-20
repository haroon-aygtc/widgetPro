import { z } from "zod";

// Unified validation patterns - consolidating all form validation logic
export const commonValidation = {
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  strongPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
  name: z.string().min(2, "Name must be at least 2 characters"),
  hexColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Please enter a valid hex color"),
  url: z.string().url("Please enter a valid URL"),
  apiKey: z.string().min(1, "API key is required"),
  nonEmptyString: (fieldName: string) =>
    z.string().min(1, `${fieldName} is required`),
  positiveNumber: (fieldName: string) =>
    z.number().positive(`${fieldName} must be a positive number`),
  numberInRange: (min: number, max: number, fieldName: string) =>
    z
      .number()
      .min(min)
      .max(max, `${fieldName} must be between ${min} and ${max}`),
};

// Unified validation patterns from useFormValidation hook - consolidating duplicate patterns
export const formValidationPatterns = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
    validate: (value: string) => {
      if (!value) return "Email is required";
      if (!formValidationPatterns.email.pattern.test(value)) {
        return formValidationPatterns.email.message;
      }
      return "";
    },
  },

  password: {
    minLength: 8,
    patterns: {
      lowercase: /[a-z]/,
      uppercase: /[A-Z]/,
      number: /\d/,
      special: /[!@#$%^&*(),.?":{}|<>]/,
    },
    validate: (value: string) => {
      if (!value) return "Password is required";
      if (value.length < formValidationPatterns.password.minLength) {
        return `Password must be at least ${formValidationPatterns.password.minLength} characters`;
      }

      const { patterns } = formValidationPatterns.password;
      const missing = [];

      if (!patterns.lowercase.test(value)) missing.push("lowercase letter");
      if (!patterns.uppercase.test(value)) missing.push("uppercase letter");
      if (!patterns.number.test(value)) missing.push("number");

      if (missing.length > 0) {
        return `Password must contain at least one ${missing.join(", ")}`;
      }

      return "";
    },

    getStrength: (value: string) => {
      if (!value) return 0;

      let score = 0;
      const { patterns } = formValidationPatterns.password;

      if (value.length >= 8) score += 1;
      if (value.length >= 12) score += 1;
      if (patterns.lowercase.test(value)) score += 1;
      if (patterns.uppercase.test(value)) score += 1;
      if (patterns.number.test(value)) score += 1;
      if (patterns.special.test(value)) score += 1;

      return Math.min(score / 6, 1);
    },
  },

  url: {
    pattern: /^https?:\/\/.+/,
    validate: (value: string) => {
      if (!value) return "URL is required";
      if (!formValidationPatterns.url.pattern.test(value)) {
        return "Please enter a valid URL starting with http:// or https://";
      }
      return "";
    },
  },

  required: (fieldName: string) => (value: string) => {
    if (!value || value.trim() === "") {
      return `${fieldName} is required`;
    }
    return "";
  },
};

// Validation utilities
export const validationUtils = {
  createPasswordConfirmation: () => ({ password_confirmation: z.string() }),

  addPasswordConfirmationRefine: <T extends Record<string, any>>(
    schema: z.ZodObject<T>,
  ) =>
    schema.refine((data: any) => data.password === data.password_confirmation, {
      message: "Password confirmation does not match",
      path: ["password_confirmation"],
    }),

  createFormValidator: <T>(schema: z.ZodSchema<T>) => {
    return {
      validate: (data: unknown) => {
        try {
          const result = schema.safeParse(data);
          if (result.success) {
            return { success: true, data: result.data, errors: {} };
          } else {
            const errors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
              const path = err.path.join(".");
              errors[path] = err.message;
            });
            return { success: false, data: null, errors };
          }
        } catch (error) {
          return {
            success: false,
            data: null,
            errors: { general: "Validation failed" },
          };
        }
      },

      validateField: (fieldName: string, value: unknown) => {
        try {
          const fieldSchema = (schema as any).shape[fieldName];
          if (fieldSchema) {
            const result = fieldSchema.safeParse(value);
            if (result.success) {
              return { success: true, error: null };
            } else {
              return {
                success: false,
                error: result.error.errors[0]?.message || "Invalid value",
              };
            }
          }
          return { success: true, error: null };
        } catch (error) {
          return { success: false, error: "Validation failed" };
        }
      },
    };
  },
};

// Auth Schemas with improved field names and messages
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = validationUtils.addPasswordConfirmationRefine(
  z.object({
    name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(255, "Name must be less than 255 characters"),
    email: z
      .string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address")
      .max(255, "Email must be less than 255 characters"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    password_confirmation: z.string().min(1, "Please confirm your password when creating an account"),
    remember: z.boolean().optional(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms of Service and Privacy Policy",
    }),
  }),
);

// Widget Configuration Schema with enhanced field-level validation
export const widgetConfigSchema = z.object({
  name: z
    .string()
    .min(1, "Widget name is required")
    .min(2, "Widget name must be at least 2 characters")
    .max(100, "Widget name must be less than 100 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Widget name can only contain letters, numbers, spaces, hyphens, and underscores",
    ),
  description: z.string().optional(),
  template: z
    .string()
    .min(1, "Template selection is required")
    .refine(
      (val) => ["default", "minimal", "modern", "enterprise"].includes(val),
      {
        message: "Please select a valid template",
      },
    ),
  primaryColor: z
    .string()
    .min(1, "Primary color is required")
    .regex(/^#[0-9A-F]{6}$/i, "Please enter a valid hex color (e.g., #4f46e5)"),
  position: z.enum(["bottom-right", "bottom-left", "top-right", "top-left"], {
    errorMap: () => ({ message: "Please select a valid widget position" }),
  }),
  welcomeMessage: z
    .string()
    .min(1, "Welcome message is required")
    .min(5, "Welcome message must be at least 5 characters")
    .max(200, "Welcome message must be less than 200 characters"),
  placeholder: z
    .string()
    .min(1, "Placeholder text is required")
    .min(3, "Placeholder must be at least 3 characters")
    .max(50, "Placeholder must be less than 50 characters"),
  botName: z
    .string()
    .min(2, "Bot name must be at least 2 characters")
    .max(30, "Bot name must be less than 30 characters")
    .optional(),
  botAvatar: z
    .string()
    .url("Please enter a valid avatar URL")
    .optional()
    .or(z.literal("")),
  autoTrigger: z.object({
    enabled: z.boolean(),
    delay: z
      .number()
      .min(1, "Delay must be at least 1 second")
      .max(60, "Delay must be less than 60 seconds"),
    message: z
      .string()
      .max(150, "Trigger message must be less than 150 characters")
      .optional(),
  }),
  autoOpen: z.boolean().optional(),
  widgetTheme: z
    .enum(["light", "dark"], {
      errorMap: () => ({ message: "Please select a valid theme" }),
    })
    .optional(),
  widgetWidth: z
    .number()
    .min(250, "Widget width must be at least 250px")
    .max(450, "Widget width must be less than 450px")
    .optional(),
  widgetHeight: z
    .number()
    .min(400, "Widget height must be at least 400px")
    .max(600, "Widget height must be less than 600px")
    .optional(),
  aiModel: z.string().optional(),
  knowledgeBase: z.array(z.string()).optional(),
});

// Individual field validation schemas for real-time validation
export const widgetFieldValidation = {
  widgetName: z
    .string()
    .min(1, "Widget name is required")
    .min(2, "Widget name must be at least 2 characters")
    .max(100, "Widget name must be less than 100 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Widget name can only contain letters, numbers, spaces, hyphens, and underscores",
    ),

  primaryColor: z
    .string()
    .min(1, "Primary color is required")
    .regex(/^#[0-9A-F]{6}$/i, "Please enter a valid hex color (e.g., #4f46e5)"),

  welcomeMessage: z
    .string()
    .min(1, "Welcome message is required")
    .min(5, "Welcome message must be at least 5 characters")
    .max(200, "Welcome message must be less than 200 characters"),

  placeholder: z
    .string()
    .min(1, "Placeholder text is required")
    .min(3, "Placeholder must be at least 3 characters")
    .max(50, "Placeholder must be less than 50 characters"),

  botName: z
    .string()
    .min(2, "Bot name must be at least 2 characters")
    .max(30, "Bot name must be less than 30 characters"),

  botAvatar: z
    .string()
    .url("Please enter a valid avatar URL")
    .or(z.literal("")),

  autoTriggerMessage: z
    .string()
    .max(150, "Trigger message must be less than 150 characters"),
} as const;

// AI Model Configuration Schema
export const aiModelConfigSchema = z.object({
  name: commonValidation.nonEmptyString("Model name"),
  provider: commonValidation.nonEmptyString("Provider"),
  model: commonValidation.nonEmptyString("Model"),
  apiKey: commonValidation.apiKey,
  temperature: commonValidation.numberInRange(0, 2, "Temperature"),
  maxTokens: commonValidation.numberInRange(1, 4000, "Max tokens"),
  systemPrompt: z.string().optional(),
});

// Knowledge Base Schema
export const knowledgeBaseSchema = z.object({
  name: commonValidation.nonEmptyString("Knowledge base name"),
  description: z.string().optional(),
  sources: z
    .array(
      z.object({
        type: z.enum(["document", "website", "api", "database"]),
        name: commonValidation.nonEmptyString("Source name"),
        content: commonValidation.nonEmptyString("Source content"),
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

// User Management Schemas
export const createUserSchema = validationUtils.addPasswordConfirmationRefine(
  z.object({
    name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(255, "Name must be less than 255 characters"),
    email: z
      .string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address")
      .max(255, "Email must be less than 255 characters"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    password_confirmation: z.string().min(1, "Please confirm your password when creating an account"),
    role_ids: z.array(z.number().int().positive()).optional(),
  }),
);

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must be less than 255 characters")
    .optional(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .optional(),
  status: z.enum(["active", "inactive"]).optional(),
  role_ids: z.array(z.number().int().positive()).optional(),
});

export const changePasswordSchema = validationUtils.addPasswordConfirmationRefine(
  z.object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    password_confirmation: z.string().min(1, "Please confirm your password"),
  }),
);

// Role Management Schemas
export const createRoleSchema = z.object({
  name: commonValidation.nonEmptyString("Role name"),
  display_name: commonValidation.nonEmptyString("Display name"),
  description: commonValidation.nonEmptyString("Description"),
  permission_ids: z.array(z.number().int().positive()).optional(),
});

export const updateRoleSchema = z.object({
  name: commonValidation.nonEmptyString("Role name").optional(),
  display_name: commonValidation.nonEmptyString("Display name").optional(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  permission_ids: z.array(z.number().int().positive()).optional(),
});

// Permission Management Schemas
export const createPermissionSchema = z.object({
  name: commonValidation.nonEmptyString("Permission name"),
  display_name: commonValidation.nonEmptyString("Display name"),
  description: commonValidation.nonEmptyString("Description"),
  category: commonValidation.nonEmptyString("Category"),
});

export const updatePermissionSchema = z.object({
  name: commonValidation.nonEmptyString("Permission name").optional(),
  display_name: commonValidation.nonEmptyString("Display name").optional(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  category: z
    .string()
    .max(255, "Category must be less than 255 characters")
    .optional(),
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type WidgetConfigFormData = z.infer<typeof widgetConfigSchema>;
export type AIModelConfigFormData = z.infer<typeof aiModelConfigSchema>;
export type KnowledgeBaseFormData = z.infer<typeof knowledgeBaseSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type CreateRoleFormData = z.infer<typeof createRoleSchema>;
export type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;
export type CreatePermissionFormData = z.infer<typeof createPermissionSchema>;
export type UpdatePermissionFormData = z.infer<typeof updatePermissionSchema>;

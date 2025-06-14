import { useState, useCallback } from "react";
import { z } from "zod";
import { validationUtils } from "@/lib/validation";

export interface FormValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  showErrorsImmediately?: boolean;
}

export function useFormValidation<T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  options: FormValidationOptions = {}
) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValidating, setIsValidating] = useState(false);
  
  const validator = validationUtils.createFormValidator(schema);
  
  const validateForm = useCallback(async (data: unknown) => {
    setIsValidating(true);
    try {
      const result = validator.validate(data);
      setErrors(result.errors);
      return result;
    } finally {
      setIsValidating(false);
    }
  }, [validator]);
  
  const validateField = useCallback(async (fieldName: string, value: unknown) => {
    if (!options.validateOnChange && !touched[fieldName]) {
      return { success: true, error: null };
    }
    
    const result = validator.validateField(fieldName, value);
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: result.error || ""
    }));
    
    return result;
  }, [validator, options.validateOnChange, touched]);
  
  const setFieldTouched = useCallback((fieldName: string, isTouched: boolean = true) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: isTouched
    }));
  }, []);
  
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);
  
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);
  
  const hasErrors = Object.keys(errors).some(key => errors[key]);
  const getFieldError = useCallback((fieldName: string) => {
    return touched[fieldName] || options.showErrorsImmediately ? errors[fieldName] : "";
  }, [errors, touched, options.showErrorsImmediately]);
  
  return {
    errors,
    touched,
    isValidating,
    hasErrors,
    validateForm,
    validateField,
    setFieldTouched,
    clearErrors,
    clearFieldError,
    getFieldError,
  };
}

// Common form validation patterns
export const formValidationPatterns = {
  // Email validation with real-time feedback
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
    validate: (value: string) => {
      if (!value) return "Email is required";
      if (!formValidationPatterns.email.pattern.test(value)) {
        return formValidationPatterns.email.message;
      }
      return "";
    }
  },
  
  // Password strength validation
  password: {
    minLength: 8,
    patterns: {
      lowercase: /[a-z]/,
      uppercase: /[A-Z]/,
      number: /\d/,
      special: /[!@#$%^&*(),.?":{}|<>]/
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
        return `Password must contain at least one ${missing.join(", ")}";
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
    }
  },
  
  // URL validation
  url: {
    pattern: /^https?:\/\/.+/,
    validate: (value: string) => {
      if (!value) return "URL is required";
      if (!formValidationPatterns.url.pattern.test(value)) {
        return "Please enter a valid URL starting with http:// or https://";
      }
      return "";
    }
  },
  
  // Required field validation
  required: (fieldName: string) => (value: any) => {
    if (!value || (typeof value === "string" && !value.trim())) {
      return fieldName + " is required";
    }
    return "";
  }
};

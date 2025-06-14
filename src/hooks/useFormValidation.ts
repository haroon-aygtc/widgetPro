import { useState, useCallback } from "react";
import { z } from "zod";
import { validationUtils, formValidationPatterns } from "@/lib/validation";

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

// Export the consolidated patterns from validation.ts
export { formValidationPatterns };

import { toast } from "@/components/ui/use-toast";
import { Fragment } from "react";

export const toastUtils = {
  // Success toasts
  success: (message: string) => {
    return toast({
      title: "Success",
      description: message,
      variant: "default",
    });
  },

  // Error toasts
  validationError: (count: number, messages: string[]) => {
    const description = messages.join("\n");
    return toast({
      title: `${count} validation ${count === 1 ? "error" : "errors"} found`,
      description,
      variant: "destructive",
    });
  },

  formError: (message: string) => {
    return toast({
      title: "Validation Error",
      description: message,
      variant: "destructive",
    });
  },

  apiError: (error: Error | string) => {
    const message = error instanceof Error ? error.message : error;
    return toast({
      title: "API Error",
      description: message,
      variant: "destructive",
    });
  },

  configError: (message: string) => {
    return toast({
      title: "Configuration Error",
      description: message,
      variant: "destructive",
    });
  },
};
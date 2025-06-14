// Inspired by react-hot-toast library
import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

// Centralized toast utility functions to eliminate redundancy
type ToastVariant = "default" | "destructive" | "success" | "warning" | "info";

interface ToastOptions extends Omit<Toast, "variant"> {
  variant?: ToastVariant;
}

// Standardized toast creators with consistent messaging patterns
const createStandardizedToast = (variant: ToastVariant) => {
  return (options: ToastOptions) => {
    return toast({
      ...options,
      variant,
    });
  };
};

// Export standardized toast variants
const toastSuccess = createStandardizedToast("success");
const toastError = createStandardizedToast("destructive");
const toastWarning = createStandardizedToast("warning");
const toastInfo = createStandardizedToast("info");

// Common toast message patterns to reduce duplication
const toastMessages = {
  success: {
    saved: { title: "Success", description: "Changes saved successfully" },
    created: { title: "Created", description: "Item created successfully" },
    updated: { title: "Updated", description: "Item updated successfully" },
    deleted: { title: "Deleted", description: "Item deleted successfully" },
  },
  error: {
    generic: {
      title: "Error",
      description: "Something went wrong. Please try again.",
    },
    network: {
      title: "Network Error",
      description: "Please check your connection and try again.",
    },
    validation: {
      title: "Validation Error",
      description: "Please check your input and try again.",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You don't have permission to perform this action.",
    },
  },
  warning: {
    unsaved: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that will be lost.",
    },
    limit: {
      title: "Limit Reached",
      description: "You've reached the maximum limit.",
    },
  },
  info: {
    loading: {
      title: "Processing",
      description: "Please wait while we process your request.",
    },
    updated: { title: "Updated", description: "Content has been updated." },
  },
};

// Quick access functions for common toast patterns
const showSuccessToast = (
  type: keyof typeof toastMessages.success = "saved",
) => {
  return toastSuccess(toastMessages.success[type]);
};

const showErrorToast = (type: keyof typeof toastMessages.error = "generic") => {
  return toastError(toastMessages.error[type]);
};

const showWarningToast = (
  type: keyof typeof toastMessages.warning = "unsaved",
) => {
  return toastWarning(toastMessages.warning[type]);
};

const showInfoToast = (type: keyof typeof toastMessages.info = "loading") => {
  return toastInfo(toastMessages.info[type]);
};

export {
  useToast,
  toast,
  toastSuccess,
  toastError,
  toastWarning,
  toastInfo,
  toastMessages,
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
};

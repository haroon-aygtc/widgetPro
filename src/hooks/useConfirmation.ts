import { useState, useCallback } from "react";

interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning" | "info";
}

interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function useConfirmation() {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    title: "",
    description: "",
  });

  const confirm = useCallback(
    (options: ConfirmationOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({
          ...options,
          isOpen: true,
          onConfirm: () => {
            resolve(true);
            setState((prev) => ({ ...prev, isOpen: false }));
          },
          onCancel: () => {
            resolve(false);
            setState((prev) => ({ ...prev, isOpen: false }));
          },
        });
      });
    },
    [],
  );

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    ...state,
    confirm,
    close,
  };
}

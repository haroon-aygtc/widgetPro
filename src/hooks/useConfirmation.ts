import { useModal } from "./useModal";

interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning" | "info";
}

// Legacy confirmation hook - now uses unified modal system
export function useConfirmation() {
  const modal = useModal();

  const confirm = (options: ConfirmationOptions): Promise<boolean> => {
    return modal.confirm({
      title: options.title,
      description: options.description,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      variant: options.variant,
    });
  };

  return {
    isOpen: modal.isOpen,
    title: modal.modalState.title,
    description: modal.modalState.description,
    confirmText: modal.modalState.confirmText,
    cancelText: modal.modalState.cancelText,
    variant: modal.modalState.variant,
    onConfirm: modal.modalState.onConfirm,
    onCancel: modal.modalState.onCancel,
    confirm,
    close: modal.closeModal,
  };
}

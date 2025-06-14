import { useState, useCallback } from "react";
import { ModalType, ModalVariant, ModalSize } from "@/components/ui/unified-modal";

interface ModalState {
  isOpen: boolean;
  title: string;
  description?: string;
  type: ModalType;
  variant: ModalVariant;
  size: ModalSize;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ModalOptions {
  title: string;
  description?: string;
  type?: ModalType;
  variant?: ModalVariant;
  size?: ModalSize;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmOptions extends ModalOptions {
  type?: "alert";
}

// Unified modal management hook - consolidating all modal state logic
export function useModal() {
  const [state, setState] = useState<ModalState>({
    isOpen: false,
    title: "",
    type: "dialog",
    variant: "default",
    size: "md",
  });

  const openModal = useCallback((options: ModalOptions) => {
    setState({
      isOpen: true,
      title: options.title,
      description: options.description,
      type: options.type || "dialog",
      variant: options.variant || "default",
      size: options.size || "md",
      confirmText: options.confirmText,
      cancelText: options.cancelText,
    });
  }, []);

  const closeModal = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title: options.title,
        description: options.description,
        type: "alert",
        variant: options.variant || "default",
        size: options.size || "md",
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
        onConfirm: () => {
          resolve(true);
          setState(prev => ({ ...prev, isOpen: false }));
        },
        onCancel: () => {
          resolve(false);
          setState(prev => ({ ...prev, isOpen: false }));
        },
      });
    });
  }, []);

  // Convenience methods for common modal types
  const showInfo = useCallback((title: string, description?: string) => {
    openModal({ title, description, variant: "info" });
  }, [openModal]);

  const showWarning = useCallback((title: string, description?: string) => {
    openModal({ title, description, variant: "warning" });
  }, [openModal]);

  const showError = useCallback((title: string, description?: string) => {
    openModal({ title, description, variant: "destructive" });
  }, [openModal]);

  const showSuccess = useCallback((title: string, description?: string) => {
    openModal({ title, description, variant: "success" });
  }, [openModal]);

  const confirmDelete = useCallback((itemName?: string): Promise<boolean> => {
    return confirm({
      title: "Confirm Deletion",
      description: itemName 
        ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
        : "Are you sure you want to delete this item? This action cannot be undone.",
      variant: "destructive",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
  }, [confirm]);

  const confirmReset = useCallback((itemName?: string): Promise<boolean> => {
    return confirm({
      title: "Confirm Reset",
      description: itemName
        ? `Are you sure you want to reset "${itemName}"? All unsaved changes will be lost.`
        : "Are you sure you want to reset? All unsaved changes will be lost.",
      variant: "warning",
      confirmText: "Reset",
      cancelText: "Cancel",
    });
  }, [confirm]);

  const confirmSave = useCallback((hasChanges: boolean = true): Promise<boolean> => {
    if (!hasChanges) return Promise.resolve(true);
    
    return confirm({
      title: "Save Changes",
      description: "You have unsaved changes. Do you want to save them before continuing?",
      variant: "info",
      confirmText: "Save",
      cancelText: "Discard",
    });
  }, [confirm]);

  const openSidePanel = useCallback((title: string, description?: string) => {
    openModal({ title, description, type: "sheet" });
  }, [openModal]);

  const openBottomSheet = useCallback((title: string, description?: string) => {
    openModal({ title, description, type: "drawer" });
  }, [openModal]);

  return {
    // State
    isOpen: state.isOpen,
    modalState: state,
    
    // Basic controls
    openModal,
    closeModal,
    confirm,
    
    // Convenience methods
    showInfo,
    showWarning,
    showError,
    showSuccess,
    
    // Common confirmations
    confirmDelete,
    confirmReset,
    confirmSave,
    
    // Layout variants
    openSidePanel,
    openBottomSheet,
  };
}

// Hook for managing multiple modals
export function useModalStack() {
  const [modals, setModals] = useState<Array<ModalState & { id: string }>>([]);

  const pushModal = useCallback((options: ModalOptions & { id?: string }) => {
    const id = options.id || Date.now().toString();
    const modal: ModalState & { id: string } = {
      id,
      isOpen: true,
      title: options.title,
      description: options.description,
      type: options.type || "dialog",
      variant: options.variant || "default",
      size: options.size || "md",
      confirmText: options.confirmText,
      cancelText: options.cancelText,
    };
    
    setModals(prev => [...prev, modal]);
    return id;
  }, []);

  const popModal = useCallback((id?: string) => {
    if (id) {
      setModals(prev => prev.filter(modal => modal.id !== id));
    } else {
      setModals(prev => prev.slice(0, -1));
    }
  }, []);

  const clearModals = useCallback(() => {
    setModals([]);
  }, []);

  return {
    modals,
    pushModal,
    popModal,
    clearModals,
    hasModals: modals.length > 0,
    topModal: modals[modals.length - 1],
  };
}

// Hook for form-specific modals
export function useFormModal() {
  const modal = useModal();

  const confirmUnsavedChanges = useCallback((): Promise<boolean> => {
    return modal.confirm({
      title: "Unsaved Changes",
      description: "You have unsaved changes. Are you sure you want to leave without saving?",
      variant: "warning",
      confirmText: "Leave",
      cancelText: "Stay",
    });
  }, [modal]);

  const showValidationErrors = useCallback((errorCount: number) => {
    modal.showError(
      "Validation Errors",
      `Please fix ${errorCount} error(s) in the form before submitting.`
    );
  }, [modal]);

  const showSaveSuccess = useCallback((itemName?: string) => {
    modal.showSuccess(
      "Saved Successfully",
      itemName ? `${itemName} has been saved.` : "Your changes have been saved."
    );
  }, [modal]);

  return {
    ...modal,
    confirmUnsavedChanges,
    showValidationErrors,
    showSaveSuccess,
  };
}

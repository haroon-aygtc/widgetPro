import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, CheckCircle, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ModalType = "dialog" | "alert" | "sheet" | "drawer";
export type ModalVariant = "default" | "destructive" | "warning" | "info" | "success";
export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface BaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  type?: ModalType;
  variant?: ModalVariant;
  size?: ModalSize;
  className?: string;
}

interface ConfirmModalProps extends BaseModalProps {
  type: "alert";
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface StandardModalProps extends BaseModalProps {
  type?: "dialog" | "sheet" | "drawer";
}

export type UnifiedModalProps = ConfirmModalProps | StandardModalProps;

const getIcon = (variant: ModalVariant) => {
  switch (variant) {
    case "destructive":
      return <XCircle className="h-6 w-6 text-red-600" />;
    case "warning":
      return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
    case "info":
      return <Info className="h-6 w-6 text-blue-600" />;
    case "success":
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    default:
      return null;
  }
};

const getSizeClasses = (size: ModalSize) => {
  switch (size) {
    case "sm":
      return "sm:max-w-sm";
    case "md":
      return "sm:max-w-md";
    case "lg":
      return "sm:max-w-lg";
    case "xl":
      return "sm:max-w-xl";
    case "full":
      return "sm:max-w-full";
    default:
      return "sm:max-w-lg";
  }
};

// Unified Modal Component - consolidating all modal patterns
export function UnifiedModal(props: UnifiedModalProps) {
  const {
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    type = "dialog",
    variant = "default",
    size = "md",
    className,
  } = props;

  const icon = getIcon(variant);
  const sizeClasses = getSizeClasses(size);

  // Alert Dialog for confirmations
  if (type === "alert" && "onConfirm" in props) {
    const { confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel } = props;
    
    const handleConfirm = () => {
      onConfirm();
      onOpenChange(false);
    };

    const handleCancel = () => {
      onCancel?.();
      onOpenChange(false);
    };

    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className={cn(sizeClasses, className)}>
          <AlertDialogHeader>
            <div className="flex items-center space-x-3">
              {icon}
              <AlertDialogTitle>{title}</AlertDialogTitle>
            </div>
            {description && (
              <AlertDialogDescription className="mt-2">
                {description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          {children}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              variant={variant === "destructive" ? "destructive" : "default"}
            >
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Sheet for side panels
  if (type === "sheet") {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className={cn(className)}>
          <SheetHeader>
            <div className="flex items-center space-x-3">
              {icon}
              <SheetTitle>{title}</SheetTitle>
            </div>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          <div className="flex-1 overflow-auto py-4">
            {children}
          </div>
          {footer && <SheetFooter>{footer}</SheetFooter>}
        </SheetContent>
      </Sheet>
    );
  }

  // Drawer for mobile-friendly bottom sheets
  if (type === "drawer") {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className={cn(className)}>
          <DrawerHeader>
            <div className="flex items-center space-x-3">
              {icon}
              <DrawerTitle>{title}</DrawerTitle>
            </div>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
          <div className="flex-1 overflow-auto px-4">
            {children}
          </div>
          {footer && <DrawerFooter>{footer}</DrawerFooter>}
        </DrawerContent>
      </Drawer>
    );
  }

  // Default Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(sizeClasses, className)}>
        <DialogHeader>
          <div className="flex items-center space-x-3">
            {icon}
            <DialogTitle>{title}</DialogTitle>
          </div>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

// Convenience components for common modal patterns
export const ConfirmModal = (props: Omit<ConfirmModalProps, "type">) => (
  <UnifiedModal {...props} type="alert" />
);

export const InfoModal = (props: Omit<StandardModalProps, "type" | "variant">) => (
  <UnifiedModal {...props} type="dialog" variant="info" />
);

export const WarningModal = (props: Omit<StandardModalProps, "type" | "variant">) => (
  <UnifiedModal {...props} type="dialog" variant="warning" />
);

export const SuccessModal = (props: Omit<StandardModalProps, "type" | "variant">) => (
  <UnifiedModal {...props} type="dialog" variant="success" />
);

export const ErrorModal = (props: Omit<StandardModalProps, "type" | "variant">) => (
  <UnifiedModal {...props} type="dialog" variant="destructive" />
);

export const SidePanel = (props: Omit<StandardModalProps, "type">) => (
  <UnifiedModal {...props} type="sheet" />
);

export const BottomSheet = (props: Omit<StandardModalProps, "type">) => (
  <UnifiedModal {...props} type="drawer" />
);

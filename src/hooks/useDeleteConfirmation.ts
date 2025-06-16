import { useState, useCallback } from "react";

interface DeleteConfirmationState {
    isOpen: boolean;
    item: any;
    type: "user" | "role" | "permission";
    onConfirm: () => void;
    title?: string;
    description?: string;
}

export function useDeleteConfirmation() {
    const [state, setState] = useState<DeleteConfirmationState>({
        isOpen: false,
        item: null,
        type: "user",
        onConfirm: () => { },
    });

    const confirmDelete = useCallback(
        (
            item: any,
            type: "user" | "role" | "permission",
            onConfirm: () => void,
            options?: {
                title?: string;
                description?: string;
            }
        ): Promise<boolean> => {
            return new Promise((resolve) => {
                setState({
                    isOpen: true,
                    item,
                    type,
                    title: options?.title,
                    description: options?.description,
                    onConfirm: () => {
                        onConfirm();
                        resolve(true);
                        setState(prev => ({ ...prev, isOpen: false }));
                    },
                });
            });
        },
        []
    );

    const confirmDeleteUser = useCallback(
        (user: any, onConfirm: () => void) => {
            return confirmDelete(user, "user", onConfirm);
        },
        [confirmDelete]
    );

    const confirmDeleteRole = useCallback(
        (role: any, onConfirm: () => void) => {
            return confirmDelete(role, "role", onConfirm);
        },
        [confirmDelete]
    );

    const confirmDeletePermission = useCallback(
        (permission: any, onConfirm: () => void) => {
            return confirmDelete(permission, "permission", onConfirm);
        },
        [confirmDelete]
    );

    const closeDialog = useCallback(() => {
        setState(prev => ({ ...prev, isOpen: false }));
    }, []);

    const handleCancel = useCallback(() => {
        closeDialog();
    }, [closeDialog]);

    return {
        // State
        isOpen: state.isOpen,
        item: state.item,
        type: state.type,
        title: state.title,
        description: state.description,

        // Actions
        confirmDelete,
        confirmDeleteUser,
        confirmDeleteRole,
        confirmDeletePermission,
        closeDialog,
        handleCancel,
        onConfirm: state.onConfirm,
    };
} 
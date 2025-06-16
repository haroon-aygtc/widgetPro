import React from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    AlertTriangle,
    User,
    Shield,
    Key,
    Mail,
    Calendar,
    Users,
    Crown,
    UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteConfirmationProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    onCancel?: () => void;
    item: any;
    type: "user" | "role" | "permission";
    title?: string;
    description?: string;
}

const DeleteConfirmation = ({
    open,
    onOpenChange,
    onConfirm,
    onCancel,
    item,
    type,
    title,
    description,
}: DeleteConfirmationProps) => {
    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    const handleCancel = () => {
        onCancel?.();
        onOpenChange(false);
    };

    const getTypeIcon = () => {
        switch (type) {
            case "user":
                return <User className="h-6 w-6 text-blue-600" />;
            case "role":
                return <Shield className="h-6 w-6 text-purple-600" />;
            case "permission":
                return <Key className="h-6 w-6 text-green-600" />;
            default:
                return <AlertTriangle className="h-6 w-6 text-red-600" />;
        }
    };

    const getRoleIcon = (roleName: string) => {
        switch (roleName?.toLowerCase()) {
            case "super admin":
                return Crown;
            case "admin":
                return Shield;
            case "manager":
                return UserCheck;
            case "user":
                return Users;
            default:
                return Key;
        }
    };

    const getRoleColor = (roleName: string) => {
        switch (roleName?.toLowerCase()) {
            case "super admin":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            case "admin":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
            case "manager":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
            case "user":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
        }
    };

    const renderUserSilhouette = () => (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-blue-200 dark:ring-blue-800">
                        <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`}
                            alt={item.name}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                            {item.name?.split(" ").map((n: string) => n[0]).join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h4 className="font-semibold text-blue-700 dark:text-blue-300">
                            {item.name}
                        </h4>
                        <div className="flex items-center gap-1 text-sm text-blue-600/80 dark:text-blue-400/80">
                            <Mail className="h-3 w-3" />
                            {item.email}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                            {item.roles?.map((role: any) => (
                                <Badge key={role.id} className={getRoleColor(role.name)}>
                                    {role.name}
                                </Badge>
                            )) || <Badge variant="outline">No Role</Badge>}
                        </div>
                    </div>
                    <div className="text-right">
                        <Badge variant={item.status === "active" ? "default" : "secondary"}>
                            {item.status}
                        </Badge>
                        {item.created_at && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(item.created_at).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const renderRoleSilhouette = () => {
        const RoleIcon = getRoleIcon(item.name);
        return (
            <Card className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-200/50 dark:border-purple-800/50">
                            <RoleIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-purple-700 dark:text-purple-300">
                                {item.name}
                            </h4>
                            <p className="text-sm text-purple-600/80 dark:text-purple-400/80">
                                {item.description || "No description"}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Key className="h-3 w-3" />
                                    {item.permissions?.length || 0} permissions
                                </div>
                                {item.users_count !== undefined && (
                                    <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {item.users_count} users
                                    </div>
                                )}
                            </div>
                        </div>
                        <Badge className={getRoleColor(item.name)}>
                            {item.name}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const renderPermissionSilhouette = () => (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200/50 dark:border-green-800/50">
                        <Key className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-green-700 dark:text-green-300">
                            {item.display_name || item.name}
                        </h4>
                        <p className="text-sm text-green-600/80 dark:text-green-400/80 font-mono">
                            {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {item.description || "No description"}
                        </p>
                    </div>
                    <div className="text-right">
                        <Badge variant="outline" className="bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300">
                            {item.category}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const renderSilhouette = () => {
        if (!item) return null;

        switch (type) {
            case "user":
                return renderUserSilhouette();
            case "role":
                return renderRoleSilhouette();
            case "permission":
                return renderPermissionSilhouette();
            default:
                return null;
        }
    };

    const getDefaultTitle = () => {
        switch (type) {
            case "user":
                return "Delete User Account";
            case "role":
                return "Delete Role";
            case "permission":
                return "Delete Permission";
            default:
                return "Confirm Deletion";
        }
    };

    const getDefaultDescription = () => {
        if (!item) return "Are you sure you want to delete this item? This action cannot be undone.";

        const itemName = item.display_name || item.name;
        switch (type) {
            case "user":
                return `Are you sure you want to delete the user account for "${itemName}"? This will permanently remove their access and cannot be undone.`;
            case "role":
                return `Are you sure you want to delete the role "${itemName}"? Users with this role will lose their associated permissions.`;
            case "permission":
                return `Are you sure you want to delete the permission "${itemName}"? This will remove it from all roles and users.`;
            default:
                return `Are you sure you want to delete "${itemName}"? This action cannot be undone.`;
        }
    };

    const getWarningMessage = () => {
        switch (type) {
            case "user":
                return "⚠️ This will permanently delete the user account and all associated data.";
            case "role":
                return "⚠️ Users with this role will lose their permissions until reassigned.";
            case "permission":
                return "⚠️ This permission will be removed from all roles and users.";
            default:
                return "⚠️ This action cannot be undone.";
        }
    };

    // Don't render if no item is provided
    if (!item) {
        return null;
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-2xl">
                <AlertDialogHeader>
                    <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                        <AlertDialogTitle className="text-xl">
                            {title || getDefaultTitle()}
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="mt-4 text-base">
                        {description || getDefaultDescription()}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="my-6">
                    {renderSilhouette()}
                </div>

                <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                        {getWarningMessage()}
                    </p>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        Delete {type === "user" ? "User" : type === "role" ? "Role" : "Permission"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteConfirmation; 
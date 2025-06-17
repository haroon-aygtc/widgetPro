import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Loader2,
  Undo2,
  Redo2,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SaveStateIndicatorProps {
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  isResetting?: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  errorCount?: number;
}

const SaveStateIndicator: React.FC<SaveStateIndicatorProps> = ({
  hasUnsavedChanges,
  isSaving,
  isResetting = false,
  canUndo,
  canRedo,
  onSave,
  onUndo,
  onRedo,
  onReset,
  errorCount = 0,
}) => {
  // Save button should be disabled if there are validation errors OR no changes OR currently saving OR resetting
  const canSave = hasUnsavedChanges && !isSaving && !isResetting && errorCount === 0;

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-3">
        {/* Save Status Badge */}
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <Badge
              variant="outline"
              className="text-orange-600 border-orange-200"
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              Unsaved Changes
            </Badge>
          )}

          {errorCount > 0 && (
            <Badge variant="destructive">
              {errorCount} Error{errorCount > 1 ? "s" : ""}
            </Badge>
          )}

          {!hasUnsavedChanges && !isSaving && errorCount === 0 && (
            <Badge
              variant="outline"
              className="text-green-600 border-green-200"
            >
              All Changes Saved
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onUndo}
                disabled={!canUndo || isResetting || isSaving}
                className={cn(
                  "h-8 w-8 p-0",
                  (!canUndo || isResetting || isSaving) && "opacity-50 cursor-not-allowed",
                )}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo (Ctrl+Z)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onRedo}
                disabled={!canRedo || isResetting || isSaving}
                className={cn(
                  "h-8 w-8 p-0",
                  (!canRedo || isResetting || isSaving) && "opacity-50 cursor-not-allowed",
                )}
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo (Ctrl+Y)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                disabled={isResetting || isSaving}
                className={cn(
                  "h-8 w-8 p-0",
                  (isResetting || isSaving) && "opacity-50 cursor-not-allowed",
                )}
              >
                {isResetting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                <RotateCcw className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isResetting ? "Resetting to factory defaults..." : "Reset to factory defaults"}</p>
            </TooltipContent>
          </Tooltip>

          <Button
            onClick={onSave}
            disabled={!canSave}
            size="sm"
            className={cn(
              canSave && "animate-pulse",
              !canSave && errorCount > 0 && "opacity-50",
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="text-xs text-muted-foreground hidden lg:block">
          Ctrl+S to save • Ctrl+Z to undo
          {errorCount > 0 && " • Fix errors to save"}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SaveStateIndicator;

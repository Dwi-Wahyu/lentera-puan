import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertCircle, HelpCircle, Loader2 } from "lucide-react";

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "error" | "secondary";
  isLoading?: boolean;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  variant = "primary",
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} variant={variant}>
      <div className="flex flex-col items-center text-center space-y-4">
        <div
          className={`p-4 rounded-full ${
            variant === "error"
              ? "bg-error-container text-error"
              : variant === "secondary"
                ? "bg-secondary-container text-secondary"
                : "bg-primary-container text-white"
          }`}
        >
          {variant === "error" ? (
            <AlertCircle className="w-10 h-10" />
          ) : (
            <HelpCircle className="w-10 h-10" />
          )}
        </div>

        <div className="space-y-2">
          <p className="text-on-surface leading-relaxed">{message}</p>
        </div>

        <div className="flex w-full gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            className={`flex-1 ${variant === "secondary" ? "bg-secondary text-on-secondary hover:bg-secondary/90" : ""}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastContextType {
  success: (title: string, message: string) => void;
  error: (title: string, message: string) => void;
  info: (title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 5000);
  }, [removeToast]);

  const success = (title: string, message: string) => addToast("success", title, message);
  const error = (title: string, message: string) => addToast("error", title, message);
  const info = (title: string, message: string) => addToast("info", title, message);

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-4 max-w-sm w-full">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
  const variants = {
    success: {
      border: "border-secondary/20",
      iconContainer: "bg-secondary-container/30",
      icon: "text-secondary",
      progress: "bg-secondary",
      LucideIcon: CheckCircle2,
    },
    error: {
      border: "border-error/20",
      iconContainer: "bg-error-container/40",
      icon: "text-error",
      progress: "bg-error",
      LucideIcon: AlertCircle,
    },
    info: {
      border: "border-primary/20",
      iconContainer: "bg-surface-container",
      icon: "text-primary",
      progress: "bg-primary",
      LucideIcon: Info,
    },
  };

  const v = variants[toast.type];

  return (
    <div className={`flex flex-col bg-surface-container-lowest border ${v.border} rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-right-full duration-300`}>
      <div className="flex items-start p-4 gap-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${v.iconContainer} flex items-center justify-center`}>
          <v.LucideIcon className={`w-6 h-6 ${v.icon}`} />
        </div>
        <div className="flex-grow pt-0.5">
          <h4 className={`font-bold text-sm leading-tight ${toast.type === 'error' ? 'text-error' : toast.type === 'info' ? 'text-primary' : 'text-on-surface'}`}>
            {toast.title}
          </h4>
          <p className="text-xs text-on-surface-variant mt-1">
            {toast.message}
          </p>
        </div>
        <button onClick={onRemove} className="flex-shrink-0 text-outline hover:text-on-surface-variant transition-colors p-1">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className={`h-1 ${v.progress} w-full opacity-30 animate-progress-shrink origin-left`}></div>
    </div>
  );
};

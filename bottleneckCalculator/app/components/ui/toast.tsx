"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X } from "lucide-react";

// Toast types
type ToastVariant = "default" | "success" | "destructive" | "warning";

interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

// Toast context
interface ToastContextType {
  (props: ToastProps): void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Toast item component
interface ToastItemProps extends ToastProps {
  id: string;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ 
  id, 
  title, 
  description, 
  variant = "default", 
  onClose 
}) => {
  // Variant styling
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return {
          borderColor: "border-green-500",
          bgColor: "bg-green-50 dark:bg-green-950/30",
          icon: <CheckCircle className="w-5 h-5 text-green-500" />
        };
      case "destructive":
        return {
          borderColor: "border-red-500",
          bgColor: "bg-red-50 dark:bg-red-950/30",
          icon: <AlertCircle className="w-5 h-5 text-red-500" />
        };
      case "warning":
        return {
          borderColor: "border-amber-500",
          bgColor: "bg-amber-50 dark:bg-amber-950/30",
          icon: <AlertCircle className="w-5 h-5 text-amber-500" />
        };
      default:
        return {
          borderColor: "border-gray-200 dark:border-gray-700",
          bgColor: "bg-white dark:bg-gray-800",
          icon: null
        };
    }
  };

  const { borderColor, bgColor, icon } = getVariantStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`w-full max-w-sm overflow-hidden rounded-lg border ${borderColor} ${bgColor} shadow-lg pointer-events-auto`}
    >
      <div className="p-4 relative">
        <button 
          onClick={() => onClose(id)}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close toast"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start">
          {icon && <div className="flex-shrink-0 mr-3">{icon}</div>}
          <div className="ml-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Toast provider component
interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

  const addToast = useCallback(({ title, description, variant = "default", duration = 5000 }: ToastProps) => {
    const id = Math.random().toString(36).slice(2);
    
    setToasts((prevToasts) => [...prevToasts, { id, title, description, variant }]);
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} {...toast} onClose={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
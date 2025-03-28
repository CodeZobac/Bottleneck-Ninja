"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertCircle, AlertTriangle, Save, Trash2, X } from "lucide-react";
import { useTheme } from "next-themes";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSave?: () => void;
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonIntent?: "primary" | "secondary" | "danger";
  icon?: "warning" | "error" | "info" | "success";
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onSave,
  title = "Unsaved Changes",
  message = "Your analysis results will not be saved if you leave this page. Would you like to save your build before continuing?",
  confirmButtonText = "Continue Without Saving",
  cancelButtonText = "Cancel",
  confirmButtonIntent = "primary",
  icon = "warning",
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Ensure we only render theme-specific elements after component mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Theme-aware styling
  const isDarkTheme = mounted && resolvedTheme === 'dark';
  
  // If not logged in, clicking save should redirect to sign in
  const handleSaveClick = () => {
    if (!session && onSave) {
      router.push("/auth/signin");
    } else if (onSave) {
      onSave();
    }
  };

  // Determine icon component based on type
  const getIconComponent = () => {
    switch (icon) {
      case "warning":
        return <AlertTriangle size={28} className="text-amber-500" />;
      case "error":
        return <Trash2 size={28} className="text-red-500" />;
      case "info":
        return <AlertCircle size={28} className="text-blue-500" />;
      case "success":
        return <Save size={28} className="text-green-500" />;
      default:
        return <AlertTriangle size={28} className="text-amber-500" />;
    }
  };

  // Determine background color for icon container
  const getIconBackgroundColor = () => {
    switch (icon) {
      case "warning":
        return "bg-amber-100";
      case "error":
        return "bg-red-100";
      case "info":
        return "bg-blue-100";
      case "success":
        return "bg-green-100";
      default:
        return "bg-amber-100";
    }
  };

  // Determine button intent styles
  const getButtonStyles = () => {
    switch (confirmButtonIntent) {
      case "danger":
        return "bg-red-500 hover:bg-red-600";
      case "primary":
        return "bg-blue-500 hover:bg-blue-600";
      case "secondary":
        return "bg-emerald-500 hover:bg-emerald-600";
      default:
        return "bg-emerald-500 hover:bg-emerald-600";
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay - made fully clickable to close modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              className={`w-full max-w-md overflow-hidden rounded-2xl shadow-2xl border pointer-events-auto ${
                isDarkTheme 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className={`rounded-full ${getIconBackgroundColor()} p-4`}>
                    {getIconComponent()}
                  </div>
                </div>
                <h3 className={`mb-2 text-center text-xl font-bold ${isDarkTheme ? 'text-gray-100' : 'text-gray-800'}`}>{title}</h3>
                <p className={`mb-8 text-center ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                  {message}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-between">
                  {onSave ? (
                    <>
                      <Button
                        intent="secondary"
                        appearance="outline"
                        className="px-4 py-2 flex-1"
                        onPress={onConfirm}
                      >
                        {confirmButtonText}
                      </Button>
                      <Button
                        intent="primary"
                        appearance="solid"
                        className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 flex-1 flex items-center justify-center gap-2"
                        onPress={handleSaveClick}
                      >
                        <Save size={18} />
                        Save to Profile
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        intent="secondary"
                        appearance="outline"
                        className="px-4 py-2 flex-1"
                        onPress={onClose}
                      >
                        {cancelButtonText}
                      </Button>
                      <Button
                        intent={confirmButtonIntent}
                        appearance="solid"
                        className={`${getButtonStyles()} px-4 py-2 flex-1 flex items-center justify-center gap-2`}
                        onPress={onConfirm}
                      >
                        {confirmButtonIntent === "danger" && <Trash2 size={18} />}
                        {confirmButtonText}
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Close button */}
              <button 
                onClick={onClose}
                className={`absolute top-4 right-4 ${
                  isDarkTheme
                    ? 'text-gray-400 hover:text-gray-200 bg-gray-800/80 hover:bg-gray-700'
                    : 'text-gray-400 hover:text-gray-600 bg-white/80 hover:bg-white'
                } rounded-full p-1`}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
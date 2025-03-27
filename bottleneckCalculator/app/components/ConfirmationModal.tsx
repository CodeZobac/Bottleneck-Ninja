"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Save, X } from "lucide-react";
import { useTheme } from "next-themes";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSave: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onSave,
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
    if (!session) {
      router.push("/auth/signin");
    } else {
      onSave();
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
                  <div className="rounded-full bg-amber-100 p-4">
                    <AlertTriangle size={28} className="text-amber-500" />
                  </div>
                </div>
                <h3 className={`mb-2 text-center text-xl font-bold ${isDarkTheme ? 'text-gray-100' : 'text-gray-800'}`}>Unsaved Changes</h3>
                <p className={`mb-8 text-center ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                  Your analysis results will not be saved if you leave this page. Would you like to save your build before continuing?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-between">
                  <Button
                    intent="secondary"
                    appearance="outline"
                    className="px-4 py-2 flex-1"
                    onPress={onConfirm}
                  >
                    Continue Without Saving
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
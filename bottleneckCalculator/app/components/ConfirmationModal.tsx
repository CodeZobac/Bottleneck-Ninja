"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="rounded-full bg-yellow-100 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-500"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 text-center text-xl font-bold">Unsaved Changes</h3>
              <p className="mb-6 text-center text-gray-600">
                Your analysis results will not be saved if you leave this page. Would you like to save your build before continuing?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                  onPress={onConfirm}
                >
                  Continue Without Saving
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onPress={handleSaveClick}
                >
                  Save to Profile
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
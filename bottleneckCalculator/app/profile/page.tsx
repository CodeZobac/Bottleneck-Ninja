'use client';

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FirstTimeSetup from "./FirstTimeSetup";
import Image from "next/image";
import { useTheme } from "next-themes";
import { PencilIcon, CheckIcon, XIcon, HomeIcon, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

interface UserPreferences {
  id?: string;
  user_id?: string;
  budget: number;
  cpu_intensive: boolean;
  gpu_intensive: boolean;
  gaming: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedPrefs, setEditedPrefs] = useState<UserPreferences | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Theme-aware styling
  const isDarkTheme = resolvedTheme === 'dark';

  // Ensure we only render theme-specific elements after component mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google");
    }
  }, [status]);

  // Fetch user preferences from API
  useEffect(() => {
    async function fetchUserPreferences() {
      if (status !== "authenticated" || !session?.user) return;
      
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch preferences');
        }
        
        const data = await response.json();
        
        if (data.preferences) {
          setUserPreferences(data.preferences);
          setEditedPrefs(data.preferences);
        }
      } catch (error) {
        console.error("Error fetching user preferences:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (status === "authenticated") {
      fetchUserPreferences();
    }
  }, [session, status]);

  const handleEditToggle = () => {
    if (editMode && editedPrefs !== userPreferences) {
      // If canceling with changes, reset to original values
      setEditedPrefs(userPreferences);
    }
    setEditMode(!editMode);
    setError("");
  };

  const handleSaveChanges = async () => {
    if (!editedPrefs) return;
    
    setSaving(true);
    setError("");
    
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedPrefs),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save preferences');
      }
      
      const data = await response.json();
      setUserPreferences(data.preferences);
      setEditMode(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error saving preferences:", err);
      setError("Failed to save preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Format budget value with commas and decimal places
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-gray-900/95 dark:to-blue-950/95 backdrop-blur-sm">
      {/* Animated background elements */}
      <motion.div 
        className="absolute inset-0 -z-20 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute w-full h-full bg-[url('/background.svg')] bg-cover opacity-10 dark:opacity-5"></div>
        <motion.div 
          className="absolute w-24 h-24 rounded-full bg-blue-500 filter blur-3xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, 40, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
          }}
          style={{ top: '20%', left: '30%' }}
        />
        <motion.div 
          className="absolute w-32 h-32 rounded-full bg-purple-600 filter blur-3xl"
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 30, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut",
          }}
          style={{ top: '60%', right: '30%' }}
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 15 
        }}
        className="relative w-full max-w-md overflow-hidden"
      >
        
        {/* Additional decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/5 to-purple-50/5 dark:from-blue-900/5 dark:to-purple-900/5"></div>
        
        {/* Primary floating orbs */}
        <motion.div 
          className="absolute w-32 h-32 rounded-full bg-blue-500 filter blur-3xl opacity-20"
          animate={{ 
            x: [0, 40, 0], 
            y: [0, 50, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut",
          }}
          style={{ top: '20%', left: '25%' }}
        />
        <motion.div 
          className="absolute w-40 h-40 rounded-full bg-purple-600 filter blur-3xl opacity-20"
          animate={{ 
            x: [0, -50, 0], 
            y: [0, 40, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "easeInOut",
          }}
          style={{ top: '50%', right: '25%' }}
        />
        
        {/* Additional floating elements for visual interest */}
        <motion.div 
          className="absolute w-24 h-24 rounded-full bg-cyan-500 filter blur-3xl opacity-10"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -40, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut",
          }}
          style={{ bottom: '15%', left: '40%' }}
        />
        <motion.div 
          className="absolute w-20 h-20 rounded-full bg-pink-500 filter blur-3xl opacity-10"
          animate={{ 
            x: [0, -20, 0], 
            y: [0, 30, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 13,
            ease: "easeInOut",
            delay: 2,
          }}
          style={{ top: '15%', right: '30%' }}
        />
      </motion.div>

      {/* Main content */}
      {(status === "loading" || loading || !mounted) ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 border-t-transparent rounded-full animate-pulse"></div>
          </motion.div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-gray-700 dark:text-gray-300"
          >
            Loading your profile...
          </motion.p>
        </div>
      ) : status === "authenticated" && !userPreferences ? (
        <FirstTimeSetup session={session} onComplete={() => setLoading(true)} />
      ) : (
        <div className="min-h-screen flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
            className="w-full max-w-4xl"
          >
            {/* Decorative elements */}
            <div className="absolute -z-10 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 dark:from-blue-600 dark:to-cyan-700 opacity-20 blur-3xl -top-40 -left-40"></div>
            <div className="absolute -z-10 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400 to-pink-300 dark:from-purple-700 dark:to-pink-900 opacity-20 blur-3xl -bottom-40 -right-40"></div>
            
            <div className={`relative rounded-2xl shadow-2xl overflow-hidden ${isDarkTheme ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-lg border ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'}`}>
              {/* Top gradient bar with animation */}
              <motion.div 
                className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                }}
                style={{ 
                  backgroundSize: '200% 100%',
                }}
                transition={{ 
                  duration: 15, 
                  repeat: Infinity,
                  ease: "linear"
                }}
              ></motion.div>

              {/* Profile header with gradient */}
              <div className="relative h-40 bg-gradient-to-br from-blue-600 to-purple-700 overflow-hidden">
                <motion.div 
                  className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('/background.svg')]"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.2, 0.25, 0.2],
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                ></motion.div>
                
                {/* Subtle floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute w-2 h-2 bg-white rounded-full opacity-60"
                    animate={{ 
                      y: [0, -30], 
                      x: [0, 5, -5, 0],
                      opacity: [0, 0.7, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                    style={{ left: '30%', top: '70%' }}
                  />
                  <motion.div
                    className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-60"
                    animate={{ 
                      y: [0, -20], 
                      x: [0, -3, 3, 0],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{ 
                      duration: 2.5, 
                      delay: 0.5,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                    style={{ left: '45%', top: '80%' }}
                  />
                  <motion.div
                    className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                    animate={{ 
                      y: [0, -25], 
                      x: [0, 4, -2, 0],
                      opacity: [0, 0.6, 0]
                    }}
                    transition={{ 
                      duration: 3.5, 
                      delay: 1.2,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                    style={{ left: '65%', top: '75%' }}
                  />
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>

              <div className="relative px-8 pb-16">
                {/* Enhanced profile image and info - adjusted top margin */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative -mt-10 mb-8 pt-4"
                >
                  <div className="flex items-end gap-6">
                    <div className="relative">
                      {/* Shiny ring around profile image */}
                      <motion.div 
                        className={`absolute inset-0 rounded-full ${isDarkTheme ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-blue-400 to-purple-400'} -m-0.5`}
                        animate={{ 
                          rotate: [0, 360]
                        }}
                        transition={{ 
                          duration: 10,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      
                      <div className={`p-1 rounded-full ${isDarkTheme ? 'bg-gray-800' : 'bg-white'} shadow-xl relative z-10`}>
                        {session?.user?.image ? (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                          >
                            <Image 
                              src={session.user.image} 
                              alt="Profile"
                              width={96}
                              height={96}
                              className="rounded-full"
                            />
                          </motion.div>
                        ) : (
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center"
                          >
                            <span className="text-2xl font-bold text-blue-500">
                              {session?.user?.name?.charAt(0) || 'U'}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <div className="mb-2">
                      <motion.h1 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-800'} flex items-center`}
                      >
                        {session?.user?.name || 'User'}
                        <motion.div 
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity, 
                            repeatDelay: 3,
                          }}
                          className="ml-2 text-yellow-400"
                        >
                          <Sparkles size={18} />
                        </motion.div>
                      </motion.h1>
                      <motion.p 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        {session?.user?.email}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>

                {/* Enhanced preferences section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`rounded-xl ${isDarkTheme ? 'bg-gray-800/50' : 'bg-gray-50/80'} p-6 backdrop-blur-sm`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-xl font-semibold ${isDarkTheme ? 'text-gray-100' : 'text-gray-800'} flex items-center`}>
                      <span>Your Computer Preferences</span>
                    </h2>
                    
                    <div className="flex space-x-3">
                      {editMode ? (
                        <>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              appearance="outline"
                              intent="secondary"
                              size="small"
                              onPress={handleEditToggle}
                              isDisabled={saving}
                              className="flex items-center gap-1"
                            >
                              <XIcon size={16} />
                              Cancel
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              appearance="solid"
                              intent="primary"
                              size="small"
                              onPress={handleSaveChanges}
                              isDisabled={saving}
                              className="flex items-center gap-1"
                            >
                              {saving ? (
                                <>
                                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <CheckIcon size={16} />
                                  Save
                                </>
                              )}
                            </Button>
                          </motion.div>
                        </>
                      ) : (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            appearance="solid"
                            intent="primary"
                            size="small"
                            onPress={handleEditToggle}
                            className="flex items-center gap-1"
                          >
                            <PencilIcon size={16} />
                            Edit Preferences
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mb-4 p-3 rounded-lg ${isDarkTheme ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-500'}`}
                    >
                      {error}
                    </motion.div>
                  )}
                  
                  {userPreferences && editedPrefs && (
                    <div className={`rounded-xl ${isDarkTheme ? 'bg-gray-900/70' : 'bg-blue-50/80'} p-6 space-y-6 backdrop-blur-sm`}>
                      {/* Enhanced Budget section */}
                      <div className="space-y-2">
                        <label className={`block text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                          <span>Budget</span>
                        </label>
                        
                        {editMode ? (
                          <motion.div 
                            whileHover={{ scale: 1.01 }}
                            className={`relative rounded-lg shadow-sm overflow-hidden ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}
                          >
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-500'} sm:text-sm`}>$</span>
                            </div>
                            <input
                              type="number"
                              value={editedPrefs.budget || ''}
                              onChange={(e) => setEditedPrefs({
                                ...editedPrefs,
                                budget: parseFloat(e.target.value) || 0
                              })}
                              className={`block w-full pl-7 pr-12 py-3 border-none ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-lg`}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <span className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-500'} sm:text-sm`}>USD</span>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}
                          >
                            <motion.span
                              initial={{ scale: 0.95 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 10 }}
                              className={`inline-block px-4 py-2 rounded-lg ${isDarkTheme ? 'bg-blue-900/30 text-blue-100' : 'bg-blue-100 text-blue-800'}`}
                            >
                              {formatCurrency(userPreferences.budget)}
                            </motion.span>
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Enhanced Usage options */}
                      <div className="space-y-3">
                        <label className={`block text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                          Usage Preferences
                        </label>
                        
                        {editMode ? (
                          <div className="space-y-3">
                            <motion.div 
                              className={`flex items-center p-3 rounded-lg ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-blue-100'} transition-colors`}
                              whileHover={{ x: 5 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <input
                                id="cpu-intensive"
                                type="checkbox"
                                checked={editedPrefs.cpu_intensive || false}
                                onChange={() => setEditedPrefs({
                                  ...editedPrefs,
                                  cpu_intensive: !editedPrefs.cpu_intensive
                                })}
                                className={`h-5 w-5 ${isDarkTheme ? 'text-blue-500 border-gray-700 bg-gray-800' : 'text-blue-600 border-gray-300'} rounded focus:ring-blue-500`}
                              />
                              <label htmlFor="cpu-intensive" className={`ml-3 block text-sm ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                                CPU Intensive Tasks (e.g., programming, video editing)
                              </label>
                            </motion.div>
                            
                            <motion.div 
                              className={`flex items-center p-3 rounded-lg ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-blue-100'} transition-colors`}
                              whileHover={{ x: 5 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <input
                                id="gpu-intensive"
                                type="checkbox"
                                checked={editedPrefs.gpu_intensive || false}
                                onChange={() => setEditedPrefs({
                                  ...editedPrefs,
                                  gpu_intensive: !editedPrefs.gpu_intensive
                                })}
                                className={`h-5 w-5 ${isDarkTheme ? 'text-blue-500 border-gray-700 bg-gray-800' : 'text-blue-600 border-gray-300'} rounded focus:ring-blue-500`}
                              />
                              <label htmlFor="gpu-intensive" className={`ml-3 block text-sm ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                                GPU Intensive Tasks (e.g., 3D rendering, AI/ML)
                              </label>
                            </motion.div>
                            
                            <motion.div 
                              className={`flex items-center p-3 rounded-lg ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-blue-100'} transition-colors`}
                              whileHover={{ x: 5 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <input
                                id="gaming"
                                type="checkbox"
                                checked={editedPrefs.gaming || false}
                                onChange={() => setEditedPrefs({
                                  ...editedPrefs,
                                  gaming: !editedPrefs.gaming
                                })}
                                className={`h-5 w-5 ${isDarkTheme ? 'text-blue-500 border-gray-700 bg-gray-800' : 'text-blue-600 border-gray-300'} rounded focus:ring-blue-500`}
                              />
                              <label htmlFor="gaming" className={`ml-3 block text-sm ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                                Gaming
                              </label>
                            </motion.div>
                          </div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`${isDarkTheme ? 'bg-gray-800/50' : 'bg-white'} rounded-lg p-4 shadow-sm`}
                          >
                            {!userPreferences.cpu_intensive && !userPreferences.gpu_intensive && !userPreferences.gaming ? (
                              <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-500'} italic`}>No usage preferences specified</p>
                            ) : (
                              <ul className={`space-y-3 ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                                {userPreferences.cpu_intensive && (
                                  <motion.li 
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex items-center"
                                  >
                                    <motion.div 
                                      animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.7, 1, 0.7],
                                      }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                      }}
                                      className="mr-3 h-3 w-3 rounded-full bg-blue-500"
                                    ></motion.div>
                                    CPU Intensive Tasks (programming, video editing)
                                  </motion.li>
                                )}
                                {userPreferences.gpu_intensive && (
                                  <motion.li 
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center"
                                  >
                                    <motion.div 
                                      animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.7, 1, 0.7],
                                      }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 0.7
                                      }}
                                      className="mr-3 h-3 w-3 rounded-full bg-purple-500"
                                    ></motion.div>
                                    GPU Intensive Tasks (3D rendering, AI/ML)
                                  </motion.li>
                                )}
                                {userPreferences.gaming && (
                                  <motion.li 
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex items-center"
                                  >
                                    <motion.div 
                                      animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.7, 1, 0.7],
                                      }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 1.4
                                      }}
                                      className="mr-3 h-3 w-3 rounded-full bg-green-500"
                                    ></motion.div>
                                    Gaming
                                  </motion.li>
                                )}
                              </ul>
                            )}
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Recommendations navigation CTA */}
                      {!editMode && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="mt-8"
                        >
                          <Link href="/calculate">
                            <motion.div 
                              whileHover={{ scale: 1.02, x: 5 }}
                              whileTap={{ scale: 0.98 }}
                              className={`flex items-center justify-between p-4 rounded-lg ${
                                isDarkTheme 
                                  ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40 hover:from-blue-800/40 hover:to-purple-800/40' 
                                  : 'bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200'
                              } transition-all`}
                            >
                              <div>
                                <h3 className={`font-medium ${isDarkTheme ? 'text-blue-200' : 'text-blue-800'}`}>
                                  View Recommendations
                                </h3>
                                <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                                  See hardware options based on your preferences
                                </p>
                              </div>
                              <ChevronRight className={isDarkTheme ? 'text-blue-300' : 'text-blue-600'} />
                            </motion.div>
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
                {/* Enhanced home button with animation */}
                <motion.div 
                  className="absolute bottom-4 right-8 z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link href="/">
                    <div className="relative group">
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-75 group-hover:opacity-100 blur-sm transition-opacity"
                        animate={{ 
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          ease: "easeInOut",
                        }}
                      />
                      <Button
                        appearance={isDarkTheme ? "outline" : "solid"}
                        intent="secondary"
                        size="small"
                        className="rounded-full w-12 h-12 shadow-lg hover:scale-105 relative z-10 transition-transform"
                      >
                        <HomeIcon className={isDarkTheme ? "text-white" : "text-gray-700"} />
                      </Button>
                    </div>
                  </Link>
                </motion.div>
              </div>

              {/* Bottom gradient bar with animation */}
              <motion.div 
                className="h-1 bg-gradient-to-r from-purple-600 to-blue-500"
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                }}
                style={{ 
                  backgroundSize: '200% 100%',
                }}
                transition={{ 
                  duration: 15, 
                  repeat: Infinity,
                  ease: "linear",
                  direction: "reverse"
                }}
              ></motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
